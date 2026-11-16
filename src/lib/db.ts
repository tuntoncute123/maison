import mockData from '@/data/db.json';
import type { Product, Order } from './types';

type MockDatabase = {
  products: Product[];
  orders: Order[];
  subscribers: { email: string; createdAt: string }[];
};
type RateLimit = { attempts: number; resetAt: number };
const globalMock = globalThis as unknown as {
  maisonMock?: MockDatabase;
  maisonRateLimits?: Map<string, RateLimit>;
};

// JSON is bundled at build time. Runtime edits are disposable, per-instance demo data.
// Keep persistence behind these functions so a real database can replace this adapter.
function store(): MockDatabase {
  return (globalMock.maisonMock ??= structuredClone(mockData) as MockDatabase);
}

export function getProducts(): Product[] {
  return structuredClone(store().products);
}
export function getProduct(id: string): Product | undefined {
  return structuredClone(store().products.find((product) => product.id === id));
}
export function saveProduct(product: Product) {
  const products = store().products;
  const index = products.findIndex((entry) => entry.id === product.id);
  if (index === -1) products.push(structuredClone(product));
  else products[index] = structuredClone(product);
}
export function deleteProduct(id: string) {
  store().products = store().products.filter((product) => product.id !== id);
}
export function getOrders(): Order[] {
  return structuredClone(store().orders).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}
export function getOrder(id: string): Order | undefined {
  return structuredClone(store().orders.find((order) => order.id === id));
}
export function saveOrder(order: Order) {
  const orders = store().orders;
  const index = orders.findIndex((entry) => entry.id === order.id);
  if (index === -1) orders.push(structuredClone(order));
  else orders[index] = structuredClone(order);
}

// The callback must stay synchronous: no request can interleave stock/order updates.
export function transaction<T>(action: () => T extends PromiseLike<unknown> ? never : T): T {
  const snapshot = structuredClone(store());
  try {
    return action();
  } catch (error) {
    globalMock.maisonMock = snapshot;
    throw error;
  }
}

export function addSubscriber(email: string) {
  const subscribers = store().subscribers;
  if (!subscribers.some((subscriber) => subscriber.email === email))
    subscribers.push({ email, createdAt: new Date().toISOString() });
}
export function getSubscriberCount() {
  return store().subscribers.length;
}
export function rateLimit(key: string, max: number, period: number) {
  const limits = (globalMock.maisonRateLimits ??= new Map<string, RateLimit>());
  const now = Date.now();
  for (const [entryKey, entry] of limits) if (entry.resetAt <= now) limits.delete(entryKey);
  const entry = limits.get(key) ?? { attempts: 0, resetAt: now + period };
  entry.attempts += 1;
  limits.set(key, entry);
  return entry.attempts <= max;
}
