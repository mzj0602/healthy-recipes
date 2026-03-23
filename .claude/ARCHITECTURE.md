# FreshPlate 系统架构

## 整体架构

```
用户浏览器
    │
    ▼
Cloudflare Pages（前端）
  React 18 SPA
  Vite 构建
  TailwindCSS + shadcn/ui
  Jotai 状态管理
    │ tRPC HTTP
    ▼
Cloudflare Worker（后端）
  tRPC Router
  DeepSeek AI API
```

## 前端架构

- **路由**：SPA 状态路由，无 URL 变化，`App.tsx` 通过状态决定渲染哪个页面
- **状态管理**：Jotai atoms，按 feature 拆分，存放在 `src/features/{feature}/store/`
- **UI 组件**：shadcn/ui（`src/components/ui/`）+ feature 专属组件
- **API 层**：tRPC client（`src/lib/trpc.ts`），统一通过 `VITE_WORKER_URL` 环境变量指向 Worker
- **样式**：TailwindCSS v4，主色 `#ec7f13`（橙色），背景 `#F9F8F6`（暖米色）

## 后端架构（Cloudflare Worker）

- **入口**：`worker/src/index.ts`，处理 CORS + 路由 `/trpc` 请求
- **Router**：`worker/src/router.ts`，tRPC procedures：
  - `recipe.list()`：列出菜谱，支持 `nutritionFocus` 过滤
  - `recipe.getById()`：获取单个菜谱
  - `recipe.suggest()`：调用 DeepSeek API 生成 AI 菜谱建议
- **AI**：DeepSeek API，Key 通过 Worker 环境变量注入（`DEEPSEEK_API_KEY`）

## 数据流

```
用户操作 UI
  → Jotai atom 更新
  → tRPC client 调用 Worker
  → Worker 返回数据
  → atom 更新
  → UI 重新渲染
```

## 部署架构

| 环境 | 服务 | 触发方式 |
|---|---|---|
| 前端 | Cloudflare Pages | push main → GitHub Actions |
| 后端 | Cloudflare Worker | push main → GitHub Actions |
| （遗留）| EC2 + Nginx | push main（待移除）|

## 新增模块时的约定

1. 在 `src/features/` 下建对应目录
2. 如需新 API，在 `worker/src/router.ts` 添加 procedure
3. 前端通过 `src/lib/trpc.ts` 调用，不直接 fetch
4. 状态变化用 Jotai atom，不用 useState 跨组件传递
