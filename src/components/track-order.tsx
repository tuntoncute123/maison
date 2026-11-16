'use client';
import { useState } from 'react';
import { Search, Package, ArrowRight } from 'lucide-react';
import { type Order, money, statusLabels } from '@/lib/types';
export function TrackOrder({ initialId }: { initialId: string }) {
  const [id, setId] = useState(initialId),
    [phone, setPhone] = useState(''),
    [busy, setBusy] = useState(false),
    [error, setError] = useState(''),
    [order, setOrder] = useState<Order | null>(null);
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError('');
    setOrder(null);
    try {
      const res = await fetch('/api/orders/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, phone }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setOrder(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Không thể kết nối. Vui lòng thử lại.');
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="section track-page">
      <div className="page-title">
        <span className="eyebrow">YOUR MÂISON JOURNEY</span>
        <h1>Đơn hàng của bạn đang ở đâu?</h1>
        <p>Nhập mã đơn và số điện thoại để theo dõi hành trình của những món đồ bạn yêu.</p>
      </div>
      <form className="track-form" onSubmit={submit}>
        <div className="form-grid">
          <label>
            Mã đơn hàng
            <input
              required
              value={id}
              onChange={(e) => setId(e.target.value)}
              placeholder="MS-XXXXXXXX"
              maxLength={30}
            />
          </label>
          <label>
            Số điện thoại đặt hàng
            <input
              required
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="0912345678"
              maxLength={20}
            />
          </label>
        </div>
        {error && (
          <p role="alert" className="form-error">
            {error}
          </p>
        )}
        <button disabled={busy} className="button dark full-width">
          <Search size={17} />
          {busy ? 'Đang tra cứu...' : 'Tra cứu đơn hàng'}
          <ArrowRight size={17} />
        </button>
      </form>
      {order && (
        <div className="tracking-result">
          <div>
            <h3>
              <Package size={22} /> {order.id}
            </h3>
            <span className={`status ${order.status}`}>{statusLabels[order.status]}</span>
          </div>
          <p>
            Ngày đặt: {new Date(order.createdAt).toLocaleDateString('vi-VN')}
            <br />
            Người nhận: {order.customerName}
            <br />
            Địa chỉ: {order.address}
          </p>
          {order.items.map((item, i) => (
            <div className="track-item" key={i}>
              <span>
                {item.name} · Size {item.size} × {item.quantity}
              </span>
              <strong>{money(item.price * item.quantity)}</strong>
            </div>
          ))}
          <div className="track-item">
            <span>Tổng thanh toán (COD)</span>
            <strong>{money(order.total)}</strong>
          </div>
          {order.status === 'pending' && <p>Cửa hàng sẽ liên hệ để xác nhận đơn hàng của bạn.</p>}
        </div>
      )}
    </div>
  );
}
