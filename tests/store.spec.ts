import { test, expect } from '@playwright/test';
const login = { email: 'admin@maison.vn', password: 'Maison@2026' };
const customer = {
  customerName: 'Khách Kiểm Thử',
  phone: '0901234567',
  email: 'test@example.com',
  address: '123 Đường Kiểm Thử, Phường Mẫu, Hà Nội',
  note: 'Đơn kiểm thử tự động',
};

test('storefront, local images, filtering, route changes and persistent wishlist', async ({
  page,
}) => {
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await page.goto('/');
  await expect(page.getByRole('heading', { name: /Mặc điều/ })).toBeVisible();
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: 'artifacts/test-store-desktop.png', fullPage: true });
  const broken = await page
    .locator('img')
    .evaluateAll((images) =>
      images
        .filter(
          (i) => !(i as HTMLImageElement).complete || (i as HTMLImageElement).naturalWidth === 0,
        )
        .map((i) => (i as HTMLImageElement).src),
    );
  expect(broken).toEqual([]);
  await page
    .getByRole('navigation', { name: 'Điều hướng chính' })
    .getByRole('link', { name: 'Nữ', exact: true })
    .click();
  await expect(page.getByRole('heading', { name: 'Dành riêng cho nàng.' })).toBeVisible();
  await page
    .getByRole('navigation', { name: 'Điều hướng chính' })
    .getByRole('link', { name: 'Nam', exact: true })
    .click();
  await expect(page.getByRole('heading', { name: 'Phong cách của chàng.' })).toBeVisible();
  await page.getByLabel('Tìm trong bộ sưu tập').fill('Essential');
  await expect(page.locator('.product-card')).toHaveCount(1);
  await page.locator('.wish-button').click();
  await page.goto('/wishlist');
  await expect(page.locator('.product-card')).toHaveCount(1);
  await page.reload();
  await expect(page.locator('.product-card')).toHaveCount(1);
  await page.locator('.wish-button').click();
  await expect(page.getByRole('heading', { name: 'Lưu lại một chút yêu thích' })).toBeVisible();
  expect(errors).toEqual([]);
});

test('shopper completes COD order, server reserves stock and tracking is private', async ({
  page,
  request,
}) => {
  const before = await (await request.get('/api/products/linen-shirt')).json();
  await page.goto('/product/linen-shirt');
  await page.getByRole('button', { name: 'M', exact: true }).click();
  await page.getByRole('button', { name: 'Màu 2', exact: true }).click();
  await page.getByRole('button', { name: 'Thêm vào giỏ hàng' }).click();
  await expect(page.getByRole('status')).toContainText('Đã thêm sản phẩm');
  await page.goto('/cart');
  await expect(page.locator('.cart-item')).toHaveCount(1);
  await page.reload();
  await expect(page.locator('.cart-item')).toHaveCount(1);
  await page.getByRole('link', { name: 'Tiến hành đặt hàng' }).click();
  await page.getByLabel('Họ và tên').fill(customer.customerName);
  await page.getByLabel('Số điện thoại').fill(customer.phone);
  await page.getByLabel('Email', { exact: false }).first().fill(customer.email);
  await page.getByLabel('Địa chỉ nhận hàng').fill(customer.address);
  await page.getByLabel('Mã ưu đãi').fill('WELCOME10');
  await page.getByRole('button', { name: 'Áp dụng' }).click();
  await expect(page.locator('.coupon-success')).toBeVisible();
  await page.getByRole('button', { name: 'Xác nhận đặt hàng' }).click();
  await expect(page.getByRole('heading', { name: 'Một chút phong cách đang đến!' })).toBeVisible();
  const id = await page.locator('.success-card>span').first().locator('strong').innerText();
  expect(id).toMatch(/^MS-/);
  await page.getByRole('link', { name: 'Theo dõi đơn hàng' }).click();
  await page.getByLabel('Số điện thoại đặt hàng').fill(customer.phone);
  await page.getByRole('button', { name: 'Tra cứu đơn hàng' }).click();
  await expect(page.locator('.tracking-result')).toContainText(id);
  const after = await (await request.get('/api/products/linen-shirt')).json();
  expect(after.stock).toBe(before.stock - 1);
  expect(
    (await request.post('/api/orders/track', { data: { id, phone: '0999999999' } })).status(),
  ).toBe(404);
  expect((await request.get('/api/orders')).status()).toBe(401);
  await page.goto('/cart');
  await expect(
    page.getByRole('heading', { name: 'Một chiếc giỏ đang chờ cảm hứng.' }),
  ).toBeVisible();
});

