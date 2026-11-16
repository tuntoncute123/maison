import nextEnv from '@next/env';
import { DatabaseSync } from 'node:sqlite';
import { randomBytes, scryptSync } from 'node:crypto';
import path from 'node:path';
nextEnv.loadEnvConfig(process.cwd());
const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
const password = process.env.ADMIN_PASSWORD;
if (!email || !password || password.length < 10) {
  console.error('Cấu hình ADMIN_EMAIL và ADMIN_PASSWORD (ít nhất 10 ký tự) trong .env.local.');
  process.exit(1);
}
const db = new DatabaseSync(path.resolve(process.env.DATABASE_PATH || './data/maison.sqlite'));
db.exec('PRAGMA busy_timeout = 5000; BEGIN IMMEDIATE');
try {
  const salt = randomBytes(16).toString('hex');
  db.exec('DELETE FROM admins; DELETE FROM sessions;');
  db.prepare('INSERT INTO admins (email,password,salt) VALUES (?,?,?)').run(
    email,
    scryptSync(password, salt, 64).toString('hex'),
    salt,
  );
  db.exec('COMMIT');
  console.log('Đã cập nhật tài khoản quản trị từ môi trường và hủy các phiên cũ.');
} catch (error) {
  db.exec('ROLLBACK');
  console.error('Không thể cập nhật. Chạy ứng dụng một lần để khởi tạo cơ sở dữ liệu.');
  process.exitCode = 1;
} finally {
  db.close();
}
