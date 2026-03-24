import { test, expect } from '@playwright/test';

// Helper: navigate to health plan page via SPA click flow
async function goToHealthPlanPage(page: import('@playwright/test').Page) {
  await page.goto('/');
  await page.getByRole('button', { name: /查看饮食计划|饮食计划/ }).first().click();
  await expect(page.getByText(/个人健康饮食计划/).first()).toBeVisible();
}

test.describe('购物清单弹窗', () => {
  test.beforeEach(async ({ page }) => {
    // Clear localStorage before each test so state is clean
    await page.addInitScript(() => {
      localStorage.removeItem('health-plan-data');
    });
    await goToHealthPlanPage(page);
  });

  // AC-1: 点击"生成购物清单" → 弹窗出现，标题含食材总数
  test('AC-1: 点击"生成购物清单"弹窗出现，标题含食材总数', async ({ page }) => {
    await page.getByRole('button', { name: /生成购物清单/ }).first().click();

    const dialog = page.getByRole('dialog', { name: /购物清单/ });
    await expect(dialog).toBeVisible();

    // Title should contain total ingredient count
    await expect(dialog.getByText(/购物清单/)).toBeVisible();
    await expect(dialog.getByText(/共\s*\d+\s*种食材/)).toBeVisible();
  });

  // AC-2: 断言分类标题可见，食材条目带复选框
  test('AC-2: 分类标题可见，食材条目带复选框', async ({ page }) => {
    await page.getByRole('button', { name: /生成购物清单/ }).first().click();
    const dialog = page.getByRole('dialog', { name: /购物清单/ });
    await expect(dialog).toBeVisible();

    // At least one category heading should be visible
    const categoryHeadings = ['蔬果类', '肉蛋类', '主食类', '调料类'];
    let foundCategory = false;
    for (const cat of categoryHeadings) {
      const heading = dialog.getByText(cat).first();
      const visible = await heading.isVisible();
      if (visible) {
        foundCategory = true;
        break;
      }
    }
    expect(foundCategory).toBe(true);

    // Checkboxes should be present
    const checkboxes = dialog.locator('input[type="checkbox"]');
    const count = await checkboxes.count();
    expect(count).toBeGreaterThan(0);
  });

  // AC-3: 点击复选框 → 文字变灰 + 删除线；再次点击 → 恢复
  test('AC-3: 勾选条目后文字变灰加删除线，再次点击恢复', async ({ page }) => {
    await page.getByRole('button', { name: /生成购物清单/ }).first().click();
    const dialog = page.getByRole('dialog', { name: /购物清单/ });
    await expect(dialog).toBeVisible();

    // Click first checkbox
    const firstCheckbox = dialog.locator('input[type="checkbox"]').first();
    await firstCheckbox.check();
    await expect(firstCheckbox).toBeChecked();

    // The corresponding label should have line-through
    const firstLabel = dialog.locator('label').first();
    await expect(firstLabel).toHaveClass(/line-through/);

    // Uncheck
    await firstCheckbox.uncheck();
    await expect(firstCheckbox).not.toBeChecked();
    await expect(firstLabel).not.toHaveClass(/line-through/);
  });

  // AC-4: 点击"复制文字" → 出现"已复制！"提示（mock navigator.clipboard）
  test('AC-4: 点击"复制文字"出现"已复制！"提示', async ({ page }) => {
    // Mock clipboard API
    await page.addInitScript(() => {
      Object.defineProperty(navigator, 'clipboard', {
        value: {
          writeText: () => Promise.resolve(),
        },
        writable: true,
        configurable: true,
      });
    });

    await goToHealthPlanPage(page);
    await page.getByRole('button', { name: /生成购物清单/ }).first().click();

    const dialog = page.getByRole('dialog', { name: /购物清单/ });
    await expect(dialog).toBeVisible();

    const copyButton = dialog.getByRole('button', { name: /复制文字/ });
    await expect(copyButton).toBeVisible();
    await copyButton.click();

    await expect(dialog.getByText('已复制！')).toBeVisible();
  });

  // AC-5: 勾选后点击 × / 蒙层关闭弹窗，重新打开后勾选已清空
  test('AC-5: 关闭弹窗后重新打开，勾选状态已清空', async ({ page }) => {
    await page.getByRole('button', { name: /生成购物清单/ }).first().click();
    const dialog = page.getByRole('dialog', { name: /购物清单/ });
    await expect(dialog).toBeVisible();

    // Check first item
    const firstCheckbox = dialog.locator('input[type="checkbox"]').first();
    await firstCheckbox.check();
    await expect(firstCheckbox).toBeChecked();

    // Close via × button
    await dialog.getByRole('button', { name: /关闭/ }).click();
    await expect(dialog).not.toBeVisible();

    // Reopen
    await page.getByRole('button', { name: /生成购物清单/ }).first().click();
    const reopenedDialog = page.getByRole('dialog', { name: /购物清单/ });
    await expect(reopenedDialog).toBeVisible();

    // Checkboxes should be unchecked (state reset since component was unmounted)
    const checkboxAfterReopen = reopenedDialog.locator('input[type="checkbox"]').first();
    await expect(checkboxAfterReopen).not.toBeChecked();
  });

  test('AC-5b: 点击背景蒙层关闭弹窗', async ({ page }) => {
    await page.getByRole('button', { name: /生成购物清单/ }).first().click();
    const dialog = page.getByRole('dialog', { name: /购物清单/ });
    await expect(dialog).toBeVisible();

    // Click the overlay (the fixed backdrop behind the dialog)
    const overlay = page.locator('[data-testid="shopping-list-overlay"]');
    // Click top-left corner of overlay (outside the dialog box)
    await overlay.click({ position: { x: 5, y: 5 } });
    await expect(dialog).not.toBeVisible();
  });

  // AC-6: 购物清单关闭后可以打开编辑计划弹窗（整合流程验证）
  // Note: Truly empty plan state cannot be triggered through normal app flow since
  // loadFromStorage always falls back to the default 7-day plan (non-empty).
  // The empty state logic is covered by unit tests (shopping-list.test.ts).
  // This test verifies the integration: closing shopping list → opening edit plan.
  test('AC-6: 关闭购物清单后可打开编辑计划弹窗', async ({ page }) => {
    // Open shopping list
    await page.getByRole('button', { name: /生成购物清单/ }).first().click();
    const shoppingDialog = page.getByRole('dialog', { name: /购物清单/ });
    await expect(shoppingDialog).toBeVisible();

    // Close it via × button
    await shoppingDialog.getByRole('button', { name: /关闭/ }).click();
    await expect(shoppingDialog).not.toBeVisible();

    // Open edit plan
    await page.getByRole('button', { name: /编辑计划/ }).first().click();
    const editDialog = page.getByRole('dialog');
    await expect(editDialog).toBeVisible();
    await expect(editDialog.getByText('编辑计划')).toBeVisible();
  });
});
