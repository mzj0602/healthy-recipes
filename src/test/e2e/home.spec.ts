import { test, expect } from '@playwright/test';

test.describe('网站首页', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('页面标题正确', async ({ page }) => {
    await expect(page).toHaveTitle(/FreshPlate|健康/);
  });

  test('导航栏显示品牌名称 FreshPlate', async ({ page }) => {
    await expect(page.getByText('FreshPlate').first()).toBeVisible();
  });

  test('Hero 区域显示品牌标语', async ({ page }) => {
    await expect(page.getByText(/用新鲜开启|健康生活|Nourish/).first()).toBeVisible();
  });

  test('点击\"探索菜谱\"跳转至菜谱页', async ({ page }) => {
    await page.getByRole('button', { name: /探索菜谱|Explore/ }).first().click();
    await expect(page.getByText(/健康探索|菜谱探索|Explore/).first()).toBeVisible();
  });

  test('点击\"查看饮食计划\"跳转至计划页', async ({ page }) => {
    await page.getByRole('button', { name: /饮食计划|Meal Plan|查看/ }).first().click();
    await expect(page.getByText(/健康饮食计划|营养目标/).first()).toBeVisible();
  });

  test('热门分类区域可见', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /热门分类|Trending/ })).toBeVisible();
  });

  test('博客文章区域可见', async ({ page }) => {
    await expect(page.getByRole('heading', { name: '最新健康建议' })).toBeVisible();
  });

  test('页脚可见', async ({ page }) => {
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await expect(page.getByText(/保留所有权利/).first()).toBeVisible();
  });
});
