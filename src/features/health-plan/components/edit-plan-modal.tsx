import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import type { DayPlan, NutrientGoal } from '@/features/health-plan/types';

interface EditPlanModalProps {
  plan: DayPlan[];
  goals: NutrientGoal[];
  onSave: (plan: DayPlan[], goals: NutrientGoal[]) => void;
  onClose: () => void;
}

export function EditPlanModal({ plan, goals, onSave, onClose }: EditPlanModalProps) {
  const [draftPlan, setDraftPlan] = useState<DayPlan[]>(() =>
    plan.map((day) => ({ ...day, meals: day.meals.map((m) => ({ ...m })) })),
  );
  const [draftGoals, setDraftGoals] = useState<NutrientGoal[]>(() =>
    goals.map((g) => ({ ...g })),
  );
  const [activeDayId, setActiveDayId] = useState(plan[0]?.id ?? '');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const activeDay = draftPlan.find((d) => d.id === activeDayId);

  function updateMeal(dayId: string, mealId: string, field: 'title' | 'calories', value: string) {
    if (field === 'calories') {
      setDraftPlan((prev) =>
        prev.map((day) =>
          day.id !== dayId
            ? day
            : {
                ...day,
                meals: day.meals.map((meal) =>
                  meal.id !== mealId
                    ? meal
                    : { ...meal, calories: value === '' ? NaN : Number(value) },
                ),
              },
        ),
      );
    } else {
      setDraftPlan((prev) =>
        prev.map((day) =>
          day.id !== dayId
            ? day
            : {
                ...day,
                meals: day.meals.map((meal) =>
                  meal.id !== mealId ? meal : { ...meal, [field]: value },
                ),
              },
        ),
      );
    }
  }

  function updateGoal(goalId: string, field: 'valueLabel' | 'percent', value: string) {
    setDraftGoals((prev) =>
      prev.map((g) =>
        g.id !== goalId
          ? g
          : {
              ...g,
              [field]: field === 'percent' ? Math.round(Math.min(100, Math.max(0, Number(value) || 0))) : value,
            },
      ),
    );
  }

  function addMeal(dayId: string) {
    const newId = crypto.randomUUID();
    setDraftPlan((prev) =>
      prev.map((day) =>
        day.id !== dayId
          ? day
          : {
              ...day,
              meals: [
                ...day.meals,
                { id: newId, type: '其他', title: '', calories: 0 },
              ],
            },
      ),
    );
  }

  function deleteMeal(dayId: string, mealId: string) {
    setDraftPlan((prev) =>
      prev.map((day) =>
        day.id !== dayId
          ? day
          : { ...day, meals: day.meals.filter((m) => m.id !== mealId) },
      ),
    );
  }

  function handleSave() {
    const newErrors: Record<string, string> = {};
    for (const day of draftPlan) {
      for (const meal of day.meals) {
        if (!meal.title.trim()) {
          newErrors[`${meal.id}-title`] = '餐食名称不能为空';
        }
        if (meal.calories < 0 || !Number.isFinite(meal.calories) || !Number.isInteger(meal.calories)) {
          newErrors[`${meal.id}-calories`] = '请输入有效卡路里（≥ 0）';
        }
      }
    }
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      const firstErrorDay = draftPlan.find((day) =>
        day.meals.some((meal) => newErrors[`${meal.id}-title`] || newErrors[`${meal.id}-calories`]),
      );
      if (firstErrorDay) setActiveDayId(firstErrorDay.id);
      return;
    }
    setErrors({});
    onSave(draftPlan, draftGoals);
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-label="编辑计划"
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-white rounded-[12px] shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <h2 className="text-lg font-bold text-slate-900">编辑计划</h2>
          <button
            className="text-slate-400 hover:text-slate-600 transition-colors"
            onClick={onClose}
            aria-label="关闭"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Scrollable content */}
        <div className="overflow-y-auto flex-1 px-6 py-5 space-y-6">
          {/* Nutrition goals section */}
          <section>
            <h3 className="text-sm font-bold text-slate-700 mb-3">今日营养目标</h3>
            <div className="space-y-3">
              {draftGoals.map((goal) => (
                <div key={goal.id} className="grid grid-cols-[1fr_140px_80px] gap-3 items-center">
                  <span className="text-sm font-semibold text-slate-700">{goal.label}</span>
                  <input
                    type="text"
                    value={goal.valueLabel}
                    onChange={(e) => updateGoal(goal.id, 'valueLabel', e.target.value)}
                    className="h-9 rounded-[8px] border border-slate-300 px-3 text-sm outline-none focus:ring-2 focus:ring-[#ec7f13]/40 focus:border-[#ec7f13]"
                    placeholder="如 (120g/150g)"
                  />
                  <div className="relative">
                    <input
                      type="number"
                      min={0}
                      max={100}
                      value={goal.percent}
                      onChange={(e) => updateGoal(goal.id, 'percent', e.target.value)}
                      className="h-9 w-full rounded-[8px] border border-slate-300 px-3 pr-8 text-sm outline-none focus:ring-2 focus:ring-[#ec7f13]/40 focus:border-[#ec7f13]"
                    />
                    <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400">%</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Weekly plan section */}
          <section>
            <h3 className="text-sm font-bold text-slate-700 mb-3">每日饮食计划</h3>

            {/* Day tabs */}
            <div className="flex gap-1 mb-4 flex-wrap">
              {draftPlan.map((day) => (
                <button
                  key={day.id}
                  onClick={() => setActiveDayId(day.id)}
                  className={cn(
                    'px-3 py-1.5 rounded-[6px] text-sm font-semibold transition-colors',
                    activeDayId === day.id
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200',
                  )}
                >
                  {day.day}
                </button>
              ))}
            </div>

            {/* Meals for active day */}
            {activeDay && (
              <div className="space-y-3">
                {activeDay.meals.map((meal) => (
                  <div key={meal.id}>
                    <div className="flex gap-3 items-center">
                      <span className="text-xs uppercase tracking-wider font-bold text-[#ec7f13] w-10 shrink-0">
                        {meal.type}
                      </span>
                      <div className="flex-1">
                        <input
                          type="text"
                          value={meal.title}
                          onChange={(e) => updateMeal(activeDay.id, meal.id, 'title', e.target.value)}
                          className={cn(
                            'w-full h-9 rounded-[8px] border px-3 text-sm outline-none focus:ring-2 focus:ring-[#ec7f13]/40 focus:border-[#ec7f13]',
                            errors[`${meal.id}-title`] ? 'border-red-400' : 'border-slate-300',
                          )}
                          placeholder="餐食名称"
                          maxLength={100}
                        />
                        {errors[`${meal.id}-title`] && (
                          <p className="text-xs text-red-500 mt-0.5">{errors[`${meal.id}-title`]}</p>
                        )}
                      </div>
                      <div className="relative w-24 shrink-0">
                        <input
                          type="number"
                          min={0}
                          value={Number.isNaN(meal.calories) ? '' : meal.calories}
                          onChange={(e) => updateMeal(activeDay.id, meal.id, 'calories', e.target.value)}
                          className={cn(
                            'h-9 w-full rounded-[8px] border px-3 pr-10 text-sm outline-none focus:ring-2 focus:ring-[#ec7f13]/40 focus:border-[#ec7f13]',
                            errors[`${meal.id}-calories`] ? 'border-red-400' : 'border-slate-300',
                          )}
                        />
                        <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400">
                          kcal
                        </span>
                      </div>
                      <button
                        aria-label="删除餐食"
                        disabled={activeDay.meals.length <= 1}
                        onClick={() => deleteMeal(activeDay.id, meal.id)}
                        className="shrink-0 text-slate-400 hover:text-red-500 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                    {errors[`${meal.id}-calories`] && (
                      <p className="text-xs text-red-500 mt-0.5 ml-[52px]">{errors[`${meal.id}-calories`]}</p>
                    )}
                  </div>
                ))}
                <Button
                  variant="outline"
                  className="w-full mt-2"
                  onClick={() => addMeal(activeDay.id)}
                >
                  + 添加餐食
                </Button>
              </div>
            )}
          </section>
        </div>

        {/* Footer actions */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-200">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-[8px] border border-slate-300 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
          >
            取消
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 rounded-[8px] bg-[#ec7f13] text-white text-sm font-bold shadow-sm hover:bg-[#cc6a0a] transition-colors"
          >
            保存计划
          </button>
        </div>
      </div>
    </div>
  );
}
