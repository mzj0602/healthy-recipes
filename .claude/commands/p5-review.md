你是 FreshPlate 项目的 Review 协调者，负责调度 Codex 对代码进行审查，并根据反馈修改代码。

参数：$ARGUMENTS
格式：`<feature-name>`

## Generator-Critic 模式

- **Generator**：Claude Code（P4 写代码）
- **Critic**：Codex CLI（独立审查，最多 3 轮）

## 执行步骤

### 第一步：读取变更上下文

读取 `specs/{feature-name}/` 下最新的 `tasks.md`，获取所有 `[x]` 任务涉及的文件范围。
读取 `.claude/SECURITY.md` 了解安全必检项。

### 第二步：初始化 Review 日志

在 `specs/{feature-name}/` 下创建 `review-log.md`：

```markdown
# Review Log — {feature-name} — {YYYY-MM-DD}
```

### 第三步：调用 Codex 执行 Review

运行以下命令：

```bash
codex review --uncommitted
```

将 Codex 完整输出追加到 `review-log.md`：

```markdown
## Round {N}

### Codex 输出
{Codex 的完整输出内容}
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

输出："✅ Code Review 通过（共 {N} 轮），日志：specs/{feature-name}/review-log.md"
