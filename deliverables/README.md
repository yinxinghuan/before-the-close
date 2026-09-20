# 空间探索 RPG 技能交接 v1.45
解压 spatial-rpg-handoff-v1.45.zip 到接收环境的 skills 目录。入口是 build-spatial-story-game/SKILL.md；相邻依赖一起提供。Node 24、Python 3 + Pillow/numpy 用于示例整理与 QA；接收端还需可用的平台媒体服务及浏览器自动化工具。
本包提供流程、独立参考、模块、冻结叙事内核和检查器，不是自动通过美术验收的成品模板。新素材须逐帧与真实场景签收；不可把 capabilities 模板当已实现证明。
技能仅产出合规项目，不包含本机发布工具、目录迁移配置或凭据。接收团队按自己的发布流程部署。
本次《交割之前》是带经验作者的新题材复用，未读取旧游戏源码；不是陌生 agent 盲测。完整证据与尚未验证事项见项目 doc/skill-evaluation.md、doc/qa-report.md。
单独的 build-spatial-story-game ZIP 用于空间模块回归。依赖包保留各自原始说明和模板来源，排除 node_modules/dist/.git。
