import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  action,
  className,
}: SectionHeadingProps) {
  return (
    <div className={cn('flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between', className)}>
      <div className="space-y-1.5">
        {eyebrow ? (
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#f09a47]">
            {eyebrow}
          </p>
        ) : null}
        <h2 className="text-2xl font-semibold tracking-[-0.02em] text-[#3f2617]">{title}</h2>
        {description ? <p className="max-w-2xl text-sm text-[#a17d62]">{description}</p> : null}
      </div>
      {action}
    </div>
  );
}
