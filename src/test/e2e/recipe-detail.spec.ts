import { test, expect } from './fixtures';

test.describe('菜谱详情页', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // 进入探索页后点击第一个菜谱
    await page.getByRole('button', { name: /探索菜谱|Explore/ }).first().click();
    await page.locator('article').first().click();
  });

  test('显示菜谱标题', async ({ page }) => {
    const heading = page.locator('h1');
    await expect(heading).toBeVisible();
  });

  test('食材清单区域可见', async ({ page }) => {
    await expect(page.getByText(/食材清单/).first()).toBeVisible();
  });

  test('食材复选框可勾选', async ({ page }) => {
    const checkbox = page.locator('input[type="checkbox"]').first();
    await expect(checkbox).toBeVisible();
    await checkbox.click();
    await expect(checkbox).toBeChecked();
  });

  test('\"全部加入购物清单\"按钮可见', async ({ page }) => {
    await expect(page.getByText(/全部加入购物清单|Add All/).first()).toBeVisible();
  });

  test('烹饪步骤区域可见', async ({ page }) => {
    await expect(page.getByText(/烹饪步骤/).first()).toBeVisible();
  });

  test('营养成分表可见', async ({ page }) => {
    await expect(page.getByText(/营养成分表/).first()).toBeVisible();
  });

  test('营养成分包含热量数据', async ({ page }) => {
    await expect(page.getByText(/kcal/i).first()).toBeVisible();
  });

  test('评论区域可见', async ({ page }) => {
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await expect(page.getByText(/评论与评分/).first()).toBeVisible();
  });
});
