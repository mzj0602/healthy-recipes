import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import {
  availableTagsAtom,
  filteredRecipesAtom,
  focusAtom,
  maxCookTimeAtom,
  searchAtom,
  selectedRecipeAtom,
  selectedRecipeIdAtom,
  selectedTagsAtom,
} from '@/features/recipes/store/recipeAtoms';
import { Button } from '@/components/ui/button';
import { RecipeCard } from '@/features/recipes/components/RecipeCard';

const focusOptions = [
  { label: '全部目标', value: 'all' },
  { label: '高蛋白', value: 'high-protein' },
  { label: '低碳', value: 'low-carb' },
  { label: '护肠胃', value: 'gut-friendly' },
  { label: '均衡', value: 'balanced' },
] as const;

export function RecipeExplorer() {
  const [search, setSearch] = useAtom(searchAtom);
  const [maxCookTime, setMaxCookTime] = useAtom(maxCookTimeAtom);
  const [focus, setFocus] = useAtom(focusAtom);
  const [selectedTags, setSelectedTags] = useAtom(selectedTagsAtom);
  const recipes = useAtomValue(filteredRecipesAtom);
  const availableTags = useAtomValue(availableTagsAtom);
  const selectedRecipe = useAtomValue(selectedRecipeAtom);
  const setSelectedRecipeId = useSetAtom(selectedRecipeIdAtom);

  const toggleTag = (tag: string) => {
    setSelectedTags((current) =>
      current.includes(tag) ? current.filter((item) => item !== tag) : [...current, tag],
    );
  };

  return (
    <main className="shell">
      <section className="hero">
        <span className="hero__eyebrow">Healthy Recipe Starter</span>
        <h1 className="hero__heading">吃得干净，也要吃得有设计感。</h1>
        <p className="hero__summary">
          这版先用 Vite + React + TypeScript + Jotai
          建一个轻量骨架，后面可以继续接菜谱详情、每周计划、购物清单和 AI 推荐。
        </p>
        <div className="hero__stats">
          <div className="stat-card">
            <strong>{recipes.length}</strong>
            <span>当前可筛选菜谱</span>
          </div>
          <div className="stat-card">
            <strong>Jotai</strong>
            <span>全局筛选与选中态</span>
          </div>
          <div className="stat-card">
            <strong>Feature-first</strong>
            <span>适合后续继续拆模块</span>
          </div>
        </div>
      </section>

      <section className="workspace">
        <aside className="filters panel">
          <h2 className="panel__title">筛选器</h2>
          <p className="panel__copy">先把“找菜谱”这个最小闭环搭起来，再逐步加周计划和备餐能力。</p>

          <div className="field">
            <label htmlFor="search">搜索菜谱</label>
            <input
              id="search"
              onChange={(event) => setSearch(event.target.value)}
              placeholder="例如 高蛋白、早餐、三文鱼"
              type="search"
              value={search}
            />
          </div>

          <div className="field">
            <label htmlFor="focus">营养目标</label>
            <select
              id="focus"
              onChange={(event) => setFocus(event.target.value as typeof focus)}
              value={focus}
            >
              {focusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="field">
            <label htmlFor="max-cook-time">最大烹饪时长: {maxCookTime} 分钟</label>
            <input
              id="max-cook-time"
              max={60}
              min={10}
              onChange={(event) => setMaxCookTime(Number(event.target.value))}
              type="range"
              value={maxCookTime}
            />
          </div>

          <fieldset className="field">
            <legend>标签</legend>
            <div className="tag-grid">
              {availableTags.map((tag) => (
                <button
                  className="tag-chip"
                  data-active={selectedTags.includes(tag)}
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  type="button"
                >
                  {tag}
                </button>
              ))}
            </div>
          </fieldset>
        </aside>

        <div className="content">
          <div className="content__header">
            <div>
              <h2 className="panel__title">推荐菜谱</h2>
              <p className="panel__copy">当前是 mock 数据，后续接 API 或 CMS 时不用大改结构。</p>
            </div>
            <Button
              className="ghost-button"
              onClick={() => {
                setSearch('');
                setFocus('all');
                setMaxCookTime(35);
                setSelectedTags([]);
              }}
              type="button"
              variant="ghost"
            >
              重置筛选
            </Button>
          </div>

          {recipes.length > 0 ? (
            <div className="content__grid">
              {recipes.map((recipe) => (
                <RecipeCard
                  isActive={selectedRecipe?.id === recipe.id}
                  key={recipe.id}
                  onSelect={setSelectedRecipeId}
                  recipe={recipe}
                />
              ))}
            </div>
          ) : (
            <div className="empty-state panel">
              没有符合条件的菜谱。后续这里可以接“放宽条件”建议或 AI 替代推荐。
            </div>
          )}

          {selectedRecipe ? (
            <section className="recipe-detail panel">
              <div>
                <h2 className="panel__title">{selectedRecipe.name}</h2>
                <p className="panel__copy">{selectedRecipe.description}</p>
              </div>
              <div className="recipe-detail__meta">
                <span className="pill">{selectedRecipe.cookTime} 分钟</span>
                <span className="pill">{selectedRecipe.calories} kcal</span>
                <span className="pill">{selectedRecipe.protein}g 蛋白</span>
              </div>
              <div className="recipe-detail__section">
                <h3>食材</h3>
                <ul>
                  {selectedRecipe.ingredients.map((ingredient) => (
                    <li key={ingredient}>{ingredient}</li>
                  ))}
                </ul>
              </div>
              <div className="recipe-detail__section">
                <h3>做法</h3>
                <ul>
                  {selectedRecipe.steps.map((step) => (
                    <li key={step}>{step}</li>
                  ))}
                </ul>
              </div>
            </section>
          ) : null}
        </div>
      </section>
    </main>
  );
}
