import { defineConfig } from '@playwright/test';
export default defineConfig({
  testDir: './tests',
  fullyParallel: false,
  workers: 1,
  timeout: 45000,
  use: {
    baseURL: 'http://127.0.0.1:3187',
    headless: true,
    viewport: { width: 1440, height: 1000 },
    trace: 'retain-on-failure',
  },
  reporter: [['list'], ['html', { open: 'never' }]],
  webServer: {
    command: 'node node_modules/next/dist/bin/next start --hostname 127.0.0.1 -p 3187',
    gracefulShutdown: { signal: 'SIGTERM', timeout: 5000 },
    // Wait for startup output: probing a closed port can hang behind a firewall.
    wait: { stdout: /Ready in/ },
    reuseExistingServer: false,
    timeout: 30000,
    env: {
      // Regression: the former SQLite path must never be opened or written.
      DATABASE_PATH: '/sys/maison-read-only/maison.sqlite',
      SESSION_SECRET: 'maison-e2e-session-secret',
      ADMIN_EMAIL: 'admin@maison.vn',
      ADMIN_PASSWORD: 'Maison@2026',
    },
  },
});
