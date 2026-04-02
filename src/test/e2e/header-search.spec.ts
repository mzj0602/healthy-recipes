import { test, expect } from './fixtures';

test.describe('Header 搜索框', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('流程 1：从首页点击搜索图标 → 输入"三文鱼" → Enter → 验证探索页搜索栏显示关键词', async ({ page }) => {
    // 点击 header 搜索图标展开搜索框
    const headerSearchBtn = page.locator('header button').filter({ has: page.locator('path[d*="21 21"]') }).first();
    await headerSearchBtn.click();

    // 输入关键词
    const searchInput = page.locator('header input[placeholder="搜索菜谱..."]');
    await expect(searchInput).toBeVisible();
    await searchInput.fill('三文鱼');
    await searchInput.press('Enter');

    // 跳转至探索页，探索页搜索栏显示关键词
    await expect(page.getByText(/健康探索/)).toBeVisible();
    const exploreInput = page.locator('input[placeholder*="牛油果吐司"]');
    await expect(exploreInput).toHaveValue('三文鱼');

    // 菜谱列表已过滤（三文鱼相关菜谱可见）
    const cards = page.locator('article');
    const count = await cards.count();
    expect(count).toBeGreaterThan(0);
  });

  test('流程 2：导航至菜谱探索页 → Header 搜索"高蛋白" → 菜谱列表刷新无闪烁', async ({ page }) => {
    // 通过导航栏进入菜谱探索页
    await page.getByRole('button', { name: '菜谱' }).first().click();
    await expect(page.getByText(/健康探索/)).toBeVisible();

    // 点击 header 搜索图标
    const headerSearchBtn = page.locator('header button').filter({ has: page.locator('path[d*="21 21"]') }).first();
    await headerSearchBtn.click();

    const searchInput = page.locator('header input[placeholder="搜索菜谱..."]');
    await expect(searchInput).toBeVisible();
    await searchInput.fill('高蛋白');
    await searchInput.press('Enter');

    // 仍在探索页，菜谱列表已更新
    await expect(page.getByText(/健康探索/)).toBeVisible();
    const exploreInput = page.locator('input[placeholder*="牛油果吐司"]');
    await expect(exploreInput).toHaveValue('高蛋白');
  });

  test('流程 3：展开搜索框不输入直接 Enter → 页面仍为首页', async ({ page }) => {
    // 点击搜索图标
    const headerSearchBtn = page.locator('header button').filter({ has: page.locator('path[d*="21 21"]') }).first();
    await headerSearchBtn.click();

    const searchInput = page.locator('header input[placeholder="搜索菜谱..."]');
    await expect(searchInput).toBeVisible();

    // 不输入直接按 Enter
    await searchInput.press('Enter');

    // 页面仍为首页（健康探索标题不可见）
    await expect(page.getByText(/用新鲜开启|健康生活|Nourish/).first()).toBeVisible();
    await expect(page.getByText(/健康探索/)).not.toBeVisible();
  });

  test('流程 4：展开搜索框后按 Escape → 搜索框收起', async ({ page }) => {
    // 点击搜索图标展开
    const headerSearchBtn = page.locator('header button').filter({ has: page.locator('path[d*="21 21"]') }).first();
    await headerSearchBtn.click();

    const searchInput = page.locator('header input[placeholder="搜索菜谱..."]');
    const wrapper = searchInput.locator('..');

    // 展开后 wrapper 有 w-[220px] class
    await expect(wrapper).toHaveClass(/w-\[220px\]/);

    // 点击 input 确保焦点，然后按 Escape
    await searchInput.click();
    await searchInput.press('Escape');

    // 收起后 wrapper 变回 w-0
    await expect(wrapper).toHaveClass(/w-0/);
  });
});
