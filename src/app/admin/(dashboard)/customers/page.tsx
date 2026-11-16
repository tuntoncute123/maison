import { adminSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { getOrders } from '@/lib/db';
import { CustomerManager } from '@/components/admin/customer-manager';
export default async function Page() {
  if (!(await adminSession())) redirect('/admin/login');
  return <CustomerManager orders={getOrders()} />;
}
