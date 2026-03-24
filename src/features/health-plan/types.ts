export type IngredientCategory = '蔬果类' | '肉蛋类' | '主食类' | '调料类' | '其他';

export interface IngredientEntry {
  name: string;
  amount: string;
  category: IngredientCategory;
}

export interface ShoppingItem {
  name: string;
  category: IngredientCategory;
  amount: string;
  servings: number;
  displayAmount: string;
}

export interface NutrientGoal {
  id: string;
  label: string;
  valueLabel: string;
  percent: number;
}

export interface MealItem {
  id: string;
  type: string;
  title: string;
  calories: number;
}

export interface DayPlan {
  id: string;
  day: string;
  meals: MealItem[];
  accent: 'dark' | 'brand' | 'brand-light' | 'soft';
}
