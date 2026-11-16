import { getProducts } from '@/lib/db';
import { Catalog } from '@/components/catalog';
export const dynamic = 'force-dynamic';
export const metadata = { title: 'Sản phẩm yêu thích' };
export default function Wishlist() {
  return <Catalog products={getProducts()} wishlistOnly />;
}
