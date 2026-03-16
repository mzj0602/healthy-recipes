import { atom } from 'jotai';
import { mockRecipes } from '@/features/recipes/data/mockRecipes';
import type { NutritionFocus } from '@/shared/types/recipe';

export const recipesAtom = atom(mockRecipes);
export const searchAtom = atom('');
export const maxCookTimeAtom = atom(35);
export const focusAtom = atom<'all' | NutritionFocus>('all');
export const selectedTagsAtom = atom<string[]>([]);
export const selectedRecipeIdAtom = atom(mockRecipes[0]?.id ?? '');

export const availableTagsAtom = atom((get) => {
  const tags = new Set<string>();

  for (const recipe of get(recipesAtom)) {
    for (const tag of recipe.tags) {
      tags.add(tag);
    }
  }

  return [...tags];
});

export const filteredRecipesAtom = atom((get) => {
  const recipes = get(recipesAtom);
  const search = get(searchAtom).trim().toLowerCase();
  const maxCookTime = get(maxCookTimeAtom);
  const focus = get(focusAtom);
  const selectedTags = get(selectedTagsAtom);

  return recipes.filter((recipe) => {
    const matchSearch =
      search.length === 0 ||
      recipe.name.toLowerCase().includes(search) ||
      recipe.description.toLowerCase().includes(search);
    const matchCookTime = recipe.cookTime <= maxCookTime;
    const matchFocus = focus === 'all' || recipe.focus === focus;
    const matchTags =
      selectedTags.length === 0 || selectedTags.every((tag) => recipe.tags.includes(tag));

    return matchSearch && matchCookTime && matchFocus && matchTags;
  });
});

export const selectedRecipeAtom = atom((get) => {
  const selectedRecipeId = get(selectedRecipeIdAtom);
  const filteredRecipes = get(filteredRecipesAtom);

  return (
    filteredRecipes.find((recipe) => recipe.id === selectedRecipeId) ??
    filteredRecipes[0] ??
    null
  );
});