test('API validates variants, stock, pricing, coupon and order transitions', async ({
  request,
}) => {
  expect((await request.post('/api/products', { data: { name: 'unauthorized' } })).status()).toBe(
    401,
  );
  const product = await (await request.get('/api/products/linen-shirt')).json();
  const item = {
    productId: product.id,
    quantity: 1,
    size: product.sizes[0],
    color: product.colors[0],
  };
  expect(
    (
      await request.post('/api/orders', {
        data: { ...customer, items: [{ ...item, size: 'INVALID' }] },
      })
    ).status(),
  ).toBe(400);
  expect(
    (
      await request.post('/api/orders', {
        data: {
          ...customer,
          items: [
            { ...item, quantity: 20 },
            { ...item, quantity: 20 },
            { ...item, quantity: 20 },
          ],
        },
      })
    ).status(),
  ).toBe(400);
  expect(
    (
      await request.post('/api/orders', { data: { ...customer, items: [item], coupon: 'INVALID' } })
    ).status(),
  ).toBe(400);
  expect((await request.get('/api/products/linen-shirt').then((r) => r.json())).stock).toBe(
    product.stock,
  );
  const res = await request.post('/api/orders', {
    data: { ...customer, items: [{ ...item, price: 1 }], total: 1, coupon: 'WELCOME10' },
  });
  expect(res.status()).toBe(201);
  const order = await res.json();
  expect(order.total).toBe(
    product.price - Math.min(Math.round(product.price * 0.1), 100000) + 30000,
  );
  expect(
    (
      await request.patch(`/api/admin/orders/${order.id}`, { data: { status: 'cancelled' } })
    ).status(),
  ).toBe(401);
  expect(
    (await request.post('/api/admin/login', { data: { ...login, password: 'wrong' } })).status(),
  ).toBe(401);
  expect(
    (
      await request.post('/api/admin/login', {
        data: login,
        headers: { origin: 'https://attacker.invalid' },
      })
    ).status(),
  ).toBe(403);
  const auth = await request.post('/api/admin/login', { data: login });
  expect(auth.ok()).toBeTruthy();
  expect(auth.headers()['set-cookie']).toContain('HttpOnly');
  expect(auth.headers()['set-cookie']).toContain('SameSite=lax');
  expect(
    (
      await request.patch(`/api/admin/orders/${order.id}`, { data: { status: 'completed' } })
    ).status(),
  ).toBe(400);
  expect(
    (
      await request.patch(`/api/admin/orders/${order.id}`, { data: { status: 'cancelled' } })
    ).status(),
  ).toBe(200);
  expect((await request.get('/api/products/linen-shirt').then((r) => r.json())).stock).toBe(
    product.stock,
  );
  expect(
    (
      await request.patch(`/api/admin/orders/${order.id}`, { data: { status: 'cancelled' } })
    ).status(),
  ).toBe(400);
  expect((await request.get('/api/products/linen-shirt').then((r) => r.json())).stock).toBe(
    product.stock,
  );
  await request.post('/api/admin/logout');
  expect((await request.get('/api/orders')).status()).toBe(401);
});

