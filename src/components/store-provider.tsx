'use client';
import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import type { Product, CartItem } from '@/lib/types';
import { Check, X } from 'lucide-react';
type Store = {
  cart: CartItem[];
  wishlist: string[];
  ready: boolean;
  addItem: (product: Product, size: string, color: string, quantity?: number) => void;
  updateQuantity: (index: number, quantity: number) => void;
  removeItem: (index: number) => void;
  clearCart: () => void;
  toggleWish: (id: string) => void;
  notify: (message: string) => void;
};
const Context = createContext<Store | null>(null);
export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]),
    [wishlist, setWishlist] = useState<string[]>([]),
    [ready, setReady] = useState(false),
    [toast, setToast] = useState('');
  useEffect(() => {
    try {
      const c = JSON.parse(localStorage.getItem('maison-cart') || '[]'),
        w = JSON.parse(localStorage.getItem('maison-wishlist') || '[]');
      if (Array.isArray(c))
        setCart(
          c.filter(
            (i) =>
              i?.product?.id &&
              Array.isArray(i.product.colors) &&
              Number.isInteger(i.quantity) &&
              i.quantity > 0,
          ),
        );
      if (Array.isArray(w)) setWishlist(w.filter((i) => typeof i === 'string'));
    } catch {}
    setReady(true);
  }, []);
  useEffect(() => {
    if (ready) {
      try {
        localStorage.setItem('maison-cart', JSON.stringify(cart));
        localStorage.setItem('maison-wishlist', JSON.stringify(wishlist));
      } catch {}
    }
  }, [cart, wishlist, ready]);
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(''), 4000);
    return () => clearTimeout(timer);
  }, [toast]);
  const notify = useCallback((message: string) => setToast(message), []);
  function addItem(product: Product, size: string, color: string, quantity = 1) {
    const total = cart
      .filter((i) => i.product.id === product.id)
      .reduce((sum, i) => sum + i.quantity, 0);
    if (total + quantity > product.stock) {
      notify('Số lượng đã vượt quá tồn kho.');
      return;
    }
    setCart((current) => {
      const found = current.findIndex(
        (i) => i.product.id === product.id && i.size === size && i.color === color,
      );
      if (found < 0) return [...current, { product, size, color, quantity }];
      return current.map((item, index) =>
        index === found ? { ...item, quantity: Math.min(20, item.quantity + quantity) } : item,
      );
    });
    notify('Đã thêm sản phẩm vào giỏ hàng');
  }
  function updateQuantity(index: number, quantity: number) {
    if (quantity < 1) return;
    const item = cart[index];
    const other = cart
      .filter((i, n) => n !== index && i.product.id === item.product.id)
      .reduce((sum, i) => sum + i.quantity, 0);
    if (quantity + other > item.product.stock || quantity > 20) {
      notify('Đã đạt số lượng tối đa.');
      return;
    }
    setCart((c) => c.map((i, n) => (n === index ? { ...i, quantity } : i)));
  }
  function toggleWish(id: string) {
    setWishlist((current) =>
      current.includes(id) ? current.filter((p) => p !== id) : [...current, id],
    );
  }
  return (
    <Context.Provider
      value={{
        cart,
        wishlist,
        ready,
        addItem,
        updateQuantity,
        removeItem: (index) => setCart((c) => c.filter((_, i) => i !== index)),
        clearCart: () => setCart([]),
        toggleWish,
        notify,
      }}
    >
      {children}
      {toast && (
        <div className="toast" role="status">
          <span className="toast-check">
            <Check size={16} />
          </span>
          {toast}
          <button onClick={() => setToast('')} aria-label="Đóng thông báo">
            <X size={17} />
          </button>
        </div>
      )}
    </Context.Provider>
  );
}
export function useStore() {
  const context = useContext(Context);
  if (!context) throw new Error('StoreProvider is required');
  return context;
}
