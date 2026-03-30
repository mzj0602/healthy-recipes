import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './src/test/e2e',
  outputDir: './test-results/e2e',
  globalSetup: './src/test/e2e/global-setup.ts',
  reporter: [
    ['list'],
    ['html', { outputFolder: './test-results/e2e-report', open: 'never' }],
  ],
  use: {
    baseURL: 'http://localhost:4173',
    storageState: 'test-results/auth.json',
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'setup',
      testMatch: /global-setup\.ts/,
    },
  ],
  webServer: {
    command: 'pnpm build && pnpm preview',
    url: 'http://localhost:4173',
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
  },
});
