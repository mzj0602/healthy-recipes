import type { DayPlan, IngredientCategory, ShoppingItem } from '@/features/health-plan/types';
import { mealIngredientsMap } from '@/features/health-plan/data/meal-ingredients-map';

const CATEGORY_ORDER: IngredientCategory[] = ['蔬果类', '肉蛋类', '主食类', '调料类', '其他'];

export function buildShoppingList(plan: DayPlan[]): Map<IngredientCategory, ShoppingItem[]> {
  // Accumulate items by name|amount (same ingredient with different amounts stays separate)
  const itemMap = new Map<string, ShoppingItem>();

  for (const day of plan) {
    for (const meal of day.meals) {
      const entries = mealIngredientsMap[meal.title];

      if (entries && entries.length > 0) {
        for (const entry of entries) {
          const key = `${entry.name}|${entry.amount}`;
          const existing = itemMap.get(key);
          if (existing) {
            existing.servings += 1;
            existing.displayAmount = `${existing.amount} × ${existing.servings} 份`;
          } else {
            itemMap.set(key, {
              name: entry.name,
              category: entry.category,
              amount: entry.amount,
              servings: 1,
              displayAmount: entry.amount,
            });
          }
        }
      } else {
        // Placeholder for unmatched meal
        const placeholderName = `${meal.title} 所需食材`;
        const key = `${placeholderName}|适量`;
        const existing = itemMap.get(key);
        if (existing) {
          existing.servings += 1;
          existing.displayAmount = `${existing.amount} × ${existing.servings} 份`;
        } else {
          itemMap.set(key, {
            name: placeholderName,
            category: '其他',
            amount: '适量',
            servings: 1,
            displayAmount: '适量',
          });
        }
      }
    }
  }

  // Group by category in fixed order
  const result = new Map<IngredientCategory, ShoppingItem[]>();

  for (const category of CATEGORY_ORDER) {
    const items = Array.from(itemMap.values()).filter((item) => item.category === category);
    if (items.length > 0) {
      result.set(category, items);
    }
  }

  return result;
}
