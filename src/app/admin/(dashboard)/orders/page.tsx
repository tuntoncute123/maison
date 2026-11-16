import { adminSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { getOrders } from '@/lib/db';
import { OrderManager } from '@/components/admin/order-manager';
export default async function Page({ searchParams }: { searchParams: Promise<{ id?: string }> }) {
  if (!(await adminSession())) redirect('/admin/login');
  return <OrderManager initialOrders={getOrders()} initialId={(await searchParams).id} />;
}
