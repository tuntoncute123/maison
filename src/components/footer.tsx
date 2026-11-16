'use client';
import Link from 'next/link';
import { ArrowUpRight, ArrowRight, Instagram, Facebook } from 'lucide-react';
import { useState } from 'react';
import { useStore } from './store-provider';
export function Footer({ year }: { year: number }) {
  const [email, setEmail] = useState(''),
    [busy, setBusy] = useState(false);
  const { notify } = useStore();
  async function subscribe(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      notify(data.message || data.error);
      if (res.ok) setEmail('');
    } catch {
      notify('Không thể kết nối. Vui lòng thử lại.');
    } finally {
      setBusy(false);
    }
  }
  return (
    <footer>
      <div className="newsletter">
        <div>
          <div className="eyebrow">THE MÂISON LETTER</div>
          <h2>
            Một chút cảm hứng, <em>mỗi tuần.</em>
          </h2>
          <p>Đón đầu bộ sưu tập mới và những ưu đãi dành riêng cho bạn.</p>
        </div>
        <form onSubmit={subscribe}>
          <div className="newsletter-input">
            <input
              required
              type="email"
              aria-label="Email nhận tin"
              placeholder="Địa chỉ email của bạn"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button disabled={busy} aria-label="Đăng ký nhận tin">
              {busy ? '...' : <ArrowRight size={23} />}
            </button>
          </div>
          <span>Đăng ký để nhận mã giảm 10% · Tối đa 100.000đ.</span>
        </form>
      </div>
      <div className="footer-main">
        <div className="footer-brand">
          <Link className="wordmark" href="/">
            MÂISON
          </Link>
          <p>
            Những thiết kế bạn yêu.
            <br />
            Phong cách thuộc về bạn.
          </p>
          <div className="social-icons">
            <a
              href="https://www.instagram.com/"
              aria-label="Instagram"
              target="_blank"
              rel="noreferrer"
            >
              <Instagram size={18} />
            </a>
            <a
              href="https://www.facebook.com/"
              aria-label="Facebook"
              target="_blank"
              rel="noreferrer"
            >
              <Facebook size={18} />
            </a>
          </div>
        </div>
        <div>
          <h4>KHÁM PHÁ</h4>
          <Link href="/shop?gender=women">Thời trang nữ</Link>
          <Link href="/shop?gender=men">Thời trang nam</Link>
          <Link href="/shop?collection=new">Bộ sưu tập mới</Link>
          <Link href="/shop?sale=true">Ưu đãi đặc biệt</Link>
        </div>
        <div>
          <h4>CHĂM SÓC KHÁCH HÀNG</h4>
          <Link href="/track">Tra cứu đơn hàng</Link>
          <Link href="/policies#shipping">Giao hàng & đổi trả</Link>
          <Link href="/policies#sizes">Hướng dẫn chọn size</Link>
          <Link href="/policies#contact">Liên hệ với MÂISON</Link>
        </div>
        <div className="footer-note">
          <h4>MADE FOR YOUR EVERYDAY</h4>
          <p>
            Tinh tế từ chất liệu.
            <br />
            Chỉn chu trong từng chi tiết.
            <br />
            Đồng hành cùng bạn mỗi ngày.
          </p>
          <Link href="/about" className="text-link">
            Câu chuyện của chúng tôi <ArrowUpRight size={16} />
          </Link>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© {year} MÂISON. All rights reserved.</span>
        <div>
          <Link href="/policies#privacy">Chính sách bảo mật</Link>
          <Link href="/admin">
            Dành cho cửa hàng <ArrowUpRight size={13} />
          </Link>
          <span>VIỆT NAM · VND ₫</span>
        </div>
      </div>
    </footer>
  );
}
