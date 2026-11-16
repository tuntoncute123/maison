import { NextResponse } from 'next/server';
import { saveProduct, deleteProduct, getProduct } from '@/lib/db';
import { adminSession, safeOrigin } from '@/lib/auth';
import { validateProduct, message } from '@/lib/validation';
type Context = { params: Promise<{ id: string }> };
export async function GET(_: Request, { params }: Context) {
  const product = getProduct((await params).id);
  return product
    ? NextResponse.json(product)
    : NextResponse.json({ error: 'Không tìm thấy sản phẩm.' }, { status: 404 });
}
export async function PUT(request: Request, { params }: Context) {
  if (!safeOrigin(request) || !(await adminSession()))
    return NextResponse.json({ error: 'Không có quyền truy cập.' }, { status: 401 });
  const { id } = await params;
  if (!getProduct(id))
    return NextResponse.json({ error: 'Sản phẩm không tồn tại.' }, { status: 404 });
  try {
    const product = { ...validateProduct(await request.json()), id };
    saveProduct(product);
    return NextResponse.json(product);
  } catch (e) {
    return NextResponse.json({ error: message(e) }, { status: 400 });
  }
}
export async function DELETE(request: Request, { params }: Context) {
  if (!safeOrigin(request) || !(await adminSession()))
    return NextResponse.json({ error: 'Không có quyền truy cập.' }, { status: 401 });
  deleteProduct((await params).id);
  return NextResponse.json({ success: true });
}
