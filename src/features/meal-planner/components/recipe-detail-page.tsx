import type { Recipe } from '@/shared/types/recipe';
import { recipeMedia } from '@/features/meal-planner/data/recipe-media';

interface RecipeDetailPageProps {
  recipe: Recipe;
  onOpenPlan: () => void;
}

const stepImages = [
  '/images/detail-step1.jpg',
  '/images/detail-step2.jpg',
  '/images/detail-step3.jpg',
];

const nutritionRows = [
  { label: '蛋白质', value: '38g' },
  { label: '总脂肪', value: '28g' },
  { label: '碳水化合物', value: '4g' },
  { label: '纤维', value: '1g' },
  { label: '钠', value: '140mg' },
];

export function RecipeDetailPage({ recipe, onOpenPlan }: RecipeDetailPageProps) {
  return (
    <div className="bg-[#F9F8F6]">
      <main className="max-w-5xl mx-auto px-4 py-8">
        {/* Hero */}
        <section className="mb-12">
          <div className="relative w-full h-[400px] md:h-[500px] overflow-hidden rounded-[8px] shadow-lg mb-6">
            <img alt={recipe.name} className="w-full h-full object-cover" src={recipeMedia[recipe.id] ?? '/images/detail-roast-chicken.jpg'} />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
              <div className="p-8 text-white">
                <div className="flex gap-2 mb-4">
                  <span className="bg-[#ec7f13] text-white px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase">
                    {focusLabel(recipe.focus)}
                  </span>
                  <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase">
                    {difficultyLabel(recipe.difficulty)}
                  </span>
                </div>
                <h1 className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight">{recipe.name}</h1>
                <div className="flex items-center gap-6 text-sm font-medium">
                  <div className="flex items-center gap-2">
                    <span className="text-[#fbe5cf]">★★★★☆</span>
                    <span>(128 条评论)</span>
                  </div>
                  <div>🕒 {recipe.cookTime} 分钟</div>
                  <div>🔥 {recipe.calories} kcal</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Left: Ingredients + Steps */}
          <div className="lg:col-span-2 space-y-12">
            {/* Ingredients */}
            <section>
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <span className="w-8 h-8 bg-[#ec7f13] text-white rounded-full flex items-center justify-center text-sm font-bold">1</span>
                食材清单
              </h2>
              <div className="bg-white p-6 rounded-[8px] border border-slate-100 shadow-sm">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {recipe.ingredients.map((ingredient) => (
                    <label
                      className="flex items-center space-x-3 cursor-pointer p-2 hover:bg-orange-50 rounded transition-colors group"
                      key={ingredient}
                    >
                      <input className="rounded text-[#ec7f13] focus:ring-[#ec7f13] w-5 h-5 border-slate-300" type="checkbox" />
                      <span className="text-slate-700 group-hover:text-[#ec7f13] transition-colors">{ingredient}</span>
                    </label>
                  ))}
                </div>
                <button
                  className="mt-8 w-full py-3 bg-white border-2 border-[#ec7f13] text-[#ec7f13] font-bold rounded-[8px] hover:bg-[#ec7f13] hover:text-white transition-all"
                  onClick={onOpenPlan}
                  type="button"
                >
                  全部加入购物清单
                </button>
              </div>
            </section>

            {/* Steps */}
            <section>
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <span className="w-8 h-8 bg-[#ec7f13] text-white rounded-full flex items-center justify-center text-sm font-bold">2</span>
                烹饪步骤
              </h2>
              <div className="space-y-8">
                {recipe.steps.map((step, index) => (
                  <div className="flex flex-col md:flex-row gap-6 bg-white p-4 rounded-[8px] border border-slate-100 shadow-sm" key={index}>
                    <div className="md:w-1/3">
                      <img
                        alt={`步骤 ${index + 1}`}
                        className="w-full h-48 object-cover rounded-[8px] shadow-sm"
                        src={stepImages[index % stepImages.length]}
                      />
                    </div>
                    <div className="md:w-2/3">
                      <h3 className="text-lg font-bold mb-2 text-slate-800">步骤 {index + 1}</h3>
                      <p className="text-slate-600 leading-relaxed">{step}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Right: Nutritional Facts */}
          <div className="space-y-8">
            <section className="bg-slate-900 text-white p-6 rounded-[8px] sticky top-24 shadow-md">
              <h2 className="text-xl font-bold mb-6 pb-2 border-b border-white/20">营养成分表</h2>
              <p className="text-xs text-slate-400 mb-4 italic">每份 (约200克)</p>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-slate-300">热量</span>
                  <span className="font-bold text-xl text-[#ec7f13]">{recipe.calories} kcal</span>
                </div>
                <div className="h-[1px] bg-white/10 w-full" />
                {nutritionRows.map((row) => (
                  <div className="flex justify-between items-center" key={row.label}>
                    <span className="font-medium text-slate-300">{row.label}</span>
                    <span className="font-bold text-lg">{row.value}</span>
                  </div>
                ))}
              </div>
              <div className="mt-8 p-4 bg-white/5 rounded text-xs leading-relaxed text-slate-400">
                * 每日营养摄入百分比基于 2,000 卡路里的饮食。根据您的热量需求，您的每日摄入值可能会更高或更低。
              </div>
            </section>
          </div>
        </div>

        {/* Reviews */}
        <section className="mt-16 pt-16 border-t border-slate-200">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <h2 className="text-2xl font-bold">评论与评分</h2>
            <button
              className="bg-[#ec7f13] text-white px-6 py-2 rounded-[8px] font-bold hover:bg-[#c76a0d] transition-all shadow-md"
              onClick={onOpenPlan}
              type="button"
            >
              撰写评论
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-[8px] border border-slate-100 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-[#ec7f13] text-white flex items-center justify-center font-bold">JD</div>
                <div>
                  <p className="font-bold">Jane Doe</p>
                  <div className="text-xs text-[#ec7f13]">★★★★★</div>
                </div>
                <span className="ml-auto text-xs text-slate-400">2天前</span>
              </div>
              <p className="text-slate-600 text-sm leading-relaxed">
                绝对美味！鸡肉非常多汁，柠檬蒜香充满了整个房子。这绝对会成为我周日晚餐的常客。
              </p>
            </div>
            <div className="bg-white p-6 rounded-[8px] border border-slate-100 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center font-bold">MS</div>
                <div>
                  <p className="font-bold">Mark Smith</p>
                  <div className="text-xs text-[#ec7f13]">★★★★☆</div>
                </div>
                <span className="ml-auto text-xs text-slate-400">1周前</span>
              </div>
              <p className="text-slate-600 text-sm leading-relaxed">
                很棒的食谱。我加了一些小土豆在烤盘里，它们吸收了所有的汁液。强烈推荐加土豆！
              </p>
            </div>
          </div>
          <div className="mt-8 text-center">
            <button className="text-[#ec7f13] font-bold text-sm hover:text-[#c76a0d] underline underline-offset-4" type="button">
              加载更多评论
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

function difficultyLabel(level: Recipe['difficulty']) {
  return { easy: '简单', medium: '中等' }[level];
}
