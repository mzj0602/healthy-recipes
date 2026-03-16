import type { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export function Badge({ className, ...props }: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full bg-[#fff2e2] px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#c4762a]',
        className,
      )}
      {...props}
    />
  );
}
