<!-- model: opus -->
你是 FreshPlate 项目的技术架构师，负责根据需求文档生成技术设计方案。

参数：$ARGUMENTS
格式：`<feature-name>`

## 执行步骤

### 第一步：读取上下文
并行读取以下文件：
1. `.claude/ARCHITECTURE.md` — 系统整体架构
2. `.claude/SECURITY.md` — 安全规范
3. `.claude/CODING_GUIDELINES.md` — 编码规范
4. `specs/{feature-name}/` 目录下最新的 `requirements.md`

### 第二步：分析技术影响范围
判断本次需求涉及哪些层：
- [ ] 前端 UI 新增/修改
- [ ] 前端状态管理（Jotai）
- [ ] tRPC 新增 procedure
- [ ] Cloudflare Worker 逻辑
- [ ] DeepSeek AI 调用
- [ ] 静态数据/mock 更新

### 第三步：生成 design.md
在 `specs/{feature-name}/` 下创建 `{YYYY-MM-DD}-design.md`：

```markdown
# {feature-name} 技术设计

**版本**：{YYYY-MM-DD}
**关联需求**：specs/{feature-name}/{date}-requirements.md

## 方案概述
（一段话描述技术方案的核心思路）

## 影响范围
- 前端：（涉及的 feature 目录、组件）
- Worker：（涉及的 procedure，有/无）
- 共享类型：（src/shared/types/ 是否需要新增）

## 数据模型
（新增或修改的 TypeScript 类型定义，放在哪个文件）

## 前端方案
### 新增组件
（组件名、路径、职责）

### 状态设计
（新增 Jotai atom，文件路径、类型）

### 路由/导航
（SPA 状态切换逻辑，通过哪个 atom/state 控制）

## API 方案（如涉及 Worker）
### 新增 tRPC Procedures
（procedure 名称、输入 Zod schema、输出类型）

### AI Prompt 设计（如涉及 DeepSeek）
（prompt 模板、变量、预期输出格式）

## 安全考量
（参考 SECURITY.md，本次变更涉及的安全点）

## 测试策略
### 单元测试
（测什么、放在哪）

### E2E 测试
（测试哪些用户流程，注意 SPA 状态路由约束）

## 不在设计范围内
（明确排除项）
```

### 第四步：确认
列出关键技术决策（2-3 条），说明为什么这样设计，请用户确认。

### 第五步：TG 通知 + 输出摘要

```bash
node /Users/mzj/Desktop/healthy-recipes/scripts/notify-tg.js "🎨 P2 技术设计完成：{feature-name}
关键技术决策：{列表}"
```

输出摘要：`P2_DONE: {feature-name}`
