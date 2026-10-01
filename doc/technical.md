# 技术文档

## r21 用量与恢复实现（2026-10-01，替代旧累计总额策略）

`async_player_usage` 在同一 PostgreSQL 世界事务下按 owner/kind/request 保存预留、成功、释放，主键保证幂等。对话提交回执与房间 ready/failed 状态用于重启后核对；日额度 1000/100、分钟 20/3，每身份每类一个未完成请求。失败不扣玩家日额度，失败尝试仍占分钟频率。UTC 日界，服务器返回 serverNow/resetAt/retryAt，前端换算本地时间而不自行猜测。

原 `async_model_budgets/async_model_calls` 原样保留。私有配置明确开启 `player-ai-fair-use-v1` 后，model-gateway 改为 meteringOnly：继续累计真实调用、不再执行旧累计最大值，身份白名单、截止和幂等不变。共享模型 FIFO 单进程 4 并发、16 等待、10 秒等待超时；实际传输最多 60 秒，有限生成/复核不变。当前仅单个游戏服务进程；水平扩容前必须换成共享队列，不能把此进程内并发上限当集群全局上限。

公开同源 `GET /api/story/usage` 返回当前身份的两类剩余量、预留数、重置时间和真实队列位置。`AiUsage.tsx` 在设置、对话和动态调查中呈现中英提示；80% 提醒，失败保留草稿，已确认未提交的错误清除待重放信封，结果不明则恢复原 ID。无自动付费重试、无静默本地权威回退。

`stage-finance-public.mjs` 与 `apply-finance-usage-ui.mjs` 可从冻结 r20 候选重建本次前端。原美术源目录未改；正式及 Pages 镜像使用同一 commit，Pages 不连接数据库。当前两房间结构和云预算/截止不变。

## r20 目标驱动接入

`src/GoalProgress.tsx` 只读权威目标、来源和两处调查的真实完成记录。`series-layouts.json` 使用dyn-goal-1/2，场景只在采纳后显现。`server/integrations/before-the-close/goal-public-scope.mjs` 在原public world中按experienceVersion隔离新版旅程和回执，但不重置owner、日提议计数或AI账本。旧资料不迁入新玩法，原PG数据不删除。

服务器需显式启用public.series=finance-goal-series-v1及finance-goal-evidence-admission-v1。每个提议最多5次模型调用：目标生成、目标复核、房间生成、房间复核、原文引用审查；任何失败均保留费用与失败记录。前端仍由当前UUID推导同源API；Pages为静态源码镜像，不建立第二世界。

2026-10-01 已完成真实模型两代闭环：第二代承接第一代两条真实分析，切换至合同/付款来源，成功生成、采纳、调查及退出；原旅程逐值不变。累计63/100次（含历史失败），本轮成功续代新增5次。先前引用字段错误和房间重名失败原样留档；修复提示词明确允许的引用字段与已有中英名称，未放宽验证器。QA移除每日子限额及45次子上限，只受原100次全局账本与原截止约束；其他玩家每日3提议及55次共享身份上限不变，所有已用计数保留。发布地址和上线核验另见本次发布记录；本版最多两间，非无限世界。

