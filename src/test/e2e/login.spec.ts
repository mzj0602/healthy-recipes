import { test, expect } from '@playwright/test';

test.describe('登录流程', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => window.sessionStorage.clear());
    await page.reload();
  });

  test('默认进入登录页，错误凭证会提示失败', async ({ page }) => {
    await expect(page.getByRole('heading', { name: '账号登录' })).toBeVisible();

    await page.getByLabel('用户名').fill('wrong');
    await page.getByLabel('密码').fill('badpass');
    await page.getByRole('button', { name: '登录' }).click();

    await expect(page.getByText('用户名或密码错误')).toBeVisible();
    await expect(page.getByRole('heading', { name: '账号登录' })).toBeVisible();
  });

  test('正确登录后进入应用，刷新后保持登录，退出后回到登录页', async ({ page }) => {
    await page.getByLabel('用户名').fill('demo');
    await page.getByLabel('密码').fill('123456');
    await page.getByRole('button', { name: '登录' }).click();

    await expect(page.getByText('你好，demo')).toBeVisible();
    await expect(page.getByText('用新鲜开启健康生活')).toBeVisible();

    await page.reload();

    await expect(page.getByText('你好，demo')).toBeVisible();
    await expect(page.getByRole('heading', { name: '账号登录' })).toHaveCount(0);

    await page.getByRole('button', { name: '退出' }).click();

    await expect(page.getByRole('heading', { name: '账号登录' })).toBeVisible();
    await expect(page.getByText('你好，demo')).toHaveCount(0);
  });
});
