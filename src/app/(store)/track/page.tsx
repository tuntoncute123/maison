import { TrackOrder } from '@/components/track-order';
export const metadata = { title: 'Tra cứu đơn hàng' };
export default async function Page({ searchParams }: { searchParams: Promise<{ id?: string }> }) {
  return <TrackOrder initialId={(await searchParams).id || ''} />;
}
