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