> **2026-09-30 r19 重要替代说明**：当前权威、服务器存档、AI、自动准入与公共入口架构见 [公共试玩技术文档](public-release-20260930.md)。下文记录历次本地版实现沿革，其中“无后台 / 无在线模型 / 浏览器唯一权威 / 不含动态房间”不再描述当前版本。美术、碰撞和作者章节实现仍沿用。
## 1. 技术栈
React 18.3.1、TypeScript 5.9、Vite 8.0.16、RPGJS 5 beta、CanvasEngine 2.2 与 PixiJS 8。Node 24，`npm ci` 后 `npm run build` 输出 `dist/`，`base` 为 `./`。空间层与旧街采用同一套 RPGJS 运行时组合；剧情继续使用当前冻结的 stateful reducer。来源见 `engine-source.json`。
## 2. 目录结构
`src/content.ts`：双语文书、角色、话题、判断；`src/world.ts`：房间、家具多块 footprint、出入口与接近点；`src/spatial/rpg-space.ts`：RPGJS 客户端/服务端握手、移动、镜头与转场；`src/spatial/sheets.ts`：主角、NPC、家具、底图与前景图层；`src/WorldView.tsx`：RPGJS 场景事件、巡游、热点投影；`src/state.ts`：唯一权威事实、条件判定、结局快照、独立旅程存档；`src/main.tsx`：阶段对话、地图、资料、菜单、放大和结局；`src/audio.ts`：音乐与动作声音。
`public/map` 保存四张 Tiled 地图、透明地砖和按房间生成的底图/前景层。每张 TMX 均保留 `collision` objectgroup；缺失该层时 RPGJS 不会建立人物与事件显示节点。`scripts/build-map-layers.mjs` 从正式地面、墙、窗与门素材确定性生成这些层。
public/art 与 public/audio 是准入后的运行资源；materials 内保留选定原图和服务任务记录。scripts/media-plan.json 记录平台任务，assemble-hero-v6.py 只做有记录的裁切、透明化、整帧镜像和图集装配。各 assembly JSON 对应运行资源与选定源图。
_qa 保存机械与真实浏览器路径脚本；doc/evidence 保存可交付截图。worker/index.js 只提供部署健康检查，无游戏后台。
## 3. 核心模块
故事事实仅由冻结 reducer 的 domain effects 写入。探索坐标与旅程目录属于产品壳；不另建一套剧情库存。结局不可改签，decisionSnapshot 保留签署时已核实的依据。未知人物在首次可见介绍后加入档案。历史最近60轮，地图不传送玩家。
七房间 640×640；人物占地 14×10，主角和 NPC 的显示框统一为 80×80。共享布局生成碰撞和已验收接近点；组合家具使用多个落地 footprint，透明角落和椅子之间的空隙保持可走。BFS 路线逐像素检查边，落点还必须在 65 像素互动半径内；移动速度 108 世界像素/秒。实际位移驱动步态与 25 像素一步音。分析师在 44 像素岗位范围巡游，其余角色值守；接近 105 像素停步转向。
RPGJS/CanvasEngine 持有地面、墙、家具、人物和前景纹理，移动帧只更新位置、姿态与镜头；不再逐帧用 Canvas2D 重画高分辨率全场景。手机镜头显示约 296–430 世界像素宽，按人物脚点水平跟随；逻辑高度保持 640。UI 内部适配 320×568 与 390×844。步态按 52 世界像素一循环，减少低帧率时跳过支撑相；正式资源 URL 带 release ID，防止 WebView 沿用旧图集缓存。首次手势播放 45 秒平台音乐，前后台切换暂停恢复，右上全局静音。文案使用中英 Pair 与 `tx`，不依赖在线模型。

`scripts/build-map-layers.mjs` 现在分别组装北墙、侧墙与南侧前景层：基础层绘制北墙后绘制侧墙，前景层最后绘制南墙；南墙在 `world.ts` 中有相同的碰撞带，办公室按门洞拆成左右两段。`scripts/assemble-axis-furniture.py` 从四个已接纳的平台 2×2 运输图中逐格裁切、清除连通背景，并写入方向与来源清单。`doc/scene-visual-contract.json` 记录每室墙体尺寸、角点关系、家具方向占比与双尺寸证据。

主角运行图集仍由 `scripts/assemble-hero-v6.py` 确定性生成；正式 opposite contact 必须在 `doc/actor-pose-plan.json` 指向其 seed contact 的平台 task。运行顺序固定为 contact、stand、opposite、stand，右向由侧向姿态族整帧镜像关系派生。release `before-the-close-rpgjs-r7` 用于使 WebView 获取本轮人物、家具和四类独立地图层。
存档通过部署UUID隔离的alteruLocalStorage，本浏览器多旅程，不承诺跨设备。首次进入跟随 `navigator.languages`：中文系统用中文，其余系统用英文；用户手动切换后记录 `localeMode: manual` 并尊重该选择，系统语言变化只更新 system 模式。每1.5秒及pagehide存位置；坏档保留原值，经用户明确动作备份后重开。后台无账号数据或共享经济系统。
## 4. 扩展点
改故事编辑 `content.ts` 和 `state.ts` 条件；加场景先改 `world.ts`、生成带 objectgroup 的 TMX 与底/前景层，再跑路径和真实显示树测试。新物件需同步多块 footprint、接近点和脚点深度；不按透明画布外框猜碰撞或尺度。改主角先通过 `hero-assembly.json` 检查及真实四向连续帧复验，不能只换静态 PNG。
主题在style.css，控件行为在main.tsx；服务生成仅在离线生产脚本发生。若要运行时生成房间，必须另接技能渐进交付与恢复合同；本章节不包含该功能。若加平台云档或生成对白，应另实现认证、回执和权威边界，不能把本地模式写成已验证云能力。

## 本轮游戏收口
activateJourney / appendJourney 在活动旅程改变前保存实时脚点，避免间隔写盘成功但内存目录位置陈旧。arriveAt 让剧情时间单调推进；它是作者场景时间，不是实时倒计时。摇杆有7 CSS px死区，手柄按指针偏移并在取消/松手时归中。结局后的afterDecision按角色和既有决定提供现场回应，签署后negotiate在领域层拒绝改写条款。

