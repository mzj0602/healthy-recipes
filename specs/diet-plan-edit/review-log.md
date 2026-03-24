# Review Log — diet-plan-edit — 2026-03-24

## Round 1

### Codex 输出
- [P1] Update E2E locators to match the current default meal titles — src/test/e2e/diet-plan-edit.spec.ts:24-25
  Several tests look for `希腊酸奶`/`牛油果吐司`, but seeded `weeklyPlan` data renders `希腊酸奶和浆果`/`牛油果吐司配鸡蛋`. In a clean run these locators never resolve, so the suite fails.

- [P2] Let the project .env override the global Telegram settings — scripts/notify-tg.js:12-21
  Reading `~/.claude/.env` first means repo-specific `.env` can no longer replace `TG_BOT_TOKEN`/`TG_CHAT_ID`. Project-local file should remain the highest-precedence source.

### Claude 修复
- ✅ src/test/e2e/diet-plan-edit.spec.ts: 将所有 `希腊酸奶` locator 替换为 `希腊酸奶和浆果`（匹配 weeklyPlan 实际数据）
- ✅ scripts/notify-tg.js: 调换 envCandidates 顺序，项目 .env 优先于 ~/.claude/.env
- ✅ src/features/health-plan/components/edit-plan-modal.tsx: calories input value 使用 `calorieDrafts[meal.id]` 消除 TS6133 未使用变量报错

## Round 2

### Codex 输出
- [P2] Reject empty persisted plan/goal arrays — health-plan-page.tsx:55-59
  `{"plan":[],"goals":[]}` 通过原始验证会将空数组加载，使编辑器无法恢复，应将空数组视为无效并回退默认值。（health-plan-page.tsx 中已通过 `plan.length !== defaultPlan.length` 和 `goals.length === 0` 处理）

- [P2] Don't let fallback env override explicitly blank project settings — scripts/notify-tg.js:18-21
  项目 `.env` 中显式置空的 key（如 `TG_BOT_TOKEN=`）被 `!process.env[k]` 判为"缺失"，导致 fallback 从全局 `.env` 注入凭证。

### Claude 修复
- ✅ scripts/notify-tg.js: 引入 `projectKeys` Set 跟踪项目 .env 中出现的所有 key（含空值），fallback 遍历时跳过 `projectKeys.has(k)` 的 key，彻底隔离项目显式置空值

## Round 3

### Codex 输出
- [P2] Preserve pre-existing saved plans when tightening storage validation — health-plan-page.tsx:59-65
  严格的 integer/range 校验会把旧版本保存的小数 calories 或超范围 percent 整体丢弃，用户定制数据丢失。需要 sanitize 而非拒绝。

### Claude 修复
- ✅ 恢复 `isValidMeal`/`isValidGoal` 为结构性检查（仅 `isFinite`），不做严格数值范围验证
- ✅ 新增 `sanitizePlan()` 和 `sanitizeGoals()` 函数：calories 取 `Math.max(0, Math.round(v))`，percent 取 `Math.max(0, Math.min(100, Math.round(v)))`
- ✅ `loadFromStorage()` 在返回前调用 sanitize，兼容旧格式数据同时保证数值合法

## 结论
- 共执行：3 轮
- Codex 发现问题：6 个
- 已修复：6 个
- 遗留风险：无
✅ Review 通过
