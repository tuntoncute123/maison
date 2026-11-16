import { adminSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { getProducts } from '@/lib/db';
import { ProductManager } from '@/components/admin/product-manager';
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ new?: string; edit?: string }>;
}) {
  if (!(await adminSession())) redirect('/admin/login');
  return <ProductManager initialProducts={getProducts()} initial={await searchParams} />;
}
