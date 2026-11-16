import { cookies } from 'next/headers';
import { createHash, randomBytes } from 'node:crypto';
import { db } from './db';
export const sessionHash = (token: string) => createHash('sha256').update(token).digest('hex');
export async function adminSession() {
  const token = (await cookies()).get('maison_session')?.value;
  if (!token) return null;
  return db()
    .prepare('SELECT email FROM sessions WHERE token = ? AND expires > ?')
    .get(sessionHash(token), Date.now()) as { email: string } | undefined;
}
export async function createSession(email: string) {
  const token = randomBytes(32).toString('hex');
  db().prepare('DELETE FROM sessions WHERE expires < ?').run(Date.now());
  db()
    .prepare('INSERT INTO sessions VALUES (?, ?, ?)')
    .run(sessionHash(token), email, Date.now() + 86400000);
  (await cookies()).set('maison_session', token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.COOKIE_SECURE === 'true',
    maxAge: 86400,
    path: '/',
  });
}
export function safeOrigin(request: Request) {
  const origin = request.headers.get('origin');
  if (!origin) return true;
  const url = new URL(request.url);
  const host = request.headers.get('x-forwarded-host') || request.headers.get('host') || url.host;
  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}
