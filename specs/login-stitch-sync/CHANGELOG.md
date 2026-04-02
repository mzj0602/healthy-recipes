## 2026-04-02 — login-stitch-sync

### 新增功能
- 登录页整体布局升级为双列结构（左 55% Hero 食物大图区 + 右 45% 表单区），桌面端 ≥1024px 可见，移动端降级为单列
- 左侧 Hero 区：食物大图（`featured-quinoa-bowl.jpg`）+ 渐变遮罩 + 品牌 Tagline（Epilogue 字体）
- 右侧表单区顶部添加品牌导航条（FreshPlate 文字 + 视觉「注册」按钮占位）
- 登录按钮升级为 Harvest 渐变橙色（`#964900 → #f5821f`），悬停有轻微放大动画
- 输入框改为无边框暖灰底色（`#f7f3ed`），风格更贴合设计系统
- 新增「记住我」复选框与「忘记密码」视觉占位元素
- `index.html` 新增 Google Fonts Epilogue 字体预连接与加载（wght@700;800，display=swap）

### 技术变更
- 唯一修改文件：`src/features/meal-planner/components/login-page.tsx`（布局与视觉重构）
- `index.html` 新增 3 行 Google Fonts `<link>` 标签
- 所有 Harvest 颜色 token（hex 值）提取为 `const harvest` 常量对象，仅通过 `style` prop 注入；`className` 中零硬编码 hex 值（满足单元测试 T12 约束）
- 现有所有业务逻辑（`handleSubmit`、`demoAccount`、`onLogin`、400ms 延迟、sessionStorage）保持不变
- 所有 E2E 选择器（`getByRole`、`getByLabel`、`getByText`、`getByPlaceholder`）兼容性经分析确认无破坏

### 完成任务
- [x] T01 在 `index.html` 添加 Google Fonts Epilogue `<link>` 标签
- [x] T02 重构 `login-page.tsx` 双列布局（Hero 区）
- [x] T03 右侧表单区顶部导航条
- [x] T04 表单元素 Harvest 样式（输入框、渐变按钮、记住我、忘记密码、演示账号提示）
- [x] T05 主标题 Epilogue 字体 + 完整业务逻辑保留验证

### 文档更新
- `docs/PRD.md`：第 2.7 节追加 v1.6 变更说明
- `specs/login-stitch-sync/CHANGELOG.md`：本文件（新建）
- `specs/login-stitch-sync/review-log.md`：Codex Review 日志（新建）
- `specs/login-stitch-sync/2026-04-02-tasks.md`：任务列表（新建，所有任务已完成）
