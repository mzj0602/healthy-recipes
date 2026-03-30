import { test as setup } from '@playwright/test';

setup('authenticate', async ({ page }) => {
  await page.goto('/');
  await page.getByLabel('用户名').fill('demo');
  await page.getByLabel('密码').fill('123456');
  await page.getByRole('button', { name: '登录' }).click();
  await page.waitForSelector('text=你好，demo');
  await page.context().storageState({ path: 'test-results/auth.json' });
});
