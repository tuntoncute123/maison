import { NextResponse } from 'next/server';
import { addSubscriber } from '@/lib/db';
import { safeOrigin } from '@/lib/auth';
export async function POST(request: Request) {
  if (!safeOrigin(request))
    return NextResponse.json({ error: 'Yêu cầu không hợp lệ.' }, { status: 403 });
  try {
    const { email } = await request.json();
    if (
      typeof email !== 'string' ||
      email.length > 254 ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    )
      throw new Error();
    addSubscriber(email.toLowerCase());
    return NextResponse.json({
      message: 'Bạn đã đăng ký thành công! Dùng mã WELCOME10 để giảm 10%, tối đa 100.000đ.',
    });
  } catch {
    return NextResponse.json({ error: 'Vui lòng nhập email hợp lệ.' }, { status: 400 });
  }
}
