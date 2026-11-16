import { getProduct, getProducts } from '@/lib/db';
import { notFound } from 'next/navigation';
import { ProductDetail } from '@/components/product-detail';
import { ProductCard } from '@/components/product-card';
export const dynamic = 'force-dynamic';
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const p = getProduct((await params).id);
  return { title: p?.name || 'Sản phẩm' };
}
export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const product = getProduct((await params).id);
  if (!product) notFound();
  return (
    <>
      <ProductDetail product={product} />
      <section className="section related-products">
        <div className="section-heading">
          <div>
            <span className="eyebrow">BETTER TOGETHER</span>
            <h2>
              Có thể bạn cũng <em>yêu.</em>
            </h2>
          </div>
        </div>
        <div className="product-grid">
          {getProducts()
            .filter((p) => p.id !== product.id)
            .slice(0, 4)
            .map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
        </div>
      </section>
    </>
  );
}
