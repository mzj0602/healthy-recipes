import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface PageShellProps {
  children: ReactNode;
  className?: string;
}

export function PageShell({ children, className }: PageShellProps) {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_1px_1px,rgba(240,140,43,0.08)_1px,transparent_0)] [background-size:20px_20px] bg-[#fffaf6] px-0">
      <div className="mx-auto flex min-h-screen w-full max-w-[1280px] flex-col bg-white shadow-[0_10px_40px_rgba(193,151,112,0.08)]">
        <main className={cn('flex-1', className)}>{children}</main>
      </div>
    </div>
  );
}
