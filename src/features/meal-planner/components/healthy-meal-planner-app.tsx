import { useState } from 'react';
import { PageShell } from '@/components/layout/page-shell';
import { mockRecipes } from '@/features/recipes/data/mockRecipes';
import { HomePage } from '@/features/meal-planner/components/home-page';
import { RecipeExplorePage } from '@/features/meal-planner/components/recipe-explore-page';
import { RecipeDetailPage } from '@/features/meal-planner/components/recipe-detail-page';
import { HealthPlanPage } from '@/features/health-plan/components/health-plan-page';
import { SiteChrome } from '@/features/meal-planner/components/site-chrome';
import { SiteFooterBlock } from '@/features/meal-planner/components/site-footer-block';
import type { PlannerPageId } from '@/features/meal-planner/types';

export function HealthyMealPlannerApp() {
  const [activePage, setActivePage] = useState<PlannerPageId>('home');
  const [selectedRecipeId, setSelectedRecipeId] = useState(mockRecipes[0]?.id ?? '');

  const selectedRecipe =
    mockRecipes.find((recipe) => recipe.id === selectedRecipeId) ?? mockRecipes[0] ?? null;

  return (
    <PageShell className="flex flex-col">
      <SiteChrome activePage={activePage} onNavigate={setActivePage} />

      <div className="flex-1 space-y-5 px-4 py-4 sm:px-6 sm:py-5">
        {activePage === 'home' ? (
          <HomePage
            onBrowseRecipes={() => setActivePage('recipes')}
            onOpenPlan={() => setActivePage('plan')}
            recipes={mockRecipes}
          />
        ) : null}

        {activePage === 'recipes' ? (
          <RecipeExplorePage
            onOpenPlan={() => setActivePage('plan')}
            onSelectRecipe={(recipeId) => {
              setSelectedRecipeId(recipeId);
              setActivePage('detail');
            }}
            recipes={mockRecipes}
          />
        ) : null}

        {activePage === 'detail' && selectedRecipe ? (
          <RecipeDetailPage
            onOpenPlan={() => setActivePage('plan')}
            recipe={selectedRecipe}
          />
        ) : null}

        {activePage === 'plan' ? <HealthPlanPage embedded /> : null}
      </div>

      <SiteFooterBlock />
    </PageShell>
  );
}
