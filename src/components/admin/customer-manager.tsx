'use client';
import { useState } from 'react';
import { Search, Users, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';
import { type Order, money } from '@/lib/types';
export function CustomerManager({ orders }: { orders: Order[] }) {
  const [q, setQ] = useState('');
  const customers = [...new Set(orders.map((o) => o.phone))]
    .map((phone) => {
      const list = orders.filter((o) => o.phone === phone);
      return {
        phone,
        name: list[0].customerName,
        email: list[0].email,
        total: list.filter((o) => o.status === 'completed').reduce((s, o) => s + o.total, 0),
        count: list.length,
        last: list[0],
      };
    })
    .filter((c) =>
      `${c.name} ${c.phone} ${c.email}`.toLocaleLowerCase('vi').includes(q.toLocaleLowerCase('vi')),
    );
  return (
    <>
      <div className="admin-page-heading">
        <div>
          <span className="eyebrow">THE PEOPLE BEHIND EVERY ORDER</span>
          <h1>Khách hàng của bạn</h1>
          <p>Ghi nhớ mỗi khách hàng, xây dựng những kết nối lâu dài.</p>
        </div>
      </div>
      <section className="admin-panel">
        <div className="admin-toolbar">
          <div className="admin-search">
            <Search size={17} />
            <input
              aria-label="Tìm khách hàng"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Tìm tên, email hoặc số điện thoại..."
            />
          </div>
          <span className="customer-count">{customers.length} khách hàng</span>
        </div>
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Khách hàng</th>
                <th>Liên hệ</th>
                <th>Số đơn hàng</th>
                <th>Đã chi tiêu</th>
                <th>Đơn gần nhất</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((c) => (
                <tr key={c.phone}>
                  <td>
                    <div className="customer-cell">
                      <span>{c.name.split(' ').at(-1)?.[0]}</span>
                      <strong>{c.name}</strong>
                    </div>
                  </td>
                  <td>
                    {c.phone}
                    <small>{c.email || 'Không cung cấp email'}</small>
                  </td>
                  <td>{c.count}</td>
                  <td>
                    {money(c.total)}
                    <small>Từ đơn hoàn thành</small>
                  </td>
                  <td>
                    <Link className="customer-order-link" href={`/admin/orders?id=${c.last.id}`}>
                      {c.last.id}
                      <ArrowUpRight size={14} />
                    </Link>
                    <small>{new Date(c.last.createdAt).toLocaleDateString('vi-VN')}</small>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!customers.length && (
            <div className="admin-empty">
              <Users size={36} />
              <strong>
                {orders.length ? 'Không tìm thấy khách hàng' : 'Chào đón những khách hàng đầu tiên'}
              </strong>
              <p>Thông tin khách hàng được tổng hợp từ đơn đặt hàng và nhóm theo số điện thoại.</p>
            </div>
          )}
        </div>
        <div className="table-bottom">
          <span>Khách hàng được nhóm theo số điện thoại</span>
          <span>Chỉ dùng thông tin để phục vụ đơn hàng</span>
        </div>
      </section>
    </>
  );
}
