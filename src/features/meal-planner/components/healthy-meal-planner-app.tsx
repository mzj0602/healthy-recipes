import { useEffect, useState } from 'react';
import { PageShell } from '@/components/layout/page-shell';
import { mockRecipes } from '@/features/recipes/data/mockRecipes';
import { HomePage } from '@/features/meal-planner/components/home-page';
import { RecipeExplorePage } from '@/features/meal-planner/components/recipe-explore-page';
import { RecipeDetailPage } from '@/features/meal-planner/components/recipe-detail-page';
import { HealthPlanPage } from '@/features/health-plan/components/health-plan-page';
import { SiteChrome } from '@/features/meal-planner/components/site-chrome';
import { SiteFooterBlock } from '@/features/meal-planner/components/site-footer-block';
import { LoginPage } from '@/features/meal-planner/components/login-page';
import type { PlannerPageId } from '@/features/meal-planner/types';
import type { Recipe } from '@/shared/types/recipe';
import { trpc } from '@/lib/trpc';

const SESSION_STORAGE_KEY = 'healthy-recipes-user';

export function HealthyMealPlannerApp() {
  const [activePage, setActivePage] = useState<PlannerPageId>('home');
  const [recipes, setRecipes] = useState<Recipe[]>(mockRecipes);
  const [selectedRecipeId, setSelectedRecipeId] = useState(mockRecipes[0]?.id ?? '');
  const [currentUser, setCurrentUser] = useState<string | null>(() => {
    if (typeof window === 'undefined') return null;
    return window.sessionStorage.getItem(SESSION_STORAGE_KEY);
  });

  useEffect(() => {
    trpc.recipe.list.query()
      .then((data) => {
        setRecipes(data);
        if (data[0] && !selectedRecipeId) setSelectedRecipeId(data[0].id);
      })
      .catch(() => {
        // Worker unavailable, keep using mockRecipes
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const selectedRecipe =
    recipes.find((recipe) => recipe.id === selectedRecipeId) ?? recipes[0] ?? null;

  function handleLogin({ username }: { username: string }) {
    setCurrentUser(username);
    if (typeof window !== 'undefined') {
      window.sessionStorage.setItem(SESSION_STORAGE_KEY, username);
    }
  }

  function handleLogout() {
    setCurrentUser(null);
    setActivePage('home');
    if (typeof window !== 'undefined') {
      window.sessionStorage.removeItem(SESSION_STORAGE_KEY);
    }
  }

  if (!currentUser) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <PageShell className="flex flex-col">
      <SiteChrome
        activePage={activePage}
        currentUser={currentUser}
        onLogout={handleLogout}
        onNavigate={setActivePage}
      />

      <div className="flex-1 space-y-5 px-4 py-4 sm:px-6 sm:py-5">
        {activePage === 'home' ? (
          <HomePage
            onBrowseRecipes={() => setActivePage('recipes')}
            onOpenPlan={() => setActivePage('plan')}
            recipes={recipes}
          />
        ) : null}

        {activePage === 'recipes' ? (
          <RecipeExplorePage
            onAddAiRecipe={(recipe) => setRecipes((prev) => [...prev, recipe])}
            onOpenPlan={() => setActivePage('plan')}
            onSelectRecipe={(recipeId) => {
              setSelectedRecipeId(recipeId);
              setActivePage('detail');
            }}
            recipes={recipes}
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
