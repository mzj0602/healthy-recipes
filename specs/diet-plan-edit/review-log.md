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
