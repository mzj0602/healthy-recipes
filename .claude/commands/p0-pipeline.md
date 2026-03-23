你是 FreshPlate 项目的 Pipeline 调度器，负责编排完整的需求开发流程。

接收参数格式：`<feature-name> <需求描述 或 JIRA URL>`

参数：$ARGUMENTS

## 执行步骤

### 第一步：解析参数
从 $ARGUMENTS 中提取：
- `FEATURE_NAME`：第一个词（英文，用于目录命名）
- `REQUIREMENT_SOURCE`：剩余部分（需求描述文字 或 JIRA URL）

### 第二步：初始化
1. 确认 `specs/{FEATURE_NAME}/` 目录存在，不存在则创建
2. 记录当前日期（格式 YYYY-MM-DD）
3. 告知用户："🚀 Pipeline 启动：{FEATURE_NAME}"

### 第三步：依次执行各阶段

按顺序执行以下指令，每个阶段完成后告知用户进度：

1. **P1 需求分析**
   执行：`/p1-require {FEATURE_NAME} {REQUIREMENT_SOURCE}`
   完成后提示：✅ P1 需求分析完成

2. **P2 技术设计**
   执行：`/p2-design {FEATURE_NAME}`
   完成后提示：✅ P2 技术设计完成

3. **P3 任务拆解**
   执行：`/p3-taskgen {FEATURE_NAME}`
   完成后提示：✅ P3 任务拆解完成

4. **判断执行策略**
   读取 `specs/{FEATURE_NAME}/` 最新 tasks.md 第一行的 Task Count：
   - 如果 tasks ≤ 8 且不涉及前后端同时变更 → 单 Agent 执行
   - 如果 tasks > 8 或同时涉及前端 + Worker → 启动并行 Sub-agents（worktree 模式）
   告知用户执行策略选择原因

5. **P4 开发**
   执行：`/p4-develop {FEATURE_NAME}`
   完成后提示：✅ P4 开发完成

6. **P5 代码 Review**
   执行：`/p5-review {FEATURE_NAME}`
   完成后提示：✅ P5 Review 通过

7. **P6 测试**
   执行：`/p6-test {FEATURE_NAME}`
   完成后提示：✅ P6 测试全部通过

8. **P7 文档同步**
   执行：`/p7-docsync {FEATURE_NAME}`
   完成后提示：✅ P7 文档同步完成

### 第四步：收尾
1. 创建 Pull Request（如有 gh CLI 可用）
2. 输出总结报告：
   - 功能名称
   - 完成的任务数量
   - 测试结果摘要
   - specs 文件路径
3. 提示："🎉 Pipeline 完成：{FEATURE_NAME}"

## 异常处理

- 任何阶段失败时，立即停止并报告失败原因
- 不自动跳过失败阶段
- 输出明确的错误信息供用户判断
