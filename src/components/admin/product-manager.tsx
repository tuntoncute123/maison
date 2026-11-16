'use client';
import { useState } from 'react';
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  Package,
  ArrowUpRight,
  X,
  Check,
  Image as ImageIcon,
} from 'lucide-react';
import Link from 'next/link';
import { categories, money, type Product } from '@/lib/types';
import { useStore } from '../store-provider';
import { Modal } from './modal';
const emptyProduct: Product = {
  id: '',
  name: '',
  category: 'Áo sơ mi',
  gender: 'women',
  price: 490000,
  originalPrice: 0,
  image: '/images/shirt.jpg',
  description: '',
  colors: ['#ded6c8'],
  sizes: ['S', 'M', 'L'],
  stock: 20,
  badge: 'MỚI',
  featured: false,
};
export function ProductManager({
  initialProducts,
  initial,
}: {
  initialProducts: Product[];
  initial: { new?: string; edit?: string };
}) {
  const [products, setProducts] = useState(initialProducts),
    [query, setQuery] = useState(''),
    [category, setCategory] = useState(''),
    [editor, setEditor] = useState<Product | null>(
      initial.new === 'true'
        ? { ...emptyProduct }
        : initialProducts.find((p) => p.id === initial.edit) || null,
    ),
    [deleting, setDeleting] = useState<Product | null>(null),
    [busy, setBusy] = useState(false),
    [error, setError] = useState('');
  const { notify } = useStore();
  const filtered = products.filter(
    (p) =>
      p.name.toLocaleLowerCase('vi').includes(query.toLocaleLowerCase('vi')) &&
      (!category || p.category === category),
  );
  async function remove() {
    if (!deleting) return;
    setBusy(true);
    setError('');
    try {
      const res = await fetch(`/api/products/${deleting.id}`, { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setProducts((p) => p.filter((i) => i.id !== deleting.id));
      setDeleting(null);
      notify('Đã xóa sản phẩm.');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Không thể kết nối.');
    } finally {
      setBusy(false);
    }
  }
  return (
    <>
      <div className="admin-page-heading">
        <div>
          <span className="eyebrow">CURATE YOUR COLLECTION</span>
          <h1>
            Quản lý sản phẩm<span className="heading-count">{products.length}</span>
          </h1>
          <p>Mỗi sản phẩm là một phần câu chuyện của cửa hàng.</p>
        </div>
        <button className="button dark" onClick={() => setEditor({ ...emptyProduct })}>
          <Plus size={16} /> Thêm sản phẩm
        </button>
      </div>
      <div className="product-stat-strip">
        <div>
          <Package size={19} />
          <span>
            Tổng sản phẩm <strong>{products.length}</strong>
          </span>
        </div>
        <div>
          <span className="stock-dot green" />
          <span>
            Đang bán <strong>{products.filter((p) => p.stock > 0).length}</strong>
          </span>
        </div>
        <div>
          <span className="stock-dot amber" />
          <span>
            Sắp hết hàng{' '}
            <strong>{products.filter((p) => p.stock > 0 && p.stock < 20).length}</strong>
          </span>
        </div>
        <div>
          <span className="stock-dot gray" />
          <span>
            Hết hàng <strong>{products.filter((p) => p.stock === 0).length}</strong>
          </span>
        </div>
      </div>
      <section className="admin-panel">
        <div className="admin-toolbar">
          <div className="admin-search">
            <Search size={17} />
            <input
              aria-label="Tìm sản phẩm quản trị"
              placeholder="Tìm theo tên sản phẩm..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            {query && (
              <button aria-label="Xóa tìm kiếm" onClick={() => setQuery('')}>
                <X size={14} />
              </button>
            )}
          </div>
          <select
            aria-label="Lọc danh mục"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">Tất cả danh mục</option>
            {categories.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </div>
        <div className="admin-table-wrap">
          <table className="admin-table products-table">
            <thead>
              <tr>
                <th>Sản phẩm</th>
                <th>Danh mục</th>
                <th>Giá bán</th>
                <th>Tồn kho</th>
                <th>Trạng thái</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p.id}>
                  <td>
                    <div className="admin-product-cell">
                      <img src={p.image} alt={p.name} />
                      <div>
                        <strong>{p.name}</strong>
                        <small>
                          {p.gender === 'men' ? 'Nam' : p.gender === 'women' ? 'Nữ' : 'Unisex'} ·{' '}
                          {p.sizes.join(', ')}
                        </small>
                      </div>
                    </div>
                  </td>
                  <td>{p.category}</td>
                  <td>
                    <strong>{money(p.price)}</strong>
                    {p.originalPrice > 0 && <del>{money(p.originalPrice)}</del>}
                  </td>
                  <td>
                    <span className={p.stock < 20 ? 'low-stock' : ''}>{p.stock}</span>
                  </td>
                  <td>
                    <span className={`stock-pill ${p.stock ? 'available' : 'unavailable'}`}>
                      {p.stock ? 'Đang bán' : 'Hết hàng'}
                    </span>
                  </td>
                  <td>
                    <div className="table-actions">
                      <Link href={`/product/${p.id}`} target="_blank" aria-label={`Xem ${p.name}`}>
                        <ArrowUpRight size={15} />
                      </Link>
                      <button aria-label={`Sửa ${p.name}`} onClick={() => setEditor({ ...p })}>
                        <Pencil size={15} />
                      </button>
                      <button
                        className="delete-action"
                        aria-label={`Xóa ${p.name}`}
                        onClick={() => {
                          setError('');
                          setDeleting(p);
                        }}
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!filtered.length && (
            <div className="admin-empty">
              <Package size={30} />
              <strong>Không tìm thấy sản phẩm</strong>
              <p>Thử thay đổi bộ lọc hoặc thêm sản phẩm mới.</p>
            </div>
          )}
        </div>
        <div className="table-bottom">
          <span>
            Hiển thị {filtered.length} / {products.length} sản phẩm
          </span>
          <span>Dữ liệu được lưu tự động khi xác nhận</span>
        </div>
      </section>
      {editor && (
        <ProductEditor
          product={editor}
          onClose={() => setEditor(null)}
          onSave={(saved) => {
            setProducts((list) =>
              list.some((p) => p.id === saved.id)
                ? list.map((p) => (p.id === saved.id ? saved : p))
                : [...list, saved],
            );
            setEditor(null);
            notify('Đã lưu sản phẩm thành công.');
          }}
        />
      )}
      {deleting && (
        <Modal
          title="Xóa sản phẩm?"
          onClose={() => {
            if (!busy) setDeleting(null);
          }}
        >
          <p className="modal-description">
            Bạn muốn xóa <strong>{deleting.name}</strong> khỏi cửa hàng? Sản phẩm sẽ không còn hiển
            thị. Thông tin trong các đơn đã đặt vẫn được giữ lại.
          </p>
          {error && <p className="form-error">{error}</p>}
          <div className="modal-actions">
            <button className="button outline" disabled={busy} onClick={() => setDeleting(null)}>
              Giữ lại sản phẩm
            </button>
            <button className="button danger" disabled={busy} onClick={remove}>
              {busy ? 'Đang xóa...' : 'Xóa sản phẩm'}
            </button>
          </div>
        </Modal>
      )}
    </>
  );
}
function ProductEditor({
  product,
  onClose,
  onSave,
}: {
  product: Product;
  onClose: () => void;
  onSave: (p: Product) => void;
}) {
  const [data, setData] = useState(product),
    [colors, setColors] = useState(product.colors.join(', ')),
    [sizes, setSizes] = useState(product.sizes.join(', ')),
    [busy, setBusy] = useState(false),
    [error, setError] = useState('');
  function field<K extends keyof Product>(key: K, value: Product[K]) {
    setData((p) => ({ ...p, [key]: value }));
  }
  async function save(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      const res = await fetch(product.id ? `/api/products/${product.id}` : '/api/products', {
        method: product.id ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          colors: colors
            .split(',')
            .map((v) => v.trim())
            .filter(Boolean),
          sizes: sizes
            .split(',')
            .map((v) => v.trim())
            .filter(Boolean),
        }),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error);
      onSave(result);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Không thể kết nối. Vui lòng thử lại.');
    } finally {
      setBusy(false);
    }
  }
  return (
    <Modal
      title={product.id ? 'Chỉnh sửa sản phẩm' : 'Thêm một thiết kế mới'}
      onClose={() => {
        if (!busy) onClose();
      }}
      wide
    >
      <form onSubmit={save}>
        <div className="product-editor-grid">
          <div className="editor-image">
            <div>
              <img
                key={data.image}
                src={data.image || '/images/shirt.jpg'}
                alt="Xem trước sản phẩm"
                onError={(e) => {
                  e.currentTarget.style.visibility = 'hidden';
                }}
                onLoad={(e) => {
                  e.currentTarget.style.visibility = 'visible';
                }}
              />
              <ImageIcon className="image-placeholder" size={35} />
            </div>
            <label className="form-field">
              Đường dẫn ảnh
              <input
                required
                value={data.image}
                onChange={(e) => field('image', e.target.value)}
                placeholder="https://... hoặc /images/..."
              />
            </label>
            <small>Nhập URL HTTPS hoặc đường dẫn ảnh trong thư mục public/images.</small>
          </div>
          <div className="form-grid editor-fields">
            <label className="span-2">
              Tên sản phẩm *
              <input
                required
                minLength={3}
                maxLength={120}
                value={data.name}
                onChange={(e) => field('name', e.target.value)}
                placeholder="Ví dụ: Áo sơ mi Linen Essential"
              />
            </label>
            <label>
              Danh mục
              <select value={data.category} onChange={(e) => field('category', e.target.value)}>
                {categories.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </label>
            <label>
              Dành cho
              <select
                value={data.gender}
                onChange={(e) => field('gender', e.target.value as Product['gender'])}
              >
                <option value="women">Nữ</option>
                <option value="men">Nam</option>
                <option value="unisex">Unisex</option>
              </select>
            </label>
            <label>
              Giá bán (đ) *
              <input
                type="number"
                required
                min={1000}
                max={100000000}
                step={1000}
                value={data.price}
                onChange={(e) => field('price', Number(e.target.value))}
              />
            </label>
            <label>
              Giá gốc (đ)
              <input
                type="number"
                required
                min={0}
                max={100000000}
                step={1000}
                value={data.originalPrice}
                onChange={(e) => field('originalPrice', Number(e.target.value))}
              />
              <small>Để 0 nếu không giảm giá</small>
            </label>
            <label>
              Tồn kho *
              <input
                type="number"
                required
                min={0}
                max={1000000}
                value={data.stock}
                onChange={(e) => field('stock', Number(e.target.value))}
              />
            </label>
            <label>
              Nhãn sản phẩm
              <select value={data.badge} onChange={(e) => field('badge', e.target.value)}>
                {['', 'MỚI', 'BÁN CHẠY', 'YÊU THÍCH', 'ESSENTIAL', 'PREMIUM'].map((b) => (
                  <option key={b} value={b}>
                    {b || 'Không có nhãn'}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Kích cỡ
              <input required value={sizes} onChange={(e) => setSizes(e.target.value)} />
              <small>Phân cách bằng dấu phẩy</small>
            </label>
            <label>
              Màu sắc (HEX)
              <input required value={colors} onChange={(e) => setColors(e.target.value)} />
              <small>Ví dụ: #ded6c8, #252525</small>
            </label>
            <label className="span-2">
              Mô tả sản phẩm
              <textarea
                rows={3}
                maxLength={5000}
                value={data.description}
                onChange={(e) => field('description', e.target.value)}
              />
            </label>
            <label className="featured-checkbox span-2">
              <input
                type="checkbox"
                checked={data.featured}
                onChange={(e) => field('featured', e.target.checked)}
              />{' '}
              Hiển thị trong sản phẩm nổi bật ở trang chủ
            </label>
          </div>
        </div>
        {error && (
          <p className="form-error" role="alert">
            {error}
          </p>
        )}
        <div className="modal-actions">
          <button type="button" className="button outline" disabled={busy} onClick={onClose}>
            Hủy thay đổi
          </button>
          <button className="button dark" disabled={busy}>
            <Check size={16} />
            {busy ? 'Đang lưu...' : 'Lưu sản phẩm'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
