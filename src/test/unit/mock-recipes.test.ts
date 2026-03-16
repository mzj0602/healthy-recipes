import { describe, it, expect } from 'vitest';
import { mockRecipes } from '@/features/recipes/data/mockRecipes';

describe('mockRecipes data', () => {
  it('contains 4 recipes', () => {
    expect(mockRecipes).toHaveLength(4);
  });

  it('each recipe has required fields', () => {
    mockRecipes.forEach((recipe) => {
      expect(recipe.id).toBeTruthy();
      expect(recipe.name).toBeTruthy();
      expect(recipe.description).toBeTruthy();
      expect(recipe.cookTime).toBeGreaterThan(0);
      expect(recipe.calories).toBeGreaterThan(0);
      expect(recipe.protein).toBeGreaterThan(0);
      expect(Array.isArray(recipe.ingredients)).toBe(true);
      expect(Array.isArray(recipe.steps)).toBe(true);
    });
  });

  it('each recipe has at least 1 ingredient and 1 step', () => {
    mockRecipes.forEach((recipe) => {
      expect(recipe.ingredients.length).toBeGreaterThan(0);
      expect(recipe.steps.length).toBeGreaterThan(0);
    });
  });

  it('contains miso-salmon-bowl recipe', () => {
    const recipe = mockRecipes.find((r) => r.id === 'miso-salmon-bowl');
    expect(recipe).toBeDefined();
    expect(recipe?.name).toBe('味噌三文鱼能量碗');
    expect(recipe?.calories).toBe(520);
  });

  it('difficulty is valid enum value', () => {
    const validDifficulties = ['easy', 'medium', 'hard'];
    mockRecipes.forEach((recipe) => {
      expect(validDifficulties).toContain(recipe.difficulty);
    });
  });
});
