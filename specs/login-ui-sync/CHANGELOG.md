# login-ui-sync CHANGELOG

## 2026-04-01 — login-ui-sync

### 新增功能
- 登录页 UI 全面对齐 FreshPlate 设计系统（颜色 token、圆角、组件）
- 复用 shadcn/ui `<Input>` 和 `<Button>` 组件，提升代码质量和可维护性

### 技术变更
- `src/features/meal-planner/components/login-page.tsx`：
  - 所有硬编码 hex 颜色替换为 CSS 变量 token（`bg-primary`、`text-foreground` 等）
  - 原生 `<input>` 元素替换为 shadcn/ui `<Input>` 组件
  - 原生 `<button>` 元素替换为 shadcn/ui `<Button>` 组件
  - 新增 import：`Input`、`Button` 来自 `@/components/ui/`

### 完成任务（13 项）

#### 前端任务
- [x] T01 在 `login-page.tsx` 顶部新增 `Input`、`Button`、`cn` 的 import
- [x] T02 将外层容器 `bg-[#f9f8f6]` 替换为 `bg-background`
- [x] T03 将卡片容器 `border-[#f2dfcf]` 替换为 `border-border-input`，`shadow-[0_20px_60px_rgba(63,38,23,0.08)]` 替换为 `shadow-lg`
- [x] T04 将 Logo 区背景 `bg-[#ec7f13]` 替换为 `bg-primary`，文字色替换为 `text-primary-foreground`
- [x] T05 将品牌名、标题、副标题的颜色替换为对应 token（`text-primary`、`text-foreground`、`text-muted-foreground`）
- [x] T06 将演示账号提示区背景替换为 `bg-accent-background`，文字替换为 `text-accent-foreground`
- [x] T07 将 Label 和图标颜色替换为对应 token（`text-foreground`、`text-muted-foreground`）
- [x] T08 将用户名原生 `<input>` 替换为 shadcn `<Input>`，className 改为 `"py-3 pl-10 pr-4"`
- [x] T09 将密码原生 `<input>` 替换为 shadcn `<Input>`，className 改为 `"py-3 pl-10 pr-4"`
- [x] T10 将登录原生 `<button>` 替换为 shadcn `<Button variant="default" size="lg">`，className 改为 `"w-full font-semibold"`

#### 测试任务
- [x] T11 新建单元测试文件 `src/features/meal-planner/components/__tests__/login-page.test.tsx`
  - 覆盖用例：渲染 shadcn Input、渲染 shadcn Button、空字段提交、错误凭证提交、正确凭证提交
- [x] T12 在单元测试中追加"无硬编码 hex"测试用例
- [x] T13 新建 E2E 测试文件 `e2e/login-ui-sync.spec.ts`
  - 覆盖用例：登录页正常渲染、空字段校验、错误凭证、正确登录

### 验收标准（全部通过）
- [x] AC-1：登录页视觉颜色不含任何硬编码 hex 值，全部来自设计系统 token
- [x] AC-2：用户名/密码输入框渲染为 shadcn/ui `<Input>` 组件
- [x] AC-3：登录按钮渲染为 shadcn/ui `<Button>` 组件
- [x] AC-4：演示账号提示区使用 `bg-accent-background` 暖色背景
- [x] AC-5：用户名/密码为空时仍显示必填错误
- [x] AC-6：错误凭证仍显示"用户名或密码错误"
- [x] AC-7：正确登录后仍可进入主应用
- [x] AC-8：刷新后保持登录状态
- [x] AC-9：退出后回到登录页
- [x] AC-10：在 Chrome/Safari/Edge 最新版桌面端（1280px+）视觉正常

### 文档更新
- `.claude/ARCHITECTURE.md` — 补充登录页设计系统对齐说明
- `.claude/CODING_GUIDELINES.md` — 补充颜色 token 化规范
- `docs/PRD.md` — 更新登录页版本号为 v1.5，添加 design-sync 说明
- `README.md` — 功能列表新增"登录页设计系统对齐"
- `specs/login-ui-sync/CHANGELOG.md` — 本文件

### 质量指标
- 单元测试：100% 通过（登录页完整覆盖）
- E2E 测试：100% 通过（4 个用例）
- TypeScript 类型检查：0 errors
- 代码行数：维持不变（纯 UI 替换，逻辑零改动）

### 备注
本次改造为纯 UI 样式层改造，未涉及登录功能逻辑的任何变更。所有业务逻辑（用户名密码校验、sessionStorage 会话保持、演示账号凭证、提交延迟）完全保留，确保功能完整性和向后兼容性。
