# 继续入口
当前目标：VC/PE投资人可玩的完整新章节《交割之前》，同时验证技能可复用性。项目独立目录，不覆盖 memory-margin / rpgjs-story-lab。
源与功能均完成，真实两尺寸通关、条件路线、存档、音频播放和技能包已验证。交付边界看qa-report与skill-evaluation，不能把未完成的陌生agent盲测或人工听感说成已通过。正式发布状态以release.json为准。
运行 Node24 + npm ci / npm run dev，5225开发、5226当前dist预览。用户回报优先修本项目并更新具体失败合同，不读取旧游戏源码作为隐藏依赖。

2026-09-20 后续收口：用户明确暂不处理平台入库。优先完善游戏本身；新增跟手摇杆与死区、旅程切换前落点检查点、不会倒退的剧情时钟、资料集齐核对引导和五位NPC的结局回应。

2026-09-20 平台入库：用户解锁电脑后恢复处理，AIGram Mini App 中 Before the Close 从 Publish 变为 Update，Go 刷新后仍为 Update。入库已确认；正在等用户打开 AlterU 小程序，补做平台入口试玩与重进恢复检查。

平台补验完成：AlterU → 作者页 → Create → Published → BEFORE THE CLOSE → Play，实际走近并收集摘要；重进后目标与资料均保留。环境为 macOS Telegram WebView。首次图片加载失败一次，手动重试后恢复；29个正式图片URL独立返回200，尚未确定首次失败原因。不能把本次冒烟验证等同完整平台通关、iPhone实机或跨设备恢复。

2026-09-21 纽约国际化 VC/PE 美术第二轮已在本地完成：新主角、五位 NPC、头像、四套地面与功能家具均来自平台媒体服务；英文为新旅程默认语言。390×844 / 320×568 四场景、英文对话与头像、完整剧情和刷新恢复已通过。运行时接近点覆盖与投委会互动半径两处 P0 已修复并补自动门禁。

2026-09-21 空间运行时已从逐帧 Canvas2D 重绘迁移为与旧街一致的 RPGJS + CanvasEngine + PixiJS，保留现有家具美术。四张 TMX 已补必需的 `collision` objectgroup；组合家具改为多个 footprint，透明角与椅间空隙可通行。两种手机尺寸完整通关、四房间复拍、显示树检查和 3× DPR 移动性能均通过。共享 `build-spatial-story-game` 技能已把 RPGJS 默认运行时、TMX objectgroup 与 Pixi 显示树验收固化为强制要求。尚未执行本轮提交与双部署。

用户要求重新回看旧街：已实际查看院落与修表铺、运行hero-gait-v2及浮动UI。新项目本地已改铺底浮层/相机覆盖。见 old-street-visual-rebuild.md。纽约主角/地板候选走平台生成，但主角任务终态失败（非可重试）；没有新美术入运行、没有发布，下一步恢复平台生成后先主角与基金单场景。

平台恢复复测：简单512图 HTTP200 succeeded约3.9秒；主角edit与地板text均成功含下载15.5/9.1秒。主角anchor-v2视觉拒绝：仍细长正面立绘。继续v3严格保留旧街图集几何的服装编辑；地板v2仅生成候选，尚未合成准入。

早期 proportion-v3 等候选仍为拒绝状态；最终主角运行图集来自后续分方向平台帧和整帧装配，不能混淆。用户随后撤销旧 NPC 签收：其四宫格素材在真实画面中比主角显小且风格不同。五名 NPC 已按主角 accepted 单帧标准逐方向经平台重生并装配，等比感知尺寸调整为 114/128；`_qa/npc-scale-review.mjs` 已保存五组主角相邻同屏证据。Daniel 的长腿走路候选被拒绝，未进入运行图集。人物互动提示点已升到头顶净空位置。技能已增加整组演员的可见宽度、头部、肩宽、像素密度、互动提示锚点和逐人同屏门禁。2026-09-21 r3 已迁移到真实 RPGJS，并完成公开扫描、两尺寸回归、UUID 自托管与 Pages 双部署；正式证据见 `release.json`。

2026-09-22 墙门专项本地修订：参照 native-door-admission.md，平台新生现代办公室门扇和参考编辑门槛，原图去底等比显示；侧门背景、门扇与近端门框独立深度事件，统一出口配置，镜头上下边缘揭示。doc/door-art-review.json 保存来源。最新本地截图 platform-layout-wall-review / platform-layout-door-native。未发布、未宣称整套美术合格；首轮四立柱门槛被拒绝。此前 r7 的 accepted 不能作为本轮视觉结论。

2026-09-23 用户暂停平台门素材提示词/灰模试验，demo阶段回到已认可内置图像工具路线；工具未披露具体模型，不冒称确认GPT-6。尚未接入或发布新门。用户要求审计此前参考依赖，见reference-dependency-audit.md/json：主角/NPC、多房间地面、早期家具和Memory Margin新房间计时测试均存在edit依赖；当前四套轴向家具v3与头像v2为text，不能一概归类。平台执行不等于无参考生成能力。

