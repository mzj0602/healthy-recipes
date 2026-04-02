<!-- model: sonnet -->
你是 FreshPlate 项目的测试工程师，负责执行完整的测试流程并生成报告。

参数：$ARGUMENTS
格式：`<feature-name>`

## 执行步骤

### 第一步：读取测试策略
读取 `specs/{feature-name}/` 下文件名字典序最后一个 `design.md` 中的"测试策略"章节。

### 第二步：实现测试任务

读取 `specs/{feature-name}/` 下文件名字典序最后一个 `tasks.md`，找到所有 `[test-spec]` 标注的未完成任务，逐条实现。

**单元测试**（`src/test/unit/{feature}.test.ts`）：
- 测试新增数据结构的完整性
- 测试工具函数的边界情况
- 测试 Jotai atom 的初始值和更新逻辑

**E2E 测试**（`src/test/e2e/{feature}.spec.ts`）：
- 注意：SPA 状态路由，不能用 `page.goto('/path')`
- 通过点击 UI 元素切换页面
- 覆盖 requirements.md 中的每条验收标准

**断言逻辑自审（每条测试写完必须检查）：**
- 断言方向是否正确（`toBeVisible` vs `not.toBeVisible`，`toHaveClass` 的值是否准确）
- 测试意图和断言是否一致（测"收起"就要断言"不可见/宽度为0"，不能断言"可见"）
- 选择器是否依赖 CSS 类名或 DOM 层级（应优先用 `getByRole`/`getByText`/`getByLabel`）
- CSS 动画隐藏（`w-0 opacity-0`）不等于 DOM 隐藏，Playwright 的 `toBeVisible` 无法识别，需改用 `toHaveClass` 或 `toHaveAttribute`

实现完成后将 tasks.md 中对应 `[test-spec]` 任务标记为 `[x]`。

### 第三步：全量回归测试

先跑全量单元测试，确认新功能没有破坏已有模块：

```bash
pnpm test
```

- 全部通过 → 继续
- 有失败 → 分析是新功能引入的 side effect 还是原有测试问题，修复后重新运行，确认通过再继续
- 测试报告输出到 `test-results/unit/`

### 第四步：执行 E2E 测试

先确认类型无误再 build，避免 build 失败暴露过晚：

```bash
tsc --noEmit && pnpm build && pnpm exec playwright test
```

如果 `tsc --noEmit` 失败 → 立即停止，报告类型错误，通知用户修复后重跑 P6，不继续 build。

注意事项：
- E2E 依赖 `pnpm preview`（port 4173），配置中已设置 webServer 自动启动
- 仅运行 Chromium（当前配置）
- 测试报告输出到 `test-results/e2e-report/`
- 失败截图保存到 `test-results/e2e/`

### 第五步：Worker 接口测试（如本次涉及 Worker 变更）

```bash
cd worker && pnpm exec wrangler dev &
WORKER_PID=$!
# 轮询等待 Worker 就绪（最多 30 秒）
for i in $(seq 1 30); do
  curl -s http://localhost:8787/ > /dev/null 2>&1 && break
  sleep 1
done
```

Worker 就绪后验证新增 procedure：
- 正常输入返回预期格式
- 错误输入被 Zod 拦截并返回合理错误

测试完成后关闭 Worker：
```bash
kill $WORKER_PID 2>/dev/null
```

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

- 全部通过 → 发送 TG 通知：
  ```bash
  node /Users/mzj/Desktop/healthy-recipes/scripts/notify-tg.js "🧪 P6 测试完成：{feature-name}
  单元 {N} 通过，E2E {N} 通过
  下一步将自动继续进入 P7 文档同步，你无需操作。"
  ```
  输出摘要：`P6_DONE: {feature-name}`
- 有失败 → 分析失败原因，修复代码后重新执行测试，最多重试 2 次
- 2 次后仍失败 → 发送 TG 通知并停止：
  ```bash
  node /Users/mzj/Desktop/healthy-recipes/scripts/notify-tg.js "❌ P6 测试失败：{feature-name}，需人工介入"
  ```
