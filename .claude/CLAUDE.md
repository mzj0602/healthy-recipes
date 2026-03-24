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

## 自然语言触发 Pipeline

**当用户用中文描述一个需求或功能改动时，自动执行以下步骤，无需用户输入任何指令：**

1. 从描述中提取功能关键词，生成英文 feature-name（如"搜索功能" → `recipe-search`）
2. 自动执行 `/p0-pipeline {feature-name} {原始描述}`

例如用户输入：
> 我想加一个收藏菜谱的功能，用户可以点击心形图标收藏，在个人中心查看

Claude 自动识别为新需求，提取 feature-name 为 `recipe-favorite`，触发完整 Pipeline。

**判断是否为新需求的标准：**
- 描述中包含"想要"、"加一个"、"新增"、"实现"、"支持"、"改一下"、"修改"等关键词
- 或描述的是一个具体功能点

**不触发 Pipeline 的情况：**
- 用户在问问题（"这个文件是干什么的？"）
- 用户在查看文件或调试
- 用户明确说"不用 Pipeline"

## 注意事项

- 新建 UI 组件优先复用 `src/components/ui/`（shadcn/ui）
- API 调用统一走 `src/lib/trpc.ts`，不直接 fetch Worker
- Jotai atoms 放在对应 feature 的 `store/` 目录
- Worker secrets 只在环境变量配置，禁止硬编码在代码里