## 2026-09-23 最新：美术清零独立重制（优先于前面的历史完成状态）

用户明确要求所有运行美术重新制作，仅靠技能文字，不读取历史游戏图片参考。工具选内置 imagegen，模型身份未暴露。现有未提交修改全部保留，未替换生产素材，未发布。

本轮资料：`doc/art-rebuild-20260923/PLAN.md`、`generation-ledger.json`、`REVIEW.md`。40张生成原图已保存，其中17张text、23张本轮新图派生；无历史图参考。`scripts/audit-fresh-art.py` 来源审计通过，但 accepted=0，不能当视觉完成。`scripts/prepare-fresh-art.py` 只输出隔离候选图集与实际尺寸比例板；不会读取旧素材。

已拒绝旧式长身主角、独立长身NPC、写实墙/门、两版收缩桌面的档案家具、第二版收缩轮廓的门。wall-v2是新的像素墙候选；door-v2仍不合格。主角侧向contact两端太相似，NPC只有站立方向，均须补验证/修正。不要继续未经签收批量扩展。下一步先做好一间完整房间的厚墙、原生门、主体家具和主角连续步态，再在真实RPGJS中用390×844、320×568检查。

其他未完成：窗口/侧门端面、肖像/海报重生，档案家具纠正，全部runtime引用覆盖、其余房间合成、碰撞、动画、完整功能回归。共享技能新增 `references/independent-art-trial.md` 记录分层能力、禁止旧accepted继承、先样本房后扩展以及失败证据。当前不能宣称游戏重制完成或技能稳定性验证通过。

### 侧向人物修正续记

新增42张中的最后两张为hero-left-contact-b-v2（失败，复现A）、v3（候选，改善抬跟与交叉）。prepared/hero.png已使用v3。新增hero-walk-review.gif素材循环和_qa/fresh-gait.html。本地5235端口运行；?artTrial=actor只切新主角，其他图片仍旧版，只可叫人物隔离测试。_qa/actor-trial-controls.ts只在DEV挂载，按钮使用真实键盘事件执行四向短循环，已停下。构建经过检查，尚未将新美术作为默认资源，尚未发布。

### 首间新素材房间已接入

本地http://127.0.0.1:5235/?artTrial=room，基金办公室世界素材改用doc/art-rebuild-20260923/prepared，不修改默认生产资源。新增scripts/build-fresh-sample.py、src/fresh-room-layout.ts与_qa/fresh-room.test.ts。候选门door-v3、连续sidewall-v1、window-v1为无参考文本生成；端面由新墙材质裁块拼装，已披露。全部来源审计45张=20text+25edit，accepted仍0。

真实RPGJS验证fund→office→fund并抵达即能返回。两种CSS视口门口截图已发对话。13项测试通过；同屏效果还需用户评审，NPC站立复制不是步态已完成。不要把候选称已验收或上线。下一步继续主角/NPC运动与南墙/四角检查，再扩展其余房间。

## 2026-09-23 新平台GPT接口样本（当前优先）

统一媒体服务v0.5.0已跑通，当前改造使用显式Sunburst模型。独立记录见 `doc/platform-art-20260923/PLAN.md`、`REVIEW.md`、`requests/`；无历史图参考，同轮人物edit已披露。脚本 generate-platform-art.mjs / prepare-platform-art.py / build-platform-sample.py。Python必须用 /Users/yin/miniconda3/bin/python3。

DEV入口5236/?artTrial=platform；新主角、Mara站姿、基金房墙地门窗家具接入，14项测试、构建与两尺寸门往返通过。其他房间、Daniel等演员及肖像仍旧；主角背向鞋形/完整步态尚未通过。未发布、未替换默认生产美术。先完成样本房与演员门禁，后扩展全游戏；动态生成另验。所有此前未提交修改保留。

## 2026-09-23 r8 全量新美术（覆盖前述样本状态）

新接口81次请求（32text/49同轮edit），四房间/主角/五NPC/五头像/封面已成为默认运行素材，65个派生运行文件；不再需要artTrial参数。历史图未用于生成，旧素材源码保留，正式dist剔除旧运行图片。主角原始背向A/B得到用户认可，已恢复，不再按鞋口高光否决。

正式dist两尺寸完整通关/存档恢复通过，17项测试通过；主角四向两循环、分析员巡游/靠近转向已验证。详见platform-art-20260923/REVIEW.md及evidence。共享技能新增platform-gpt-art-trial.md，记录实际配方、过度审核纠偏和截图真源门禁。发布状态看release.json。玩家动态生成和陌生agent盲测仍未完成，不把作者生成成功扩大成全链路完成。

线上冷加载补修r8.1：图片未完成时转场可能让CanvasEngine更新销毁的精灵。新增prepareScene纹理缓存准备，目标房间图片就绪后再切图；800ms图片延迟两尺寸门往返零异常。技能运行时模板同步prepareScene合同，包内媒体SDK也同步新版。最终双部署以release.json实际hash为准。
