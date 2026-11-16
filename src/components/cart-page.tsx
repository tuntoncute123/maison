'use client';
import Link from 'next/link';
import {
  ShoppingBag,
  Minus,
  Plus,
  X,
  ArrowRight,
  ArrowLeft,
  Truck,
  ShieldCheck,
} from 'lucide-react';
import { useStore } from './store-provider';
import { money } from '@/lib/types';
export function CartPage() {
  const { cart, ready, updateQuantity, removeItem } = useStore();
  const subtotal = cart.reduce((sum, i) => sum + i.product.price * i.quantity, 0),
    shipping = subtotal >= 699000 ? 0 : 30000;
  if (!ready) return <div className="section loading-state">Đang mở giỏ hàng...</div>;
  return (
    <div className="section cart-page">
      <div className="breadcrumb">
        <Link href="/">Trang chủ</Link>
        <span>/</span>
        <span>Giỏ hàng</span>
      </div>
      <div className="page-title">
        <span className="eyebrow">YOUR EVERYDAY FINDS</span>
        <h1>
          Giỏ hàng của bạn<span> ({cart.reduce((s, i) => s + i.quantity, 0)})</span>
        </h1>
      </div>
      {cart.length ? (
        <div className="cart-layout">
          <div>
            <div className="free-shipping">
              <Truck size={21} />
              <div>
                {subtotal >= 699000 ? (
                  'Tuyệt vời! Đơn hàng của bạn được miễn phí vận chuyển.'
                ) : (
                  <>
                    Thêm <strong>{money(699000 - subtotal)}</strong> để được miễn phí vận chuyển.
                  </>
                )}
                <div className="shipping-progress">
                  <i style={{ width: `${Math.min(100, (subtotal / 699000) * 100)}%` }} />
                </div>
              </div>
            </div>
            <div className="cart-labels">
              <span>SẢN PHẨM</span>
              <span>SỐ LƯỢNG</span>
              <span>THÀNH TIỀN</span>
            </div>
            {cart.map((item, index) => (
              <div className="cart-item" key={`${item.product.id}-${item.size}-${item.color}`}>
                <Link href={`/product/${item.product.id}`}>
                  <img src={item.product.image} alt={item.product.name} />
                </Link>
                <div className="cart-item-info">
                  <Link href={`/product/${item.product.id}`}>{item.product.name}</Link>
                  <span>
                    Size {item.size} <i style={{ background: item.color }} />
                  </span>
                  <strong>{money(item.product.price)}</strong>
                  <button className="remove-mobile" onClick={() => removeItem(index)}>
                    Xóa sản phẩm
                  </button>
                </div>
                <div className="quantity-control">
                  <button
                    aria-label={`Giảm số lượng ${item.product.name}`}
                    disabled={item.quantity <= 1}
                    onClick={() => updateQuantity(index, item.quantity - 1)}
                  >
                    <Minus size={13} />
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    aria-label={`Tăng số lượng ${item.product.name}`}
                    onClick={() => updateQuantity(index, item.quantity + 1)}
                  >
                    <Plus size={13} />
                  </button>
                </div>
                <strong className="cart-line-total">
                  {money(item.product.price * item.quantity)}
                </strong>
                <button
                  className="remove-item"
                  aria-label={`Xóa ${item.product.name}`}
                  onClick={() => removeItem(index)}
                >
                  <X size={17} />
                </button>
              </div>
            ))}
            <Link className="text-link continue-shopping" href="/shop">
              <ArrowLeft size={16} /> Tiếp tục mua sắm
            </Link>
          </div>
          <aside className="order-summary">
            <h2>Tóm tắt đơn hàng</h2>
            <div>
              <span>Tạm tính</span>
              <span>{money(subtotal)}</span>
            </div>
            <div>
              <span>Phí vận chuyển</span>
              <span>{shipping ? money(shipping) : 'Miễn phí'}</span>
            </div>
            <p>Mã ưu đãi có thể nhập ở bước thanh toán.</p>
            <div className="summary-total">
              <span>Tổng cộng</span>
              <strong>{money(subtotal + shipping)}</strong>
            </div>
            <Link className="button dark full-width" href="/checkout">
              Tiến hành đặt hàng <ArrowRight size={18} />
            </Link>
            <small>
              <ShieldCheck size={15} /> Thanh toán khi nhận hàng (COD)
            </small>
          </aside>
        </div>
      ) : (
        <div className="empty-state">
          <ShoppingBag size={50} strokeWidth={1} />
          <h2>Một chiếc giỏ đang chờ cảm hứng.</h2>
          <p>Khám phá những thiết kế mới và tìm món đồ dành riêng cho bạn.</p>
          <Link className="button dark" href="/shop">
            Bắt đầu khám phá <ArrowRight size={18} />
          </Link>
        </div>
      )}
    </div>
  );
}
