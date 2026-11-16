'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  Users,
  ArrowUpRight,
  LogOut,
  Menu,
  X,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { useStore } from '../store-provider';
const links = [
  { href: '/admin', label: 'Tổng quan', icon: LayoutDashboard },
  { href: '/admin/products', label: 'Sản phẩm', icon: Package },
  { href: '/admin/orders', label: 'Đơn hàng', icon: ShoppingBag },
  { href: '/admin/customers', label: 'Khách hàng', icon: Users },
];
export function AdminShell({ children, email }: { children: React.ReactNode; email: string }) {
  const path = usePathname(),
    router = useRouter();
  const [open, setOpen] = useState(false),
    [busy, setBusy] = useState(false);
  const { notify } = useStore();
  async function logout() {
    setBusy(true);
    try {
      const res = await fetch('/api/admin/logout', { method: 'POST' });
      if (!res.ok) throw new Error();
      router.push('/admin/login');
      router.refresh();
    } catch {
      notify('Không thể đăng xuất. Vui lòng thử lại.');
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="admin-app">
      {open && (
        <button
          className="sidebar-backdrop"
          aria-label="Đóng menu quản trị"
          onClick={() => setOpen(false)}
        />
      )}
      <aside className={`admin-sidebar ${open ? 'open' : ''}`}>
        <Link href="/admin" className="wordmark">
          MÂISON<span>STORE MANAGEMENT</span>
        </Link>
        <button className="sidebar-close" aria-label="Đóng menu" onClick={() => setOpen(false)}>
          <X size={20} />
        </button>
        <div className="sidebar-store">
          <span>M</span>
          <div>
            <strong>MÂISON Official</strong>
            <small>Cửa hàng thời trang</small>
          </div>
          <span className="online-dot" />
        </div>
        <span className="sidebar-label">KHÔNG GIAN LÀM VIỆC</span>
        <nav>
          {links.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              className={path === href ? 'active' : ''}
              href={href}
              onClick={() => setOpen(false)}
            >
              <Icon size={18} />
              {label}
              {path === href && <ChevronRight size={14} />}
            </Link>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <div className="sidebar-tip">
            <Sparkles size={22} />
            <strong>Mỗi ngày, tốt hơn một chút.</strong>
            <p>Chăm chút sản phẩm, lắng nghe khách hàng và cùng cửa hàng phát triển.</p>
            <Link href="/" target="_blank">
              Ghé thăm cửa hàng <ArrowUpRight size={14} />
            </Link>
          </div>
          <button onClick={logout} disabled={busy}>
            <LogOut size={17} />
            {busy ? 'Đang đăng xuất...' : 'Đăng xuất'}
          </button>
        </div>
      </aside>
      <div className="admin-workspace">
        <header className="admin-header">
          <div>
            <button
              className="admin-menu"
              aria-label="Mở menu quản trị"
              onClick={() => setOpen(true)}
            >
              <Menu size={21} />
            </button>
            <span>Không gian quản trị</span>
            <ChevronRight size={13} />
            <strong>{links.find((l) => l.href === path)?.label || 'MÂISON'}</strong>
          </div>
          <div>
            <Link href="/" className="visit-store">
              Xem cửa hàng <ArrowUpRight size={15} />
            </Link>
            <span className="admin-avatar">M</span>
            <span className="admin-user">
              <strong>Quản trị viên</strong>
              <small>{email}</small>
            </span>
          </div>
        </header>
        <main className="admin-content">{children}</main>
        <footer className="admin-footer">
          <span>MÂISON Store Management</span>
          <span>Được chăm chút, từ những chi tiết nhỏ.</span>
        </footer>
      </div>
    </div>
  );
}
