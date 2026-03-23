## 2026-03-23 — header-search

### 新增功能

- 导航栏右上角（个人中心左侧）新增可展开/收起的全局搜索框
- 点击搜索图标后，输入框以 200ms CSS transition 动画展开，并自动聚焦
- 输入关键词按 Enter，切换至菜谱探索页并自动填入关键词触发筛选
- 已在菜谱探索页时，直接更新搜索状态，无页面重新挂载
- 点击输入框外部（onBlur + 150ms 延迟）或按 Esc 键收起搜索框
- 空关键词按 Enter 不触发任何副作用

### 技术变更

- `site-chrome.tsx`：内联定义 `HeaderSearch` 组件（`isExpanded` / `localValue` 本地 state + `searchAtom` 全局写入），在 SiteChrome header 区域渲染
- `recipe-explore-page.tsx`：将 `const [query, setQuery] = useState('')` 替换为 `useAtom(searchAtom)`，使探索页搜索栏与全局 `searchAtom` 同步
- 无新增 tRPC procedure，无 Worker 变更

### 完成任务

- [x] T01 在 `site-chrome.tsx` 内联实现 `HeaderSearch` 组件
- [x] T02 修改 `recipe-explore-page.tsx`，将 query state 迁移至 `searchAtom`
- [x] T03 新增单元测试 `src/test/unit/header-search.test.tsx`（5 个测试用例）
- [x] T04 新增 E2E 测试 `src/test/e2e/header-search.spec.ts`（4 个流程）

### 文档更新

- `docs/PRD.md`：版本升至 v1.1，更新导航栏功能描述，新增"五、全局导航栏搜索"章节，更新首页验收标准
- `README.md`：新建项目根目录 README，包含功能列表、本地开发命令、目录结构、部署说明
- `.claude/ARCHITECTURE.md`：（待更新）补充 `HeaderSearch` 组件和全局 Atoms 说明
- `.claude/CODING_GUIDELINES.md`：（待更新）补充延迟写入模式说明
