import { test, expect } from '@playwright/test';

test.describe('个人健康周计划页', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // 通过导航进入计划页
    await page.getByRole('button', { name: /查看饮食计划|饮食计划/ }).first().click();
  });

  test('显示页面标题\"个人健康饮食计划\"', async ({ page }) => {
    await expect(page.getByText(/个人健康饮食计划/).first()).toBeVisible();
  });

  test('显示今日营养目标区域', async ({ page }) => {
    await expect(page.getByText(/今日营养目标/).first()).toBeVisible();
  });

  test('营养目标包含蛋白质进度条', async ({ page }) => {
    await expect(page.getByText(/蛋白质/).first()).toBeVisible();
    await expect(page.getByText('80%').first()).toBeVisible();
  });

  test('营养目标包含热量进度条', async ({ page }) => {
    await expect(page.getByText(/热量/).first()).toBeVisible();
    await expect(page.getByText('84%')).toBeVisible();
  });

  test('显示 7 天日历', async ({ page }) => {
    const days = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
    for (const day of days) {
      await expect(page.getByText(day)).toBeVisible();
    }
  });

  test('每天包含早餐、午餐、加餐、晚餐', async ({ page }) => {
    const mealTypes = ['早餐', '午餐', '加餐', '晚餐'];
    for (const type of mealTypes) {
      const items = page.getByText(type);
      const count = await items.count();
      expect(count).toBeGreaterThanOrEqual(7);
    }
  });

  test('\"生成购物清单\"按钮可见', async ({ page }) => {
    await expect(page.getByRole('button', { name: /生成购物清单/ })).toBeVisible();
  });

  test('\"编辑计划\"按钮可见', async ({ page }) => {
    await expect(page.getByRole('button', { name: /编辑计划/ })).toBeVisible();
  });
});
