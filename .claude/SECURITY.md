# FreshPlate 安全规范

## API 密钥管理

- `DEEPSEEK_API_KEY` 只能存在于 Cloudflare Worker 的环境变量中
- 禁止在前端代码（`src/`）出现任何 API Key
- `wrangler.toml` 中禁止写入 secrets，使用 `wrangler secret put` 命令单独配置
- `.env` 文件禁止提交到 git（已在 .gitignore 中）

## CORS 配置

当前状态（待改进）：
```typescript
// worker/src/index.ts — 目前允许所有来源，生产环境需收紧
'Access-Control-Allow-Origin': '*'
```

生产环境应改为：
```typescript
'Access-Control-Allow-Origin': 'https://healthy-recipes.pages.dev'
```

## 输入验证

- 所有 tRPC procedure 的输入必须用 Zod schema 验证
- 禁止直接将用户输入拼接到 AI prompt 中，需做内容过滤

## 代码 Review 安全必检项

每次 P5 Review 必须检查：
1. 前端代码中无硬编码 API Key 或 secret
2. Worker CORS 配置是否合理
3. 新增 tRPC procedure 是否有 Zod 输入验证
4. `wrangler.toml` 无敏感信息
5. DeepSeek prompt 是否有注入防护

## GitHub Actions Secrets

| Secret 名称 | 用途 |
|---|---|
| `EC2_HOST` | EC2 服务器地址（待移除）|
| `EC2_SSH_KEY` | EC2 SSH 私钥（待移除）|
| `CLOUDFLARE_API_TOKEN` | Cloudflare 部署 Token |
| `CLOUDFLARE_ACCOUNT_ID` | Cloudflare 账户 ID |
| `TG_BOT_TOKEN` | Telegram Bot Token |
| `TG_CHAT_ID` | Telegram Chat ID |

## localStorage 安全规范

- `localStorage` 读写必须包裹 `try/catch`，兼容 Safari 隐私模式（会抛 `SecurityError`）
- `localStorage` 仅存储用户本地个性化数据，禁止存储 API Key、token 或任何敏感凭证
- 读取 `localStorage` 数据后须验证结构（`Array.isArray` 等），格式不合法时回退默认值，防止脏数据导致崩溃
- 演示型登录功能如仅做前端校验，禁止在浏览器存储中保存密码；仅可保存最小必要的展示信息或登录标记
