import { MetricProgress } from '@/components/ui/metric-progress';
import type { NutrientGoal } from '@/features/health-plan/types';

interface NutritionGoalsCardProps {
  goals: NutrientGoal[];
}

export function NutritionGoalsCard({ goals }: NutritionGoalsCardProps) {
  return (
    <div className="bg-white p-6 rounded-[8px] shadow-sm border border-slate-200">
      <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
        <svg className="h-5 w-5 text-[#ec7f13]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
        </svg>
        今日营养目标
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {goals.map((goal) => (
          <MetricProgress
            key={goal.id}
            label={goal.label}
            percent={goal.percent}
            valueLabel={goal.valueLabel}
          />
        ))}
      </div>
    </div>
  );
}
