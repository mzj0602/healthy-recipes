import type { Recipe } from '@/shared/types/recipe';
import { Button } from '@/components/ui/button';

interface RecipeCardProps {
  recipe: Recipe;
  isActive: boolean;
  onSelect: (recipeId: string) => void;
}

export function RecipeCard({ recipe, isActive, onSelect }: RecipeCardProps) {
  return (
    <article
      className="recipe-card panel"
      style={{
        outline: isActive ? '2px solid rgba(63, 125, 58, 0.35)' : 'none',
      }}
    >
      <div className="recipe-card__top">
        <span className="pill">{recipe.focus}</span>
        <span className="pill">{recipe.difficulty}</span>
      </div>
      <div>
        <h3 className="recipe-card__title">{recipe.name}</h3>
        <p className="recipe-card__description">{recipe.description}</p>
      </div>
      <div className="recipe-card__meta">
        <span className="pill">{recipe.cookTime} 分钟</span>
        <span className="pill">{recipe.calories} kcal</span>
        <span className="pill">{recipe.protein}g 蛋白</span>
      </div>
      <div className="recipe-card__footer">
        <div className="recipe-card__meta">
          {recipe.tags.slice(0, 2).map((tag) => (
            <span className="pill" key={tag}>
              {tag}
            </span>
          ))}
        </div>
        <Button
          className="recipe-card__button"
          onClick={() => onSelect(recipe.id)}
          type="button"
        >
          查看详情
        </Button>
      </div>
    </article>
  );
}
