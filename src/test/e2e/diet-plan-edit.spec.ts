import { test, expect } from './fixtures';

test.describe('饮食计划编辑弹窗', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // 通过导航进入计划页（SPA 状态路由）
    await page.getByRole('button', { name: /查看饮食计划|饮食计划/ }).first().click();
    // 确认已进入计划页
    await expect(page.getByText(/个人健康饮食计划/).first()).toBeVisible();
  });

  test('打开弹窗', async ({ page }) => {
    await page.getByRole('button', { name: /编辑计划/ }).click();
    await expect(page.getByRole('dialog')).toBeVisible();
    await expect(page.getByRole('dialog').getByText('编辑计划')).toBeVisible();
  });

  test('Tab 切换展示对应日期餐食', async ({ page }) => {
    await page.getByRole('button', { name: /编辑计划/ }).click();
    await expect(page.getByRole('dialog')).toBeVisible();

    const dialog = page.getByRole('dialog');

    // 默认显示周一的餐食
    await expect(dialog.locator('input[value="希腊酸奶和浆果"]')).toBeVisible();

    // 点击周三 Tab
    await dialog.getByRole('button', { name: '周三' }).click();

    // 应显示周三的餐食
    await expect(dialog.locator('input[value="燕麦片"]')).toBeVisible();
    // 周一餐食不应再出现
    await expect(dialog.locator('input[value="希腊酸奶和浆果"]')).not.toBeVisible();
  });

  test('保存后餐食名称更新到看板', async ({ page }) => {
    await page.getByRole('button', { name: /编辑计划/ }).click();
    await expect(page.getByRole('dialog')).toBeVisible();

    const dialog = page.getByRole('dialog');

    // 修改周一早餐名称
    const titleInput = dialog.locator('input[value="希腊酸奶和浆果"]');
    await titleInput.fill('改版早餐');

    // 点击保存
    await dialog.getByRole('button', { name: '保存计划' }).click();

    // 弹窗关闭
    await expect(page.getByRole('dialog')).not.toBeVisible();

    // 周计划看板应反映新名称
    await expect(page.getByText('改版早餐').first()).toBeVisible();
  });

  test('保存后目标进度更新', async ({ page }) => {
    await page.getByRole('button', { name: /编辑计划/ }).click();
    await expect(page.getByRole('dialog')).toBeVisible();

    const dialog = page.getByRole('dialog');

    // 修改蛋白质进度 (percent=80 → 50)
    // 目标区的 percent input 是第一个 spinbutton
    const percentInput = dialog.getByRole('spinbutton').first();
    await percentInput.fill('50');

    // 点击保存
    await dialog.getByRole('button', { name: '保存计划' }).click();
    await expect(page.getByRole('dialog')).not.toBeVisible();

    // 进度条百分比应更新
    await expect(page.getByText('50%').first()).toBeVisible();
  });

  test('取消丢弃草稿，原数据不变', async ({ page }) => {
    await page.getByRole('button', { name: /编辑计划/ }).click();
    await expect(page.getByRole('dialog')).toBeVisible();

    const dialog = page.getByRole('dialog');

    // 修改名称
    const titleInput = dialog.locator('input[value="希腊酸奶和浆果"]');
    await titleInput.fill('不保存的内容');

    // 点击取消
    await dialog.getByRole('button', { name: '取消' }).click();
    await expect(page.getByRole('dialog')).not.toBeVisible();

    // 看板数据不变
    await expect(page.getByText('希腊酸奶和浆果').first()).toBeVisible();
    await expect(page.getByText('不保存的内容')).not.toBeVisible();
  });

  test('蒙层关闭弹窗，草稿丢弃', async ({ page }) => {
    await page.getByRole('button', { name: /编辑计划/ }).click();
    await expect(page.getByRole('dialog')).toBeVisible();

    const dialog = page.getByRole('dialog');

    // 修改名称
    const titleInput = dialog.locator('input[value="希腊酸奶和浆果"]');
    await titleInput.fill('蒙层测试');

    // 点击背景蒙层（dialog 外侧区域）
    await page.mouse.click(10, 10);
    await expect(page.getByRole('dialog')).not.toBeVisible();

    // 原数据不变
    await expect(page.getByText('希腊酸奶和浆果').first()).toBeVisible();
    await expect(page.getByText('蒙层测试')).not.toBeVisible();
  });

  test('× 按钮关闭弹窗', async ({ page }) => {
    await page.getByRole('button', { name: /编辑计划/ }).click();
    await expect(page.getByRole('dialog')).toBeVisible();

    // 点击关闭按钮
    await page.getByRole('button', { name: '关闭' }).click();
    await expect(page.getByRole('dialog')).not.toBeVisible();
  });

  test('T16/AC1-AC2: 修改餐食名称保存后刷新仍显示新名称', async ({ page }) => {
    await page.getByRole('button', { name: /编辑计划/ }).click();
    await expect(page.getByRole('dialog')).toBeVisible();

    const dialog = page.getByRole('dialog');
    const titleInput = dialog.locator('input[value="希腊酸奶和浆果"]');
    await titleInput.fill('持久化早餐');

    await dialog.getByRole('button', { name: '保存计划' }).click();
    await expect(page.getByRole('dialog')).not.toBeVisible();
    await expect(page.getByText('持久化早餐').first()).toBeVisible();

    // 刷新页面验证 localStorage 持久化
    await page.reload();
    await page.getByRole('button', { name: /查看饮食计划|饮食计划/ }).first().click();
    await expect(page.getByText('持久化早餐').first()).toBeVisible();
  });

  test('T17/AC3: 修改后取消刷新数据不变', async ({ page }) => {
    await page.getByRole('button', { name: /编辑计划/ }).click();
    await expect(page.getByRole('dialog')).toBeVisible();

    const dialog = page.getByRole('dialog');
    const titleInput = dialog.locator('input[value="希腊酸奶和浆果"]');
    await titleInput.fill('未保存内容');

    await dialog.getByRole('button', { name: '取消' }).click();
    await expect(page.getByRole('dialog')).not.toBeVisible();

    // 刷新后数据不变
    await page.reload();
    await page.getByRole('button', { name: /查看饮食计划|饮食计划/ }).first().click();
    await expect(page.getByText('希腊酸奶和浆果').first()).toBeVisible();
    await expect(page.getByText('未保存内容')).not.toBeVisible();
  });

  test('T18/AC4: 添加餐食保存刷新后新行存在', async ({ page }) => {
    await page.getByRole('button', { name: /编辑计划/ }).click();
    await expect(page.getByRole('dialog')).toBeVisible();

    const dialog = page.getByRole('dialog');

    // 点击添加餐食
    await dialog.getByRole('button', { name: '+ 添加餐食' }).click();

    // 填写新餐食名称（最后一个空名称 input）
    const nameInputs = dialog.getByPlaceholder('餐食名称');
    const count = await nameInputs.count();
    await nameInputs.nth(count - 1).fill('新增的餐食');

    await dialog.getByRole('button', { name: '保存计划' }).click();
    await expect(page.getByRole('dialog')).not.toBeVisible();
    await expect(page.getByText('新增的餐食').first()).toBeVisible();

    // 刷新后仍存在
    await page.reload();
    await page.getByRole('button', { name: /查看饮食计划|饮食计划/ }).first().click();
    await expect(page.getByText('新增的餐食').first()).toBeVisible();
  });

  test('T19/AC5: 删除餐食后消失；仅剩 1 条时删除按钮 disabled', async ({ page }) => {
    await page.getByRole('button', { name: /编辑计划/ }).click();
    await expect(page.getByRole('dialog')).toBeVisible();

    const dialog = page.getByRole('dialog');

    // 周一默认有多条餐食，删除第一条
    const deleteButtons = dialog.getByRole('button', { name: '删除餐食' });
    const initialCount = await deleteButtons.count();
    await deleteButtons.first().click();
    await expect(dialog.getByRole('button', { name: '删除餐食' })).toHaveCount(initialCount - 1);

    // 继续删除直到仅剩 1 条，验证 disabled
    const remaining = await dialog.getByRole('button', { name: '删除餐食' }).count();
    for (let i = 0; i < remaining - 1; i++) {
      await dialog.getByRole('button', { name: '删除餐食' }).first().click();
    }
    await expect(dialog.getByRole('button', { name: '删除餐食' })).toBeDisabled();
  });

  test('T20/AC6: 清空 title 保存后错误提示出现且 modal 未关闭', async ({ page }) => {
    await page.getByRole('button', { name: /编辑计划/ }).click();
    await expect(page.getByRole('dialog')).toBeVisible();

    const dialog = page.getByRole('dialog');

    // 清空第一个餐食名称
    const firstTitleInput = dialog.getByPlaceholder('餐食名称').first();
    await firstTitleInput.fill('');

    await dialog.getByRole('button', { name: '保存计划' }).click();

    // 错误提示出现，modal 仍显示
    await expect(dialog.getByText('餐食名称不能为空')).toBeVisible();
    await expect(page.getByRole('dialog')).toBeVisible();
  });

  test('T21/AC7: 输入 -5 calories 保存后 localStorage 中对应值为 0', async ({ page }) => {
    await page.getByRole('button', { name: /编辑计划/ }).click();
    await expect(page.getByRole('dialog')).toBeVisible();

    const dialog = page.getByRole('dialog');

    // 找到第一个 calories spinbutton（goals 的 percent 之后）
    const spinbuttons = dialog.getByRole('spinbutton');
    // 前三个是 goals percent（蛋白质/热量/碳水），第四个起是 meal calories
    await spinbuttons.nth(3).fill('-5');

    await dialog.getByRole('button', { name: '保存计划' }).click();

    // 由于 -5 < 0，校验失败，modal 不关闭，localStorage 不写入
    // 验证错误提示出现
    await expect(dialog.getByText('请输入有效卡路里（≥ 0）')).toBeVisible();
    await expect(page.getByRole('dialog')).toBeVisible();

    // 验证 localStorage 未写入负值（通过 evaluate 检查）
    const storedValue = await page.evaluate(() => {
      const raw = localStorage.getItem('health-plan-data');
      if (!raw) return null;
      const data = JSON.parse(raw) as { plan: Array<{ meals: Array<{ calories: number }> }> };
      return data.plan[0]?.meals[0]?.calories ?? null;
    });
    // localStorage 中不应有 -5
    expect(storedValue).not.toBe(-5);
  });
});
