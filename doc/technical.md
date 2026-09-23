# 技术文档
## 1. 技术栈
React 18.3.1、TypeScript 5.9、Vite 8.0.16、RPGJS 5 beta、CanvasEngine 2.2 与 PixiJS 8。Node 24，`npm ci` 后 `npm run build` 输出 `dist/`，`base` 为 `./`。空间层与旧街采用同一套 RPGJS 运行时组合；剧情继续使用当前冻结的 stateful reducer。来源见 `engine-source.json`。
## 2. 目录结构
`src/content.ts`：双语文书、角色、话题、判断；`src/world.ts`：房间、家具多块 footprint、出入口与接近点；`src/spatial/rpg-space.ts`：RPGJS 客户端/服务端握手、移动、镜头与转场；`src/spatial/sheets.ts`：主角、NPC、家具、底图与前景图层；`src/WorldView.tsx`：RPGJS 场景事件、巡游、热点投影；`src/state.ts`：唯一权威事实、条件判定、结局快照、独立旅程存档；`src/main.tsx`：阶段对话、地图、资料、菜单、放大和结局；`src/audio.ts`：音乐与动作声音。
`public/map` 保存四张 Tiled 地图、透明地砖和按房间生成的底图/前景层。每张 TMX 均保留 `collision` objectgroup；缺失该层时 RPGJS 不会建立人物与事件显示节点。`scripts/build-map-layers.mjs` 从正式地面、墙、窗与门素材确定性生成这些层。
public/art 与 public/audio 是准入后的运行资源；materials 内保留选定原图和服务任务记录。scripts/media-plan.json 记录平台任务，assemble-hero-v6.py 只做有记录的裁切、透明化、整帧镜像和图集装配。各 assembly JSON 对应运行资源与选定源图。
_qa 保存机械与真实浏览器路径脚本；doc/evidence 保存可交付截图。worker/index.js 只提供部署健康检查，无游戏后台。
## 3. 核心模块
故事事实仅由冻结 reducer 的 domain effects 写入。探索坐标与旅程目录属于产品壳；不另建一套剧情库存。结局不可改签，decisionSnapshot 保留签署时已核实的依据。未知人物在首次可见介绍后加入档案。历史最近60轮，地图不传送玩家。
四房间 640×640；人物占地 14×10，主角和 NPC 的显示框统一为 80×80。共享布局生成碰撞和已验收接近点；组合家具使用多个落地 footprint，透明角落和椅子之间的空隙保持可走。BFS 路线逐像素检查边，落点还必须在 65 像素互动半径内；移动速度 108 世界像素/秒。实际位移驱动步态与 25 像素一步音。分析师在 44 像素岗位范围巡游，其余角色值守；接近 105 像素停步转向。
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
