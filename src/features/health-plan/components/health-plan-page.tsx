import { useState } from 'react';
import { NutritionGoalsCard } from '@/features/health-plan/components/nutrition-goals-card';
import { WeekPlanBoard } from '@/features/health-plan/components/week-plan-board';
import { EditPlanModal } from '@/features/health-plan/components/edit-plan-modal';
import { nutrientGoals as defaultGoals, weeklyPlan as defaultPlan } from '@/features/health-plan/data/weekly-plan';
import type { DayPlan, NutrientGoal } from '@/features/health-plan/types';

const STORAGE_KEY = 'health-plan-data';

const VALID_ACCENTS = new Set<string>(['dark', 'brand', 'brand-light', 'soft']);

function isValidMeal(m: unknown): m is DayPlan['meals'][number] {
  if (!m || typeof m !== 'object') return false;
  const meal = m as Record<string, unknown>;
  return (
    typeof meal.id === 'string' &&
    typeof meal.type === 'string' &&
    typeof meal.title === 'string' &&
    typeof meal.calories === 'number' &&
    Number.isFinite(meal.calories)
  );
}

function isValidDayPlan(d: unknown): d is DayPlan {
  if (!d || typeof d !== 'object') return false;
  const day = d as Record<string, unknown>;
  return (
    typeof day.id === 'string' &&
    typeof day.day === 'string' &&
    Array.isArray(day.meals) &&
    (day.meals as unknown[]).length > 0 &&
    (day.meals as unknown[]).every(isValidMeal) &&
    VALID_ACCENTS.has(day.accent as string)
  );
}

function isValidGoal(g: unknown): g is NutrientGoal {
  if (!g || typeof g !== 'object') return false;
  const goal = g as Record<string, unknown>;
  return (
    typeof goal.id === 'string' &&
    typeof goal.label === 'string' &&
    typeof goal.valueLabel === 'string' &&
    typeof goal.percent === 'number' &&
    Number.isFinite(goal.percent)
  );
}

/** Sanitize numeric values that may have been saved by older builds. */
function sanitizePlan(plan: DayPlan[]): DayPlan[] {
  return plan.map((day) => ({
    ...day,
    meals: day.meals.map((m) => ({ ...m, calories: Math.max(0, Math.round(m.calories)) })),
  }));
}

function sanitizeGoals(goals: NutrientGoal[]): NutrientGoal[] {
  return goals.map((g) => ({
    ...g,
    percent: Math.max(0, Math.min(100, Math.round(g.percent))),
  }));
}

function loadFromStorage(): { plan: DayPlan[]; goals: NutrientGoal[] } {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { plan: defaultPlan, goals: defaultGoals };
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') throw new Error('invalid');
    const { plan, goals } = parsed as Record<string, unknown>;
    if (
      !Array.isArray(plan) ||
      !Array.isArray(goals) ||
      plan.length !== defaultPlan.length ||
      goals.length === 0 ||
      !(plan as unknown[]).every(isValidDayPlan) ||
      !(goals as unknown[]).every(isValidGoal)
    ) {
      throw new Error('invalid');
    }
    return { plan: sanitizePlan(plan), goals: sanitizeGoals(goals) };
  } catch {
    return { plan: defaultPlan, goals: defaultGoals };
  }
}

interface HealthPlanPageProps {
  embedded?: boolean;
}

export function HealthPlanPage({ embedded = false }: HealthPlanPageProps) {
  const [plan, setPlan] = useState<DayPlan[]>(() => loadFromStorage().plan);
  const [goals, setGoals] = useState<NutrientGoal[]>(() => loadFromStorage().goals);
  const [isEditOpen, setIsEditOpen] = useState(false);

  function handleSave(newPlan: DayPlan[], newGoals: NutrientGoal[]) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ plan: newPlan, goals: newGoals }));
    } catch {
      // storage unavailable (private browsing, quota exceeded) — proceed with in-memory update
    }
    setPlan(newPlan);
    setGoals(newGoals);
    setIsEditOpen(false);
  }

  const editButton = (
    <button
      onClick={() => setIsEditOpen(true)}
      className="px-4 py-2 bg-white border border-slate-300 rounded-[8px] text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
    >
      编辑计划
    </button>
  );

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
              {editButton}
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
            {editButton}
            <button className="px-4 py-2 bg-[#ec7f13] text-white rounded-[8px] text-sm font-bold shadow-sm hover:bg-[#cc6a0a] transition-colors">
              生成购物清单
            </button>
          </div>
        </div>
      )}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <section className="mb-8">
          <NutritionGoalsCard goals={goals} />
        </section>
        <section className="overflow-x-auto">
          <WeekPlanBoard days={plan} />
        </section>
      </main>
      {!embedded && (
        <footer className="bg-white border-t border-slate-200 mt-8 py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-slate-500">
            © 2023 个人健康饮食计划。保持营养，健康生活。
          </div>
        </footer>
      )}
      {isEditOpen && (
        <EditPlanModal
          plan={plan}
          goals={goals}
          onSave={handleSave}
          onClose={() => setIsEditOpen(false)}
        />
      )}
    </div>
  );
}
