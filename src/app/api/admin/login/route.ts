import { NextResponse } from 'next/server';
import { rateLimit } from '@/lib/db';
import { authenticateAdmin, createSession, safeOrigin } from '@/lib/auth';
export async function POST(request: Request) {
  if (!safeOrigin(request))
    return NextResponse.json({ error: 'Yêu cầu không hợp lệ.' }, { status: 403 });
  try {
    const { email, password } = await request.json();
    if (
      typeof email !== 'string' ||
      typeof password !== 'string' ||
      password.length > 200 ||
      email.length > 254
    )
      return NextResponse.json({ error: 'Thông tin đăng nhập không hợp lệ.' }, { status: 400 });
    if (!rateLimit(`login:${email.toLowerCase()}`, 10, 900000))
      return NextResponse.json(
        { error: 'Quá nhiều lần đăng nhập. Vui lòng thử lại sau 15 phút.' },
        { status: 429 },
      );
    const admin = authenticateAdmin(email, password);
    if (!admin)
      return NextResponse.json({ error: 'Email hoặc mật khẩu không chính xác.' }, { status: 401 });
    await createSession(admin.email);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Yêu cầu đăng nhập không hợp lệ.' }, { status: 400 });
  }
}
