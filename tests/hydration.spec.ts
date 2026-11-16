import { expect, test } from '@playwright/test';

test('extension attributes on body preserve hydration and store interactions', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text());
  });
  // Emulate an extension mutating the parsed DOM before application scripts hydrate.
  await page.addInitScript(() => {
    const observer = new MutationObserver(() => {
      if (!document.body) return;
      document.body.setAttribute('data-testim-main-word-scripts-loaded', 'true');
      document.body.classList.add('vsc-initialized');
      observer.disconnect();
    });
    observer.observe(document, { childList: true, subtree: true });
  });

  await page.goto('/', { waitUntil: 'networkidle' });
  await page.getByRole('button', { name: 'Tìm kiếm', exact: true }).click();
  await expect(page.getByRole('textbox', { name: 'Tìm sản phẩm' })).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('textbox', { name: 'Tìm sản phẩm' })).toHaveCount(0);
  await expect(page.getByRole('button', { name: 'Tìm kiếm', exact: true })).toBeFocused();
  await page.locator('.wish-button').first().click();
  await expect(page.locator('.wish-button').first()).toHaveAttribute('aria-pressed', 'true');
  await page.reload();
  await expect(page.locator('.wish-button').first()).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('body')).toHaveAttribute(
    'data-testim-main-word-scripts-loaded',
    'true',
  );
  await expect(page.locator('body')).toHaveClass('vsc-initialized');
  expect(errors).toEqual([]);
});
