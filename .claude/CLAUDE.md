# FreshPlate 健康菜谱平台 — Claude 项目指令

## 项目简介

FreshPlate 是一个健康菜谱 SPA，前端用 React 18 + TypeScript + Vite，后端是 Cloudflare Worker（tRPC + DeepSeek AI）。

## 关键约定

- **SPA 状态路由**：无 URL 变化，页面切换靠状态，E2E 测试只能点击 UI 元素，不能用 `page.goto('/xxx')`
- **路径别名**：所有导入统一用 `@/`，不用相对路径
- **包管理器**：只用 `pnpm`，禁止 npm / yarn
- **Worker 独立**：`worker/` 目录有独立 `pnpm install`，前后端分开安装依赖

## 目录结构

```
src/features/{feature}/
  components/   # UI 组件
  data/         # 静态数据 / mock
  store/        # Jotai atoms
  types.ts      # 类型定义

worker/src/
  index.ts      # Worker 入口，CORS + tRPC 路由
  router.ts     # tRPC procedures

specs/{feature-name}/
  YYYY-MM-DD-requirements.md
  YYYY-MM-DD-design.md
  YYYY-MM-DD-tasks.md
```

## 常用命令

```bash
pnpm dev              # 开发服务器 :3010
pnpm build            # tsc + vite build
pnpm preview          # 预览构建产物 :4173（E2E 测试用）
pnpm test             # Vitest 单元测试
pnpm test:e2e         # Playwright E2E（需先 build）
pnpm test:coverage    # 覆盖率报告
tsc --noEmit          # 仅类型检查，不构建

# Worker
cd worker && pnpm install
cd worker && pnpm exec wrangler dev    # 本地 Worker
cd worker && pnpm exec wrangler deploy # 部署 Worker
```

## Pipeline 使用

```
/p0-pipeline <feature-name> <需求描述 或 JIRA URL>
```

示例：
```
/p0-pipeline recipe-search 用户需要按食材搜索菜谱，支持多选过滤
/p0-pipeline recipe-ai https://jira.company.com/browse/HR-123
```

## 注意事项

- 新建 UI 组件优先复用 `src/components/ui/`（shadcn/ui）
- API 调用统一走 `src/lib/trpc.ts`，不直接 fetch Worker
- Jotai atoms 放在对应 feature 的 `store/` 目录
- Worker secrets 只在环境变量配置，禁止硬编码在代码里
