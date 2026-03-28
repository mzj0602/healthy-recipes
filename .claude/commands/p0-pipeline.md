你是 FreshPlate 项目的 Pipeline 调度器，负责编排完整的需求开发流程。

接收参数格式：`<feature-name> <需求描述 或 JIRA URL>`

参数：$ARGUMENTS

## 执行步骤

### 第一步：解析参数
从 $ARGUMENTS 中提取：
- `FEATURE_NAME`：第一个词（英文，用于目录命名）
- `REQUIREMENT_SOURCE`：剩余部分（需求描述文字 或 JIRA URL）

### 第二步：读取模型配置
读取 `.claude/PIPELINE_MODELS.md`，获取各阶段使用的模型分配。

### 第三步：初始化
1. 确认 `specs/{FEATURE_NAME}/` 目录存在，不存在则创建
2. 记录当前日期（格式 YYYY-MM-DD）
3. 创建功能分支（如不在该分支上）：
   ```bash
   git checkout -b feature/{FEATURE_NAME}
   ```
   已在 `feature/{FEATURE_NAME}` 上则跳过；在 `main` 上有未提交变更则先 stash 再建分支。
4. 告知用户："🚀 Pipeline 启动：{FEATURE_NAME}（分支：feature/{FEATURE_NAME}）"

### 第四步：依次执行各阶段

按顺序执行以下阶段，每个阶段通过 Agent tool 启动子 agent，使用 PIPELINE_MODELS.md 中对应的模型。

**通用规则**：每个 Agent 调用需将对应 `p*.md` skill 文件的完整内容作为 prompt，并将 `$ARGUMENTS` 替换为实际参数值。

---

1. **P1 需求分析**（模型：haiku）
   使用 Agent tool 启动子 agent：
   - model: `"haiku"`
   - prompt: `.claude/commands/p1-require.md` 的内容，`$ARGUMENTS` = `{FEATURE_NAME} {REQUIREMENT_SOURCE}`
   完成后提示：✅ P1 需求分析完成

   **⏸ 暂停，等待用户确认：**
   输出 P1 摘要中的核心功能点，询问用户："需求理解是否正确？回复"确认"继续，或直接说明修改意见。"
   - 用户回复"确认"或类似肯定词 → 继续
   - 用户提出修改 → 将修改意见追加到 requirements.md，再继续

2. **P2 技术设计**（模型：opus）
   使用 Agent tool 启动子 agent：
   - model: `"opus"`
   - prompt: `.claude/commands/p2-design.md` 的内容，`$ARGUMENTS` = `{FEATURE_NAME}`
   完成后提示：✅ P2 技术设计完成

3. **P3 任务拆解**（模型：sonnet）
   使用 Agent tool 启动子 agent：
   - model: `"sonnet"`
   - prompt: `.claude/commands/p3-taskgen.md` 的内容，`$ARGUMENTS` = `{FEATURE_NAME}`
   完成后提示：✅ P3 任务拆解完成

5. **判断执行策略**
   读取 `specs/{FEATURE_NAME}/` 最新 tasks.md 第一行的 Task Count：
   - 如果 tasks ≤ 8 且不涉及前后端同时变更 → 单 Agent 执行
   - 如果 tasks > 8 或同时涉及前端 + Worker → 启动并行 Sub-agents（worktree 模式）
   告知用户执行策略选择原因

6. **P4 开发**（模型：sonnet）
   使用 Agent tool 启动子 agent：
   - model: `"sonnet"`
   - prompt: `.claude/commands/p4-develop.md` 的内容，`$ARGUMENTS` = `{FEATURE_NAME}`
   完成后提示：✅ P4 开发完成

7. **P5 代码 Review**（模型：sonnet）
   使用 Agent tool 启动子 agent：
   - model: `"sonnet"`
   - prompt: `.claude/commands/p5-review.md` 的内容，`$ARGUMENTS` = `{FEATURE_NAME}`
   完成后提示：✅ P5 Review 通过

8. **P6 测试**（模型：sonnet）
   使用 Agent tool 启动子 agent：
   - model: `"sonnet"`
   - prompt: `.claude/commands/p6-test.md` 的内容，`$ARGUMENTS` = `{FEATURE_NAME}`
   完成后提示：✅ P6 测试全部通过

9. **P7 文档同步**（模型：haiku）
   使用 Agent tool 启动子 agent：
   - model: `"haiku"`
   - prompt: `.claude/commands/p7-docsync.md` 的内容，`$ARGUMENTS` = `{FEATURE_NAME}`
   完成后提示：✅ P7 文档同步完成

10. **P8 提交 & PR**（模型：haiku）
   使用 Agent tool 启动子 agent：
   - model: `"haiku"`
   - prompt: `.claude/commands/p8-commit.md` 的内容，`$ARGUMENTS` = `{FEATURE_NAME}`
   完成后提示：✅ P8 提交完成（等待用户选择推送方式）

### 第五步：收尾
输出总结报告：
- 功能名称、完成任务数、测试结果摘要、specs 路径
- 提示："🎉 Pipeline 完成：{FEATURE_NAME}"

## 异常处理

- 任何阶段失败时，立即停止并报告失败原因
- 不自动跳过失败阶段
- 输出明确的错误信息供用户判断

**回滚指引：**

P1/P2/P3 失败（仅文档变更）：
```bash
git checkout -- specs/{FEATURE_NAME}/
```

P4/P5 失败（代码已改动）：
```bash
git stash  # 保留改动备查
# 或
git checkout -- .  # 放弃所有未提交变更
```

P6/P7 失败（代码已通过但测试/文档有问题）：
- 保留代码，人工修复测试后重新从 P6 执行
- 输出：
```
PIPELINE_FAILED: {FEATURE_NAME} 在 {阶段} 失败，需人工介入
```
