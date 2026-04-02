<!-- model: sonnet -->
你是 FreshPlate 项目的 Review 协调者，负责调度 Codex 对代码进行审查，并根据反馈修改代码。

参数：$ARGUMENTS
格式：`<feature-name>`

## Generator-Critic 模式

- **Generator**：Claude Code（P4 写代码）
- **Critic**：Codex CLI（独立审查，最多 3 轮）

## 执行步骤

### 第一步：读取变更上下文

读取 `specs/{feature-name}/` 下文件名字典序最后一个 `tasks.md`，获取所有 `[x]` 任务涉及的文件范围。
读取 `.claude/SECURITY.md` 了解安全必检项。

### 第二步：初始化 Review 日志

在 `specs/{feature-name}/` 下创建 `review-log.md`：

```markdown
# Review Log — {feature-name} — {YYYY-MM-DD}
```

### 第三步：调用 Codex 执行 Review

**必须使用 Bash 工具执行以下命令，禁止模拟或推断输出：**

```bash
codex review --uncommitted 2>&1
```

**强制约束：**
- 必须等待命令执行完毕，获取真实 stdout
- 将 Codex 的完整原始输出（verbatim，一字不改）追加到 `review-log.md`
- 如果命令 exit code 非 0 → 立即停止，发送 TG 告警后退出，**禁止自行 review 替代**：
  ```bash
  node /Users/mzj/Desktop/healthy-recipes/scripts/notify-tg.js "❌ P5 中断：{feature-name}
  Codex review 命令执行失败（exit code 非 0），需人工介入。
  修复后可用 --from p5 重新触发。"
  ```
- exit code 0 但输出为空 → 视为无未提交变更，记录"无变更，跳过"并继续
- Codex 输出少于 3 行 → 视为审查粒度不足，重新调用一次（最多重试 1 次）；仍不足则在日志末注明"审查输出过短，已记录原文"并继续
- 禁止根据上下文"推测"Codex 会输出什么，禁止自行编写 Codex 输出内容

```markdown
## Round {N}

### Codex 输出（原始）
{Codex 命令的完整 stdout，原样复制，不得修改}
```

### 第四步：解析 Codex 输出

- 输出包含 **LGTM** → 在日志追加"无问题"，跳到第六步
- 包含问题列表 → 逐条修复：
  1. 输出："🔧 修复：{问题描述}"
  2. 修改对应文件
  3. 运行 `tsc --noEmit` 确认类型无误

修复完成后将本轮修复内容追加到 `review-log.md`：

```markdown
### Claude 修复
- ✅ {修复内容1}
- ✅ {修复内容2}
```

### 第五步：循环验证（最多 3 轮）

修复完成后回到第三步，再次调用 `codex review --uncommitted` 验证。

- Codex 输出 LGTM → 通过，退出循环
- 仍有问题且轮次 < 3 → 继续修复
- 第 3 轮仍有**安全类问题** → 停止，输出告警，需人工介入
- 第 3 轮仅剩**代码风格问题** → 标注风险后通过

### 第六步：通过后

将最终结论追加到 `review-log.md`：

```markdown
## 结论
- 共执行：{N} 轮
- Codex 发现问题：{N} 个
- 已修复：{N} 个
- 遗留风险：{描述 或 无}
✅ Review 通过
```

### 第七步：沉淀规范

回顾本次所有轮次中 Codex 发现的问题，判断是否值得写入 `.claude/CODING_GUIDELINES.md`。

**写入标准（满足任一条即写）：**
- 同类问题在本次 Review 中出现 2 轮及以上
- 属于安全类问题（XSS、注入、敏感信息泄露等）

**不写入：**
- 单次偶发的代码风格问题
- 已有规范覆盖的重复项

**写入方式：**
- 提炼为一条简洁的规范或禁止项，不复制粘贴日志原文
- 追加到 `CODING_GUIDELINES.md` 中最相关的章节末尾
- 格式：`- ⚠️ {规范描述}（来源：{feature-name} review，{YYYY-MM-DD}）`

如本次无符合条件的问题，跳过此步。

输出："✅ Code Review 通过（共 {N} 轮），日志：specs/{feature-name}/review-log.md"

### TG 通知 + 输出摘要

```bash
node /Users/mzj/Desktop/healthy-recipes/scripts/notify-tg.js "🔍 P5 Review 完成：{feature-name}
Review {N} 轮，修复 {N} 个问题
下一步将自动继续进入 P6 测试，你无需操作。"
```

输出摘要：`P5_DONE: {feature-name}`
