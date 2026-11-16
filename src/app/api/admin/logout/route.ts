import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { safeOrigin } from '@/lib/auth';
export async function POST(request: Request) {
  if (!safeOrigin(request))
    return NextResponse.json({ error: 'Yêu cầu không hợp lệ.' }, { status: 403 });
  const jar = await cookies();
  jar.delete('maison_session');
  return NextResponse.json({ success: true });
}
