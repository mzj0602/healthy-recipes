import type { ReactNode } from 'react';

interface SiteHeaderProps {
  title: string;
  subtitle: string;
  actions?: ReactNode;
}

export function SiteHeader({ title, subtitle, actions }: SiteHeaderProps) {
  return (
    <header className="flex flex-col gap-4 border-b border-[#f2dfcf] px-5 py-5 sm:px-7 sm:py-6 lg:flex-row lg:items-start lg:justify-between">
      <div className="space-y-1">
        <h1 className="text-xl font-semibold tracking-[-0.02em] text-[#3f2617] sm:text-2xl">
          {title}
        </h1>
        <p className="text-sm text-[#aa8367]">{subtitle}</p>
      </div>

      {actions ? <div className="flex flex-wrap gap-2">{actions}</div> : null}
    </header>
  );
}
