你是 FreshPlate 项目的 Pipeline 调度器，负责编排完整的需求开发流程。

接收参数格式：`<feature-name> <需求描述 或 JIRA URL> [--from <stage>]`

参数：$ARGUMENTS

## 执行模式说明

本流水线运行在 `claude --print` 非交互模式下，**每次调用只执行到下一个暂停点后退出**。
暂停点由 openclaw（外部调度器）负责等待用户确认后再触发下一次调用。

暂停点：
- P1 完成后（等待需求确认）
- P7 完成后（等待选择推送方式）

P2b→P2→P3→P4→P5→P6→P7 自动接续，无需用户干预。

## 通知职责边界

- **各阶段完成通知**：由各阶段命令文件（p1~p8）自己发送，p0 不重复发
- **暂停点通知**：由 p0 负责（P1 后的确认请求、P7 后的推送选项）
- **最终完成通知**：由 p8-commit.md 负责，含 commit hash 和推送结果

维护原则：新增或修改阶段时，通知逻辑写在阶段文件内，不要在 p0 里追加。

## 执行步骤

### 第一步：解析参数

从 $ARGUMENTS 中提取：
- `FEATURE_NAME`：第一个词（英文）
- `START_STAGE`：`--from` 后的值（如 `p2`），无则默认从 `p1` 开始
- `REQUIREMENT_SOURCE`：除 FEATURE_NAME 和 `--from <stage>` 之外的部分

**specs 文件读取约定（全流水线通用）：**
`specs/{FEATURE_NAME}/` 下同类文件可能存在多个日期版本（如 `2026-03-28-design.md`、`2026-03-29-design.md`），**统一按文件名字典序取最后一个**，即日期前缀最大的为最新版本。

### 第二步：读取模型配置

读取 `.claude/PIPELINE_MODELS.md`，获取各阶段模型分配。

### 第三步：初始化（仅 START_STAGE=p1 时执行）

1. 确认 `specs/{FEATURE_NAME}/` 目录存在，不存在则创建
2. 记录当前日期（格式 YYYY-MM-DD）
3. 创建功能分支（如不在该分支上）：
   ```bash
   git checkout -b feature/{FEATURE_NAME}
   ```
   已在 `feature/{FEATURE_NAME}` 上则跳过；在 `main` 上有未提交变更则先 stash 再建分支。
4. 通知用户："🚀 Pipeline 启动：{FEATURE_NAME}（分支：feature/{FEATURE_NAME}）"

### 第四步：按 START_STAGE 执行

根据 START_STAGE 跳转到对应入口，**向后执行直到遇到暂停点退出**。

---

#### 入口 p1

1. **P1 需求分析**（模型：haiku）
   使用 Agent tool 启动子 agent，prompt 为 `p1-require.md` 内容，参数 `{FEATURE_NAME} {REQUIREMENT_SOURCE}`
   完成后提示：✅ P1 需求分析完成

2. **发送 TG 通知并退出**
   ```bash
   node scripts/notify-tg.js "📋 P1 需求分析完成：{FEATURE_NAME}
   核心功能点：{P1摘要，不超过3条}

   现在需要你确认需求理解。
   请回复「确认」继续，或直接回复修改意见。"
   ```
   ⛔ **退出，等待用户确认。**

---

#### 入口 confirm（用户回复"确认"后由 openclaw 触发；该入口会从 P2b 开始继续后续链路）

若用户在确认时附带了修改意见，将修改意见追加到 `specs/{FEATURE_NAME}/` 文件名字典序最后一个 requirements.md 后再继续。

按顺序执行以下阶段，每阶段完成后自动接续：

3. **P2b UI 设计稿**（模型：sonnet）
   prompt 为 `p2b-ui.md` 内容，参数 `{FEATURE_NAME}`

4. **P2 技术设计**（模型：opus）
   prompt 为 `p2-design.md` 内容，参数 `{FEATURE_NAME}`

5. **P3 任务拆解**（模型：sonnet）
   prompt 为 `p3-taskgen.md` 内容，参数 `{FEATURE_NAME}`

6. **执行策略**
   当前统一走单 Agent 串行执行。
   <!-- TODO: 并行 Sub-agents 未实现。前后端存在接口依赖顺序，且合并 worktree 有冲突风险，待项目规模增大后再评估。 -->

