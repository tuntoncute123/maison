'use client';
import Link from 'next/link';
import { useState } from 'react';
import { Check, ArrowRight, ArrowLeft, ShieldCheck, Banknote, Tag } from 'lucide-react';
import { useStore } from './store-provider';
import { money, type Order } from '@/lib/types';
export function Checkout() {
  const { cart, clearCart, ready } = useStore();
  const [busy, setBusy] = useState(false),
    [error, setError] = useState(''),
    [coupon, setCoupon] = useState(''),
    [applied, setApplied] = useState(''),
    [couponError, setCouponError] = useState(''),
    [order, setOrder] = useState<Order | null>(null);
  const subtotal = cart.reduce((s, i) => s + i.quantity * i.product.price, 0),
    shipping = subtotal >= 699000 ? 0 : 30000,
    discount = applied ? Math.min(Math.round(subtotal * 0.1), 100000) : 0;
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError('');
    const values = Object.fromEntries(new FormData(e.currentTarget));
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...values,
          coupon: applied,
          items: cart.map((i) => ({
            productId: i.product.id,
            size: i.size,
            color: i.color,
            quantity: i.quantity,
          })),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setOrder(data);
      clearCart();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Không thể kết nối. Vui lòng thử lại.');
    } finally {
      setBusy(false);
    }
  }
  if (!ready) return <div className="section loading-state">Đang tải...</div>;
  if (order)
    return (
      <div className="section order-success">
        <div className="success-icon">
          <Check size={35} />
        </div>
        <span className="eyebrow">THANK YOU FOR CHOOSING MÂISON</span>
        <h1>Một chút phong cách đang đến!</h1>
        <p>Cảm ơn {order.customerName}. Cửa hàng đã nhận đơn và sẽ liên hệ xác nhận với bạn.</p>
        <div className="success-card">
          <span>
            Mã đơn hàng<strong>{order.id}</strong>
          </span>
          <span>
            Thanh toán khi nhận hàng<strong>{money(order.total)}</strong>
          </span>
          <span>
            Giao đến<strong>{order.address}</strong>
          </span>
          <small>
            Lưu mã đơn để tra cứu cùng số điện thoại đặt hàng. Đơn chưa được thanh toán.
          </small>
        </div>
        <div className="success-actions">
          <Link className="button dark" href={`/track?id=${order.id}`}>
            Theo dõi đơn hàng <ArrowRight size={17} />
          </Link>
          <Link className="button outline" href="/shop">
            Tiếp tục khám phá
          </Link>
        </div>
      </div>
    );
  if (!cart.length)
    return (
      <div className="section empty-state">
        <h1>Giỏ hàng của bạn đang trống</h1>
        <Link className="button dark" href="/shop">
          Khám phá bộ sưu tập
        </Link>
      </div>
    );
  return (
    <div className="section checkout-page">
      <div className="breadcrumb">
        <Link href="/cart">
          <ArrowLeft size={14} /> Giỏ hàng
        </Link>
        <span>/</span>
        <span>Đặt hàng</span>
      </div>
      <div className="page-title">
        <span className="eyebrow">ONE STEP CLOSER</span>
        <h1>Hoàn tất đơn hàng.</h1>
      </div>
      <form className="checkout-layout" onSubmit={submit}>
        <div className="checkout-fields">
          <h2>
            <span>01</span> Thông tin giao hàng
          </h2>
          <div className="form-grid">
            <label>
              Họ và tên *
              <input
                name="customerName"
                required
                minLength={2}
                maxLength={100}
                autoComplete="name"
                placeholder="Nguyễn Minh Anh"
              />
            </label>
            <label>
              Số điện thoại *
              <input
                name="phone"
                type="tel"
                required
                pattern="(0|\+84)[0-9]{9}"
                autoComplete="tel"
                placeholder="0912345678"
                title="Nhập 10 chữ số, bắt đầu bằng 0; không dùng khoảng trắng"
              />
            </label>
            <label className="span-2">
              Email <span>(không bắt buộc)</span>
              <input
                name="email"
                type="email"
                maxLength={254}
                autoComplete="email"
                placeholder="ban@email.com"
              />
            </label>
            <label className="span-2">
              Địa chỉ nhận hàng *
              <textarea
                name="address"
                required
                minLength={10}
                maxLength={500}
                autoComplete="street-address"
                placeholder="Số nhà, tên đường, phường/xã, tỉnh/thành phố"
                rows={3}
              />
            </label>
            <label className="span-2">
              Ghi chú đơn hàng
              <textarea
                name="note"
                maxLength={1000}
                placeholder="Điều gì bạn muốn nhắn với MÂISON?"
                rows={2}
              />
            </label>
          </div>
          <h2>
            <span>02</span> Phương thức thanh toán
          </h2>
          <div className="payment-option">
            <span className="radio-dot" />
            <Banknote size={26} />
            <div>
              <strong>Thanh toán khi nhận hàng (COD)</strong>
              <p>Thanh toán trực tiếp cho đơn vị vận chuyển khi nhận hàng.</p>
            </div>
            <Check size={19} />
          </div>
          <p className="checkout-policy">
            Bằng việc đặt hàng, bạn đồng ý với{' '}
            <Link href="/policies">chính sách mua hàng và bảo mật</Link> của MÂISON.
          </p>
        </div>
        <aside className="order-summary checkout-summary">
          <h2>
            Đơn hàng của bạn <span>({cart.reduce((s, i) => s + i.quantity, 0)})</span>
          </h2>
          <div className="checkout-items">
            {cart.map((i) => (
              <div className="checkout-item" key={`${i.product.id}-${i.size}-${i.color}`}>
                <img src={i.product.image} alt={i.product.name} />
                <div>
                  <strong>{i.product.name}</strong>
                  <span>
                    Size {i.size} · Số lượng {i.quantity}
                  </span>
                  <b>{money(i.product.price * i.quantity)}</b>
                </div>
              </div>
            ))}
          </div>
          <div className="coupon-input">
            <Tag size={17} />
            <input
              aria-label="Mã ưu đãi"
              value={coupon}
              onChange={(e) => setCoupon(e.target.value)}
              placeholder="Mã ưu đãi"
            />
            <button
              type="button"
              onClick={() => {
                if (coupon.trim().toUpperCase() === 'WELCOME10') {
                  setApplied('WELCOME10');
                  setCouponError('');
                } else {
                  setApplied('');
                  setCouponError('Mã không hợp lệ. Thử WELCOME10.');
                }
              }}
            >
              Áp dụng
            </button>
          </div>
          {couponError && (
            <p className="form-error" role="alert">
              {couponError}
            </p>
          )}
          {applied && (
            <p className="coupon-success">Đã áp dụng WELCOME10 · Giảm 10% (tối đa 100K)</p>
          )}
          <div>
            <span>Tạm tính</span>
            <span>{money(subtotal)}</span>
          </div>
          <div>
            <span>Phí vận chuyển</span>
            <span>{shipping ? money(shipping) : 'Miễn phí'}</span>
          </div>
          {discount > 0 && (
            <div className="discount-row">
              <span>Ưu đãi</span>
              <span>−{money(discount)}</span>
            </div>
          )}
          <div className="summary-total">
            <span>Tổng thanh toán</span>
            <strong>{money(subtotal + shipping - discount)}</strong>
          </div>
          {error && (
            <p className="form-error" role="alert">
              {error}
            </p>
          )}
          <button className="button dark full-width" disabled={busy}>
            {busy ? 'Đang xử lý...' : 'Xác nhận đặt hàng'}
            <ArrowRight size={18} />
          </button>
          <small>
            <ShieldCheck size={15} /> Thông tin của bạn được bảo mật
          </small>
        </aside>
      </form>
    </div>
  );
}
