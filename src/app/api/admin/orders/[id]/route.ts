import { NextResponse } from 'next/server';
import { db, getProduct } from '@/lib/db';
import { adminSession, safeOrigin } from '@/lib/auth';
import type { Order } from '@/lib/types';
const transitions: Record<Order['status'], Order['status'][]> = {
  pending: ['confirmed', 'cancelled'],
  confirmed: ['shipping', 'cancelled'],
  shipping: ['completed'],
  completed: [],
  cancelled: [],
};
export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!safeOrigin(request) || !(await adminSession()))
    return NextResponse.json({ error: 'Không có quyền truy cập.' }, { status: 401 });
  let transaction = false;
  try {
    const { status } = await request.json();
    const { id } = await params;
    db().exec('BEGIN IMMEDIATE');
    transaction = true;
    const row = db().prepare('SELECT data FROM orders WHERE id = ?').get(id) as
      { data: string } | undefined;
    if (!row) throw new Error('Không tìm thấy đơn hàng.');
    const order: Order = JSON.parse(row.data);
    if (!transitions[order.status].includes(status))
      throw new Error('Không thể chuyển sang trạng thái này.');
    if (status === 'cancelled')
      for (const item of order.items) {
        const product = getProduct(item.productId);
        if (product) {
          product.stock += item.quantity;
          db()
            .prepare('UPDATE products SET data = ? WHERE id = ?')
            .run(JSON.stringify(product), product.id);
        }
      }
    order.status = status;
    db().prepare('UPDATE orders SET data = ? WHERE id = ?').run(JSON.stringify(order), id);
    db().exec('COMMIT');
    transaction = false;
    return NextResponse.json(order);
  } catch (e) {
    if (transaction) db().exec('ROLLBACK');
    return NextResponse.json(
      { error: e instanceof Error ? e.message : 'Yêu cầu không hợp lệ.' },
      { status: 400 },
    );
  }
}
