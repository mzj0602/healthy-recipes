import { NutritionGoalsCard } from '@/features/health-plan/components/nutrition-goals-card';
import { WeekPlanBoard } from '@/features/health-plan/components/week-plan-board';
import { nutrientGoals, weeklyPlan } from '@/features/health-plan/data/weekly-plan';

interface HealthPlanPageProps {
  embedded?: boolean;
}

export function HealthPlanPage({ embedded = false }: HealthPlanPageProps) {
  return (
    <div className="bg-[#F9F8F6]">
      {!embedded && (
        <header className="bg-white border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">个人健康饮食计划</h1>
              <p className="text-sm text-slate-500">跟踪您的营养状况，坚持一周计划</p>
            </div>
            <div className="flex items-center gap-3">
              <button className="px-4 py-2 bg-white border border-slate-300 rounded-[8px] text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors">
                编辑计划
              </button>
              <button className="px-4 py-2 bg-[#ec7f13] text-white rounded-[8px] text-sm font-bold shadow-sm hover:bg-[#cc6a0a] transition-colors">
                生成购物清单
              </button>
            </div>
          </div>
        </header>
      )}
      {embedded && (
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">个人健康饮食计划</h1>
            <p className="text-sm text-slate-500">跟踪您的营养状况，坚持一周计划</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="px-4 py-2 bg-white border border-slate-300 rounded-[8px] text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors">
              编辑计划
            </button>
            <button className="px-4 py-2 bg-[#ec7f13] text-white rounded-[8px] text-sm font-bold shadow-sm hover:bg-[#cc6a0a] transition-colors">
              生成购物清单
            </button>
          </div>
        </div>
      )}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <section className="mb-8">
          <NutritionGoalsCard goals={nutrientGoals} />
        </section>
        <section className="overflow-x-auto">
          <WeekPlanBoard days={weeklyPlan} />
        </section>
      </main>
      {!embedded && (
        <footer className="bg-white border-t border-slate-200 mt-8 py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-slate-500">
            © 2023 个人健康饮食计划。保持营养，健康生活。
          </div>
        </footer>
      )}
    </div>
  );
}
