import { describe, it, expect } from 'vitest';
import { weeklyPlan } from '@/features/health-plan/data/weekly-plan';
import { mealIngredientsMap } from '@/features/health-plan/data/meal-ingredients-map';
import { buildShoppingList } from '@/features/health-plan/utils/build-shopping-list';
import type { DayPlan } from '@/features/health-plan/types';

// Collect all 28 meal titles from the default plan
const allMealTitles = weeklyPlan.flatMap((day) => day.meals.map((m) => m.title));

describe('mealIngredientsMap', () => {
  it('covers all 28 default meal titles with no undefined key', () => {
    expect(allMealTitles).toHaveLength(28);
    for (const title of allMealTitles) {
      expect(mealIngredientsMap[title], `Missing key: "${title}"`).toBeDefined();
      expect(Array.isArray(mealIngredientsMap[title])).toBe(true);
      expect(mealIngredientsMap[title].length).toBeGreaterThan(0);
    }
  });
});

describe('buildShoppingList', () => {
  it('returns empty Map for empty plan', () => {
    const result = buildShoppingList([]);
    expect(result.size).toBe(0);
  });

  it('returns empty Map when plan has no meals', () => {
    const emptyPlan: DayPlan[] = [
      { id: 'd1', day: '周一', accent: 'dark', meals: [] },
    ];
    const result = buildShoppingList(emptyPlan);
    expect(result.size).toBe(0);
  });

  it('deduplicates same ingredient: servings accumulate, displayAmount format correct', () => {
    // 希腊酸奶和浆果 and 希腊酸奶 both contain '希腊酸奶'
    const plan: DayPlan[] = [
      {
        id: 'd1',
        day: '周一',
        accent: 'dark',
        meals: [
          { id: 'm1', type: '早餐', title: '希腊酸奶和浆果', calories: 320 },
          { id: 'm2', type: '加餐', title: '希腊酸奶', calories: 140 },
        ],
      },
    ];
    const result = buildShoppingList(plan);
    const meat = result.get('肉蛋类');
    expect(meat).toBeDefined();
    const yogurtItem = meat!.find((i) => i.name === '希腊酸奶');
    expect(yogurtItem).toBeDefined();
    expect(yogurtItem!.servings).toBe(2);
    expect(yogurtItem!.displayAmount).toBe('200g × 2 份');
  });

  it('generates correct placeholder entry for unmatched meal title', () => {
    const plan: DayPlan[] = [
      {
        id: 'd1',
        day: '周一',
        accent: 'dark',
        meals: [
          { id: 'm1', type: '早餐', title: '未知特色早餐', calories: 300 },
        ],
      },
    ];
    const result = buildShoppingList(plan);
    const others = result.get('其他');
    expect(others).toBeDefined();
    const placeholder = others!.find((i) => i.name === '未知特色早餐 所需食材');
    expect(placeholder).toBeDefined();
    expect(placeholder!.category).toBe('其他');
    expect(placeholder!.amount).toBe('适量');
  });

  it('groups categories in fixed order: 蔬果类 → 肉蛋类 → 主食类 → 调料类 → 其他', () => {
    const result = buildShoppingList(weeklyPlan);
    const keys = Array.from(result.keys());
    const expectedOrder = ['蔬果类', '肉蛋类', '主食类', '调料类', '其他'];
    // Every key present should appear in the expected order
    let lastIndex = -1;
    for (const key of keys) {
      const idx = expectedOrder.indexOf(key);
      expect(idx).toBeGreaterThan(lastIndex);
      lastIndex = idx;
    }
  });

  it('does not include empty categories', () => {
    // A plan with only 蔬果类 items (杏仁和苹果 has only 蔬果类 entries)
    const plan: DayPlan[] = [
      {
        id: 'd1',
        day: '周一',
        accent: 'dark',
        meals: [{ id: 'm1', type: '加餐', title: '杏仁和苹果', calories: 180 }],
      },
    ];
    const result = buildShoppingList(plan);
    // 肉蛋类、主食类、调料类 should not appear
    expect(result.has('肉蛋类')).toBe(false);
    expect(result.has('主食类')).toBe(false);
    expect(result.has('调料类')).toBe(false);
    expect(result.has('蔬果类')).toBe(true);
  });

  it('single-serving item has displayAmount equal to amount (no × N)', () => {
    const plan: DayPlan[] = [
      {
        id: 'd1',
        day: '周一',
        accent: 'dark',
        meals: [{ id: 'm1', type: '早餐', title: '希腊酸奶和浆果', calories: 320 }],
      },
    ];
    const result = buildShoppingList(plan);
    const meat = result.get('肉蛋类');
    const yogurt = meat?.find((i) => i.name === '希腊酸奶');
    expect(yogurt).toBeDefined();
    expect(yogurt!.servings).toBe(1);
    expect(yogurt!.displayAmount).toBe('200g');
  });
});
