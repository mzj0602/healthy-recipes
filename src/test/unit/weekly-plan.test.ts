import { describe, it, expect } from 'vitest';
import { weeklyPlan, nutrientGoals } from '@/features/health-plan/data/weekly-plan';

describe('weeklyPlan data', () => {
  it('contains 7 days', () => {
    expect(weeklyPlan).toHaveLength(7);
  });

  it('each day has 4 meals', () => {
    weeklyPlan.forEach((day) => {
      expect(day.meals).toHaveLength(4);
    });
  });

  it('each meal has type, title and calories', () => {
    weeklyPlan.forEach((day) => {
      day.meals.forEach((meal) => {
        expect(meal.type).toBeTruthy();
        expect(meal.title).toBeTruthy();
        expect(meal.calories).toBeGreaterThan(0);
      });
    });
  });

  it('monday has dark accent', () => {
    const monday = weeklyPlan.find((d) => d.id === 'monday');
    expect(monday?.accent).toBe('dark');
  });

  it('tuesday has brand accent', () => {
    const tuesday = weeklyPlan.find((d) => d.id === 'tuesday');
    expect(tuesday?.accent).toBe('brand');
  });

  it('wednesday has brand-light accent', () => {
    const wednesday = weeklyPlan.find((d) => d.id === 'wednesday');
    expect(wednesday?.accent).toBe('brand-light');
  });

  it('thursday has soft accent', () => {
    const thursday = weeklyPlan.find((d) => d.id === 'thursday');
    expect(thursday?.accent).toBe('soft');
  });
});

describe('nutrientGoals data', () => {
  it('contains 3 goals', () => {
    expect(nutrientGoals).toHaveLength(3);
  });

  it('all percents are between 0 and 100', () => {
    nutrientGoals.forEach((goal) => {
      expect(goal.percent).toBeGreaterThanOrEqual(0);
      expect(goal.percent).toBeLessThanOrEqual(100);
    });
  });

  it('includes protein, calories and carbs', () => {
    const ids = nutrientGoals.map((g) => g.id);
    expect(ids).toContain('protein');
    expect(ids).toContain('calories');
    expect(ids).toContain('carbs');
  });
});
