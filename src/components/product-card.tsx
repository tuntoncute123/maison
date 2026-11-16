'use client';
import Link from 'next/link';
import { Heart, ArrowUpRight } from 'lucide-react';
import { useStore } from './store-provider';
import { money, type Product } from '@/lib/types';
export function ProductCard({ product }: { product: Product }) {
  const { wishlist, toggleWish } = useStore();
  const liked = wishlist.includes(product.id);
  const discount =
    product.originalPrice > product.price
      ? Math.round((1 - product.price / product.originalPrice) * 100)
      : 0;
  return (
    <article className="product-card">
      <div className="product-image">
        <Link href={`/product/${product.id}`} tabIndex={-1} aria-hidden="true">
          <img src={product.image} alt={product.name} loading="lazy" />
        </Link>
        {product.badge && (
          <span className={`product-badge ${product.badge === 'MỚI' ? 'new' : ''}`}>
            {product.badge}
          </span>
        )}
        <button
          className={`wish-button ${liked ? 'liked' : ''}`}
          aria-label={liked ? `Bỏ yêu thích ${product.name}` : `Yêu thích ${product.name}`}
          aria-pressed={liked}
          onClick={() => toggleWish(product.id)}
        >
          <Heart size={17} fill={liked ? 'currentColor' : 'none'} />
        </button>
        <Link className="quick-view" href={`/product/${product.id}`}>
          Khám phá sản phẩm <ArrowUpRight size={18} />
        </Link>
        {product.stock === 0 && <span className="sold-out">Tạm hết hàng</span>}
        {discount > 0 && <span className="product-discount">−{discount}%</span>}
      </div>
      <div className="product-meta">
        <span>
          {product.gender === 'men'
            ? 'THỜI TRANG NAM'
            : product.gender === 'women'
              ? 'THỜI TRANG NỮ'
              : 'UNISEX'}{' '}
          / {product.category.toLocaleUpperCase('vi')}
        </span>
        <div className="swatches">
          {product.colors.map((c) => (
            <i key={c} style={{ background: c }} title={c} />
          ))}
        </div>
      </div>
      <Link href={`/product/${product.id}`} className="product-name">
        {product.name}
      </Link>
      <div className="price">
        {money(product.price)}
        {product.originalPrice > product.price && <del>{money(product.originalPrice)}</del>}
      </div>
      <div className="product-options" aria-label="Kích cỡ có sẵn">
        <span>{product.sizes.join(' · ')}</span>
        <span>{product.colors.length} màu</span>
      </div>
    </article>
  );
}
