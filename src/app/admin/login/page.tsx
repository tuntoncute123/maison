import { adminSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { LoginForm } from '@/components/admin/login-form';
export const dynamic = 'force-dynamic';
export default async function LoginPage() {
  if (await adminSession()) redirect('/admin');
  return <LoginForm />;
}
