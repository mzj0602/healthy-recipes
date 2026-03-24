import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { buildShoppingList } from '@/features/health-plan/utils/build-shopping-list';
import type { DayPlan, IngredientCategory } from '@/features/health-plan/types';

interface ShoppingListModalProps {
  plan: DayPlan[];
  onClose: () => void;
  onOpenEditPlan: () => void;
}

const CATEGORY_LABELS: Record<IngredientCategory, string> = {
  蔬果类: '🥦 蔬果类',
  肉蛋类: '🥩 肉蛋类',
  主食类: '🍚 主食类',
  调料类: '🧂 调料类',
  其他: '📦 其他',
};

export function ShoppingListModal({ plan, onClose, onOpenEditPlan }: ShoppingListModalProps) {
  const [checked, setChecked] = useState<Set<string>>(new Set());
  const [copyFeedback, setCopyFeedback] = useState(false);
  const [hasClipboard, setHasClipboard] = useState(false);

  useEffect(() => {
    setHasClipboard(typeof navigator !== 'undefined' && typeof navigator.clipboard !== 'undefined');
  }, []);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const shoppingList = buildShoppingList(plan);
  const totalCount = Array.from(shoppingList.values()).reduce((sum, items) => sum + items.length, 0);
  const isEmpty = totalCount === 0;

  function toggleChecked(name: string) {
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(name)) {
        next.delete(name);
      } else {
        next.add(name);
      }
      return next;
    });
  }

  async function handleCopy() {
    if (!hasClipboard) return;
    const lines: string[] = [];
    for (const [, items] of shoppingList) {
      for (const item of items) {
        if (!checked.has(`${item.name}|${item.amount}`)) {
          lines.push(`□ ${item.name} ${item.displayAmount}`);
        }
      }
    }
    await navigator.clipboard.writeText(lines.join('\n'));
    setCopyFeedback(true);
    setTimeout(() => setCopyFeedback(false), 1500);
  }

  function handleOverlayClick(e: React.MouseEvent<HTMLDivElement>) {
    if (e.target === e.currentTarget) onClose();
  }

  function handleEmptyEditPlan() {
    onClose();
    onOpenEditPlan();
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={handleOverlayClick}
      data-testid="shopping-list-overlay"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="购物清单"
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 max-h-[80vh] flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <h2 className="text-lg font-bold text-slate-900">
            购物清单
            {!isEmpty && (
              <span className="ml-2 text-sm font-normal text-slate-500">（共 {totalCount} 种食材）</span>
            )}
          </h2>
          <button
            onClick={onClose}
            aria-label="关闭"
            className="text-slate-400 hover:text-slate-600 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {isEmpty ? (
            <div className="flex flex-col items-center justify-center py-12 text-center gap-4">
              <p className="text-slate-500">当前计划没有餐食数据，无法生成购物清单。</p>
              <button
                onClick={handleEmptyEditPlan}
                className="px-4 py-2 bg-[#ec7f13] text-white rounded-lg text-sm font-semibold hover:bg-[#cc6a0a] transition-colors"
              >
                去编辑计划
              </button>
            </div>
          ) : (
            <div className="space-y-5">
              {Array.from(shoppingList.entries()).map(([category, items]) => (
                <div key={category}>
                  <h3 className="text-sm font-semibold text-slate-700 mb-2">{CATEGORY_LABELS[category]}</h3>
                  <ul className="space-y-1">
                    {items.map((item) => {
                      const itemKey = `${item.name}|${item.amount}`;
                      const isChecked = checked.has(itemKey);
                      return (
                        <li key={itemKey} className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            id={`item-${itemKey}`}
                            checked={isChecked}
                            onChange={() => toggleChecked(itemKey)}
                            className="h-4 w-4 rounded border-slate-300 text-[#ec7f13] accent-[#ec7f13] cursor-pointer flex-shrink-0"
                          />
                          <label
                            htmlFor={`item-${itemKey}`}
                            className={cn(
                              'flex-1 flex items-center justify-between text-sm cursor-pointer',
                              isChecked && 'line-through text-slate-400'
                            )}
                          >
                            <span>{item.name}</span>
                            <span className="text-slate-400 text-xs">{item.displayAmount}</span>
                          </label>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {!isEmpty && (
          <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-between gap-3">
            <button
              onClick={() => setChecked(new Set())}
              className="px-3 py-2 text-slate-500 text-sm hover:text-slate-700 transition-colors"
            >
              取消全部勾选
            </button>
            <div className="flex items-center gap-3">
              {hasClipboard && (
                <button
                  onClick={handleCopy}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg text-sm font-semibold hover:bg-slate-200 transition-colors"
                >
                  {copyFeedback ? '已复制！' : '复制文字'}
                </button>
              )}
              <button
                onClick={onClose}
                className="px-4 py-2 bg-[#ec7f13] text-white rounded-lg text-sm font-semibold hover:bg-[#cc6a0a] transition-colors"
              >
                完成
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
