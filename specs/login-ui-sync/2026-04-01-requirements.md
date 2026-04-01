# login-ui-sync 需求文档

**版本**：2026-04-01
**状态**：Draft

---

## 背景

FreshPlate 登录页（`src/features/meal-planner/components/login-page.tsx`）在功能层面已实现用户名密码登录、表单校验、sessionStorage 会话保持，但 UI 实现与当前项目设计系统存在明显偏差：

- 使用硬编码 hex 颜色（`bg-[#ec7f13]`、`text-[#3f2617]` 等）而非 CSS 变量 token（`bg-primary`、`text-foreground`）
- 未复用 `src/components/ui/` 中已有的 shadcn/ui 组件（`<Input>`、`<Button>`）
- 圆角、焦点环宽度等细节与设计系统不一致（`rounded-xl` vs `rounded-[14px]`）
- 整体视觉质感与其他已完成页面（菜谱探索、饮食计划等）存在差异

本次目标是在**不破坏现有登录能力**的前提下，将登录页 UI 对齐 FreshPlate 全局设计系统。

---

## 目标

1. 登录页视觉全面对齐 FreshPlate 设计规范（颜色 token、圆角、字体、间距、组件）
2. 复用 shadcn/ui `<Input>` 和 `<Button>` 组件，删除冗余自定义样式
3. 保留全部现有登录功能（用户名密码校验、演示账号、会话保持、退出）

---

## 用户故事

- 作为用户，我希望登录页的视觉风格与 FreshPlate 主应用保持一致，感受到品牌连贯性
- 作为开发者，我希望登录页使用统一设计 token，方便全局主题修改时自动同步

---

## 功能需求

1. **组件替换**：将登录表单中的 `<input>` 替换为 `src/components/ui/input.tsx` 的 `<Input>`，`<button>` 替换为 `src/components/ui/button.tsx` 的 `<Button variant="default" size="lg">`
2. **颜色 Token 化**：全部移除硬编码 hex，改用 CSS 变量引用的 Tailwind token：
   - 背景：`bg-background`
   - 主色：`bg-primary` / `text-primary`
   - 前景文字：`text-foreground`
   - 次要文字：`text-muted-foreground`
   - 强调背景：`bg-accent-background` / `text-accent-foreground`
   - 边框：`border-border-input`
3. **圆角统一**：卡片使用 `rounded-xl`（16px），输入框/按钮遵循 shadcn/ui 组件内置圆角（`rounded-[14px]`），不额外覆盖
4. **焦点环**：Input 组件已包含 `focus-visible:ring-4 focus-visible:ring-ring/30`，无需在使用处重复定义
5. **演示账号提示**：保留提示框，背景改为 `bg-accent-background`、文字改为 `text-accent-foreground`，与设计系统一致
6. **图标前缀**：Input 字段左侧保留 User / Lock 图标，图标颜色改为 `text-muted-foreground`
7. **品牌标识**：顶部 Logo 区保留 FreshPlate 文字 + 图标，颜色使用 `text-primary` / `bg-primary`
8. **功能完整保留**：不改动任何校验逻辑、演示账号凭证、sessionStorage 读写、提交延迟（400ms）、`onLogin` 回调

---

## 验收标准

| # | 验收条件 |
|---|---------|
| AC-1 | 登录页视觉颜色不含任何硬编码 hex 值，全部来自设计系统 token |
| AC-2 | 用户名/密码输入框渲染为 shadcn/ui `<Input>` 组件，具备正确焦点环（橙色，与其他页面一致） |
| AC-3 | 登录按钮渲染为 shadcn/ui `<Button>` 组件，hover/disabled 状态与全局按钮一致 |
| AC-4 | 演示账号提示区使用 `bg-accent-background` 暖色背景，无视觉突兀 |
| AC-5 | 用户名/密码为空时仍显示必填错误，功能不退化 |
| AC-6 | 错误凭证仍显示"用户名或密码错误" |
| AC-7 | 正确登录后仍可进入主应用 |
| AC-8 | 刷新后保持登录状态（sessionStorage 逻辑不变） |
| AC-9 | 退出后回到登录页（现有逻辑不变） |
| AC-10 | 在 Chrome/Safari/Edge 最新版桌面端（1280px+）视觉正常 |

---

## 非功能需求

- **性能**：纯 UI 改造，无新增依赖，首屏渲染性能不退化
- **兼容性**：Chrome / Safari / Edge 最新版，桌面端 1280px+
- **可维护性**：改造后代码量不应增加，删除冗余自定义样式后代码更精简

---

## 不在范围内

- 不改动登录逻辑（校验、会话保存、退出流程）
- 不添加新字段（注册、找回密码、社交登录）
- 不做响应式移动端适配（与全站一致，以桌面端为主）
- 不引入新的 npm 依赖
- 不修改 `site-chrome.tsx` 或应用入口的登录态管理逻辑

---

## 依赖与风险

| 类型 | 描述 |
|------|------|
| 依赖 | `src/components/ui/input.tsx` — 已有 shadcn/ui Input |
| 依赖 | `src/components/ui/button.tsx` — 已有 shadcn/ui Button |
| 依赖 | `src/app/styles.css` — CSS 变量 token 定义（`--primary`、`--border-input` 等） |
| 风险 | Input 组件内置左侧无 padding slot，图标前缀需要 `relative` 包裹层 + `absolute` 定位，改造后需目测确认图标不遮挡文字 |
| 风险 | Button 组件默认 `h-10`（40px），若原登录页按钮高度为 `py-3`（44px），需用 `size="lg"`（h-11）保持视觉高度 |
