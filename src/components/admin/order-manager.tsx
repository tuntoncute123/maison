'use client';
import { useState } from 'react';
import {
  Search,
  ShoppingBag,
  Eye,
  Download,
  ArrowRight,
  RefreshCw,
  MapPin,
  Phone,
  Mail,
  User,
  CalendarDays,
} from 'lucide-react';
import { type Order, money, statusLabels } from '@/lib/types';
import { useStore } from '../store-provider';
import { Modal } from './modal';
const transitions: Record<Order['status'], Order['status'][]> = {
  pending: ['confirmed', 'cancelled'],
  confirmed: ['shipping', 'cancelled'],
  shipping: ['completed'],
  completed: [],
  cancelled: [],
};
export function OrderManager({
  initialOrders,
  initialId,
}: {
  initialOrders: Order[];
  initialId?: string;
}) {
  const [orders, setOrders] = useState(initialOrders),
    [query, setQuery] = useState(''),
    [status, setStatus] = useState(''),
    [selected, setSelected] = useState<Order | null>(
      initialOrders.find((o) => o.id === initialId) || null,
    ),
    [busy, setBusy] = useState(false),
    [refreshing, setRefreshing] = useState(false),
    [error, setError] = useState(''),
    [nextStatus, setNextStatus] = useState('');
  const { notify } = useStore();
  const filtered = orders.filter(
    (o) =>
      (!status || o.status === status) &&
      `${o.id} ${o.customerName} ${o.phone}`
        .toLocaleLowerCase('vi')
        .includes(query.toLocaleLowerCase('vi')),
  );
  async function refresh() {
    setRefreshing(true);
    try {
      const res = await fetch('/api/orders');
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setOrders(data);
      notify('Đã cập nhật danh sách đơn hàng.');
    } catch (e) {
      notify(e instanceof Error ? e.message : 'Không thể cập nhật.');
    } finally {
      setRefreshing(false);
    }
  }
  async function update() {
    if (!selected || !nextStatus) return;
    setBusy(true);
    setError('');
    try {
      const res = await fetch(`/api/admin/orders/${selected.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setOrders((list) => list.map((o) => (o.id === data.id ? data : o)));
      setSelected(data);
      setNextStatus('');
      notify('Đã cập nhật trạng thái đơn hàng.');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Không thể kết nối.');
    } finally {
      setBusy(false);
    }
  }
  function csv() {
    const cell = (v: string | number) =>
      `"${String(v)
        .replace(/^[=+@\-\t\r]/, "'$&")
        .replaceAll('"', '""')}"`;
    const rows = [
      ['Mã đơn', 'Khách hàng', 'Số điện thoại', 'Ngày đặt', 'Tổng tiền', 'Trạng thái'],
      ...filtered.map((o) => [
        o.id,
        o.customerName,
        o.phone,
        new Date(o.createdAt).toLocaleDateString('vi-VN'),
        o.total,
        statusLabels[o.status],
      ]),
    ];
    const blob = new Blob(['\uFEFF' + rows.map((r) => r.map(cell).join(',')).join('\r\n')], {
      type: 'text/csv;charset=utf-8;',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'maison-don-hang.csv';
    a.click();
    URL.revokeObjectURL(url);
  }
  return (
    <>
      <div className="admin-page-heading">
        <div>
          <span className="eyebrow">EVERY ORDER, A NEW STORY</span>
          <h1>
            Quản lý đơn hàng<span className="heading-count">{orders.length}</span>
          </h1>
          <p>Theo dõi và chăm chút từng đơn hàng, từ lúc đặt đến khi nhận.</p>
        </div>
        <button className="button outline" onClick={csv}>
          <Download size={16} /> Xuất CSV
        </button>
      </div>
      <section className="admin-panel">
        <div className="admin-order-tabs">
          {[['', 'Tất cả'], ...Object.entries(statusLabels)].map(([s, l]) => (
            <button className={s === status ? 'active' : ''} key={s} onClick={() => setStatus(s)}>
              {l}
              <span>{orders.filter((o) => !s || o.status === s).length}</span>
            </button>
          ))}
        </div>
        <div className="admin-toolbar">
          <div className="admin-search">
            <Search size={17} />
            <input
              aria-label="Tìm đơn hàng"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Tìm mã đơn, tên hoặc số điện thoại..."
            />
          </div>
          <button className="refresh-button" onClick={refresh} disabled={refreshing}>
            <RefreshCw size={15} />
            {refreshing ? 'Đang tải...' : 'Làm mới'}
          </button>
        </div>
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Mã đơn hàng</th>
                <th>Khách hàng</th>
                <th>Ngày đặt</th>
                <th>Tổng tiền</th>
                <th>Trạng thái</th>
                <th>Chi tiết</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((o) => (
                <tr key={o.id}>
                  <td>
                    <button
                      className="order-id"
                      onClick={() => {
                        setSelected(o);
                        setError('');
                        setNextStatus('');
                      }}
                    >
                      {o.id}
                    </button>
                  </td>
                  <td>
                    <strong>{o.customerName}</strong>
                    <small>{o.phone}</small>
                  </td>
                  <td>
                    {new Date(o.createdAt).toLocaleDateString('vi-VN')}
                    <small>
                      {new Date(o.createdAt).toLocaleTimeString('vi-VN', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </small>
                  </td>
                  <td>
                    <strong>{money(o.total)}</strong>
                    <small>{o.items.reduce((s, i) => s + i.quantity, 0)} sản phẩm · COD</small>
                  </td>
                  <td>
                    <span className={`status ${o.status}`}>{statusLabels[o.status]}</span>
                  </td>
                  <td>
                    <button
                      aria-label={`Xem đơn ${o.id}`}
                      onClick={() => {
                        setSelected(o);
                        setError('');
                        setNextStatus('');
                      }}
                    >
                      <Eye size={17} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!filtered.length && (
            <div className="admin-empty">
              <ShoppingBag size={36} />
              <strong>
                {orders.length ? 'Không có đơn phù hợp' : 'Những đơn hàng đầu tiên đang chờ bạn'}
              </strong>
              <p>
                {orders.length
                  ? 'Thử tìm kiếm hoặc chọn trạng thái khác.'
                  : 'Khi khách đặt hàng, bạn có thể xem và xử lý đơn ngay tại đây.'}
              </p>
            </div>
          )}
        </div>
        <div className="table-bottom">
          <span>{filtered.length} đơn hàng</span>
          <span>Thanh toán khi nhận hàng (COD)</span>
        </div>
      </section>
      {selected && (
        <Modal
          title={`Đơn hàng ${selected.id}`}
          onClose={() => {
            if (!busy) setSelected(null);
          }}
          wide
        >
          <div className="order-detail-heading">
            <span className={`status ${selected.status}`}>{statusLabels[selected.status]}</span>
            <span>
              <CalendarDays size={14} />
              {new Date(selected.createdAt).toLocaleString('vi-VN')}
            </span>
          </div>
          <div className="order-customer">
            <div>
              <User size={16} />
              <strong>{selected.customerName}</strong>
            </div>
            <div>
              <Phone size={16} />
              {selected.phone}
            </div>
            {selected.email && (
              <div>
                <Mail size={16} />
                {selected.email}
              </div>
            )}
            <div>
              <MapPin size={16} />
              {selected.address}
            </div>
          </div>
          {selected.note && (
            <div className="order-note">
              <strong>Ghi chú:</strong> {selected.note}
            </div>
          )}
          <div className="order-detail-items">
            {selected.items.map((item, i) => (
              <div key={i}>
                <img src={item.image} alt={item.name} />
                <div>
                  <strong>{item.name}</strong>
                  <span>
                    Size {item.size} <i style={{ background: item.color }} /> · Số lượng{' '}
                    {item.quantity}
                  </span>
                </div>
                <strong>{money(item.quantity * item.price)}</strong>
              </div>
            ))}
          </div>
          <div className="order-detail-totals">
            <div>
              <span>Tạm tính</span>
              <span>{money(selected.subtotal)}</span>
            </div>
            <div>
              <span>Vận chuyển</span>
              <span>{money(selected.shipping)}</span>
            </div>
            {selected.discount > 0 && (
              <div>
                <span>Ưu đãi</span>
                <span>−{money(selected.discount)}</span>
              </div>
            )}
            <div className="total">
              <strong>Tổng thanh toán (COD)</strong>
              <strong>{money(selected.total)}</strong>
            </div>
          </div>
          {transitions[selected.status].length > 0 ? (
            <div className="order-update">
              <label>
                Cập nhật trạng thái
                <select
                  aria-label="Trạng thái mới"
                  value={nextStatus}
                  onChange={(e) => setNextStatus(e.target.value)}
                >
                  <option value="">Chọn trạng thái mới</option>
                  {transitions[selected.status].map((s) => (
                    <option value={s} key={s}>
                      {statusLabels[s]}
                    </option>
                  ))}
                </select>
              </label>
              <button className="button dark" disabled={!nextStatus || busy} onClick={update}>
                {busy ? 'Đang lưu...' : 'Xác nhận cập nhật'}
                <ArrowRight size={16} />
              </button>
            </div>
          ) : (
            <p className="final-order-note">
              Đơn hàng đã {selected.status === 'completed' ? 'hoàn thành' : 'hủy'}. Không thể thay
              đổi trạng thái.
            </p>
          )}
          {nextStatus === 'cancelled' && (
            <p className="cancel-note">
              Xác nhận hủy sẽ hoàn lại số lượng sản phẩm vào kho. Không thể mở lại đơn đã hủy.
            </p>
          )}
          {error && (
            <p role="alert" className="form-error">
              {error}
            </p>
          )}
        </Modal>
      )}
    </>
  );
}
