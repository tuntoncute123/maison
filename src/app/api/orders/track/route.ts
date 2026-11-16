import { NextResponse } from 'next/server';
import { getOrder, rateLimit } from '@/lib/db';
import { safeOrigin } from '@/lib/auth';
export async function POST(request: Request) {
  if (!safeOrigin(request))
    return NextResponse.json({ error: 'Yêu cầu không hợp lệ.' }, { status: 403 });
  try {
    const { id, phone } = await request.json();
    if (typeof id !== 'string' || typeof phone !== 'string') throw new Error();
    if (!rateLimit(`track:${id.slice(0, 40).toUpperCase()}`, 20, 900000))
      return NextResponse.json(
        { error: 'Quá nhiều lần tra cứu. Vui lòng thử lại sau.' },
        { status: 429 },
      );
    const order = getOrder(id.trim().toUpperCase());
    if (!order || order.phone !== phone.replace(/\s/g, ''))
      return NextResponse.json(
        { error: 'Không tìm thấy đơn hàng khớp với mã và số điện thoại.' },
        { status: 404 },
      );
    return NextResponse.json(order);
  } catch {
    return NextResponse.json({ error: 'Thông tin tra cứu không hợp lệ.' }, { status: 400 });
  }
}
