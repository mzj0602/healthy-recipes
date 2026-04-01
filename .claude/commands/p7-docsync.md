<!-- model: haiku -->
你是 FreshPlate 项目的文档维护者，负责在每次功能完成后同步更新所有相关文档。

参数：$ARGUMENTS
格式：`<feature-name>`

## 执行步骤

### 第一步：读取本次变更内容
读取 `specs/{feature-name}/` 下文件名字典序最后一个：
- `requirements.md` — 功能描述
- `design.md` — 技术变更
- `tasks.md` — 实际完成的任务

### 第二步：逐个更新文档

#### 1. `docs/PRD.md`
- 在对应页面章节中追加新功能描述
- 更新版本号和日期
- 如新增了页面，添加页面说明

#### 2. `README.md`（项目根目录，如不存在则创建）
- 更新功能列表
- 更新本地开发说明（如有新命令）
- 更新部署说明（如有变更）

#### 3. `.claude/ARCHITECTURE.md`
- 新增模块：补充到目录结构说明
- 新增 tRPC procedure：补充到 API 方案章节
- 新增 Jotai atom：如果是全局共享的，说明用途
- 更新数据流说明（如有变化）

#### 4. `.claude/SECURITY.md`
- 新增 API 调用：补充安全考量
- 新增权限逻辑：说明校验方式
- 如发现新的安全风险，补充到待处理项

#### 5. `.claude/CODING_GUIDELINES.md`
- 如本次引入了新的约定或模式，补充说明
- 如有新的禁止项（发现反模式），补充到规范中

#### 6. `.claude/CLAUDE.md`
- **不主动更新**，避免频繁追加导致文件膨胀影响加载
- 仅当出现**全局性、永久性**的新约定（如新增路径别名、新增包管理器规则）时才更新，且只追加一行
- 判断标准：如果这条信息放在 CODING_GUIDELINES.md 也合适，就放那里而不是 CLAUDE.md

### 第三步：生成 CHANGELOG
在 `specs/{feature-name}/` 下追加或创建 `CHANGELOG.md`：

```markdown
## {YYYY-MM-DD} — {feature-name}

### 新增功能
（来自 requirements.md 的功能描述）

### 技术变更
（来自 design.md 的技术方案摘要）

### 完成任务
（tasks.md 中所有 [x] 的任务列表）

### 文档更新
（本次更新了哪些文档）
```

### 第四步：完成确认
输出所有已更新的文件列表，并说明每个文件更新了哪些内容。
输出："✅ 文档同步完成"

### TG 通知 + 输出摘要

```bash
node /Users/mzj/Desktop/healthy-recipes/scripts/notify-tg.js "📚 P7 文档同步完成：{feature-name}
更新文件：{列表}"
```

输出摘要：`P7_DONE: {feature-name}`
