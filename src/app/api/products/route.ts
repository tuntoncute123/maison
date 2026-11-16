import { NextResponse } from 'next/server';
import { saveProduct, getProducts } from '@/lib/db';
import { adminSession, safeOrigin } from '@/lib/auth';
import { validateProduct, message } from '@/lib/validation';
import { randomUUID } from 'node:crypto';
export async function GET() {
  return NextResponse.json(getProducts());
}
export async function POST(request: Request) {
  if (!safeOrigin(request) || !(await adminSession()))
    return NextResponse.json({ error: 'Không có quyền truy cập.' }, { status: 401 });
  try {
    const product = validateProduct(await request.json());
    product.id = randomUUID();
    saveProduct(product);
    return NextResponse.json(product, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: message(e) }, { status: 400 });
  }
}
