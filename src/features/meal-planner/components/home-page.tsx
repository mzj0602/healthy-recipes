import type { Recipe } from '@/shared/types/recipe';

interface HomePageProps {
  recipes: Recipe[];
  onBrowseRecipes: () => void;
  onOpenPlan: () => void;
}

const categoryItems = [
  { label: '生酮友好', img: '/images/cat-keto.jpg' },
  { label: '纯素食', img: '/images/cat-vegan.jpg' },
  { label: '无麸质', img: '/images/cat-gluten-free.jpg' },
  { label: '古法饮食', img: '/images/cat-paleo.jpg' },
  { label: '奶昔', img: '/images/cat-smoothies.jpg' },
  { label: '新鲜沙拉', img: '/images/cat-salads.jpg' },
];

const blogArticles = [
  {
    category: '营养',
    authorInitials: 'SG',
    title: '适合忙碌职场人士的5个备餐技巧',
    desc: '通过简单的周日准备策略，节省时间并保持饮食计划。',
    author: 'Sarah Green 博士 • 5 分钟阅读',
    img: '/images/blog-meal-prep.jpg',
  },
  {
    category: '康养',
    authorInitials: 'MT',
    title: '水分补给与能量的科学',
    desc: '了解水分摄入如何直接影响您的代谢率和专注力。',
    author: 'Mark Thompson • 8 分钟阅读',
    img: '/images/blog-hydration.jpg',
  },
  {
    category: '生活方式',
    authorInitials: 'ER',
    title: '为什么吃当季食物对健康很重要',
    desc: '更好的口感、更高的营养价值，并且支持当地农户 —— 这就是季节性的优势。',
    author: 'Elena Rossi • 4 分钟阅读',
    img: '/images/blog-seasonal.jpg',
  },
];

