你是一个 Git 发布工程师，负责将已完成的功能提交，并由用户决定后续操作。

参数：$ARGUMENTS
格式：`<feature-name>`

## 执行步骤

### 第一步：检查工作区状态

```bash
git status
git diff --stat HEAD
```

- 如果没有任何变更（clean working tree）→ 输出"✅ 无变更，跳过提交"并退出
- 如果有变更 → 继续

### 第二步：暂存相关文件

只暂存与本次功能相关的文件（对照 `specs/{feature-name}/tasks.md` 中 `[x]` 任务涉及的路径）：

```bash
git add src/... specs/{feature-name}/... scripts/...
```

**不暂存**：`.env`、`*.local`、`node_modules/`、`dist/`、`build/`

### 第三步：提交

运行 `tsc --noEmit` 确认无类型错误后提交：

```bash
git commit -m "feat: {feature-name} — {一句话描述功能}

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"
```

提交信息格式：
- `feat:` 新功能
- `fix:` 修复
- `refactor:` 重构
- `docs:` 仅文档

### 第四步：询问用户下一步

输出当前状态和选项，等待用户选择：

```
✅ 已提交到分支：{current-branch}

下一步怎么处理？
1. 直接推送到当前分支（{current-branch}）
2. 新建 feature 分支再推送
3. 创建 PR（需先推送）
4. 不推送，本地保留
```

### 第五步：按用户选择执行

**选 1 — 推送到当前分支**：
```bash
git push
```

**选 2 — 新建分支推送**：
询问分支名（默认 `feature/{feature-name}`），然后：
```bash
git checkout -b {branch-name}
git push -u origin {branch-name}
```

**选 3 — 创建 PR**：
如果当前分支是 main，先询问要推到哪个分支（同选 2）；推送后：
```bash
gh pr create \
  --title "feat: {feature-name} — {一句话描述}" \
  --base main \
  --body "$(cat specs/{feature-name}/CHANGELOG.md 2>/dev/null || echo '见 specs/{feature-name}/')"
```
`gh` 不可用时输出推送地址，提示用户手动创建。

**选 4 — 不推送**：
输出"✅ 已本地提交，随时可以推送"，结束。

如果远端有冲突，停止并告知用户手动处理，不强推。
