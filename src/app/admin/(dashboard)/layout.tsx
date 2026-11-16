import { adminSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { AdminShell } from '@/components/admin/shell';
export const dynamic = 'force-dynamic';
export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await adminSession();
  if (!session) redirect('/admin/login');
  return <AdminShell email={session.email}>{children}</AdminShell>;
}
