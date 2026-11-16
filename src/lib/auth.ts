import { cookies } from 'next/headers';
import { createHash, createHmac, randomBytes, timingSafeEqual } from 'node:crypto';

// Public demo credentials. Override both variables before using private data.
function adminCredentials() {
  return {
    email: (process.env.ADMIN_EMAIL || 'admin@maison.vn').trim().toLowerCase(),
    password: process.env.ADMIN_PASSWORD || 'Maison@2026',
  };
}
function signature(payload: string) {
  const admin = adminCredentials();
  const key = process.env.SESSION_SECRET || `${admin.email}:${admin.password}`;
  return createHmac('sha256', key).update(payload).digest('base64url');
}
function equal(a: string, b: string) {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  return left.length === right.length && timingSafeEqual(left, right);
}
export function authenticateAdmin(email: string, password: string) {
  const admin = adminCredentials();
  const candidate = createHash('sha256').update(password).digest('hex');
  const expected = createHash('sha256').update(admin.password).digest('hex');
  return equal(candidate, expected) && email.trim().toLowerCase() === admin.email
    ? { email: admin.email }
    : null;
}
export async function adminSession() {
  const token = (await cookies()).get('maison_session')?.value;
  if (!token || token.length > 2048) return null;
  const parts = token.split('.');
  if (parts.length !== 2 || !equal(signature(parts[0]), parts[1])) return null;
  try {
    const session = JSON.parse(Buffer.from(parts[0], 'base64url').toString('utf8'));
    if (
      session.email !== adminCredentials().email ||
      typeof session.expires !== 'number' ||
      session.expires <= Date.now()
    )
      return null;
    return { email: session.email as string };
  } catch {
    return null;
  }
}
export async function createSession(email: string) {
  // A signed cookie works across Vercel instances without a sessions database.
  const payload = Buffer.from(
    JSON.stringify({
      email,
      expires: Date.now() + 86400000,
      nonce: randomBytes(16).toString('hex'),
    }),
  ).toString('base64url');
  (await cookies()).set('maison_session', `${payload}.${signature(payload)}`, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.COOKIE_SECURE === 'true' || process.env.VERCEL === '1',
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
