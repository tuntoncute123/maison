'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Search, SlidersHorizontal, X, ArrowUpRight } from 'lucide-react';
import { categories, type Product } from '@/lib/types';
import { ProductCard } from './product-card';
import { useStore } from './store-provider';
export function Catalog({
  products,
  initial = {},
  wishlistOnly = false,
}: {
  products: Product[];
  initial?: Record<string, string | undefined>;
  wishlistOnly?: boolean;
}) {
  const [gender, setGender] = useState(initial.gender || ''),
    [category, setCategory] = useState(initial.category || ''),
    [q, setQ] = useState(initial.q || ''),
    [sort, setSort] = useState('featured'),
    [sale, setSale] = useState(initial.sale === 'true'),
    [newOnly, setNewOnly] = useState(initial.collection === 'new');
  const { wishlist } = useStore();
  const filtered = products
    .filter(
      (p) =>
        (!wishlistOnly || wishlist.includes(p.id)) &&
        (!gender || p.gender === gender || p.gender === 'unisex') &&
        (!category || p.category === category) &&
        (!sale || p.originalPrice > p.price) &&
        (!newOnly || p.badge === 'MỚI') &&
        p.name.toLocaleLowerCase('vi').includes(q.toLocaleLowerCase('vi')),
    )
    .sort((a, b) =>
      sort === 'price-up'
        ? a.price - b.price
        : sort === 'price-down'
          ? b.price - a.price
          : sort === 'name'
            ? a.name.localeCompare(b.name, 'vi')
            : Number(b.featured) - Number(a.featured),
    );
  function reset() {
    setGender('');
    setCategory('');
    setQ('');
    setSale(false);
    setNewOnly(false);
    setSort('featured');
  }
  return (
    <div className="catalog-page section">
      <div className="breadcrumb">
        <Link href="/">Trang chủ</Link>
        <span>/</span>
        <span>{wishlistOnly ? 'Yêu thích' : 'Bộ sưu tập'}</span>
      </div>
      <div className="catalog-title">
        <span className="eyebrow">{wishlistOnly ? 'SAVED WITH LOVE' : 'THE MÂISON WARDROBE'}</span>
        <h1>
          {wishlistOnly
            ? 'Những điều bạn yêu.'
            : gender === 'women'
              ? 'Dành riêng cho nàng.'
              : gender === 'men'
                ? 'Phong cách của chàng.'
                : newOnly
                  ? 'Một mùa cảm hứng mới.'
                  : 'Tìm phong cách của bạn.'}
        </h1>
        <p>Thiết kế tinh tế, chất liệu chọn lọc. Để mỗi ngày đều là một ngày bạn tự tin.</p>
      </div>
      <div className="catalog-toolbar">
        <div className="catalog-tabs">
          {[
            ['', 'Tất cả'],
            ['women', 'Nữ'],
            ['men', 'Nam'],
          ].map(([v, l]) => (
            <button key={v} className={gender === v ? 'active' : ''} onClick={() => setGender(v)}>
              {l}
            </button>
          ))}
        </div>
        <div className="catalog-search">
          <Search size={17} />
          <input
            aria-label="Tìm trong bộ sưu tập"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Tìm sản phẩm..."
          />
        </div>
      </div>
      <div className="catalog-layout">
        <aside className="filter-panel">
          <h3>
            <SlidersHorizontal size={17} /> Bộ lọc
          </h3>
          <label className="filter-label">DANH MỤC</label>
          <button className={!category ? 'category-active' : ''} onClick={() => setCategory('')}>
            Tất cả sản phẩm <span>{products.length}</span>
          </button>
          {categories.map((c) => (
            <button
              key={c}
              className={category === c ? 'category-active' : ''}
              onClick={() => setCategory(c)}
            >
              {c}
              <span>{products.filter((p) => p.category === c).length}</span>
            </button>
          ))}
          <div className="filter-checks">
            <label>
              <input type="checkbox" checked={sale} onChange={(e) => setSale(e.target.checked)} />{' '}
              Đang có ưu đãi
            </label>
            <label>
              <input
                type="checkbox"
                checked={newOnly}
                onChange={(e) => setNewOnly(e.target.checked)}
              />{' '}
              Sản phẩm mới
            </label>
          </div>
          <button className="reset-filter" onClick={reset}>
            Xóa bộ lọc <X size={14} />
          </button>
          <div className="filter-promo">
            <span>WELCOME TO MÂISON</span>
            <h3>Chào bạn mới.</h3>
            <p>
              Giảm 10% với mã
              <br />
              <strong>WELCOME10</strong>
            </p>
            <small>Tối đa 100.000đ / đơn hàng</small>
            <ArrowUpRight size={23} />
          </div>
        </aside>
        <div className="catalog-results">
          <div className="results-header">
            <span>{filtered.length} sản phẩm</span>
            <label>
              Sắp xếp:{' '}
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                aria-label="Sắp xếp sản phẩm"
              >
                <option value="featured">Nổi bật</option>
                <option value="price-up">Giá tăng dần</option>
                <option value="price-down">Giá giảm dần</option>
                <option value="name">Tên A–Z</option>
              </select>
            </label>
          </div>
          {filtered.length ? (
            <div className="product-grid catalog-grid">
              {filtered.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <Search size={40} />
              <h2>{wishlistOnly ? 'Lưu lại một chút yêu thích' : 'Chưa tìm thấy sản phẩm'}</h2>
              <p>
                {wishlistOnly
                  ? 'Chạm vào trái tim trên sản phẩm để lưu những món đồ bạn yêu.'
                  : 'Thử từ khóa hoặc bộ lọc khác để tìm món đồ phù hợp.'}
              </p>
              {wishlistOnly ? (
                <Link className="button dark" href="/shop">
                  Khám phá ngay <ArrowUpRight size={18} />
                </Link>
              ) : (
                <button className="button dark" onClick={reset}>
                  Xóa bộ lọc
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
