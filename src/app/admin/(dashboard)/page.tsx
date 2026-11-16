import { adminSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { getProducts, getOrders, db } from '@/lib/db';
import { Overview } from '@/components/admin/overview';
export default async function Page() {
  if (!(await adminSession())) redirect('/admin/login');
  const subscribers = (
    db().prepare('SELECT COUNT(*) AS count FROM subscribers').get() as { count: number }
  ).count;
  return <Overview products={getProducts()} orders={getOrders()} subscribers={subscribers} />;
}
