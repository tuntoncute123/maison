import { NextResponse } from 'next/server';
import { getProduct, getOrder, saveProduct, saveOrder, transaction } from '@/lib/db';
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
  try {
    const { status } = await request.json();
    const { id } = await params;
    const result = transaction(() => {
      const order = getOrder(id);
      if (!order) throw new Error('Không tìm thấy đơn hàng.');
      if (!transitions[order.status].includes(status))
        throw new Error('Không thể chuyển sang trạng thái này.');
      if (status === 'cancelled')
        for (const item of order.items) {
          const product = getProduct(item.productId);
          if (product) {
            product.stock += item.quantity;
            saveProduct(product);
          }
        }
      order.status = status;
      saveOrder(order);
      return order;
    });
    return NextResponse.json(result);
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : 'Yêu cầu không hợp lệ.' },
      { status: 400 },
    );
  }
}
