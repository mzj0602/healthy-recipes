# FreshPlate 健康菜谱平台

面向健康饮食人群的 Web 应用，提供菜谱浏览、饮食计划管理和 AI 菜谱生成功能。

**技术栈**：React 18 + TypeScript + Vite + TailwindCSS + Jotai + tRPC + Cloudflare Worker

---

## 功能列表

| 功能 | 状态 | 说明 |
|------|------|------|
| 网站首页 | ✅ | Hero Banner、今日推荐、热门分类、博客 |
| 菜谱探索页 | ✅ | 关键词搜索 + 多维度筛选（热量/时间/难度/过敏原） |
| 菜谱详情页 | ✅ | 食材清单、烹饪步骤、营养成分表、用户评论 |
| 个人健康周计划 | ✅ | 一周饮食日历、营养目标进度条 |
| AI 菜谱生成 | ✅ | DeepSeek AI 根据营养偏好生成菜谱建议 |
| 导航栏全局搜索 | ✅ | 任意页面可展开搜索框，回车直达菜谱探索页 |

---

## 本地开发

```bash
# 安装依赖
pnpm install

# 启动前端开发服务器（:3010）
pnpm dev

# 类型检查
tsc --noEmit

# 单元测试
pnpm test

# 构建
pnpm build

# 预览构建产物（:4173，E2E 测试用）
pnpm preview

# E2E 测试（需先 build）
pnpm test:e2e

# 覆盖率报告
pnpm test:coverage
```

## Worker 开发

```bash
cd worker
pnpm install

# 本地 Worker
pnpm exec wrangler dev

# 部署 Worker
pnpm exec wrangler deploy
```

---

## 目录结构

```
src/
  features/         # 按功能模块拆分
    meal-planner/   # 首页、菜谱探索、详情、计划页、SiteChrome
    recipes/        # 菜谱数据、store atoms
  components/ui/    # shadcn/ui 通用组件
  lib/              # trpc client、utils
  shared/types/     # 跨 feature 共享类型
  test/
    unit/           # Vitest 单元测试
    e2e/            # Playwright E2E 测试

worker/src/
  index.ts          # Worker 入口（CORS + 路由）
  router.ts         # tRPC procedures

specs/              # 每个 feature 的需求/设计/任务文档
docs/               # PRD 等产品文档
```

---

## 部署

| 环境 | 服务 | 触发方式 |
|------|------|----------|
| 前端 | Cloudflare Pages | push main → GitHub Actions |
| 后端 | Cloudflare Worker | push main → GitHub Actions |

所需 Secrets：`CLOUDFLARE_API_TOKEN`、`CLOUDFLARE_ACCOUNT_ID`
