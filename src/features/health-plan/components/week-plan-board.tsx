import type { DayPlan } from '@/features/health-plan/types';
import { DayPlanColumn } from '@/features/health-plan/components/day-plan-column';

interface WeekPlanBoardProps {
  days: DayPlan[];
}

export function WeekPlanBoard({ days }: WeekPlanBoardProps) {
  return (
    <section className="overflow-x-auto">
      <div
        className="gap-4 min-w-max md:min-w-0"
        style={{ display: 'grid', gridTemplateColumns: 'repeat(7, minmax(150px, 1fr))' }}
      >
        {days.map((day) => (
          <DayPlanColumn day={day} key={day.id} />
        ))}
      </div>
    </section>
  );
}
