import { initTRPC, TRPCError } from '@trpc/server';
import { z } from 'zod';

export interface Context {
  apiKey: string;
}

const t = initTRPC.context<Context>().create();

export type NutritionFocus = 'high-protein' | 'low-carb' | 'gut-friendly' | 'balanced';

export interface Recipe {
  id: string;
  name: string;
  description: string;
  cookTime: number;
  calories: number;
  protein: number;
  focus: NutritionFocus;
  difficulty: 'easy' | 'medium';
  tags: string[];
  ingredients: string[];
  steps: string[];
}

const recipes: Recipe[] = [
  {
    id: 'miso-salmon-bowl',
    name: '味噌三文鱼能量碗',
    description: '高蛋白、低负担，适合工作日晚餐和训练后恢复。',
    cookTime: 25,
    calories: 520,
    protein: 38,
    focus: 'high-protein',
    difficulty: 'easy',
    tags: ['高蛋白', '晚餐', '无精制糖'],
    ingredients: ['三文鱼 180g', '糙米饭 120g', '毛豆 80g', '牛油果 1/2 个', '西兰花 100g'],
    steps: ['三文鱼抹味噌酱，烤箱 200°C 烤 12 分钟。', '西兰花焯水，毛豆解冻备用。', '糙米饭铺底，依次摆上配菜和三文鱼。'],
  },
  {
    id: 'green-shakshuka',
    name: '羽衣甘蓝青酱北非蛋',
    description: '用绿色蔬菜替代番茄底，提升纤维和微量营养素密度。',
    cookTime: 20,
    calories: 410,
    protein: 24,
    focus: 'gut-friendly',
    difficulty: 'easy',
    tags: ['早餐', '护肠胃', '一锅出'],
    ingredients: ['鸡蛋 2 个', '羽衣甘蓝 100g', '菠菜 80g', '希腊酸奶 50g', '全麦面包 2 片'],
    steps: ['羽衣甘蓝和菠菜炒软后打成酱。', '倒回平底锅，小火煨 3 分钟后磕入鸡蛋。', '盖盖焖至蛋白凝固，搭配酸奶和烤面包。'],
  },
  {
    id: 'tofu-zucchini-noodles',
    name: '豆腐西葫芦轻碳面',
    description: '控制碳水时也能有饱腹感，适合清爽午餐。',
    cookTime: 18,
    calories: 330,
    protein: 26,
    focus: 'low-carb',
    difficulty: 'easy',
    tags: ['低碳', '午餐', '快手'],
    ingredients: ['北豆腐 200g', '西葫芦 2 根', '芝麻酱 20g', '酱油 10ml', '小番茄 6 个'],
    steps: ['西葫芦刨成面条状，豆腐煎至表面金黄。', '芝麻酱、酱油和少量温水调成酱汁。', '拌匀西葫芦面、豆腐和小番茄后即可食用。'],
  },
  {
    id: 'chicken-lentil-soup',
    name: '鸡胸红扁豆暖汤',
    description: '平衡碳水、蛋白和纤维，适合作为备餐主菜。',
    cookTime: 35,
    calories: 460,
    protein: 35,
    focus: 'balanced',
    difficulty: 'medium',
    tags: ['备餐', '高纤维', '晚餐'],
    ingredients: ['鸡胸肉 180g', '红扁豆 100g', '胡萝卜 1 根', '芹菜 2 根', '洋葱 1/2 个'],
    steps: ['鸡胸肉切块煎香，蔬菜炒出香味。', '加入扁豆和足量水，小火煮 25 分钟。', '最后调味，按需撒欧芹或黑胡椒。'],
  },
];

const SYSTEM_PROMPT = `你是一位专业营养师，根据用户需求生成一道健康食谱。
必须返回严格的 JSON 对象，字段如下：
{
  "id": "kebab-case的唯一ID",
  "name": "菜谱名称（中文）",
  "description": "一句话描述（中文，30字以内）",
  "cookTime": 烹饪分钟数（数字）,
  "calories": 热量kcal（数字）,
  "protein": 蛋白质克数（数字）,
  "focus": "high-protein" | "low-carb" | "gut-friendly" | "balanced",
  "difficulty": "easy" | "medium",
  "tags": ["标签1", "标签2", "标签3"],
  "ingredients": ["食材1", "食材2"],
  "steps": ["步骤1", "步骤2", "步骤3"]
}
只返回 JSON，不要有任何其他文字。`;

export const appRouter = t.router({
  recipe: t.router({
    list: t.procedure
      .input(
        z
          .object({
            focus: z.enum(['high-protein', 'low-carb', 'gut-friendly', 'balanced']).optional(),
          })
          .optional(),
      )
      .query(({ input }) => {
        if (input?.focus) {
          return recipes.filter((r) => r.focus === input.focus);
        }
        return recipes;
      }),

    getById: t.procedure.input(z.string()).query(({ input }) => {
      return recipes.find((r) => r.id === input) ?? null;
    }),

    suggest: t.procedure
      .input(z.object({ prompt: z.string().min(1).max(200) }))
      .mutation(async ({ input, ctx }) => {
        const response = await fetch('https://api.deepseek.com/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${ctx.apiKey}`,
          },
          body: JSON.stringify({
            model: 'deepseek-chat',
            response_format: { type: 'json_object' },
            messages: [
              { role: 'system', content: SYSTEM_PROMPT },
              { role: 'user', content: input.prompt },
            ],
          }),
        });

        if (!response.ok) {
          throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'DeepSeek API 请求失败' });
        }

        const data = await response.json() as {
          choices: Array<{ message: { content: string } }>;
        };

        const content = data.choices[0]?.message?.content;
        if (!content) {
          throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: '未收到 AI 响应' });
        }

        return JSON.parse(content) as Recipe;
      }),
  }),
});

export type AppRouter = typeof appRouter;
