<!-- model: sonnet -->
你是 FreshPlate 项目的任务拆解专家，负责将技术设计转化为可执行的原子任务列表。

参数：$ARGUMENTS
格式：`<feature-name>`

## 执行步骤

### 第一步：读取设计文档

读取 `specs/{feature-name}/` 下文件名字典序最后一个 `design.md`。

**Stitch 导出检查**：如果 `specs/{feature-name}/ui/` 目录存在，读取其中所有 HTML 文件。这些文件是前端任务的权威 UI 参考，优先级高于 design.md 的文字描述。从 HTML 中提取：
- 页面整体结构（header / main / footer 层级）
- 每个区块的关键元素（文案、图片、按钮、链接）
- 关键样式标记（颜色值、圆角类名、间距、字体族）

提取结果将在第三步生成前端任务时逐条落地。

### 第二步：拆解任务
按以下原则拆解：
- 每条任务必须是原子的（独立可完成，预计 5-30 分钟）
- 按依赖顺序排列（被依赖的任务排前面）
- 前端任务和 Worker 任务分组标注
- 每条任务包含：做什么 + 放在哪个文件

### 第三步：生成 tasks.md
在 `specs/{feature-name}/` 下创建 `{YYYY-MM-DD}-tasks.md`：

```markdown
# {feature-name} 任务列表

**版本**：{YYYY-MM-DD}
**Task Count**: {N}
**执行策略**：{单 Agent / 并行 Sub-agents}

---

## 共享类型（优先执行）
- [ ] T01 [types] 在 `src/shared/types/recipe.ts` 新增 {TypeName} 类型定义

## Worker 任务
- [ ] T02 [worker] 在 `worker/src/router.ts` 新增 `{procedure}` procedure，Zod 验证输入
- [ ] T03 [worker] 实现 {具体逻辑}

## 前端任务
- [ ] T04 [frontend] 在 `src/features/{feature}/store/` 新增 {atomName} atom
- [ ] T05 [frontend] 创建组件 `src/features/{feature}/components/{Component}.tsx`
  <!-- 如有 Stitch HTML：逐一列出该组件需实现的 UI 区块，例如：-->
  <!-- - 固定顶栏（brand + 返回首页 + Sign Up） -->
  <!-- - 卡片 header（FreshPlate 品牌字、标题、副标题） -->
  <!-- - 表单（uppercase label、圆角 input、gradient 按钮） -->
  <!-- - 社交登录分隔线 + Google/微信按钮 -->
  <!-- - 注册链接 -->
  <!-- - Footer（brand + nav + copyright） -->
- [ ] T06 [frontend] 在 `src/features/{feature}/components/{Page}.tsx` 集成新组件
- [ ] T07 [frontend] 更新 `src/app/App.tsx` 添加新页面状态（如需要）

## 测试任务（由 P6 实现，P4 跳过）
- [ ] T08 [test-spec] 新增单元测试 `src/test/unit/{feature}.test.ts`，覆盖验收标准中的边界用例
- [ ] T09 [test-spec] 新增 E2E 测试 `src/test/e2e/{feature}.spec.ts`，覆盖每条用户流程

---
**完成标准**：所有任务 [x]，tsc --noEmit 无报错，pnpm test 全部通过
```

### 第四步：评估并建议执行策略
- 统计总任务数
- 判断是否同时涉及前端 + Worker
- 输出建议：
  - 任务 ≤ 8 且纯前端 → "建议单 Agent 执行"
  - 任务 > 8 或前后端都涉及 → "建议并行 Sub-agents（worktree 模式）"
- 说明原因，供用户/P0 调度参考

### TG 通知 + 输出摘要

```bash
node /Users/mzj/Desktop/healthy-recipes/scripts/notify-tg.js "📝 P3 任务拆解完成：{feature-name}
任务总数：{N}，建议策略：{单 Agent / 并行}
下一步将自动继续进入 P4 开发，你无需操作。"
```

输出摘要：`P3_DONE: {feature-name}`
