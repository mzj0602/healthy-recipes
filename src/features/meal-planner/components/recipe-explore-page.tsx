import { useMemo } from 'react';
import { useAtom } from 'jotai';
import type { Recipe } from '@/shared/types/recipe';
import { recipeMedia } from '@/features/meal-planner/data/recipe-media';
import { AiSuggestPanel } from '@/features/recipes/components/AiSuggestPanel';
import { searchAtom } from '@/features/recipes/store/recipeAtoms';

interface RecipeExplorePageProps {
  recipes: Recipe[];
  onSelectRecipe: (recipeId: string) => void;
  onOpenPlan: () => void;
}

export function RecipeExplorePage({ recipes, onSelectRecipe, onAddAiRecipe }: RecipeExplorePageProps & { onAddAiRecipe?: (recipe: Recipe) => void }) {
  const [query, setQuery] = useAtom(searchAtom);

  const filteredRecipes = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return recipes;
    return recipes.filter(
      (r) =>
        r.name.toLowerCase().includes(normalized) ||
        r.description.toLowerCase().includes(normalized) ||
        r.tags.some((t) => t.toLowerCase().includes(normalized)),
    );
  }, [query, recipes]);

  return (
    <div className="bg-[#F9F8F6]">
      {/* Search bar row */}
      <div className="bg-white border-b border-slate-100 px-4 py-3">
        <div className="max-w-7xl mx-auto">
          <div className="relative max-w-2xl">
            <input
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-[8px] focus:ring-2 focus:ring-[#ec7f13] focus:border-[#ec7f13] outline-none text-sm"
              onChange={(e) => setQuery(e.target.value)}
              placeholder="搜索健康菜谱（如：牛油果吐司、三文鱼）..."
              type="text"
              value={query}
            />
            <div className="absolute left-3 top-2.5 text-slate-400">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 py-8 flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <aside className="w-full md:w-64 flex-shrink-0">
          <div className="sticky top-24 space-y-8 bg-white/80 backdrop-blur-sm p-6 rounded-[8px] border border-slate-100 shadow-sm">
            <div>
              <h3 className="font-semibold text-slate-800 mb-4">热量范围</h3>
              <input className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#ec7f13]" max="1500" min="100" step="50" type="range" />
              <div className="flex justify-between text-xs text-slate-500 mt-2">
                <span>100 kcal</span>
                <span>1500+ kcal</span>
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-slate-800 mb-3">排除过敏原</h3>
              <div className="space-y-2">
                {['无麸质', '无奶', '无坚果', '无大豆'].map((item) => (
                  <label className="flex items-center gap-3 text-sm text-slate-600 cursor-pointer" key={item}>
                    <input className="rounded text-[#ec7f13] focus:ring-[#ec7f13] border-slate-300" type="checkbox" />
                    {item}
                  </label>
                ))}
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-slate-800 mb-3">烹饪时间</h3>
              <div className="grid grid-cols-2 gap-2">
                {['15分钟以下', '30分钟以下', '45分钟以下', '60分钟以上'].map((item) => (
                  <button
                    className="px-3 py-1.5 text-xs font-medium border border-slate-200 rounded-[8px] hover:border-[#ec7f13] hover:text-[#ec7f13] transition-colors bg-white"
                    key={item}
                    type="button"
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-slate-800 mb-3">难度</h3>
              <select className="w-full bg-white border border-slate-200 rounded-[8px] text-sm px-3 py-2 focus:ring-[#ec7f13] focus:border-[#ec7f13]">
                <option>所有难度</option>
                <option>初学者</option>
                <option>中级</option>
                <option>高级</option>
              </select>
            </div>
            <button className="w-full py-3 bg-[#ec7f13] text-white font-bold rounded-[8px] hover:bg-[#c1660d] transition-colors mt-4 shadow-lg" type="button">
              应用筛选
            </button>
          </div>
        </aside>

        {/* Recipe Grid */}
        <section className="flex-1">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-slate-800">健康探索</h2>
            <span className="text-sm text-slate-500">展示 {filteredRecipes.length} 个菜谱</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRecipes.map((recipe) => (
              <article
                className="bg-white rounded-[8px] border border-slate-100 shadow-md overflow-hidden recipe-card-hover cursor-pointer group"
                key={recipe.id}
                onClick={() => onSelectRecipe(recipe.id)}
              >
                <div className="relative h-48 w-full">
                  <img alt={recipe.name} className="w-full h-full object-cover" src={recipeMedia[recipe.id]} />
                  <div className="absolute top-3 right-3 bg-[#ec7f13] px-2 py-1 rounded-[8px] text-[10px] font-bold text-white uppercase tracking-wider">
                    {focusLabel(recipe.focus)}
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-lg text-slate-800 mb-2 leading-tight group-hover:text-[#ec7f13] transition-colors">{recipe.name}</h3>
                  <div className="flex items-center gap-4 text-sm text-slate-500">
                    <span className="flex items-center gap-1">
                      <svg className="h-4 w-4 text-[#ec7f13]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M13 10V3L4 14h7v7l9-11h-7z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                      </svg>
                      {recipe.calories} kcal
                    </span>
                    <span className="flex items-center gap-1">
                      <svg className="h-4 w-4 text-[#ec7f13]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                      </svg>
                      {recipe.cookTime} 分钟
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* Pagination */}
          <div className="mt-8">
            <AiSuggestPanel onAdd={(recipe) => onAddAiRecipe?.(recipe)} />
          </div>

          <div className="mt-12 flex justify-center items-center gap-2">
            {['1', '2', '3'].map((p) => (
              <button
                className={p === '2'
                  ? 'w-10 h-10 flex items-center justify-center rounded-[8px] bg-[#ec7f13] border border-[#ec7f13] text-white font-bold shadow-md'
                  : 'w-10 h-10 flex items-center justify-center rounded-[8px] border border-slate-200 hover:border-[#ec7f13] hover:text-[#ec7f13] transition-all bg-white'}
                key={p}
                type="button"
              >
                {p}
              </button>
            ))}
            <span className="mx-2 text-slate-400">...</span>
            <button className="w-10 h-10 flex items-center justify-center rounded-[8px] border border-slate-200 hover:border-[#ec7f13] hover:text-[#ec7f13] transition-all bg-white" type="button">
              12
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}

function focusLabel(focus: Recipe['focus']) {
  return { 'high-protein': '高蛋白', 'gut-friendly': '肠道友好', 'low-carb': '低碳水', balanced: '均衡' }[focus];
}
