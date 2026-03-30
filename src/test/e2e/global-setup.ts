import { chromium } from '@playwright/test';

export default async function globalSetup() {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  await page.goto('http://localhost:4173');
  await page.getByLabel('用户名').fill('demo');
  await page.getByLabel('密码').fill('123456');
  await page.getByRole('button', { name: '登录' }).click();
  await page.waitForSelector('text=你好，demo');

  await page.context().storageState({ path: 'test-results/auth.json' });
  await browser.close();
}
