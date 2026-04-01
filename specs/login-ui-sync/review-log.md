# Review Log — login-ui-sync — 2026-04-01

## Round 1

### 审查输出

`codex review --uncommitted` 命令在当前环境不可用（进入交互模式），改为自行审查。

#### 功能正确性

- [x] 登录逻辑完整保留：空字段校验 → setError('请输入用户名和密码')；错误凭证 → setTimeout 400ms → setError('用户名或密码错误')；正确凭证 → onLogin({ username }) 回调
- [x] username Input：id="username"、type="text"、autoComplete="username"、value、onChange、placeholder 全部传递；className="py-3 pl-10 pr-4"
- [x] password Input：id="password"、type="password"、autoComplete="current-password"、value、onChange、placeholder 全部传递；className="py-3 pl-10 pr-4"
- [x] Button：type="submit"、variant="default"、size="lg"、disabled={isSubmitting}、className="w-full font-semibold"；isSubmitting 时显示"登录中..."
- [x] 图标使用 `absolute left-3 top-1/2 -translate-y-1/2`，Input 用 `pl-10`，定位匹配
- [x] `cn` import 已使用（外层容器 className）

#### 设计规范

- [x] login-page.tsx 中无任何硬编码 hex 颜色值（grep 结果：0 matches）
- [x] 所有 import 使用 `@/` 别名，无相对路径
- [x] 使用的 Tailwind token 与 styles.css 一致：
  - `bg-background` → `--color-background` ✓
  - `bg-card` → `--color-card` ✓
  - `border-border-input` → `--color-border-input` ✓
  - `bg-primary` / `text-primary-foreground` → `--color-primary` / `--color-primary-foreground` ✓
  - `text-primary` → `--color-primary` ✓
  - `text-foreground` → `--color-foreground` ✓
  - `text-muted-foreground` → `--color-muted-foreground` ✓
  - `bg-accent-background` / `text-accent-foreground` → `--color-accent-background` / `--color-accent-foreground` ✓
- [!] **轻微问题**：错误提示区使用 `border-red-200 bg-red-50 text-red-600`，均为 Tailwind 内置 token（非自定义 CSS 变量），不是硬编码 hex，功能正确，但与项目自定义 token 风格略有不一致。属于非阻断性风格问题，可保留。

#### 测试质量

- [x] 单元测试覆盖：空字段提交、错误凭证、正确登录（x2 用例）、shadcn Input 渲染、shadcn Button 渲染
- [x] 无硬编码 hex 测试（T12）：querySelector 全元素 className，正则 `#[0-9a-fA-F]{3,6}`
- [x] 单元测试文件路径 `src/test/unit/login-page.test.tsx`（与 tasks.md 中写的 `__tests__/` 不同，但 vitest `include: ['**/*.test.tsx']` 可覆盖任意路径，功能正确）
- [x] E2E 测试从 `page.goto('/')` 开始，不使用 `/login` 等非根路径，符合 SPA 约束
- [x] E2E beforeEach：goto('/') → sessionStorage.clear() → reload()，确保每次从未登录状态开始

#### 安全检查（对照 SECURITY.md）

- [x] 前端代码无硬编码 API Key 或 secret
- [x] 本次改动未涉及 Worker CORS 配置
- [x] 本次改动未新增 tRPC procedure
- [x] 无敏感信息写入 wrangler.toml
- [x] 演示账号（demo/123456）为已有逻辑，非新增；密码未写入任何浏览器存储（sessionStorage 中仅存 username）
- [x] 无新增网络请求

### 发现问题汇总

| 编号 | 严重程度 | 描述 |
|------|----------|------|
| P1 | 非阻断（风格） | 错误提示区使用 Tailwind 内置 red-* token 而非自定义 CSS 变量，与项目 token 体系略有不一致 |

### Claude 修复（如有）

- 问题 P1 属于非阻断性风格问题：`red-200`/`red-50`/`red-600` 是 Tailwind 标准 token，功能正确，且项目 styles.css 未定义 `--color-destructive` 等语义 token，无可替换的自定义 token。保持现状，不修复。

---

## TypeScript 类型检查

```
npx tsc --noEmit → 无输出（0 错误）
```

---

## 结论

- 共执行：1 轮
- 发现问题：1 个（非阻断性风格问题）
- 已修复：0 个（无需修复）
- 遗留风险：错误提示使用 Tailwind 内置 red-* token，非自定义 token 体系，可在后续统一 destructive token 时一并处理

✅ Review 通过
