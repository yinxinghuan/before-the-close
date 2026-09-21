# 技术文档
## 1. 技术栈
React 19、TypeScript、Vite 8、Canvas 2D。Node 24，npm ci 后 npm run build 输出 dist，base 为 ./。不是 RPG-JS 运行时；独立消费空间技能的 world / distance-motion 与当前冻结 stateful reducer。来源见 engine-source.json。
## 2. 目录结构
src/content.ts：双语文书、角色、话题、判断；src/world.ts：房间、家具、脚点碰撞、出入口与接近点；src/WorldView.tsx：相机、位移、图集、深度排序、巡游与实体热点；src/state.ts：唯一权威事实、条件判定、结局快照、独立旅程存档；src/main.tsx：阶段对话、地图、资料、菜单、放大和结局；src/audio.ts：音乐与动作声音。
public/art 与 public/audio 是准入后的运行资源；materials 内保留选定原图和服务任务记录。scripts/media-plan.json 记录平台任务，assemble-hero-v6.py 只做有记录的裁切、透明化、整帧镜像和图集装配。各 assembly JSON 对应运行资源与选定源图。
_qa 保存机械与真实浏览器路径脚本；doc/evidence 保存可交付截图。worker/index.js 只提供部署健康检查，无游戏后台。
## 3. 核心模块
故事事实仅由冻结 reducer 的 domain effects 写入。探索坐标与旅程目录属于产品壳；不另建一套剧情库存。结局不可改签，decisionSnapshot 保留签署时已核实的依据。未知人物在首次可见介绍后加入档案。历史最近60轮，地图不传送玩家。
四房间640×640；人物占地14×10，渲染框80×80。共享布局生成碰撞和已验收接近点，运行时不得用人物脚下固定偏移覆盖。BFS路线逐像素检查边，落点还必须在65像素互动半径内；108世界像素/秒移动。实际距离驱动行走与25像素一步音。分析师在44像素岗位范围巡游，其余角色值守；接近105像素停步转向。人物、家具按脚底深度排序，门洞补片先画，底墙最后画。
Canvas依据DPR与视口重绘，UI内部适配320×568与390×844。首次手势播放45秒平台音乐，前后台切换暂停恢复，右上全局静音。文案使用中英Pair与tx，不依赖在线模型。
存档通过部署UUID隔离的alteruLocalStorage，本浏览器多旅程，不承诺跨设备。每1.5秒及pagehide存位置；坏档保留原值，经用户明确动作备份后重开。后台无账号数据或共享经济系统。
## 4. 扩展点
改故事编辑content.ts和state.ts条件；加场景先改world.ts并跑路径测试，再集成素材。新物件需同步占地、接近点和脚点排序；不按画布宽度猜真实尺度。改主角先通过hero-assembly.json检查及真实四向连续帧复验，不能只换静态PNG。
主题在style.css，控件行为在main.tsx；服务生成仅在离线生产脚本发生。若要运行时生成房间，必须另接技能渐进交付与恢复合同；本章节不包含该功能。若加平台云档或生成对白，应另实现认证、回执和权威边界，不能把本地模式写成已验证云能力。

## 本轮游戏收口
activateJourney / appendJourney 在活动旅程改变前保存实时脚点，避免间隔写盘成功但内存目录位置陈旧。arriveAt 让剧情时间单调推进；它是作者场景时间，不是实时倒计时。摇杆有7 CSS px死区，手柄按指针偏移并在取消/松手时归中。结局后的afterDecision按角色和既有决定提供现场回应，签署后negotiate在领域层拒绝改写条款。
