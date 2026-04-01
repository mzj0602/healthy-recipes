import { test, expect } from '@playwright/test';

// SPA 状态路由：登录页是默认首屏，不能使用 page.goto('/login')
test.describe('login-ui-sync', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => window.sessionStorage.clear());
    await page.reload();
  });

  test('登录页正常渲染', async ({ page }) => {
    await expect(page.getByText('账号登录')).toBeVisible();
    await expect(page.getByText(/演示账号/)).toBeVisible();
  });

  test('空字段校验', async ({ page }) => {
    await page.getByRole('button', { name: '登录' }).click();
    await expect(page.getByText('请输入用户名和密码')).toBeVisible();
  });

  test('错误凭证提示', async ({ page }) => {
    await page.getByPlaceholder('请输入用户名').fill('wrong');
    await page.getByPlaceholder('请输入密码').fill('wrong');
    await page.getByRole('button', { name: '登录' }).click();
    await expect(page.getByText('用户名或密码错误')).toBeVisible();
  });

  test('正确登录进入主应用', async ({ page }) => {
    await page.getByPlaceholder('请输入用户名').fill('demo');
    await page.getByPlaceholder('请输入密码').fill('123456');
    await page.getByRole('button', { name: '登录' }).click();
    await expect(page.getByText(/FreshPlate|健康菜谱|今日推荐/)).toBeVisible({ timeout: 5000 });
  });
});
