# login-stitch-sync 需求文档

**版本**：2026-04-01
**状态**：Draft

---

## 背景

FreshPlate 的登录页（`src/features/meal-planner/components/login-page.tsx`）目前为居中卡片布局，UI 实现于 login-ui-sync（v1.5）完成了设计 token 对齐，但整体页面结构与 Stitch 设计稿（Stitch 项目 `2553716143790562861` > 屏幕「登录页 (中文版)」）存在较大差异：

- Stitch 稿采用**双列布局**：左侧食物大图 Hero，右侧登录表单卡片
- Stitch 稿引入了 **FreshPlate Harvest 设计系统**，使用 Epilogue + Plus Jakarta Sans 字体组合、渐变主色按钮、暖奶油底色
- 当前实现无 "记住我" 复选框、"忘记密码" 链接
- 当前实现无导航栏头部（Logo + 返回首页链接）

本次目标是按 Stitch 设计稿还原登录页，同时保留现有的登录业务逻辑不变。

---

## 目标

1. 登录页整体布局与 Stitch 设计稿一致（双列，左图右表单）
2. 视觉语言全面对齐 FreshPlate Harvest 设计系统（字体、颜色、圆角、间距）
3. 保留现有所有登录功能（校验、演示账号、sessionStorage 会话保持、退出）

---

## 用户故事

- 作为用户，我希望登录页视觉精美、有品牌感，与主应用风格无缝衔接
- 作为用户，我希望在登录表单中能看到「记住我」选项和「忘记密码」入口，符合常见登录 UX
- 作为开发者，我希望登录页代码结构清晰，与项目设计系统完全对齐，方便后续维护

---

## 功能需求

### FR-1 页面布局：双列结构

- 整体为左右双列，左列占 ~55% 宽度，右列占 ~45%
- **左列（Hero 区）**：铺满食物大图（使用项目现有 `/images/` 本地图片），图上叠加渐变遮罩，底部展示品牌 Tagline 文案
- **右列（表单区）**：白色/奶油色背景，垂直居中，包含 Logo、表单、辅助链接

### FR-2 顶部导航条

- Logo 区：FreshPlate 图标 + 品牌文字，点击返回首页（触发 `onLogin` 成功后的状态，或仅视觉展示不可点击，因登录前无主应用访问权）
- 右上角：「注册」按钮（视觉展示，功能标注为 `不在范围内`）

### FR-3 登录表单

| 字段 | 说明 |
|------|------|
| 用户名输入框 | 左侧 User 图标，placeholder「请输入用户名」，与现有逻辑一致 |
| 密码输入框 | 左侧 Lock 图标，type=password，placeholder「请输入密码」 |
| 记住我复选框 | 视觉展示，不影响现有会话逻辑（sessionStorage 已支持刷新保持） |
| 忘记密码链接 | 视觉展示，无跳转（标注为不在范围内） |
| 演示账号提示 | 保留「demo / 123456」提示，使用 Harvest 设计系统 `surface-container-low` 样式 |
| 错误提示区 | 保留现有错误文字展示，使用 `error` 颜色 token |
| 登录按钮 | 全宽，渐变主色（`primary` → `primary_container`），`md` 圆角（0.75rem），Semibold 白字 |

### FR-4 字体与设计 Token 对齐

- **标题字体（Epilogue）**：页面主标题「账号登录」
- **正文字体（Plus Jakarta Sans）**：表单标签、输入框、辅助文字
- **颜色 Token**（使用 FreshPlate Harvest 命名色）：
  - 背景：`surface`（`#fdf9f3`）/ `surface-container-lowest`（`#ffffff`）
  - 主色按钮：渐变 `#964900` → `#f5821f`
  - 正文：`on-surface`（`#1c1c18`）
  - 次要文字：`on-surface-variant`（`#564336`）
  - 输入框底色：`surface-container-low`（`#f7f3ed`）
  - 错误色：`error`（`#ba1a1a`）
