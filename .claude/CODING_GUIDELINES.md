# FreshPlate 编码规范

## 目录结构规范

新功能必须按 feature 组织：
```
src/features/{feature-name}/
  components/     # React 组件
  data/           # 静态数据、mock 数据
  store/          # Jotai atoms
  types.ts        # TypeScript 类型
```

禁止将组件直接放在 `src/components/` 下（该目录只放跨 feature 的通用组件）。

## 导入规范

```typescript
// ✅ 正确：使用 @/ 别名
import { Button } from '@/components/ui/button'
import { recipeAtom } from '@/features/recipes/store/recipeAtoms'

// ❌ 错误：相对路径
import { Button } from '../../../components/ui/button'
```

## UI 组件规范

- 优先使用 `src/components/ui/` 中已有的 shadcn/ui 组件
- 需要新增 shadcn 组件时，用 `pnpm dlx shadcn@latest add {component}`
- 自定义样式用 `cn()` 工具函数合并 className，不直接拼字符串

```typescript
import { cn } from '@/lib/utils'

// ✅ 正确
<div className={cn('base-class', condition && 'conditional-class', className)} />
```

## 状态管理规范

- 局部 UI 状态用 `useState`
- 跨组件共享状态用 Jotai atom，放在 feature 的 `store/` 目录
- 禁止用 prop drilling 超过 2 层，超过请用 atom

```typescript
// src/features/recipes/store/recipeAtoms.ts
import { atom } from 'jotai'
import type { Recipe } from '@/shared/types/recipe'

export const selectedRecipeAtom = atom<Recipe | null>(null)
```

## API 调用规范

- 所有后端调用通过 `src/lib/trpc.ts`，禁止直接 fetch Worker URL
- tRPC procedure 必须有 Zod 输入验证

```typescript
// ✅ 正确
import { trpc } from '@/lib/trpc'
const recipes = await trpc.recipe.list.query({ nutritionFocus: 'high-protein' })

// ❌ 错误
const res = await fetch('https://healthy-recipes-api.mazj0602.workers.dev/trpc/...')
```

## TypeScript 规范

- 严格模式已开启，禁止使用 `any`（用 `unknown` 替代）
- 共享类型放 `src/shared/types/`
- feature 内部类型放该 feature 的 `types.ts`

## 测试规范

- 单元测试文件放 `src/test/unit/`，命名 `{name}.test.ts(x)`
- E2E 测试文件放 `src/test/e2e/`，命名 `{page}.spec.ts`
- E2E 不能用 `page.goto()` 跳转（SPA 状态路由），通过点击 UI 切换页面
- 每个新 feature 至少要有：数据完整性单元测试 + 关键流程 E2E 测试

## Worker 编码规范

- 新增 procedure 必须写在 `worker/src/router.ts`
- 输入用 Zod 验证，输出类型明确定义
- AI prompt 模板单独提取为常量，不内联在 procedure 里

## localStorage 使用规范

凡需要 `localStorage` 持久化的功能，必须遵循以下模式：

```typescript
// ✅ 读取：带结构校验 + 容错回退
function loadFromStorage() {
  try {
    const raw = localStorage.getItem('your-key')
    if (!raw) throw new Error('empty')
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed.items)) throw new Error('invalid')
    return parsed
  } catch {
    return defaultData  // 回退默认数据
  }
}

// ✅ 写入：带 try/catch（兼容 Safari 隐私模式）
function saveToStorage(data) {
  try {
    localStorage.setItem('your-key', JSON.stringify(data))
  } catch {
    // 存储不可用，仅内存更新
  }
}
```

- `localStorage` 草稿状态用局部 `useState` 管理，不放 Jotai atom（不需要跨组件共享）
- 弹窗编辑采用"深拷贝草稿"模式：props → deep copy → draft state → 保存时写回父组件
