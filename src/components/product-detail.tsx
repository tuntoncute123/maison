'use client';
import { useState } from 'react';
import Link from 'next/link';
import {
  Heart,
  ShoppingBag,
  Minus,
  Plus,
  Truck,
  RefreshCcw,
  Ruler,
  Check,
  ArrowUpRight,
} from 'lucide-react';
import { money, type Product } from '@/lib/types';
import { useStore } from './store-provider';
export function ProductDetail({ product: p }: { product: Product }) {
  const [size, setSize] = useState(p.sizes[0]),
    [color, setColor] = useState(p.colors[0]),
    [quantity, setQuantity] = useState(1);
  const { addItem, wishlist, toggleWish } = useStore();
  return (
    <div className="section product-detail-page">
      <div className="breadcrumb">
        <Link href="/">Trang chủ</Link>
        <span>/</span>
        <Link href="/shop">Bộ sưu tập</Link>
        <span>/</span>
        <span>{p.name}</span>
      </div>
      <div className="product-detail">
        <div className="detail-image">
          <img src={p.image} alt={p.name} />
          {p.badge && <span className="product-badge">{p.badge}</span>}
          <span className="detail-image-note">MÂISON — THOUGHTFULLY SELECTED</span>
        </div>
        <div className="detail-info">
          <span className="eyebrow">
            {p.category} / {p.gender === 'men' ? 'NAM' : p.gender === 'women' ? 'NỮ' : 'UNISEX'}
          </span>
          <h1>{p.name}</h1>
          <div className="detail-price">
            {money(p.price)}
            {p.originalPrice > p.price && (
              <>
                <del>{money(p.originalPrice)}</del>
                <span>−{Math.round((1 - p.price / p.originalPrice) * 100)}%</span>
              </>
            )}
          </div>
          <p className="detail-description">{p.description}</p>
          <div className="variant-label">
            Màu sắc{' '}
            <span className="muted">
              / {p.colors.indexOf(color) + 1} trong {p.colors.length} lựa chọn
            </span>
          </div>
          <div className="color-options">
            {p.colors.map((c, i) => (
              <button
                key={c}
                className={color === c ? 'selected' : ''}
                aria-label={`Màu ${i + 1}`}
                aria-pressed={color === c}
                onClick={() => setColor(c)}
                style={{ background: c }}
              >
                {color === c && (
                  <Check
                    size={17}
                    color={
                      [
                        '#252525',
                        '#262626',
                        '#303530',
                        '#343a3d',
                        '#32312e',
                        '#2b3032',
                        '#4a4540',
                        '#902e34',
                      ].includes(c)
                        ? 'white'
                        : '#222'
                    }
                  />
                )}
              </button>
            ))}
          </div>
          <div className="variant-label">
            Kích cỡ
            <Link href="/policies#sizes">
              <Ruler size={15} /> Hướng dẫn chọn size
            </Link>
          </div>
          <div className="size-options">
            {p.sizes.map((s) => (
              <button
                key={s}
                className={size === s ? 'selected' : ''}
                onClick={() => setSize(s)}
                aria-pressed={size === s}
              >
                {s}
              </button>
            ))}
          </div>
          <div className={`stock-status ${!p.stock ? 'out' : ''}`}>
            <span />
            {p.stock ? `Sẵn hàng · ${p.stock} sản phẩm` : 'Tạm hết hàng'}
          </div>
          <div className="purchase-row">
            <div className="quantity-control">
              <button
                aria-label="Giảm số lượng"
                disabled={quantity <= 1}
                onClick={() => setQuantity((q) => q - 1)}
              >
                <Minus size={15} />
              </button>
              <span>{quantity}</span>
              <button
                aria-label="Tăng số lượng"
                disabled={quantity >= Math.min(20, p.stock)}
                onClick={() => setQuantity((q) => q + 1)}
              >
                <Plus size={15} />
              </button>
            </div>
            <button
              className="button dark add-to-cart"
              disabled={!p.stock}
              onClick={() => addItem(p, size, color, quantity)}
            >
              <ShoppingBag size={18} /> Thêm vào giỏ hàng
            </button>
            <button
              className={`detail-wish ${wishlist.includes(p.id) ? 'liked' : ''}`}
              aria-label="Yêu thích sản phẩm"
              aria-pressed={wishlist.includes(p.id)}
              onClick={() => toggleWish(p.id)}
            >
              <Heart size={21} fill={wishlist.includes(p.id) ? 'currentColor' : 'none'} />
            </button>
          </div>
          <Link className="detail-cart-link" href="/cart">
            Xem giỏ hàng của bạn <ArrowUpRight size={15} />
          </Link>
          <div className="detail-benefits">
            <span>
              <Truck size={19} /> Miễn phí giao hàng cho đơn từ 699.000đ
            </span>
            <span>
              <RefreshCcw size={18} /> Đổi trả trong 30 ngày theo chính sách cửa hàng
            </span>
          </div>
          <details open>
            <summary>Chất liệu & bảo quản</summary>
            <p>
              Giặt nhẹ ở nhiệt độ không quá 30°C. Tránh chất tẩy mạnh, phơi trong bóng râm và ủi ở
              nhiệt độ thấp. Xem nhãn bên trong sản phẩm để biết hướng dẫn cụ thể.
            </p>
          </details>
          <details>
            <summary>Giao hàng & đổi trả</summary>
            <p>
              Giao hàng dự kiến 2–5 ngày làm việc. Hỗ trợ đổi trả trong 30 ngày với sản phẩm còn
              nguyên tem và chưa qua sử dụng.{' '}
              <Link href="/policies#shipping">Xem chính sách đầy đủ.</Link>
            </p>
          </details>
        </div>
      </div>
    </div>
  );
}
