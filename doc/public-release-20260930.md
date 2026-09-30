# 公共试玩发布 r18

## 1. 技术栈

前端保持 React / TypeScript / Vite / RPGJS / CanvasEngine / Pixi，构建 base 为 `./`。权威服务采用 Node 22+、SWI-Prolog 与 PostgreSQL；Cloudflare 同 UUID Worker 只转发认证后的游戏 API。沿用现有 ECS，不创建第二数据库世界用于 Pages。

## 2. 目录结构

- `src/authority-bridge.mjs`：权威状态、串行提交、断线恢复与位置检查点。
- `src/kit-*.mjs`：公共恢复日志与空间插槽适配。
- `src/series-presentation.mjs`、`dynamic-browser.mjs`：绑定后的房间、地图与调查笔记呈现。
- `worker/index.js`：匿名签名 Cookie、同源检查、受限代理；秘密通过部署绑定注入。
- `server/packages/`：公共编译、权威事务、恢复、采纳、动态提议与模型预算组件。
- `server/integrations/before-the-close/`：本游戏规则与公共/测试入口适配。
- `server/snapshot/`：原作者章节的只读规则来源快照及逐文件哈希。

## 3. 核心模块与边界

主站使用永久 UUID `233b6970-d7f6-4d54-bc20-4213eefc6ba5`，API base 从 `getGameApiBase()` 取得。平台剥离 UUID 后，Worker 接收 `/api/story/*`。Worker 不信任浏览器提交的 owner，签名 Cookie 生成稳定匿名浏览器身份，再以私有边界凭据转发 ECS。HTTPS、同源写入、16 KiB 请求上限和服务并发上限保护公开入口；这不是平台账号认证或跨设备身份。

公共旅程与 QA 旅程分 world 隔离，模型费用仍使用原 100 次总账，并受原账户剩余额度限制，不能通过重启或换浏览器重置模型总额。PG 当前仍部署在已授权隔离实例和 test schema；这是有预算、时间期限的公开试玩，不是平台长期生产迁移验收。

AI 对话不直接写事实。补充房间按现有合同生成、编译、检查、人工复核，再显式 fork 采纳；最多两代收入/资金调查。服务器推进规则与旅程版本，前端只呈现已提交结果。旧章节规则源 hash 为 `a0b71d5b3a10e5671fc71e7a6c0cfda109c5a46082e523339f071492b2985cc4`。客户端仍带作者文本和 UI 条件辅助，不宣称已完成全部客户端规则剥离。

浏览器仅保留恢复日志与草稿，不迁移旧版 localStorage 剧情。Cookie 丢失后写入失败，不把迟到动作写给新身份。新 UUID 缺少独立后端绑定会明确失败，不接回原游戏世界。Pages 不调用游戏 API，只展示正式入口链接。

## 4. 扩展与运行

规则/来源调整先改公共 kit 与本游戏合同，验证后重新生成快照与前端，不能改客户端状态冒充权威效果。新游戏必须提供自己的规则组合、世界配置与私有部署绑定。新 profile、自动语义审批、长期运营身份和无限新房间均不在本版完成声明内。

人工复核使用 ECS 内 `deploy/finance-review-main.mjs --public --inspect-proposal ...`，核对内容后再以工件和审核哈希批准；公共 HTTP 不提供审批接口。发布代码不包含 `.env`、模型总账、玩家数据、云凭据或边界密钥。

当前测试实例总预算 1,000 元；约 800 元预警、900 元提前节省停机。兜底停机为北京时间 2026-10-01 18:02。试玩 API 也有期限，延长需同时更新服务和发布层配置；只延长服务器不代表游戏 API 自动延长。保留旧提交和上次服务 release 供显式回退，不自动覆盖玩家数据。

## 验收状态

2026-09-30 已替换原 UUID 正式入口，无需 QA 账号。运行代码提交为 `ad42bada50a109c97b08267ada3b0efa2ea391a7`，发布标记 `before-the-close-public-ai-r18`。主站与 Pages 实际返回同一 `assets/index-BoQSXni5.js`（1,409,463 bytes），均含本版标记；Pages 仅为静态入口/源码镜像，不提供第二套游戏后端。

严格 TypeScript 与生产构建通过；公共入口及相关 HTTP 测试 5 项、后台恢复/系列核心测试 3 项通过。已修复平台 Worker 不支持 `redirect: 'error'` 导致的 503：改为手动重定向模式，显式拒绝所有 3xx，未放宽边界凭据转发目标。修复后主站 health 返回 200、`backendReady: true`，公开源代码 ZIP 和动态素材均可访问。

真实浏览器已验证匿名进入、新旅程、移动到桌边、阅读欢迎便笺、推进至下一目标、切换英文及刷新后恢复状态。Chrome 390×844 / 320×568 复验开场、地图 HUD 和英文菜单，无横向溢出；可见主操作目标至少 44×44，检查时未捕获 console error。截图保存在发布工作区 `_qa/ui/public-r18/chrome-*`，早先 IAB 视口截图存在采集缩放异常，不作为尺寸验收证据。新玩家理解仍为 `comprehension unverified`，不将路径可执行等同教学验证通过。

本轮没有增加模型调用；最近核验总账为 25/100。此前的两代动态机制证据与本轮公开入口验证分开，不声称本轮重新跑完全部 AI 支线。人工房间复核、匿名身份限制、预算及到期停服边界仍按上文执行。
