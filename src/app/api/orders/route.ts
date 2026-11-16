import { NextResponse } from 'next/server';
import { randomBytes } from 'node:crypto';
import { getProduct, getOrders, saveProduct, saveOrder, transaction, rateLimit } from '@/lib/db';
import { adminSession, safeOrigin } from '@/lib/auth';
import { message } from '@/lib/validation';
import type { Order, OrderItem } from '@/lib/types';
export async function GET() {
  if (!(await adminSession()))
    return NextResponse.json({ error: 'Không có quyền truy cập.' }, { status: 401 });
  return NextResponse.json(getOrders());
}
export async function POST(request: Request) {
  if (!safeOrigin(request))
    return NextResponse.json({ error: 'Yêu cầu không hợp lệ.' }, { status: 403 });
  try {
    const body = await request.json();
    const customerName = String(body.customerName || '').trim(),
      email = String(body.email || '').trim(),
      phone = String(body.phone || '').replace(/\s/g, ''),
      address = String(body.address || '').trim(),
      note = String(body.note || '').trim();
    if (customerName.length < 2 || customerName.length > 100)
      throw new Error('Vui lòng nhập họ tên từ 2 đến 100 ký tự.');
    if (!/^(0|\+84)[0-9]{9}$/.test(phone)) throw new Error('Số điện thoại Việt Nam không hợp lệ.');
    if (email && (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254))
      throw new Error('Email không hợp lệ.');
    if (address.length < 10 || address.length > 500 || note.length > 1000)
      throw new Error('Vui lòng nhập địa chỉ đầy đủ (10–500 ký tự), ghi chú tối đa 1.000 ký tự.');
    if (!Array.isArray(body.items) || !body.items.length || body.items.length > 50)
      throw new Error('Giỏ hàng không hợp lệ.');
    if (!rateLimit(`order:${phone}`, 10, 3600000))
      return NextResponse.json(
        { error: 'Bạn đã đặt quá nhiều đơn. Vui lòng thử lại sau.' },
        { status: 429 },
      );
    const result = transaction(() => {
      const quantities = new Map<string, number>();
      const items: OrderItem[] = body.items.map(
        (item: { productId: string; size: string; color: string; quantity: number }) => {
          if (
            !item ||
            typeof item.productId !== 'string' ||
            !Number.isInteger(item.quantity) ||
            item.quantity < 1 ||
            item.quantity > 20
          )
            throw new Error('Số lượng sản phẩm không hợp lệ (1–20).');
          const product = getProduct(item.productId);
          if (!product)
            throw new Error(
              'Một sản phẩm trong giỏ không còn tồn tại. Vui lòng cập nhật giỏ hàng.',
            );
          if (!product.sizes.includes(item.size) || !product.colors.includes(item.color))
            throw new Error(`Kích cỡ hoặc màu của ${product.name} không hợp lệ.`);
          const quantity = (quantities.get(product.id) || 0) + item.quantity;
          if (quantity > product.stock)
            throw new Error(`${product.name} chỉ còn ${product.stock} sản phẩm.`);
          quantities.set(product.id, quantity);
          return {
            productId: product.id,
            name: product.name,
            image: product.image,
            size: item.size,
            color: item.color,
            quantity: item.quantity,
            price: product.price,
          };
        },
      );
      const subtotal = items.reduce((sum, item) => sum + item.quantity * item.price, 0);
      const coupon = String(body.coupon || '')
        .trim()
        .toUpperCase();
      if (coupon && coupon !== 'WELCOME10') throw new Error('Mã ưu đãi không hợp lệ.');
      const discount = coupon ? Math.min(Math.round(subtotal * 0.1), 100000) : 0;
      const shipping = subtotal >= 699000 ? 0 : 30000;
      const order: Order = {
        id: `MS-${randomBytes(4).toString('hex').toUpperCase()}`,
        customerName,
        email,
        phone,
        address,
        note,
        items,
        subtotal,
        discount,
        shipping,
        total: subtotal - discount + shipping,
        status: 'pending',
        createdAt: new Date().toISOString(),
      };
      for (const [id, quantity] of quantities) {
        const product = getProduct(id)!;
        product.stock -= quantity;
        saveProduct(product);
      }
      saveOrder(order);
      return order;
    });
    return NextResponse.json(result, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: message(e) }, { status: 400 });
  }
}
