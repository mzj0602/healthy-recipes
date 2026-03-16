import { test, expect } from '@playwright/test';

test.describe('菜谱探索页', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: /探索菜谱|Explore/ }).first().click();
  });

  test('页面标题显示\"健康探索\"', async ({ page }) => {
    await expect(page.getByText(/健康探索|菜谱探索/).first()).toBeVisible();
  });

  test('搜索框可见且可输入', async ({ page }) => {
    const searchInput = page.locator('input[type="text"]').first();
    await expect(searchInput).toBeVisible();
    await searchInput.fill('三文鱼');
    await expect(searchInput).toHaveValue('三文鱼');
  });

  test('侧边栏筛选区域可见', async ({ page }) => {
    await expect(page.getByText('热量范围')).toBeVisible();
  });

  test('菜谱卡片列表可见', async ({ page }) => {
    const cards = page.locator('article');
    await expect(cards.first()).toBeVisible();
    const count = await cards.count();
    expect(count).toBeGreaterThan(0);
  });

  test('分页按钮可见', async ({ page }) => {
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    const paginationBtns = page.locator('button').filter({ hasText: /^[0-9]+$/ });
    await expect(paginationBtns.first()).toBeVisible();
  });

  test('点击菜谱卡片进入详情页', async ({ page }) => {
    await page.locator('article').first().click();
    await expect(page.getByText(/食材清单|烹饪步骤|营养成分/).first()).toBeVisible();
  });
});