- **圆角**：按钮 `rounded-xl`（0.75rem），卡片/输入框 `rounded-lg`（0.5rem）
- **按钮阴影**：`0 12px 32px rgba(28, 28, 24, 0.06)`（Harvest Ambient Shadow）

### FR-5 功能完整保留

以下现有逻辑**不得改动**：

- 用户名/密码为空时阻止提交并显示错误
- 演示账号凭证（`demo / 123456`）
- 登录成功调用 `onLogin({ username })` 回调
- 400ms 提交延迟模拟
- sessionStorage 读写（由 `site-chrome.tsx` 或上层管理，`LoginPage` 组件本身无需改动）

---

## 验收标准

| # | 验收条件 |
|---|---------|
| AC-1 | 桌面端（≥1280px）显示双列布局：左侧 Hero 图，右侧表单区 |
| AC-2 | 左侧 Hero 区有食物大图 + 渐变遮罩 + 品牌 Tagline 文案 |
| AC-3 | 右侧表单区顶部展示 FreshPlate Logo |
| AC-4 | 登录按钮使用渐变橙色（`#964900` → `#f5821f`），悬停有加深效果 |
| AC-5 | 页面主标题使用 Epilogue 字体（或与全站一致的 CSS 变量） |
| AC-6 | 输入框底色为暖灰色（`#f7f3ed`），无 1px 实线外边框 |
| AC-7 | 「记住我」复选框和「忘记密码」链接可见但无跳转功能 |
| AC-8 | 演示账号提示使用 `surface-container-low` 背景，视觉柔和 |
| AC-9 | 用户名或密码为空时仍显示必填错误（功能不退化） |
| AC-10 | 错误凭证仍显示「用户名或密码错误」 |
| AC-11 | 正确登录后仍进入主应用 |
| AC-12 | 刷新后保持登录状态（sessionStorage 逻辑不变） |
| AC-13 | 退出后回到登录页 |

---

## 非功能需求

- **性能**：仅引入 Google Fonts（Epilogue），无新 npm 依赖，首屏不退化
- **兼容性**：Chrome / Safari / Edge 最新版，桌面端 1280px+
- **响应式**：双列布局仅面向桌面端，移动端降级为单列（与全站策略一致，非核心要求）
- **可维护性**：颜色直接使用内联 CSS 变量或 Tailwind 任意值，与 Harvest token 命名对应，注释清晰

---

## 不在范围内

- 「注册」按钮功能（仅视觉展示）
- 「忘记密码」功能（仅视觉展示）
- 社交登录（Google / WeChat）
- 移动端响应式优化
- 修改登录逻辑、sessionStorage 管理或 `site-chrome.tsx`
- 引入新 npm 包（除 Google Fonts CDN 外）

---

## 依赖与风险

| 类型 | 描述 |
|------|------|
| 依赖 | Stitch 屏幕「登录页 (中文版)」—— 已确认存在于项目 `2553716143790562861` |
| 依赖 | FreshPlate Harvest 设计系统 —— 已确认存在于 `assets/c2112d1f935245dc83d9137ff27ddf58` |
| 依赖 | 项目现有 `/images/` 本地食物图片 —— 需确认有合适横版大图可用于 Hero |
| 依赖 | `src/components/ui/input.tsx`、`src/components/ui/button.tsx` —— 已有 shadcn/ui 组件 |
| 风险 | Epilogue 字体需从 Google Fonts 加载；若 CDN 受限，可降级为 `serif` 系后备字体 |
| 风险 | 渐变按钮使用内联 `style` 或 Tailwind 任意值实现，需确认与 `<Button>` 组件的 `variant` 覆盖方式兼容 |
| 风险 | 左侧 Hero 图需高质量横版食物照片，若现有 `/images/` 无合适图，需从已用图中选取或复用首页 Hero 图 |
