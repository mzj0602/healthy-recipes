# 登录页设计稿摘要

## 设计来源

- **Stitch 项目 ID**：`2553716143790562861`（FreshPlate 个人健康周计划页项目）
- **屏幕名称**：登录页 (中文版)
- **屏幕 ID**：`3d98477367564f0ab94beb5383bea58e`
- **设计系统**：FreshPlate Harvest（`assets/c2112d1f935245dc83d9137ff27ddf58`）
- **设计稿尺寸**：2560 × 2076px，桌面端

---

## 关键 UI 元素

### 布局

设计稿采用**居中单列卡片**布局（非需求文档描述的双列），主内容区为一个居中的白色卡片（`max-w-md`），卡片左右有半透明装饰性食物图片（`opacity-20`，lg 断点才显示）。

> 注意：需求文档 FR-1 要求双列布局（左图右表单），但 Stitch 稿实际为居中卡片。P4 开发时应以需求文档双列布局为准，同时参考设计稿的视觉语言（颜色、字体、组件细节）。

### 顶部导航条（Header）

- 固定定位（`fixed top-0 z-50`），背景色 `#fdf9f3`，`backdrop-blur-xl`
- Logo：`FreshPlate`，Epilogue 字体，`font-bold text-2xl text-orange-800`
- 右侧：「返回首页」文字链接 + 「Sign Up」按钮（`bg-primary text-on-primary px-5 py-2 rounded-xl`）

### 登录卡片

- 背景：`bg-surface-container-lowest`（`#ffffff`）
- 内边距：`p-8 md:p-12`
- 圆角：`rounded-xl`（`0.5rem`，注意 Tailwind 配置中 `xl` = `1.5rem`，但卡片用的是 `rounded-xl` 类）
- 阴影：`shadow-[0_12px_32px_rgba(28,28,24,0.06)]`（Harvest Ambient Shadow）
- 边框：`border border-outline-variant/10`

### 卡片顶部品牌区

- FreshPlate 品牌名：`text-primary-container text-4xl font-extrabold editorial-title`（`#f5821f`，Epilogue）
- 主标题：`欢迎回来`，`text-3xl font-bold text-on-surface editorial-title mt-6`（Epilogue）
- 副标题：`继续您的健康烹饪之旅`，`text-on-surface-variant text-sm`（Plus Jakarta Sans）

### 表单字段

| 字段 | 实现细节 |
|------|---------|
| 标签 | `text-xs font-bold uppercase tracking-wider text-on-surface-variant`，`font-label`（Plus Jakarta Sans） |
| 用户名输入框 | 左侧 `person` Material Symbol 图标，`bg-surface-container-low`（`#f7f3ed`），`border-none rounded-xl`，`focus:ring-2 focus:ring-primary/20` |
| 密码输入框 | 左侧 `lock` Material Symbol 图标，同上样式 |
| 记住我 | `<input type="checkbox">`，`text-primary-container focus:ring-primary-container/20`，标签文字 `text-on-surface-variant` |
| 忘记密码 | `<a>` 链接，`text-primary font-semibold hover:text-primary-container` |
| 登录按钮 | 全宽，`.zest-gradient`（`linear-gradient(135deg, #964900 0%, #f5821f 100%)`），`text-on-primary font-bold py-4 rounded-xl`，`editorial-title text-lg`，悬停 `hover:scale-[1.02]` |

### 分割线 + 社交登录

- 分割线：`border-outline-variant/20`，中间文字「或使用社交账号登录」`text-outline uppercase tracking-widest`
- Google 登录按钮：`grid grid-cols-2`，`bg-surface-container-low hover:bg-surface-container-high rounded-xl`
- 微信登录按钮：同上

### 注册引导

- 「还没有账号？立即注册」，`text-primary font-bold hover:underline`

### Footer

- 背景 `bg-stone-100`，Epilogue Logo + 导航链接 + 版权信息

---

## 颜色 Token（FreshPlate Harvest）

| Token | 色值 | 用途 |
|-------|------|------|
| `surface` / `background` | `#fdf9f3` | 页面背景 |
| `surface-container-lowest` | `#ffffff` | 卡片背景 |
| `surface-container-low` | `#f7f3ed` | 输入框背景 |
| `surface-container` | `#f1ede7` | 次要容器 |
| `primary` | `#964900` | 主色（按钮渐变起点、链接） |
| `primary-container` | `#f5821f` | 品牌名颜色、按钮渐变终点 |
| `on-surface` | `#1c1c18` | 主要文字 |
| `on-surface-variant` | `#564336` | 次要文字、标签 |
| `outline` | `#8a7264` | 图标色 |
| `outline-variant` | `#ddc1b0` | 边框、分割线 |
| `error` | `#ba1a1a` | 错误提示 |

---

## 字体

| 类型 | 字体 | 用途 |
|------|------|------|
| `headline` / `editorial-title` | Epilogue | 品牌名、主标题、登录按钮文字 |
| `body` / `label` | Plus Jakarta Sans | 表单标签、输入框、辅助文字 |
| Material Symbols Outlined | Google Fonts | 表单图标（person、lock） |

---

## P4 开发注意事项

1. **布局以需求文档为准**：实现双列布局（左 55% Hero 图 + 右 45% 表单），而非设计稿的居中单列卡片。视觉语言（颜色、字体、组件）完全沿用设计稿。

2. **渐变按钮实现**：登录按钮使用 `background: linear-gradient(135deg, #964900 0%, #f5821f 100%)`，可通过 Tailwind 任意值或内联 `style` 实现。注意 `<Button>` 组件的 `variant` 可能需要覆盖。

3. **Tailwind 圆角配置注意**：设计稿 Tailwind config 中 `xl` 被重定义为 `1.5rem`（而非 Tailwind 默认的 `0.75rem`）。项目中若未同步此配置，`rounded-xl` 效果会不同，建议直接用内联 `style` 或 Tailwind 任意值 `rounded-[0.75rem]`（需求文档要求按钮 `0.75rem`）。

4. **输入框无边框**：`border-none` + `bg-surface-container-low`（`#f7f3ed`）+ `focus:ring-2 focus:ring-primary/20`，覆盖 shadcn/ui `Input` 组件的默认 `border` 样式。

5. **Material Symbols 图标**：设计稿用 Google Fonts Material Symbols，项目中若已有 Lucide 图标，优先用 `User` / `Lock` 图标代替，保持一致性。

6. **社交登录（Google / 微信）**：不在本次范围内，若保留 UI 区域，标注为 `disabled` 或直接不渲染。

7. **Hero 区图片**：左侧 Hero 图需从 `public/images/` 中选择合适的横版食物大图，叠加渐变遮罩 `linear-gradient(to top, rgba(0,0,0,0.6), transparent)`，底部展示品牌 Tagline。

8. **顶部导航**：固定定位，登录前「返回首页」链接可设为无功能（`href="#"` 或 `pointer-events-none`），「注册」按钮视觉展示只。

9. **演示账号提示**：设计稿无此元素，需在表单中自行设计，使用 `bg-surface-container-low` 背景的提示框，与设计系统一致。

10. **错误提示**：使用 `text-error`（`#ba1a1a`）颜色，与 Harvest 设计系统对齐。
