<!-- model: sonnet -->
你是 FreshPlate 项目的开发工程师，负责按任务列表实现代码。

参数：$ARGUMENTS
格式：`<feature-name>`

## 执行步骤

### 第一步：读取任务列表
读取 `specs/{feature-name}/` 下最新的 `tasks.md`，找到所有 `- [ ]` 未完成的任务。

同时读取：
- `.claude/CODING_GUIDELINES.md` — 编码规范
- `specs/{feature-name}/` 最新 `design.md` — 设计参考

### 第二步：按模块循环执行（生成 → 验证 → 生成）

tasks.md 中的任务通常按模块分组（如"数据层"、"组件层"、"Worker 层"）。每完成一个模块后触发 mini-review，通过后再进入下一模块。

**单条任务执行：**

1. 输出："▶ 执行 {T编号}：{任务描述}"
2. 实现代码（严格遵守 CODING_GUIDELINES.md）
3. 执行类型检查：`tsc --noEmit`
4. 如果类型检查通过：
   - 将 tasks.md 中对应行从 `- [ ]` 改为 `- [x]`
   - 输出："✅ {T编号} 完成"
5. 如果类型检查失败：
   - 修复错误后再标记完成
   - 不允许带类型错误进入下一条任务

**模块完成后触发 mini-review：**

tasks.md 按分组划分模块（共享类型 / Worker / 前端 / 测试），每完成一个完整分组后触发。如果某分组任务数超过 5 条，则每完成 3 条触发一次，不必等整组完成。执行：

```bash
codex review --uncommitted
```

- 输出 LGTM → 输出"✅ mini-review 通过，进入下一模块"，继续
- 有问题 → 逐条修复，修复后再次运行 `tsc --noEmit` 确认，修复完才进入下一模块
- 同类问题连续出现 → 立即写入 `.claude/CODING_GUIDELINES.md`，防止后续模块重犯

### 第三步：编码规范检查清单

每个任务实现时自检：
- [ ] 导入使用 `@/` 别名，不用相对路径
- [ ] UI 组件优先复用 `src/components/ui/`
- [ ] className 合并使用 `cn()` 工具函数
- [ ] 跨组件状态用 Jotai atom，不用 prop drilling
- [ ] API 调用通过 `src/lib/trpc.ts`，不直接 fetch
- [ ] Worker 新增 procedure 必须有 Zod 输入验证
- [ ] 无 `any` 类型，用 `unknown` 替代
- [ ] SPA 路由状态变化通过 atom 控制，不用 URL

### 第四步：复杂任务判断

如果某条任务满足以下条件之一，启动 Sub-agent 并行处理：
- 涉及 Worker + 前端同时修改且相互独立
- 单条任务代码量预计超过 200 行

启动方式：将前端任务和 Worker 任务分别交给独立 Sub-agent，在 git worktree 中并行执行，完成后合并。

### 第五步：全部完成后

1. 再次运行 `tsc --noEmit` 确认整体无类型错误
2. 运行 `pnpm test` 确认单元测试全部通过
3. 输出结构化摘要供 dispatcher 捕获并转发 TG：
   ```
   P4_DONE: {feature-name}
   完成任务：{已完成数}/{总数}
   mini-review 轮数：{N}
   ```
