export type Product = {
  id: string;
  name: string;
  category: string;
  gender: 'men' | 'women' | 'unisex';
  price: number;
  originalPrice: number;
  image: string;
  description: string;
  colors: string[];
  sizes: string[];
  stock: number;
  badge: string;
  featured: boolean;
};
export type CartItem = { product: Product; size: string; color: string; quantity: number };
export type OrderItem = {
  productId: string;
  name: string;
  image: string;
  size: string;
  color: string;
  quantity: number;
  price: number;
};
export type Order = {
  id: string;
  customerName: string;
  email: string;
  phone: string;
  address: string;
  note: string;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
  status: 'pending' | 'confirmed' | 'shipping' | 'completed' | 'cancelled';
  createdAt: string;
};
export const money = (amount: number) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
export const statusLabels: Record<Order['status'], string> = {
  pending: 'Chờ xác nhận',
  confirmed: 'Đã xác nhận',
  shipping: 'Đang giao',
  completed: 'Hoàn thành',
  cancelled: 'Đã hủy',
};
export const categories = ['Áo sơ mi', 'Áo thun', 'Áo khoác', 'Quần', 'Đầm & Chân váy', 'Phụ kiện'];
