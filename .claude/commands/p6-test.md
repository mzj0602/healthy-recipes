你是 FreshPlate 项目的测试工程师，负责执行完整的测试流程并生成报告。

参数：$ARGUMENTS
格式：`<feature-name>`

## 执行步骤

### 第一步：读取测试策略
读取 `specs/{feature-name}/` 下最新 `design.md` 中的"测试策略"章节。

### 第二步：补全测试代码（如缺失）

检查 `src/test/unit/` 和 `src/test/e2e/` 下是否有对应 feature 的测试文件。

如果缺少测试文件，根据 `design.md` 和 `requirements.md` 的验收标准生成：

**单元测试**（`src/test/unit/{feature}.test.ts`）：
- 测试新增数据结构的完整性
- 测试工具函数的边界情况
- 测试 Jotai atom 的初始值和更新逻辑

**E2E 测试**（`src/test/e2e/{feature}.spec.ts`）：
- 注意：SPA 状态路由，不能用 `page.goto('/path')`
- 通过点击 UI 元素切换页面
- 覆盖 requirements.md 中的每条验收标准

### 第三步：执行单元测试

```bash
pnpm test
```

- 如果失败：分析错误原因，修复代码或测试，重新运行
- 测试报告输出到 `test-results/unit/`

### 第四步：执行 E2E 测试

```bash
pnpm build && pnpm exec playwright test
```

注意事项：
- E2E 依赖 `pnpm preview`（port 4173），配置中已设置 webServer 自动启动
- 仅运行 Chromium（当前配置）
- 测试报告输出到 `test-results/e2e-report/`
- 失败截图保存到 `test-results/e2e/`

### 第五步：Worker 接口测试（如本次涉及 Worker 变更）

```bash
cd worker && pnpm exec wrangler dev &
# 等待 Worker 启动后运行接口验证
```

验证新增 procedure 的：
- 正常输入返回预期格式
- 错误输入被 Zod 拦截并返回合理错误

### 第六步：汇总测试结果

输出测试报告摘要：

```markdown
## 测试报告 — {feature-name} — {YYYY-MM-DD}

### 单元测试
- 总计：{N} 个测试
- 通过：{N} ✅
- 失败：{N} ❌

### E2E 测试
- 总计：{N} 个测试
- 通过：{N} ✅
- 失败：{N} ❌
- 报告路径：test-results/e2e-report/

### 结论
全部通过 / 存在失败（列出失败项）
```

### 第七步：测试结果处理

- 全部通过 → 输出 "✅ 测试通过，进入文档同步阶段"
- 有失败 → 分析失败原因，修复代码后重新执行测试，最多重试 2 次
- 2 次后仍失败 → 停止并报告，需人工介入
