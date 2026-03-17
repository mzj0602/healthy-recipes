import { useState } from 'react';
import { trpc } from '@/lib/trpc';
import type { Recipe } from '@/shared/types/recipe';

interface AiSuggestPanelProps {
  onAdd: (recipe: Recipe) => void;
}

export function AiSuggestPanel({ onAdd }: AiSuggestPanelProps) {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Recipe | null>(null);
  const [error, setError] = useState('');

  const handleSuggest = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const recipe = await trpc.recipe.suggest.mutate({ prompt });
      setResult(recipe);
    } catch {
      setError('AI 生成失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-2xl border border-dashed border-green-300 bg-green-50 p-4 space-y-3">
      <div className="flex items-center gap-2">
        <span className="text-lg">✨</span>
        <h3 className="font-semibold text-green-800">AI 食谱生成</h3>
      </div>

      <div className="flex gap-2">
        <input
          className="flex-1 rounded-lg border border-green-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-green-400"
          disabled={loading}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSuggest()}
          placeholder="描述你想要的食谱，例如：低卡高蛋白的快手早餐"
          value={prompt}
        />
        <button
          className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-50 hover:bg-green-700"
          disabled={loading || !prompt.trim()}
          onClick={handleSuggest}
          type="button"
        >
          {loading ? '生成中…' : '生成'}
        </button>
      </div>

      {error ? <p className="text-sm text-red-500">{error}</p> : null}

      {result ? (
        <div className="rounded-xl border border-green-200 bg-white p-4 space-y-2">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="font-semibold text-gray-900">{result.name}</p>
              <p className="text-sm text-gray-500">{result.description}</p>
            </div>
            <button
              className="shrink-0 rounded-lg bg-green-100 px-3 py-1.5 text-xs font-medium text-green-700 hover:bg-green-200"
              onClick={() => onAdd(result)}
              type="button"
            >
              加入列表
            </button>
          </div>
          <div className="flex gap-2 text-xs text-gray-500">
            <span>{result.cookTime} 分钟</span>
            <span>·</span>
            <span>{result.calories} kcal</span>
            <span>·</span>
            <span>{result.protein}g 蛋白</span>
          </div>
          <div className="space-y-1">
            <p className="text-xs font-medium text-gray-700">食材</p>
            <p className="text-xs text-gray-500">{result.ingredients.join('、')}</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs font-medium text-gray-700">做法</p>
            <ol className="space-y-0.5">
              {result.steps.map((step, i) => (
                <li className="text-xs text-gray-500" key={i}>{i + 1}. {step}</li>
              ))}
            </ol>
          </div>
        </div>
      ) : null}
    </div>
  );
}