### 2026-09-22 出口视觉修订

`src/door-layout.json` 是出口位置和朝向的共用输入，`scripts/build-map-layers.mjs` 与 `src/world.ts` 消费它。镜头的垂直边缘揭示位移同时用于 RPG 挂载节点、热点投影和点击反投影；角色逻辑坐标及现有存档坐标保持原含义。新门口截图位于 `_qa/ui/platform-layout-wall-review-*`，仅为本地待用户评审版本，未发布。

### 新平台美术隔离试验（2026-09-23）

DEV参数 `artTrial=platform` 通过 spatial/sheets.ts 按 sample-manifest.coverage 选择新平台样本资源；未覆盖资源仍走旧引用。world.ts 仅在该DEV模式调用 platform-room-layout.ts，共享渲染布局和碰撞测试。生成脚本只访问统一媒体API，保存幂等ID、响应、来源和时延；下载失败从已返回URL恢复，不再次付费生成。准备脚本显式去洋红底与等比装配。生产默认未切换，本段不代表全量换图或动态生成功能上线。

### r8默认美术与构建合同

src/art-assets.ts默认启用平台新素材，只有DEV显式legacy/actor/room才回旧试验。sheets.ts按新清单加载独立NPC图集和真实图片尺寸；world.ts应用四房布局与独立座椅占地。build-platform-sample.py从本轮原图处理结果装配并安装65个运行文件。finalize-art-build.mjs从dist移除旧图，保留源码回退。脚本audit-platform-art.py校验SHA、同轮引用图谱和运行覆盖，不判断美学。正式构建两尺寸端到端回归见platform-art-20260923/evidence。

### 冷加载转场修正 r8.1

WorldView按房间选出主角、NPC、家具、墙地门纹理，先经Pixi Assets.load进入同一纹理缓存。首场景准备后创建引擎；restore设置changing后调用prepareScene，再changeMap，避免旧精灵异步加载恢复时访问已销毁transform。800ms图片延迟的两尺寸往返复验通过。


### 持续行走修正 r8.2

音频固定复用上限为step 3 / paper 2 / door 1，音乐单实例；不随脚步新增播放器。音乐失败重试不重复注册前后台监听。NPC仅在位置/方向/姿态变化时同步。相机与互动标记采用transform，保持原有project/toWorld映射；摇杆旋钮通过ref局部更新，pointermove不再使App重渲染。

持续测试脚本 `_qa/movement-soak.mjs` 支持 `QA_URL / QA_CPU / QA_BLOCKS / QA_INPUT=touch / QA_WIDTH / QA_HEIGHT / QA_LABEL`。必须检查实际travel，避免把撞墙静止误算为行走测试；默认自然GC。iPhone AlterU约5秒卡顿的用户报告及修复证据见 `movement-performance-20260923.md`；桌面模拟不等于目标设备通过。

### r8.3 探索与交谈UI
地图接近目标保留44px可访问区域，去除常驻圆点，人物命中点由原头顶移到身体。主行动使用深青实底/金边和按压位移；原摇杆净空、文字右对齐不变。对话以实体+台词+页码+语言绑定阅读计时，900ms后开放开口/回应；等待420ms后呈现NPC台词，最后页自动进入选项，其他页保留继续。新等待、关闭与换对象取消旧计时。减少动效只关闭180ms淡入。

### r8.4 地图与资料夹
Atlas.tsx以world.entities门连接构建有向图，map-route.ts广度优先查路，door-layout.json给出每段门方向。缩放/拖动只改变地图视图，未改游戏坐标。资料夹新增overview，统计当前旅程已收集记录、已核实判断和已认识人物；人物页显示当前旅程history并保留头像放大。资料/判断原有逻辑继续使用。

### r8.5 自由交谈
free-dialogue.ts通过平台匿名game-chat接口发送NPC身份、已揭示资料、当前开放话题和同人物最近4轮记录。回复只显示并成对写入当前浏览器旅程history，不向reducer写任何模型指令。500字符限制，25秒超时，AbortController防重复并在关闭/换对象/卸载时取消；迟到回复不写入。草稿在当前页面按旅程和人物隔离，失败保留并可重试；刷新不承诺恢复未发送草稿。模型台词不等于权威事实。未引入新世界后台，预设判断/交易动作保持独立。


