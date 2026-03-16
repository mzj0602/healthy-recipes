import { cn } from '@/lib/utils';

interface MetricProgressProps {
  label: string;
  valueLabel: string;
  percent: number;
  className?: string;
}

export function MetricProgress({ label, valueLabel, percent, className }: MetricProgressProps) {
  return (
    <div className={cn('space-y-1', className)}>
      <div className="flex justify-between mb-1">
        <span className="text-sm font-medium text-slate-600">{label} {valueLabel}</span>
        <span className="text-sm font-bold text-slate-900">{percent}%</span>
      </div>
      <div className="w-full bg-slate-100 rounded-full h-2.5">
        <div
          className="bg-[#ec7f13] h-2.5 rounded-full"
          style={{ width: `${Math.max(0, Math.min(percent, 100))}%` }}
        />
      </div>
    </div>
  );
}
