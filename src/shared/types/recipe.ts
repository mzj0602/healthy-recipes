export type NutritionFocus = 'high-protein' | 'low-carb' | 'gut-friendly' | 'balanced';

export interface Recipe {
  id: string;
  name: string;
  description: string;
  cookTime: number;
  calories: number;
  protein: number;
  focus: NutritionFocus;
  difficulty: 'easy' | 'medium';
  tags: string[];
  ingredients: string[];
  steps: string[];
}
