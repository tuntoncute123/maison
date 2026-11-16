'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import {
  ArrowUpRight,
  Search,
  Heart,
  ShoppingBag,
  UserRound,
  Menu,
  X,
  ArrowRight,
} from 'lucide-react';
import { useStore } from './store-provider';
export function Header() {
  const { cart, wishlist } = useStore(),
    pathname = usePathname(),
    router = useRouter();
  const [searchOpen, setSearchOpen] = useState(false),
    [menuOpen, setMenuOpen] = useState(false),
    [query, setQuery] = useState('');
  const headerRef = useRef<HTMLElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const searchButtonRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!menuOpen && !searchOpen) return;
    function onKeyDown(event: KeyboardEvent) {
      if (event.key !== 'Escape') return;
      (searchOpen ? searchButtonRef : menuButtonRef).current?.focus();
      setMenuOpen(false);
      setSearchOpen(false);
    }
    function onPointerDown(event: PointerEvent) {
      if (!headerRef.current?.contains(event.target as Node)) {
        setMenuOpen(false);
        setSearchOpen(false);
      }
    }
    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('pointerdown', onPointerDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('pointerdown', onPointerDown);
    };
  }, [menuOpen, searchOpen]);
  const count = cart.reduce((sum, i) => sum + i.quantity, 0);
  return (
    <>
      <div className="announcement">
        <span>THÊM MỘT CHÚT PHONG CÁCH, THÊM MỘT CHÚT BẠN.</span>
        <Link href="/shop">
          Miễn phí vận chuyển cho đơn từ 699K <ArrowUpRight size={13} />
        </Link>
      </div>
      <header className="header" ref={headerRef}>
        <div className="header-inner">
          <button
            className="icon-button mobile-menu"
            aria-label="Mở menu"
            ref={menuButtonRef}
            aria-expanded={menuOpen}
            aria-controls="main-navigation"
            onClick={() => {
              setMenuOpen(!menuOpen);
              setSearchOpen(false);
            }}
          >
            {menuOpen ? <X /> : <Menu />}
          </button>
          <Link className="wordmark" href="/" aria-label="MÂISON - Trang chủ">
            MÂISON<span>EVERYDAY, ELEVATED.</span>
          </Link>
          <nav
            id="main-navigation"
            className={menuOpen ? 'main-nav open' : 'main-nav'}
            aria-label="Điều hướng chính"
          >
            <Link
              className={pathname === '/' ? 'active' : ''}
              href="/"
              onClick={() => setMenuOpen(false)}
            >
              Trang chủ
            </Link>
            <Link href="/shop?gender=women" onClick={() => setMenuOpen(false)}>
              Nữ
            </Link>
            <Link href="/shop?gender=men" onClick={() => setMenuOpen(false)}>
              Nam
            </Link>
            <Link href="/shop?collection=new" onClick={() => setMenuOpen(false)}>
              Bộ sưu tập <span className="nav-new">NEW</span>
            </Link>
            <Link className="sale-link" href="/shop?sale=true" onClick={() => setMenuOpen(false)}>
              Ưu đãi
            </Link>
            <Link className="mobile-nav-extra" href="/wishlist" onClick={() => setMenuOpen(false)}>
              Yêu thích ({wishlist.length}) <Heart size={17} />
            </Link>
            <Link className="mobile-nav-extra" href="/track" onClick={() => setMenuOpen(false)}>
              Tra cứu đơn hàng <UserRound size={17} />
            </Link>
          </nav>
          <div className="header-actions">
            <button
              className="icon-button"
              aria-label="Tìm kiếm"
              ref={searchButtonRef}
              aria-expanded={searchOpen}
              aria-controls="site-search"
              onClick={() => {
                setSearchOpen(!searchOpen);
                setMenuOpen(false);
              }}
            >
              <Search size={21} />
            </button>
            <Link className="icon-button account-icon" href="/track" aria-label="Tra cứu đơn hàng">
              <UserRound size={21} />
            </Link>
            <Link
              className="icon-button wishlist-icon"
              href="/wishlist"
              aria-label={`Yêu thích (${wishlist.length})`}
            >
              <Heart size={21} />
              {wishlist.length > 0 && <span className="mini-count">{wishlist.length}</span>}
            </Link>
            <Link className="icon-button bag-link" href="/cart" aria-label={`Giỏ hàng (${count})`}>
              <ShoppingBag size={21} />
              <span className="bag-count">{count}</span>
            </Link>
          </div>
        </div>
        {searchOpen && (
          <form
            id="site-search"
            role="search"
            className="header-search"
            onSubmit={(e) => {
              e.preventDefault();
              router.push(`/shop?q=${encodeURIComponent(query)}`);
              setSearchOpen(false);
            }}
          >
            <Search size={20} />
            <input
              autoFocus
              aria-label="Tìm sản phẩm"
              placeholder="Bạn đang tìm món đồ nào?"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button type="submit" aria-label="Tìm">
              <ArrowRight size={20} />
            </button>
            <button type="button" aria-label="Đóng tìm kiếm" onClick={() => setSearchOpen(false)}>
              <X size={20} />
            </button>
          </form>
        )}
      </header>
    </>
  );
}
