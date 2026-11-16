import { DatabaseSync } from 'node:sqlite';
import { mkdirSync } from 'node:fs';
import path from 'node:path';
import { randomBytes, scryptSync } from 'node:crypto';
import { seedProducts } from './seed';
import type { Product, Order } from './types';

const globalDb = globalThis as unknown as { maisonDb?: DatabaseSync };
export function db() {
  if (globalDb.maisonDb) return globalDb.maisonDb;
  // The database lives on the runtime disk, not in the application bundle.
  const location = path.resolve(
    /* turbopackIgnore: true */ process.env.DATABASE_PATH || './data/maison.sqlite',
  );
  mkdirSync(path.dirname(location), { recursive: true });
  const connection = new DatabaseSync(location);
  connection.exec(`PRAGMA journal_mode = WAL; PRAGMA foreign_keys = ON; PRAGMA busy_timeout = 5000;
    CREATE TABLE IF NOT EXISTS products (id TEXT PRIMARY KEY, data TEXT NOT NULL);
    CREATE TABLE IF NOT EXISTS orders (id TEXT PRIMARY KEY, data TEXT NOT NULL);
    CREATE TABLE IF NOT EXISTS admins (email TEXT PRIMARY KEY, password TEXT NOT NULL, salt TEXT NOT NULL);
    CREATE TABLE IF NOT EXISTS sessions (token TEXT PRIMARY KEY, email TEXT NOT NULL, expires INTEGER NOT NULL);
    CREATE TABLE IF NOT EXISTS subscribers (email TEXT PRIMARY KEY, created_at TEXT NOT NULL);
    CREATE TABLE IF NOT EXISTS settings (key TEXT PRIMARY KEY, value TEXT NOT NULL);
    CREATE TABLE IF NOT EXISTS rate_limits (key TEXT PRIMARY KEY, attempts INTEGER NOT NULL, reset_at INTEGER NOT NULL);
  `);
  if (!connection.prepare("SELECT key FROM settings WHERE key = 'seeded'").get()) {
    connection.exec('BEGIN IMMEDIATE');
    try {
      for (const product of seedProducts)
        connection
          .prepare('INSERT OR IGNORE INTO products VALUES (?, ?)')
          .run(product.id, JSON.stringify(product));
      connection.prepare("INSERT INTO settings VALUES ('seeded', '1')").run();
      connection.exec('COMMIT');
    } catch (error) {
      connection.exec('ROLLBACK');
      throw error;
    }
  }
  if (!connection.prepare('SELECT email FROM admins LIMIT 1').get()) {
    const email = process.env.ADMIN_EMAIL || 'admin@maison.vn';
    const password = process.env.ADMIN_PASSWORD;
    if (password) {
      const salt = randomBytes(16).toString('hex');
      connection
        .prepare('INSERT INTO admins VALUES (?, ?, ?)')
        .run(email.toLowerCase(), scryptSync(password, salt, 64).toString('hex'), salt);
    }
  }
  globalDb.maisonDb = connection;
  return connection;
}
export function getProducts(): Product[] {
  return (db().prepare('SELECT data FROM products ORDER BY rowid').all() as { data: string }[]).map(
    (row) => JSON.parse(row.data),
  );
}
export function getProduct(id: string): Product | undefined {
  const row = db().prepare('SELECT data FROM products WHERE id = ?').get(id) as
    { data: string } | undefined;
  return row ? JSON.parse(row.data) : undefined;
}
export function getOrders(): Order[] {
  return (
    db().prepare('SELECT data FROM orders ORDER BY rowid DESC').all() as { data: string }[]
  ).map((row) => JSON.parse(row.data));
}
export function rateLimit(key: string, max: number, period: number) {
  const conn = db();
  const now = Date.now();
  conn.prepare('DELETE FROM rate_limits WHERE reset_at < ?').run(now);
  conn
    .prepare(
      'INSERT INTO rate_limits VALUES (?, 1, ?) ON CONFLICT(key) DO UPDATE SET attempts = attempts + 1',
    )
    .run(key, now + period);
  const row = conn.prepare('SELECT attempts FROM rate_limits WHERE key = ?').get(key) as {
    attempts: number;
  };
  return row.attempts <= max;
}
