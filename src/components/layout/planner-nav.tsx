import { cn } from '@/lib/utils';

export type PlannerPageId = 'home' | 'recipes' | 'detail' | 'plan';

interface PlannerNavItem {
  id: PlannerPageId;
  label: string;
}

interface PlannerNavProps {
  activePage: PlannerPageId;
  items: PlannerNavItem[];
  onChange: (page: PlannerPageId) => void;
}

export function PlannerNav({ activePage, items, onChange }: PlannerNavProps) {
  return (
    <nav className="flex flex-wrap gap-2">
      {items.map((item) => (
        <button
          className={cn(
            'rounded-full px-3 py-1.5 text-xs font-semibold transition sm:text-sm',
            item.id === activePage
              ? 'bg-[#1f2837] text-white shadow-[0_10px_20px_rgba(31,40,55,0.2)]'
              : 'bg-[#fff4e7] text-[#9a6c49] hover:bg-[#fee8d1]',
          )}
          key={item.id}
          onClick={() => onChange(item.id)}
          type="button"
        >
          {item.label}
        </button>
      ))}
    </nav>
  );
}