test('admin login, product create edit delete, order processing and CSV export', async ({
  page,
  request,
}) => {
  await page.goto('/admin/products');
  await expect(page).toHaveURL(/\/admin\/login/);
  await page.getByLabel('Email quản trị').fill(login.email);
  await page.getByLabel('Mật khẩu', { exact: true }).fill(login.password);
  await page.getByRole('button', { name: 'Đăng nhập quản trị' }).click();
  await expect(page).toHaveURL(/\/admin$/);
  await expect(page.getByRole('heading', { name: 'Hiệu quả kinh doanh' })).toBeVisible();
  await page.screenshot({ path: 'artifacts/test-admin-desktop.png', fullPage: true });
  await page.getByRole('link', { name: 'Sản phẩm', exact: true }).click();
  await page.getByRole('button', { name: 'Thêm sản phẩm', exact: true }).click();
  const modal = page.getByRole('dialog');
  await modal.getByLabel('Tên sản phẩm').fill('Áo Kiểm Thử E2E');
  await modal.getByLabel('Tồn kho').fill('10');
  await modal.getByRole('button', { name: 'Lưu sản phẩm' }).click();
  await expect(modal).not.toBeVisible();
  await expect(page.getByText('Áo Kiểm Thử E2E', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Sửa Áo Kiểm Thử E2E' }).click();
  await modal.getByLabel('Giá bán').fill('555000');
  await modal.getByRole('button', { name: 'Lưu sản phẩm' }).click();
  await expect(modal).not.toBeVisible();
  await expect(page.locator('tr').filter({ hasText: 'Áo Kiểm Thử E2E' })).toContainText('555.000');
  await page.reload();
  await expect(page.locator('tr').filter({ hasText: 'Áo Kiểm Thử E2E' })).toContainText('555.000');
  await page.getByRole('button', { name: 'Xóa Áo Kiểm Thử E2E' }).click();
  await modal.getByRole('button', { name: 'Xóa sản phẩm', exact: true }).click();
  await expect(page.getByText('Áo Kiểm Thử E2E', { exact: true })).toHaveCount(0);
  await page.getByRole('link', { name: 'Đơn hàng', exact: true }).click();
  const pendingRow = page.locator('tbody tr').filter({ hasText: 'Chờ xác nhận' }).first();
  await pendingRow.getByRole('button', { name: /Xem đơn/ }).click();
  for (const status of ['confirmed', 'shipping', 'completed']) {
    await modal.getByLabel('Trạng thái mới').selectOption(status);
    await modal.getByRole('button', { name: 'Xác nhận cập nhật' }).click();
    await expect(modal.locator('.status')).toHaveClass(new RegExp(status));
  }
  await expect(modal.locator('.final-order-note')).toContainText('hoàn thành');
  await modal.getByRole('button', { name: 'Đóng hộp thoại' }).click();
  const download = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Xuất CSV' }).click();
  expect((await download).suggestedFilename()).toBe('maison-don-hang.csv');
  await page.getByRole('link', { name: 'Khách hàng', exact: true }).click();
  await expect(page).toHaveURL(/\/admin\/customers$/);
  await expect(
    page.locator('.customer-cell strong').filter({ hasText: customer.customerName }),
  ).toHaveCount(1);
  await page.getByRole('button', { name: 'Đăng xuất', exact: true }).click();
  await expect(page).toHaveURL(/\/admin\/login/);
  expect((await request.get('/api/orders')).status()).toBe(401);
});

test('mobile and tablet layouts, navigation and admin modal stay within viewport', async ({
  page,
}) => {
  for (const width of [390, 768]) {
    await page.setViewportSize({ width, height: 844 });
    for (const path of ['/', '/shop', '/product/linen-shirt', '/cart', '/track', '/admin/login']) {
      await page.goto(path);
      await expect
        .poll(() => page.evaluate(() => document.documentElement.scrollWidth <= innerWidth))
        .toBe(true);
    }
  }
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await page.getByRole('button', { name: 'Mở menu', exact: true }).click();
  await page.getByRole('navigation').getByRole('link', { name: 'Nữ', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Dành riêng cho nàng.' })).toBeVisible();
  await page.goto('/admin/login');
  await page.getByLabel('Email quản trị').fill(login.email);
  await page.getByLabel('Mật khẩu', { exact: true }).fill(login.password);
  await page.getByRole('button', { name: 'Đăng nhập quản trị' }).click();
  await expect(page).toHaveURL(/\/admin$/);
  await expect
    .poll(() => page.evaluate(() => document.documentElement.scrollWidth <= innerWidth))
    .toBe(true);
  await page.screenshot({ path: 'artifacts/test-admin-mobile.png', fullPage: true });
  await page.getByRole('button', { name: 'Mở menu quản trị' }).click();
  await page.getByRole('link', { name: 'Sản phẩm', exact: true }).click();
  await page.getByRole('button', { name: 'Thêm sản phẩm', exact: true }).click();
  await expect(page.getByRole('dialog')).toBeVisible();
  expect(await page.getByRole('dialog').evaluate((e) => e.scrollWidth <= innerWidth)).toBe(true);
  await page.screenshot({ path: 'artifacts/test-product-modal-mobile.png', fullPage: true });
});

test('newsletter validates and saves subscription without duplicate errors', async ({
  page,
  request,
}) => {
  expect((await request.post('/api/newsletter', { data: { email: 'invalid' } })).status()).toBe(
    400,
  );
  await page.goto('/');
  await page.getByLabel('Email nhận tin').fill('subscriber@example.com');
  await page.getByRole('button', { name: 'Đăng ký nhận tin' }).click();
  await expect(page.getByRole('status')).toContainText('đăng ký thành công');
  expect(
    (await request.post('/api/newsletter', { data: { email: 'subscriber@example.com' } })).status(),
  ).toBe(200);
});
