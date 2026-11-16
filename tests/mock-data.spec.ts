import { expect, test } from '@playwright/test';
import { createHmac } from 'node:crypto';
import mockData from '../src/data/db.json';

test('bundled JSON catalog and sample orders work without a writable database', async ({
  request,
}) => {
  const response = await request.get('/api/products');
  expect(response.status()).toBe(200);
  const products = await response.json();
  expect(products.map((product: { id: string }) => product.id)).toEqual(
    mockData.products.map((product) => product.id),
  );
  for (const order of mockData.orders) {
    const tracked = await request.post('/api/orders/track', {
      data: { id: order.id, phone: order.phone },
    });
    expect(tracked.status()).toBe(200);
    expect(await tracked.json()).toEqual(order);
    expect(
      (
        await request.post('/api/orders/track', { data: { id: order.id, phone: '0999999999' } })
      ).status(),
    ).toBe(404);
  }
});

test('signed demo sessions reject forged, expired and wrong-account cookies', async ({
  playwright,
}) => {
  const context = await playwright.request.newContext({ baseURL: 'http://127.0.0.1:3187' });
  try {
    const login = await context.post('/api/admin/login', {
      data: { email: 'admin@maison.vn', password: 'Maison@2026' },
    });
    expect(login.status()).toBe(200);
    const cookie = (await context.storageState()).cookies.find(
      (entry) => entry.name === 'maison_session',
    )!;
    expect((await context.get('/api/orders')).status()).toBe(200);
    const payload = cookie.value.split('.')[0];
    const signedToken = (data: object) => {
      const value = Buffer.from(JSON.stringify(data)).toString('base64url');
      return `${value}.${createHmac('sha256', 'maison-e2e-session-secret').update(value).digest('base64url')}`;
    };
    for (const token of [
      `${payload}.invalid-signature`,
      signedToken({ email: 'admin@maison.vn', expires: Date.now() - 1000 }),
      signedToken({ email: 'other@example.com', expires: Date.now() + 86400000 }),
      'malformed',
    ]) {
      const response = await context.get('/api/orders', {
        headers: { cookie: `maison_session=${token}` },
      });
      expect(response.status()).toBe(401);
    }
    await context.post('/api/admin/logout');
    expect((await context.get('/api/orders')).status()).toBe(401);
  } finally {
    await context.dispose();
  }
});
