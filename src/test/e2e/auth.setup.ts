import { test as setup } from '@playwright/test';
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

const authFile = join('test-results', 'auth.json');

setup('authenticate', async ({ page }) => {
  await page.goto('/');
  await page.getByLabel('用户名').fill('demo');
  await page.getByLabel('密码').fill('123456');
  await page.getByRole('button', { name: '登录' }).click();
  await page.waitForSelector('text=你好，demo');

  await page.context().storageState({ path: authFile });

  // sessionStorage 不在 storageState 中，手动追加
  const username = await page.evaluate(() =>
    window.sessionStorage.getItem('healthy-recipes-user')
  );
  const state = JSON.parse(readFileSync(authFile, 'utf-8'));
  const entry = { name: 'healthy-recipes-user', value: username ?? '' };
  const origin = state.origins?.find((o: { origin: string }) => o.origin === 'http://localhost:4173');
  if (origin) {
    origin.sessionStorage = [entry];
  } else {
    state.origins = [{ origin: 'http://localhost:4173', sessionStorage: [entry] }];
  }
  writeFileSync(authFile, JSON.stringify(state));
});