## 连续话题更新（2026-09-24）
使用 src/conversation-flow.ts 对完整已提交问答做话题完成投影，稳定 topicKey 与回应一起保存；作者追问依赖 after，utility 不消耗。新增历史不再静默截断，界面分页与模型上下文窗口分开。存储适配、测试和边界见 conversation-lifecycle-20260924.md。

## 固定章节扩展（2026-09-25）
七房由 src/world.ts、door-layout.json 与 public/map 定义，共享布局与碰撞。新增 delivery/channel/meeting 均使用原 RPGJS 渲染路径，不引入新引擎或动态生成服务。src/chapter.ts 定义阶段、修订材料、事实门槛和结局后回应；state.ts 保存 chapterVersion，已结束旧存档继续封存。收集修订材料必须在阶段变化后重访物件；原始证据和结局快照保持独立。

新增素材经 scripts/generate-chapter-art.mjs 调用统一媒体服务，准备/组装脚本与请求记录可追溯；发布 manifest 决定素材覆盖范围，chapter-art-dimensions.json 提供独立家具尺寸。相机容器使用 overflow:clip，防止远处可访问控件聚焦时发生 DOM 横向滚动。

## 大本营与分地点地图
`headquarters.ts` 提供项目目录、既有关系、委托与归档状态。Journey 标记 projectId，当前只有 relayops，独立旅程不共享证据；这还不是动态多公司运行时。`world.ts` 的十房分属四个物理地点；`locations.ts` 的 areas/areaOf 定义分区，内部图仅连接本地点房门，总览卡片切换地图而不传送。跨区出口打开外访确认，确认后才经原 arriveAt 转场；取消保持原位置。会议室提交意见、合伙人室复盘、资料室归档，均沿用原剧情事实。旧档仍按原位置恢复，已有材料视为委托进行中，旧结局不撤回。

### 地点音频
`locations.ts` 是房间所属地点的公共真源，地图和 `location-music.ts` 共用。`audio.ts` 在首个手势恢复 AudioContext，以GainNode统一静音并交叉淡化两个BufferSource。解码缓存最多两条，加载令牌拒绝迟到结果；返回原地点会取消过时切曲，文件失败保留当前曲并在下次手势重试。文档隐藏时暂停context与脚步音效。素材生成记录在doc/location-music-20260925，原始音频与音量处理文件分开保留。

## 中央接待区修正
新增lobby，location-rooms.json共享地点房间归属；door-layout.json的五条总部双向支路为地图/寻路/转场真源。assemble-central-headquarters.py用已认可的独立墙地/侧门重组11房，北墙64、侧墙8、南墙视觉512..576而碰撞548..576，建立可见前景覆盖。北南通道保持开放，侧门独立排序；wall-decor-0..2来自平台纯文生，源任务与裁切坐标记录在doc/hub-decor-20260925。load仅在旧脚点不再可行走时迁移至原房spawn。平台纹理URL绑定RELEASE_ID，防止原地址墙体缓存。

正面门纹理为1280×640的闭合/空框两帧，由同一源图提取；RPGJS事件只在接近状态改变时切animationName并sync，不逐帧重建纹理。侧门640×640保持独立门扇和近端墙截面。所有四向门仍来自door-layout.json，主体世界尺度不因门状态变化。

### 南墙局部透显
`src/spatial/foreground-reveal.ts`为实际Pixi前景增加一个共享纹理的30%透明副本和椭圆孔遮罩。逐帧只更新位置及可见性，不重绘整房纹理；场景改变销毁旧副本与遮罩。世界人物位置转为墙sprite父节点坐标时扣除anchor×640，避免底部锚点造成揭示孔错位。DEV的wallReview控制使用正常寻路，生产构建不包含该面板。

### r13 对r12遮挡方案的替代
foreground-reveal已改为一次生成512方形渐变alpha纹理，Pixi Sprite mask直接应用于南墙，移除硬孔Graphics及半透明副本。architecture.ts共用参数和墙段重叠判定；sideLeafBodies加入world障碍，动态NPC寻路仍从同一world障碍表扩展。开发测试面板可使用正常寻路和持续输入测试门板，生产构建移除。北墙脚点改为128，北门坐标、接近点、室内边界和装配器同时更新；合法旧档保留，落入新墙的旧脚点经已有迁移返回该房出生点。

### r14 当前比例与边界（替代 r12/r13）
核对旧街实际运行覆盖值 heroScale=.24，而非目录默认.14：旧街站姿可见54.24，当前67.5。统一11房北墙80（48..128）、南墙80（506..586，地面脚线576）、墙帽10、侧厚10。保留北门脚线128避免移动门位。南墙前原548..576阻挡带删除，人物脚可到576，由室内边界阻止越墙；侧门门板接触线碰撞保留。渐变揭示半径50，中心脚点上30，中心墙面不透明度20%。此前r13比例计算有误，不能继续作为验收标准。39项测试通过，包含全部房间墙脚边界、门板碰撞与出口可达。手机WebView仍由用户复测。

