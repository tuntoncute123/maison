import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { sessionHash, safeOrigin } from '@/lib/auth';
export async function POST(request: Request) {
  if (!safeOrigin(request))
    return NextResponse.json({ error: 'Yêu cầu không hợp lệ.' }, { status: 403 });
  const jar = await cookies();
  const token = jar.get('maison_session')?.value;
  if (token) db().prepare('DELETE FROM sessions WHERE token = ?').run(sessionHash(token));
  jar.delete('maison_session');
  return NextResponse.json({ success: true });
}
