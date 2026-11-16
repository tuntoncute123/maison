'use client';
import Link from 'next/link';
import { useState } from 'react';
import {
  ArrowUpRight,
  ArrowRight,
  ShoppingBag,
  Wallet,
  Package,
  Users,
  Plus,
  CalendarDays,
  Mail,
  CircleArrowUp,
} from 'lucide-react';
import { type Product, type Order, money, statusLabels } from '@/lib/types';
export function Overview({
  products,
  orders,
  subscribers,
}: {
  products: Product[];
  orders: Order[];
  subscribers: number;
}) {
  const [period, setPeriod] = useState('30');
  const now = new Date();
  const days = Number(period);
  const start = new Date(now);
  start.setDate(start.getDate() - days + 1);
  start.setHours(0, 0, 0, 0);
  const filtered = orders.filter((o) => new Date(o.createdAt) >= start);
  const completed = filtered.filter((o) => o.status === 'completed'),
    revenue = completed.reduce((s, o) => s + o.total, 0),
    customers = new Set(filtered.map((o) => o.phone)).size;
  const pending = orders.filter((o) => o.status === 'pending').length;
  const statusColors: Record<Order['status'], string> = {
    pending: '#e2d4b9',
    confirmed: '#b5c6d2',
    shipping: '#b7c2a8',
    completed: '#7d8b69',
    cancelled: '#d7b9af',
  };
  let cursor = 0;
  const segments = Object.entries(statusColors).map(([status, color]) => {
    const from = cursor;
    cursor += filtered.length
      ? (filtered.filter((o) => o.status === status).length / filtered.length) * 100
      : 0;
    return `${color} ${from}% ${cursor}%`;
  });
  const donut = filtered.length ? `conic-gradient(${segments.join(',')})` : undefined;
  const bars = Array.from({ length: 7 }, (_, i) => {
    const begin = new Date(start.getTime() + ((now.getTime() - start.getTime()) * i) / 7);
    const end = new Date(start.getTime() + ((now.getTime() - start.getTime()) * (i + 1)) / 7 + 1);
    return {
      label: `${begin.getDate()}/${begin.getMonth() + 1}`,
      value: completed
        .filter((o) => new Date(o.createdAt) >= begin && new Date(o.createdAt) < end)
        .reduce((s, o) => s + o.total, 0),
    };
  });
  const max = Math.max(...bars.map((b) => b.value), 1000000);
  const low = products.filter((p) => p.stock < 20);
  return (
    <>
      <div className="admin-page-heading">
        <div>
          <span className="eyebrow">YOUR STORE, AT A GLANCE</span>
          <h1>
            Một ngày tốt lành, MÂISON <span>✳</span>
          </h1>
          <p>Cùng xem cửa hàng của bạn hôm nay có gì mới.</p>
        </div>
        <Link href="/admin/products?new=true" className="button dark">
          <Plus size={16} /> Thêm sản phẩm
        </Link>
      </div>
      <div className="overview-welcome">
        <div>
          <span className="welcome-icon">
            <ShoppingBag size={23} />
          </span>
          <div>
            <strong>
              {pending
                ? `Bạn có ${pending} đơn hàng đang chờ xác nhận.`
                : 'Cửa hàng đã sẵn sàng cho những đơn hàng mới.'}
            </strong>
            <p>
              {pending
                ? 'Một chút chăm sóc kịp thời tạo nên trải nghiệm khác biệt.'
                : 'Sản phẩm, đơn hàng và khách hàng — tất cả ở ngay trong tầm tay.'}
            </p>
          </div>
        </div>
        <Link href={pending ? '/admin/orders' : '/'}>
          {pending ? 'Xử lý đơn hàng' : 'Xem cửa hàng'} <ArrowRight size={16} />
        </Link>
      </div>
      <div className="overview-period">
        <h2>Hiệu quả kinh doanh</h2>
        <label>
          <CalendarDays size={15} />
          <select
            aria-label="Khoảng thời gian thống kê"
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
          >
            <option value="7">7 ngày gần đây</option>
            <option value="30">30 ngày gần đây</option>
            <option value="90">90 ngày gần đây</option>
          </select>
        </label>
      </div>
      <div className="metric-grid">
        {[
          {
            label: 'Doanh thu thực nhận',
            value: money(revenue),
            note: 'Từ đơn hàng đã hoàn thành',
            icon: Wallet,
            color: 'olive',
          },
          {
            label: 'Tổng đơn hàng',
            value: filtered.length.toString().padStart(2, '0'),
            note: `${filtered.filter((o) => o.status === 'pending').length} đơn chờ xác nhận`,
            icon: ShoppingBag,
            color: 'sand',
          },
          {
            label: 'Sản phẩm đang bán',
            value: products
              .filter((p) => p.stock > 0)
              .length.toString()
              .padStart(2, '0'),
            note: `${products.reduce((s, p) => s + p.stock, 0)} sản phẩm trong kho · Hiện tại`,
            icon: Package,
            color: 'blue',
          },
          {
            label: 'Khách mua hàng',
            value: customers.toString().padStart(2, '0'),
            note: `${subscribers} email đăng ký nhận tin · Tổng cộng`,
            icon: Users,
            color: 'rose',
          },
        ].map(({ label, value, note, icon: Icon, color }) => (
          <div className="metric-card" key={label}>
            <div>
              <span>{label}</span>
              <span className={`metric-icon ${color}`}>
                <Icon size={18} />
              </span>
            </div>
            <strong>{value}</strong>
            <small>{note}</small>
          </div>
        ))}
      </div>
      <div className="overview-charts">
        <section className="admin-panel revenue-panel">
          <div className="panel-heading">
            <div>
              <h2>Tổng quan doanh thu</h2>
              <p>Đơn hoàn thành trong {days} ngày gần đây</p>
            </div>
            <span className="chart-legend">
              <i /> Doanh thu
            </span>
          </div>
          <div className="chart-container">
            <div className="chart-y">
              <span>{money(max)}</span>
              <span>{money(max * 0.75)}</span>
              <span>{money(max * 0.5)}</span>
              <span>{money(max * 0.25)}</span>
              <span>0đ</span>
            </div>
            <div className="chart-plot">
              <div className="chart-grid-lines">
                <i />
                <i />
                <i />
                <i />
                <i />
              </div>
              <div className="chart-bars">
                {bars.map((b, i) => (
                  <div key={i} className="chart-bar-column">
                    <div
                      className="chart-bar"
                      title={`${b.label}: ${money(b.value)}`}
                      style={{ height: `${Math.max(b.value ? 2 : 0, (b.value / max) * 100)}%` }}
                    />
                    <span>{b.label}</span>
                  </div>
                ))}
              </div>
              {revenue === 0 && (
                <div className="chart-empty">
                  <CircleArrowUp size={24} />
                  <span>Những con số đẹp đang chờ bạn.</span>
                  <small>Doanh thu sẽ xuất hiện khi có đơn hoàn thành.</small>
                </div>
              )}
            </div>
          </div>
        </section>
        <section className="admin-panel order-breakdown">
          <div className="panel-heading">
            <div>
              <h2>Trạng thái đơn hàng</h2>
              <p>Trong {days} ngày gần đây</p>
            </div>
          </div>
          <div className="order-circle" style={{ background: donut }}>
            <div>
              <strong>{filtered.length}</strong>
              <span>đơn hàng</span>
            </div>
          </div>
          <div className="order-legend">
            {(['pending', 'confirmed', 'shipping', 'completed', 'cancelled'] as const).map((s) => (
              <div key={s}>
                <span>
                  <i className={s} />
                  {statusLabels[s]}
                </span>
                <strong>{filtered.filter((o) => o.status === s).length}</strong>
              </div>
            ))}
          </div>
        </section>
      </div>
      <div className="overview-bottom">
        <section className="admin-panel recent-orders">
          <div className="panel-heading">
            <div>
              <h2>Đơn hàng gần đây</h2>
              <p>Những lựa chọn mới nhất từ khách hàng</p>
            </div>
            <Link href="/admin/orders">
              Xem tất cả <ArrowUpRight size={14} />
            </Link>
          </div>
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Mã đơn hàng</th>
                  <th>Khách hàng</th>
                  <th>Giá trị</th>
                  <th>Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                {orders.slice(0, 5).map((o) => (
                  <tr key={o.id}>
                    <td>
                      <Link href={`/admin/orders?id=${o.id}`}>{o.id}</Link>
                    </td>
                    <td>{o.customerName}</td>
                    <td>{money(o.total)}</td>
                    <td>
                      <span className={`status ${o.status}`}>{statusLabels[o.status]}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {!orders.length && (
              <div className="admin-empty">
                <ShoppingBag size={30} />
                <strong>Chưa có đơn hàng nào</strong>
                <p>Đơn đặt từ cửa hàng sẽ tự động xuất hiện tại đây.</p>
                <Link href="/">
                  Khám phá cửa hàng <ArrowUpRight size={14} />
                </Link>
              </div>
            )}
          </div>
        </section>
        <section className="admin-panel inventory-panel">
          <div className="panel-heading">
            <div>
              <h2>Cần chú ý</h2>
              <p>Tồn kho dưới 20 sản phẩm</p>
            </div>
            <Package size={19} />
          </div>
          {low.length ? (
            low.slice(0, 4).map((p) => (
              <Link className="low-stock-item" key={p.id} href={`/admin/products?edit=${p.id}`}>
                <img src={p.image} alt="" />
                <div>
                  <strong>{p.name}</strong>
                  <span>Còn {p.stock} sản phẩm</span>
                </div>
                <ArrowUpRight size={15} />
              </Link>
            ))
          ) : (
            <div className="inventory-good">Tất cả sản phẩm có tồn kho ổn định.</div>
          )}
          <Link href="/admin/products" className="inventory-link">
            Quản lý kho hàng <ArrowRight size={14} />
          </Link>
          <div className="newsletter-stat">
            <Mail size={18} />
            <span>
              <strong>{subscribers}</strong> email đăng ký nhận tin
            </span>
          </div>
        </section>
      </div>
    </>
  );
}
