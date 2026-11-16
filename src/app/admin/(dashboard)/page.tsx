import { adminSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { getProducts, getOrders, getSubscriberCount } from '@/lib/db';
import { Overview } from '@/components/admin/overview';
export default async function Page() {
  if (!(await adminSession())) redirect('/admin/login');
  const subscribers = getSubscriberCount();
  return <Overview products={getProducts()} orders={getOrders()} subscribers={subscribers} />;
}
