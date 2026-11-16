'use client';
import { useState } from 'react';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import type { Product } from '@/lib/types';
import { ProductCard } from './product-card';
export function HomeProducts({ products }: { products: Product[] }) {
  const [tab, setTab] = useState('all');
  const filtered = products
    .filter((p) =>
      tab === 'all'
        ? p.featured
        : tab === 'new'
          ? p.badge === 'MỚI'
          : p.gender === tab || p.gender === 'unisex',
    )
    .slice(0, 4);
  return (
    <section className="section featured-section">
      <div className="section-heading">
        <div>
          <span className="eyebrow">CURATED FOR YOU</span>
          <h2>
            Những lựa chọn <em>đáng yêu.</em>
          </h2>
        </div>
        <Link className="text-link" href="/shop">
          Xem tất cả sản phẩm <ArrowUpRight size={17} />
        </Link>
      </div>
      <div className="product-tabs" role="tablist" aria-label="Lọc sản phẩm nổi bật">
        {[
          ['all', 'Được yêu thích'],
          ['new', 'Mới về'],
          ['women', 'Thời trang nữ'],
          ['men', 'Thời trang nam'],
        ].map(([value, label]) => (
          <button
            role="tab"
            aria-selected={tab === value}
            className={tab === value ? 'selected' : ''}
            onClick={() => setTab(value)}
            key={value}
          >
            {label}
            {value === 'new' && <span>NEW</span>}
          </button>
        ))}
      </div>
      <div className="product-grid">
        {filtered.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
      <div className="center-link">
        <Link className="button outline" href="/shop">
          Tìm món đồ của bạn <ArrowUpRight size={18} />
        </Link>
      </div>
    </section>
  );
}
