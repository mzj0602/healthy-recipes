import { cn } from '@/lib/utils';
import type { DayPlan } from '@/features/health-plan/types';

interface DayPlanColumnProps {
  day: DayPlan;
}

const headerClasses: Record<DayPlan['accent'], string> = {
  dark: 'bg-slate-900 text-white',
  brand: 'bg-[#ec7f13] text-white',
  'brand-light': 'bg-[#fde6d0] text-[#cc6a0a]',
  soft: 'bg-slate-200 text-slate-800',
};

export function DayPlanColumn({ day }: DayPlanColumnProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className={cn('p-3 rounded-[8px] text-center font-bold', headerClasses[day.accent])}>
        {day.day}
      </div>
      {day.meals.map((meal) => (
        <div
          className="meal-card bg-white p-4 rounded-[8px] border border-slate-200 shadow-sm"
          key={meal.id}
        >
          <span className="text-[10px] uppercase tracking-wider font-bold text-[#ec7f13] mb-1 block">
            {meal.type}
          </span>
          <p className="text-sm font-semibold">{meal.title}</p>
          <p className="text-xs text-slate-500 mt-1">{meal.calories} kcal</p>
        </div>
      ))}
    </div>
  );
}
