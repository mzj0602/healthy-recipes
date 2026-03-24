## 2026-03-24 — shopping-list-generation

### 新增功能

- 点击健康计划页"生成购物清单"按钮，弹出 `ShoppingListModal` 购物清单弹窗
- 基于当前周计划（`localStorage('health-plan-data')`）通过静态映射表自动推导本周所需食材
- 食材按五类分组展示：蔬果类 → 肉蛋类 → 主食类 → 调料类 → 其他，弹窗标题显示食材总数
- 相同食材去重合并，用量累加（格式：`"150g × 3 份"`）
- 支持复选框勾选已购食材（文字变灰 + 删除线），弹窗关闭后自动重置
- 支持"复制文字"将未勾选食材以纯文本写入剪贴板（不支持时自动隐藏按钮）
- 支持"取消全部勾选"重置所有复选框
- 空状态：计划无餐食时显示提示 + "去编辑计划"按钮，可联动打开 `EditPlanModal`
- 未匹配映射表的餐食生成占位条目（`category: '其他'`），不报错

### 技术变更

- **新增类型**（`src/features/health-plan/types.ts`）：`IngredientCategory`、`IngredientEntry`、`ShoppingItem`
- **新增数据文件**（`src/features/health-plan/data/meal-ingredients-map.ts`）：覆盖 28 条默认餐食的静态映射表
- **新增工具函数**（`src/features/health-plan/utils/build-shopping-list.ts`）：纯函数，将 `DayPlan[]` 转换为 `Map<IngredientCategory, ShoppingItem[]>`
- **新增组件**（`src/features/health-plan/components/shopping-list-modal.tsx`）：购物清单弹窗，接收 `plan`、`onClose`、`onOpenEditPlan` props
- **修改**（`src/features/health-plan/components/health-plan-page.tsx`）：新增 `isShoppingListOpen` state，连接"生成购物清单"按钮与弹窗
- 无 Worker / tRPC / Jotai atom 变更，全程纯前端计算

### 完成任务

- [x] T01 新增 `IngredientCategory`、`IngredientEntry`、`ShoppingItem` 类型定义
- [x] T02 创建 `meal-ingredients-map.ts`，补全 28 条默认餐食映射
- [x] T03 创建 `build-shopping-list.ts`，实现去重 + 分组纯函数
- [x] T04 创建 `ShoppingListModal` 组件
- [x] T05 修改 `HealthPlanPage`，接入购物清单弹窗
- [x] T06 新增单元测试（映射覆盖率、去重逻辑、占位回退、分组顺序、空计划）
- [x] T07 新增 E2E 测试（AC-1 ～ AC-6 全覆盖）

### 文档更新

- `docs/PRD.md`：版本升至 v1.3，2.4 节增加购物清单弹窗说明，新增 2.6 节详细描述功能与验收标准
- `README.md`：功能列表新增"购物清单生成"条目
- `.claude/ARCHITECTURE.md`：补充 health-plan feature 模块结构说明及购物清单数据流
- `.claude/SECURITY.md`：补充剪贴板 API 安全规范
- `.claude/CODING_GUIDELINES.md`：补充 `utils/` 纯函数规范
- `specs/shopping-list-generation/CHANGELOG.md`：本文件（新建）
