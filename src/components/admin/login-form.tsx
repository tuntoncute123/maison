'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { ArrowLeft, ArrowUpRight, LockKeyhole, Eye, EyeOff } from 'lucide-react';
export function LoginForm() {
  const router = useRouter();
  const [busy, setBusy] = useState(false),
    [error, setError] = useState(''),
    [show, setShow] = useState(false);
  async function login(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError('');
    const body = Object.fromEntries(new FormData(e.currentTarget));
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      router.push('/admin');
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Không thể kết nối. Vui lòng thử lại.');
      setBusy(false);
    }
  }
  return (
    <div className="admin-login">
      <div className="login-visual">
        <img src="/images/hero.jpg" alt="MÂISON Studio" />
        <Link href="/" className="wordmark">
          MÂISON
        </Link>
        <div>
          <span className="eyebrow">THE BUSINESS OF GREAT STYLE</span>
          <h1>
            Cùng tạo nên
            <br />
            những điều <em>đẹp.</em>
          </h1>
          <p>Không gian dành cho người đứng sau mỗi lựa chọn tinh tế.</p>
        </div>
        <span className="login-caption">MÂISON STUDIO / STORE MANAGEMENT</span>
      </div>
      <div className="login-form-wrap">
        <Link href="/" className="login-back">
          <ArrowLeft size={15} /> Về cửa hàng
        </Link>
        <form onSubmit={login} className="login-form">
          <div className="login-lock">
            <LockKeyhole size={25} />
          </div>
          <span className="eyebrow">WELCOME BACK</span>
          <h2>Chào người tạo phong cách.</h2>
          <p>Đăng nhập để quản lý cửa hàng MÂISON của bạn.</p>
          <label className="form-field">
            Email quản trị
            <input
              name="email"
              type="email"
              autoComplete="username"
              required
              placeholder="admin@maison.vn"
            />
          </label>
          <label className="form-field">
            Mật khẩu
            <div className="password-field">
              <input
                name="password"
                type={show ? 'text' : 'password'}
                required
                autoComplete="current-password"
                placeholder="Nhập mật khẩu của bạn"
              />
              <button
                type="button"
                aria-label={show ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                onClick={() => setShow(!show)}
              >
                {show ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
            </div>
          </label>
          {error && (
            <p className="form-error" role="alert">
              {error}
            </p>
          )}
          <button disabled={busy} className="button dark full-width">
            {busy ? 'Đang đăng nhập...' : 'Đăng nhập quản trị'}
            <ArrowUpRight size={19} />
          </button>
          <p className="login-help">
            Tài khoản do chủ cửa hàng cấu hình.
            <br />
            Liên hệ quản trị viên nếu bạn cần được cấp quyền.
          </p>
        </form>
        <span className="login-copyright">© 2026 MÂISON. Everyday, elevated.</span>
      </div>
    </div>
  );
}