### 地图快捷前往候选（等待用户试玩）
`use-map-gesture.ts`把手势视图写入ref，requestAnimationFrame只更新地图transform；React仅在手势结束更新缩放按钮状态。`map-gesture.ts`负责焦点缩放与边界约束。`map-travel.ts`在提交前检查到访、总部出访项目准入和真实门路线；`arriveAt`统一累积旅程visited、保留时间单调，旧档不猜测外部访问史。地图切换只更新房间/位置，到访不等于收集证据。正面门不再由WorldView距离自动切帧；明确按前往才进入下一房。新地图目前为候选实现，未同步共享技能，也未宣称双指/iPhone实机通过。


## 2026-09-26 地图导航改造
地图手势使用 `src/map-gesture.ts` 的纯模型与 `src/use-map-gesture.ts` 的 React 适配器。拖动只更新 RAF transform，结束时同步按钮缩放状态；支持累计阈值、双指切单指、取消、重新挂载和 resize。快捷前往通过现有旅程权威入口提交，沿已知且畅通的真实门路径检查，不绕过剧情条件。
本轮回归 45 项通过，构建通过。快捷前往后刷新位置保持；重复请求与陈旧版本有机械测试。手机尺寸浏览器检查与真实 iPhone 双指/持续拖动性能不是同一种证据，后者待试玩。

### 新人序章（2026-09-28）

`DialogueCoach.tsx` 在人物已介绍、回应可用时展示开放提问邀请；成功状态来自服务端 history 的 `topicKey: free-talk` 标记，介绍和预写话题不算成功，刷新不重置。旧无标记记录不推测为 AI 成功；再进行一次真实交流即可完成邀请。提示不写剧情事实，不增加通关前置。

2026-10-01 自由对话修复：权威运行时不再把 free-talk 当作 main-flow 拦截；序章中已介绍且在交互距离内的人物可聊天，聊天无规则效果，不推进引导事实。其他主线动作的序章条件保持不变。客户端把 PROLOGUE_REQUIRED 作为确定拒绝清除待处理信封，保留输入与进度，并给出准确提示，不再伪装成网络故障。
`src/prologue.ts` 定义 welcome/role/colleague/brief/check/file/ready 七个持久阶段，沿用 StorySave facts。`newJourney()` 设置 `prologueVersion:1`，旧旅程无该字段，继续原流程。新旅程的 `collect`、`decide`、`arriveAt` 与 `projectAccepted` 共同保护序章条件；地图复用同一许可。`dialogueTopics` 序章内仅返回当前可用引导话题；自由对话上下文使用相同简化资料。基金资料室实际打开摘要才记录回看进度。美术与 RPGJS renderer 无改动。
# 2026-10-01 选项知情与对白续读修复

`dialogue-questions.json` 是四个过度预设初始问题的双语呈现修订；服务端保存问句与客户端按钮使用同一份内容（发布时逐字校验）。稳定 topicKey、作者回复、编译规则和 mapVersion 不变。`conversation-topics.ts` 同时保留原问答及新问答精确别名，兼容无 topicKey 的旧历史。

`dialogue-reading.ts` 保存按当前部署 session、旅程和人物隔离的 exchangeId/page/locale；正文始终从服务器已保存历史查找，不另造剧情。新回应立即记录未读位置，续页更新，末页展示后清除；重新打开先恢复同一回应。切换语言重新读这轮，旧存档不伪造阅读位置。它是当前设备的展示恢复，不是跨设备已读证明。
# 2026-10-01 固定截止撤销

公共代理需显式私有绑定 `RPG_PUBLIC_TIME_POLICY=user-approved-budget-only-20261001` 和 `RPG_PUBLIC_EXPIRES_AT=none`；缺少/错误授权标记仍拒绝配置，非授权部署仍遵循原固定期限。公共服务同样要求批准标记及 null 期限。模型网关仅移除固定 expiresAt，不更换既有预算 ID 或清空调用总账，metering-only 策略不变。原 QA 截止仍保留；过期 QA handler 可构造但请求返回 410，避免同进程公共服务重启失败。Cookie 30 天有限续期仍使用原 HMAC/同游戏 scope/HttpOnly/Secure/SameSite=Strict；只在成功 bootstrap GET 续期原签名身份，写入缺失身份仍拒绝。75 秒公共代理和 60 秒模型超时不变。
