# Review Log — user-login — 2026-03-30

## Round 1

### Codex 输出（原始）
The `notify-tg.js` change regresses the existing notification workflow: it no longer reads credentials from the configured `.env` files and it can misroute messages to a hardcoded chat ID. Those are functional regressions in the current automation.

Full review comments:

- [P2] Keep loading Telegram credentials from the repo/global `.env` files — /Users/mzj/Desktop/healthy-recipes/scripts/notify-tg.js:11-14
  `p5-review.md` still invokes `node scripts/notify-tg.js` directly, but this rewrite removed the previous fallback that populated `TG_BOT_TOKEN`/`TG_CHAT_ID` from the project's `.env` and `~/.claude/.env`. In the existing local workflow those values are often not exported into the shell, so this path now exits at line 14 and silently drops every review notification.

- [P2] Do not send to the hardcoded chat when `TG_CHAT_ID` is unset — /Users/mzj/Desktop/healthy-recipes/scripts/notify-tg.js:11-12
  Falling back to `'6938150752'` changes the semantics of an unset or explicitly blank `TG_CHAT_ID` from "do not send / misconfigured" to "send to this fixed chat". In any environment that provides only `TG_BOT_TOKEN` (or intentionally clears `TG_CHAT_ID`), review messages will now be delivered to the wrong recipient instead of failing closed.

### Claude 修复（Round 1）
- ✅ 恢复 `.env` 文件加载逻辑（项目 `.env` 优先，`~/.claude/.env` fallback）
- ✅ 移除硬编码 token
- ✅ `TG_CHAT_ID` 无值时 fail closed，不再 fallback 到硬编码值

## Round 2

### Codex 输出（原始）
The new env-loading logic is an improvement over the hardcoded credentials, but it still introduces configuration regressions: empty exported vars no longer disable sending, and common quoted `.env` values are parsed incorrectly. Either case can break or misroute Telegram notifications.

Full review comments:

- [P2] Treat empty exported Telegram vars as configured overrides — /Users/mzj/Desktop/healthy-recipes/scripts/notify-tg.js:20-20
  If a caller intentionally clears `TG_BOT_TOKEN` or `TG_CHAT_ID` by exporting them as empty strings (for example to disable notifications in a shell/CI job), the falsy check here treats that as "missing" and repopulates the value from `.env`. That changes a fail-closed configuration into actually sending a message, which is especially surprising for `TG_CHAT_ID` because it can route notifications to a recipient the caller explicitly tried to disable.

- [P2] Strip surrounding quotes when reading `.env` values — /Users/mzj/Desktop/healthy-recipes/scripts/notify-tg.js:20-20
  This parser copies the raw right-hand side from `.env` into `process.env`, so standard quoted entries like `TG_BOT_TOKEN="123:abc"` or `TG_CHAT_ID="6938150752"` keep their quotes. In that case the fetch URL/body are built with the quoted values and Telegram rejects the request, so notifications silently stop working for any environment that uses normal quoted `.env` syntax.

### Claude 修复（Round 2）
- ✅ 使用 `k in process.env` 替代 `!process.env[k]`，空字符串视为已定义，不被 .env 覆盖
- ✅ `.env` 值解析时用 regex 去掉首尾单/双引号

## Round 3

### Codex 输出（原始）
I did not find a discrete correctness issue in the current changes. The functional code change in `scripts/notify-tg.js` appears to address the previously documented Telegram credential regressions without introducing a new provable breakage.

## 结论
- 共执行：3 轮
- Codex 发现问题：4 个
- 已修复：4 个
- 遗留风险：无
✅ Review 通过
