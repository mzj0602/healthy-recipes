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

## 轻量登录壳层（user-login，2026-03-28）

- 应用入口在 `src/features/meal-planner/components/healthy-meal-planner-app.tsx` 增加登录态守卫
- 未登录时优先渲染 `LoginPage`，已登录时渲染原有 FreshPlate SPA
- 登录态通过 `sessionStorage('healthy-recipes-user')` 保存当前用户名，仅用于会话恢复与界面展示
- 顶部导航 `SiteChrome` 展示当前用户名并提供退出按钮，退出后清除会话并回到登录页

## 新增模块时的约定

1. 在 `src/features/` 下建对应目录
2. 如需新 API，在 `worker/src/router.ts` 添加 procedure
3. 前端通过 `src/lib/trpc.ts` 调用，不直接 fetch
4. 状态变化用 Jotai atom，不用 useState 跨组件传递

## 本地持久化数据流（localStorage）

部分功能无需后端，直接读写 `localStorage`：

```
用户操作 UI（编辑弹窗）
  → 本地 useState 草稿更新
  → 保存校验通过
  → localStorage.setItem('health-plan-data', JSON.stringify({plan, goals}))
  → 父组件 setState 更新
  → UI 重新渲染
  ↑
页面加载时：localStorage.getItem → JSON.parse → 回退默认数据（格式不合法时）
```

**适用场景**：纯客户端个性化配置，不需要服务端同步的数据（如饮食计划编辑）。

**现有 localStorage key**：

| Key | 结构 | 用途 |
|---|---|---|
| `health-plan-data` | `{ plan: DayPlan[], goals: NutrientGoal[] }` | 用户自定义饮食计划与营养目标 |