7. **P4 开发**（模型：sonnet）
   prompt 为 `p4-develop.md` 内容，参数 `{FEATURE_NAME}`

8. **P5 代码 Review**（模型：sonnet）
   prompt 为 `p5-review.md` 内容，参数 `{FEATURE_NAME}`

9. **P6 测试**（模型：sonnet）
   prompt 为 `p6-test.md` 内容，参数 `{FEATURE_NAME}`

10. **P7 文档同步**（模型：haiku）
    prompt 为 `p7-docsync.md` 内容，参数 `{FEATURE_NAME}`

11. **发送 TG 通知并退出**
    ```bash
    node scripts/notify-tg.js "📚 P7 文档同步完成：{FEATURE_NAME}
    代码已就绪。
    现在需要你选择下一步，请回复以下选项之一继续：
    1 — 本地提交并推送分支
    2 — 本地提交、推送分支并创建 PR
    3 — 仅本地提交，暂不推送"
    ```
    ⛔ **退出，等待用户回复 1/2/3 触发 P8。**

---

#### 入口 p2b（跳过 P1，从 UI 设计稿重入）

3. **P2b UI 设计稿**（模型：sonnet）
   prompt 为 `p2b-ui.md` 内容，参数 `{FEATURE_NAME}`

然后继续执行步骤 4→11（P2 → P3 → 策略 → P4 → P5 → P6 → P7 → 退出等待推送方式）。

---

#### 入口 p2（跳过 P1/P2b，从技术设计重入）

4. **P2 技术设计**（模型：opus）
   prompt 为 `p2-design.md` 内容，参数 `{FEATURE_NAME}`

然后继续执行步骤 5→11（P3 → 策略 → P4 → P5 → P6 → P7 → 退出等待推送方式）。

---

#### 入口 p3（跳过 P1/P2b/P2，从任务拆解重入）

5. **P3 任务拆解**（模型：sonnet）
   prompt 为 `p3-taskgen.md` 内容，参数 `{FEATURE_NAME}`

然后继续执行步骤 6→11（判断策略 → P4 → P5 → P6 → P7 → 退出等待推送方式）。

---

#### 入口 p4（跳过 P1~P3，从开发重入）

7. **P4 开发**（模型：sonnet）
   prompt 为 `p4-develop.md` 内容，参数 `{FEATURE_NAME}`

然后继续执行步骤 8→11（P5 → P6 → P7 → 退出等待推送方式）。

---

#### 入口 p5（跳过 P1~P4，从 Review 重入）

8. **P5 代码 Review**（模型：sonnet）
   prompt 为 `p5-review.md` 内容，参数 `{FEATURE_NAME}`

然后继续执行步骤 9→11（P6 → P7 → 退出等待推送方式）。

---

#### 入口 p6（跳过 P1~P5，从测试重入）

9. **P6 测试**（模型：sonnet）
   prompt 为 `p6-test.md` 内容，参数 `{FEATURE_NAME}`

然后继续执行步骤 10→11（P7 → 退出等待推送方式）。

---

#### 入口 p7（跳过 P1~P6，从文档同步重入）

10. **P7 文档同步**（模型：haiku）
    prompt 为 `p7-docsync.md` 内容，参数 `{FEATURE_NAME}`

然后继续执行步骤 11（退出等待推送方式）。

---

#### 入口 p8（用户回复 1/2/3 后由 openclaw 触发）

从 $ARGUMENTS 中额外读取推送选项（1/2/3）。

11. **P8 提交 & PR**（模型：haiku）
    prompt 为 `p8-commit.md` 内容，参数 `{FEATURE_NAME} {推送选项}`
    （最终完成通知由 p8-commit.md 负责发送，含 commit hash 和推送结果）

---

## 异常处理

- 任何阶段失败时，立即停止并发送 TG 通知：
  ```bash
  node scripts/notify-tg.js "❌ Pipeline 中断：{FEATURE_NAME}
  阶段：{失败阶段}
  原因：{简要描述}"
  ```
- 不自动跳过失败阶段

**回滚指引：**

P1/P2/P3 失败（仅文档变更）：
```bash
git checkout -- specs/{FEATURE_NAME}/
```

P4/P5 失败（代码已改动）：
```bash
git stash
```

P6/P7 失败：保留代码，人工修复后重新从该阶段触发。
