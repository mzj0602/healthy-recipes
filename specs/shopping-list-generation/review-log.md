# Review Log — shopping-list-generation — 2026-03-24

## Round 1

### Codex 输出
The shopping-list feature is not fully reachable from the app's primary embedded plan view, and the clipboard export/keyboard-close behavior both miss expected user flows.

- [P1] Wire the embedded shopping-list trigger — health-plan-page.tsx:147: embedded 区块的"生成购物清单"按钮缺少 onClick，用户在主 App 嵌入视图中无法打开弹窗。
- [P1] Exclude checked items when copying — shopping-list-modal.tsx:48-51: handleCopy() 将已勾选（已购）的食材也一并复制，导致剩余采购清单不准确。
- [P2] Add Escape-key dismissal — shopping-list-modal.tsx: 弹窗缺少 keydown 事件处理，键盘用户无法按 Escape 关闭。

### Claude 修复
- ✅ health-plan-page.tsx embedded 按钮添加 `onClick={() => setIsShoppingListOpen(true)}`
- ✅ shopping-list-modal.tsx handleCopy 过滤 checked 中的已购条目，仅复制未勾选项
- ✅ shopping-list-modal.tsx 新增 Escape 键 keydown 监听，调用 onClose，组件卸载时移除监听

## Round 2

### Codex 输出
The new shopping-list aggregation logic can generate incorrect quantities for the default meal plan.

- [P1] Preserve per-meal quantities when merging identical ingredients — build-shopping-list.ts:16-19: merge key 仅用 name，相同食材不同用量（如 `香蕉` 半根/1根）会错误合并，显示 `半根 × 3 份`，实际用量被低估。

### Claude 修复
- ✅ build-shopping-list.ts itemMap 改用 `name|amount` 复合键，相同食材相同用量合并，不同用量独立显示
- ✅ shopping-list-modal.tsx checked/isChecked/id/htmlFor 全部改用 `name|amount` 复合键，避免 id 冲突和错误联动

## Round 3

### Codex 输出
Two required behaviors still missing or incompatible with FR-4.

- [P2] Copy format wrong — shopping-list-modal.tsx:55-62: 剪贴板内容含 `【蔬果类】` 分类头且无 `□` 前缀，不符合 FR-4 规定的 `□ 食材名 用量` 格式。
- [P2] Missing "取消全部勾选" — shopping-list-modal.tsx footer: FR-4/需求文档 line 50 明确要求该重置按钮，当前 footer 未实现。

### Claude 修复
- ✅ shopping-list-modal.tsx handleCopy 改为 `□ 食材名 用量` 纯文本格式，去除分类头
- ✅ shopping-list-modal.tsx footer 新增"取消全部勾选"按钮，调用 `setChecked(new Set())` 清除所有勾选

## 结论
- 共执行：3 轮
- Codex 发现问题：6 个（P1×3，P2×3）
- 已修复：6 个
- 遗留风险：无
✅ Review 通过

