import { useState, useEffect, useRef } from 'react';
import { useSetAtom } from 'jotai';
import { cn } from '@/lib/utils';
import type { PlannerPageId } from '@/features/meal-planner/types';
import { searchAtom } from '@/features/recipes/store/recipeAtoms';

interface SiteChromeProps {
  activePage: PlannerPageId;
  onNavigate: (page: PlannerPageId) => void;
  currentUser: string;
  onLogout: () => void;
}

interface HeaderSearchProps {
  activePage: PlannerPageId;
  onNavigate: (page: PlannerPageId) => void;
}

function HeaderSearch({ activePage, onNavigate }: HeaderSearchProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [localValue, setLocalValue] = useState('');
  const setSearch = useSetAtom(searchAtom);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isExpanded) inputRef.current?.focus();
  }, [isExpanded]);

  function handleBlur() {
    setTimeout(() => { setIsExpanded(false); setLocalValue(''); }, 150);
  }

  function handleSubmit() {
    const trimmed = localValue.trim();
    if (!trimmed) return;
    setSearch(trimmed);
    if (activePage !== 'recipes') onNavigate('recipes');
    setIsExpanded(false);
    setLocalValue('');
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter') handleSubmit();
    if (e.key === 'Escape') { setIsExpanded(false); setLocalValue(''); }
  }

  return (
    <div className="relative flex items-center">
      <div className={cn(
        'overflow-hidden transition-all duration-200',
        isExpanded ? 'w-[220px] opacity-100' : 'w-0 opacity-0',
      )}>
        <input
          ref={inputRef}
          className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-[8px] focus:ring-2 focus:ring-[#ec7f13] focus:border-[#ec7f13] outline-none text-sm"
          onBlur={handleBlur}
          onChange={(e) => setLocalValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="搜索菜谱..."
          type="text"
          value={localValue}
        />
      </div>
      <button
        aria-label="搜索"
        className="p-2 text-gray-600 hover:text-[#ec7f13] transition-colors"
        onClick={() => setIsExpanded(true)}
        type="button"
      >
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
        </svg>
      </button>
    </div>
  );
}

const navItems: Array<{ id: PlannerPageId; label: string }> = [
  { id: 'recipes', label: '菜谱' },
  { id: 'plan', label: '饮食计划' },
  { id: 'home', label: '健康资讯' },
  { id: 'detail', label: '关于' },
];

export function SiteChrome({ activePage, onNavigate, currentUser, onLogout }: SiteChromeProps) {
  return (
    <header className="sticky top-0 z-50 bg-[#F9F8F6]/90 backdrop-blur-md border-b border-gray-200/50">
      <div className="container mx-auto flex h-20 items-center justify-between gap-4 px-4">
        <button className="flex items-center gap-2 group" onClick={() => onNavigate('home')} type="button">
          <div className="w-10 h-10 bg-[#ec7f13] rounded-[8px] flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
            </svg>
          </div>
          <span className="text-xl font-extrabold tracking-tight text-gray-900">FreshPlate</span>
        </button>

        <nav className="hidden md:flex items-center gap-8 font-medium text-gray-600">
          {navItems.map((item) => (
            <button
              key={item.id}
              className={cn(
                'hover:text-[#ec7f13] transition-colors',
                activePage === item.id && 'text-[#ec7f13] font-semibold',
              )}
              onClick={() => onNavigate(item.id)}
              type="button"
            >
              {item.label}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <HeaderSearch activePage={activePage} onNavigate={onNavigate} />
          <div className="hidden rounded-[8px] border border-[#f2dfcf] bg-white px-3 py-2 text-sm text-[#5d4230] shadow-sm sm:block">
            你好，{currentUser}
          </div>
          <button
            className="flex items-center gap-2 rounded-[8px] bg-[#ec7f13] px-4 py-2 font-semibold text-white transition-all hover:bg-[#c7670b]"
            onClick={() => onNavigate('plan')}
            type="button"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
            </svg>
            个人中心
          </button>
          <button
            className="rounded-[8px] border border-[#ead7c5] bg-white px-4 py-2 text-sm font-semibold text-[#7b5a45] transition-colors hover:border-[#ec7f13] hover:text-[#ec7f13]"
            onClick={onLogout}
            type="button"
          >
            退出
          </button>
        </div>
      </div>
    </header>
  );
}