export function HomePage({ onBrowseRecipes, onOpenPlan }: HomePageProps) {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-[650px] flex items-center overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url(/images/featured-quinoa-bowl.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-2xl bg-black/20 backdrop-blur-xl p-10 md:p-14 rounded-[8px] border border-white/10">
            <span className="inline-block px-4 py-1.5 bg-[#ec7f13] text-white text-xs font-black uppercase tracking-[0.2em] rounded mb-6">
              2024夏季
            </span>
            <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-8 leading-[1.1]">
              用新鲜开启<span className="text-[#ec7f13]">健康生活</span>
            </h1>
            <p className="text-xl text-white/90 mb-10 max-w-lg leading-relaxed">
              发现成千上万由厨师精心设计的菜谱，旨在提升您的能量，让您保持最佳状态。
            </p>
            <div className="flex flex-wrap gap-5">
              <button
                className="px-10 py-4 bg-[#ec7f13] hover:bg-[#c7670b] text-white font-black rounded-[8px] shadow-xl transition-all transform hover:-translate-y-1"
                onClick={onBrowseRecipes}
                type="button"
              >
                探索菜谱
              </button>
              <button
                className="px-10 py-4 bg-white/10 hover:bg-white/20 text-white font-bold rounded-[8px] backdrop-blur-md transition-all border border-white/30"
                onClick={onOpenPlan}
                type="button"
              >
                查看饮食计划
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Today's Recommendation */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="flex items-end justify-between mb-12">
            <div>
              <h2 className="text-4xl font-extrabold text-gray-900 mb-3 tracking-tight">今日推荐</h2>
              <div className="h-2 w-24 bg-[#ec7f13] rounded-full" />
            </div>
            <button
              className="text-[#ec7f13] font-bold hover:text-[#c7670b] transition-colors flex items-center gap-2"
              onClick={onBrowseRecipes}
              type="button"
            >
              查看每日菜单 <span className="text-xl">→</span>
            </button>
          </div>
          <div
            className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center bg-white rounded-[8px] p-8 md:p-12"
            style={{ boxShadow: '0 10px 40px -10px rgba(0,0,0,0.08), 0 4px 20px -5px rgba(236,127,19,0.05)' }}
          >
            <div className="relative group overflow-hidden rounded-[8px] shadow-lg">
              <img
                alt="地中海藜麦能量碗"
                className="w-full h-[450px] object-cover transition-transform duration-700 group-hover:scale-105"
                src="/images/featured-quinoa-bowl.jpg"
              />
              <div className="absolute top-6 left-6 bg-[#ec7f13] px-4 py-1.5 rounded-[8px] text-sm font-black text-white shadow-lg">
                450 千卡
              </div>
            </div>
            <div className="space-y-8">
              <div className="flex gap-3">
                <span className="px-4 py-1.5 bg-[#fde6d0] text-[#c7670b] text-[10px] font-black uppercase tracking-widest rounded-full">纯素</span>
                <span className="px-4 py-1.5 bg-[#fde6d0] text-[#c7670b] text-[10px] font-black uppercase tracking-widest rounded-full">高蛋白</span>
              </div>
              <h3 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight">地中海藜麦能量碗</h3>
              <p className="text-gray-500 text-lg leading-relaxed font-medium">
                富含烤鹰嘴豆、黄瓜、圣女果以及清爽的柠檬芝麻酱。这款营养均衡的午餐能让您在整个下午保持充沛活力。
              </p>
              <div className="grid grid-cols-3 gap-6 py-8 border-y border-gray-100">
                <div>
                  <p className="text-gray-400 text-xs uppercase font-black tracking-widest mb-1">准备时间</p>
                  <p className="text-gray-900 font-extrabold text-lg">15分钟</p>
                </div>
                <div>
                  <p className="text-gray-400 text-xs uppercase font-black tracking-widest mb-1">难度</p>
                  <p className="text-gray-900 font-extrabold text-lg">简单</p>
                </div>
                <div>
                  <p className="text-gray-400 text-xs uppercase font-black tracking-widest mb-1">份量</p>
                  <p className="text-gray-900 font-extrabold text-lg">2人份</p>
                </div>
              </div>
              <button
                className="w-full md:w-auto px-10 py-4 bg-[#ec7f13] hover:bg-[#c7670b] text-white font-black rounded-[8px] shadow-lg transition-all transform hover:-translate-y-0.5"
                onClick={onBrowseRecipes}
                type="button"
              >
                获取菜谱
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Trending Categories */}
      <section className="py-24">
        <div className="container mx-auto px-4 text-center mb-16">
          <h2 className="text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">热门分类</h2>
          <p className="text-gray-500 max-w-xl mx-auto text-lg font-medium">浏览我们受欢迎的特定饮食集合，开启您的健康生活方式</p>
        </div>
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8">
            {categoryItems.map((cat) => (
              <div className="group block text-center cursor-pointer" key={cat.label}>
                <div
                  className="aspect-square bg-white rounded-[8px] flex items-center justify-center mb-6 transition-all group-hover:bg-[#ec7f13] overflow-hidden"
                  style={{ boxShadow: '0 10px 40px -10px rgba(0,0,0,0.08), 0 4px 20px -5px rgba(236,127,19,0.05)' }}
                >
                  <img alt={cat.label} className="w-24 h-24 object-contain group-hover:brightness-110 transition-all" src={cat.img} />
                </div>
                <span className="font-bold text-gray-900 text-lg group-hover:text-[#ec7f13] transition-colors">{cat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Latest Healthy Tips */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-16">
            <h2 className="text-4xl font-extrabold text-gray-900 tracking-tight">最新健康建议</h2>
            <button className="text-sm font-black text-[#ec7f13] hover:text-[#c7670b] uppercase tracking-[0.2em] transition-colors" type="button">
              阅读所有文章
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {blogArticles.map((article) => (
              <article
                className="bg-white rounded-[8px] overflow-hidden group cursor-pointer"
                key={article.title}
                style={{ boxShadow: '0 10px 40px -10px rgba(0,0,0,0.08), 0 4px 20px -5px rgba(236,127,19,0.05)' }}
              >
                <div className="h-56 overflow-hidden">
                  <img
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    src={article.img}
                  />
                </div>
                <div className="p-8">
                  <p className="text-[#ec7f13] text-xs font-black uppercase tracking-widest mb-3">{article.category}</p>
                  <h4 className="text-2xl font-extrabold text-gray-900 mb-4 group-hover:text-[#ec7f13] transition-colors leading-snug">{article.title}</h4>
                  <p className="text-gray-500 text-base mb-6 leading-relaxed font-medium">{article.desc}</p>
                  <div className="flex items-center gap-3 pt-6 border-t border-gray-50">
                    <div className="w-10 h-10 rounded-full bg-[#fde6d0] flex items-center justify-center font-bold text-[#ec7f13]">
                      {article.authorInitials}
                    </div>
                    <span className="text-xs font-bold text-gray-700 uppercase tracking-tighter">{article.author}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-24 bg-[#ec7f13] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-black/5 rounded-full -ml-24 -mb-24" />
        <div className="container mx-auto px-4 max-w-4xl text-center relative z-10">
          <h2 className="text-4xl font-black text-white mb-6 tracking-tight">加入我们的健康社区</h2>
          <p className="text-white/90 mb-10 text-lg font-medium">每周直接在收件箱中接收菜谱、饮食计划和健康建议。</p>
          <form className="flex flex-col md:flex-row gap-4 max-w-lg mx-auto">
            <input
              className="flex-1 rounded-[8px] border-none py-4 px-6 focus:ring-2 focus:ring-white/50 bg-white/10 text-white placeholder:text-white/60 backdrop-blur-md outline-none"
              placeholder="输入您的邮箱"
              required
              type="email"
            />
            <button
              className="px-10 py-4 bg-white text-[#ec7f13] font-black rounded-[8px] hover:bg-gray-50 transition-all shadow-xl"
              type="submit"
            >
              立即订阅
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
