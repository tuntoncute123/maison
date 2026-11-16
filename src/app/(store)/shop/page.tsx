import { getProducts } from '@/lib/db';
import { Catalog } from '@/components/catalog';
export const dynamic = 'force-dynamic';
export const metadata = { title: 'Khám phá bộ sưu tập' };
export default async function Shop({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const filters = await searchParams;
  return <Catalog key={JSON.stringify(filters)} products={getProducts()} initial={filters} />;
}
