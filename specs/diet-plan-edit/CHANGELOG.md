## 2026-03-24 — diet-plan-edit

### 新增功能

- 点击"编辑计划"按钮弹出 `EditPlanModal` 对话框
- 弹窗支持七天 Tab 切换，逐日编辑餐食列表
- 每条餐食可编辑名称（maxLength=100）和卡路里（min=0）
- 支持添加餐食（默认 type='其他'）和删除餐食（仅剩 1 条时 disabled）
- 营养目标编辑：`valueLabel` 文本 + `percent` 数字（超范围自动截断至 0–100）
- 保存时对全部七天执行校验（title 非空、calories 为有效非负整数）
- 校验通过后写入 `localStorage('health-plan-data')` 并更新看板，刷新后数据保持
- 取消/×/蒙层关闭弹窗时丢弃草稿，原数据不变

### 技术变更

- 新增组件：`src/features/health-plan/components/edit-plan-modal.tsx`
  - 弹窗框架（Dialog/蒙层）、`role="dialog"` + `aria-modal="true"`
  - 局部 `useState` 管理草稿：`draftPlan`、`draftGoals`、`activeDayId`、`errors`
  - 深拷贝隔离：打开时从 props 深拷贝，关闭时草稿丢弃
- 修改：`src/features/health-plan/components/health-plan-page.tsx`
  - 新增 `loadFromStorage` / `handleSave` 工具函数（带 try/catch 容错）
  - 新增 `plan`、`goals`、`isEditOpen` 状态
  - 初始化从 `localStorage('health-plan-data')` 读取，格式不合法回退默认数据
  - 条件渲染 `<EditPlanModal>`
- 无 Worker / tRPC 变更，纯前端 localStorage 持久化

### 完成任务

- [x] T01 HealthPlanPage 新增 loadFromStorage / handleSave 及状态初始化
- [x] T02 EditPlanModal 弹窗框架与 Props 接口实现
- [x] T03 日期 Tab 切换功能
- [x] T04 餐食行编辑（title/calories 双向绑定、添加、删除）
- [x] T05 营养目标编辑（percent 实时截断）
- [x] T06 保存校验与取消逻辑
- [x] T07 单元测试（7 项用例）
- [x] T08 E2E 测试（覆盖 AC-1 ~ AC-10）

### 文档更新

- `docs/PRD.md`：版本升至 v1.2，2.4 节新增编辑弹窗功能行和验收标准，新增 2.5 节 EditPlanModal 功能说明
- `README.md`：功能列表更新"个人健康周计划"说明
- `.claude/ARCHITECTURE.md`：新增 localStorage 本地持久化数据流说明和 key 索引表
- `.claude/SECURITY.md`：新增 localStorage 安全规范（try/catch、结构校验、禁止存储敏感数据）
- `.claude/CODING_GUIDELINES.md`：新增 localStorage 使用规范（读写模板、草稿模式）
