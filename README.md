# OmniALE V2：题面、答卷与评分看板

**在线看板：https://nanxiang-git.github.io/OmniALE_v2/**

**当前为轻量展示版。** 题面、答卷索引与评分记录完整保留，超过 5 分钟的输入视频仅预览前 5 分钟，部分大原件不上传。时间轴超出预览范围的事件可读记录，无法在截短预览中播放。详细范围见 `lightweight.html`，文件可用性以 `asset-manifest.json` 的 `availability` 为准。

包含 14 道正式任务、48 个 Case 概念、434 个公开输入/规范文件，以及 14 份冻结答卷的 450 个交付文件。结果区提供成片、音频、字幕导航、抠像抽帧、修复对照、审核时间轴和逐项评分依据。

## 评分说明

本看板展示已有评测记录。第3题已更新 Resolve 原生 API 探索性实验，第12题已更新两模型评分与专家标注；其余题目保留已有数据。待评不记为零分；答题者自检不作为独立成绩。第 12 题使用最终确认的 `case12_retry2`。

## 文件分布

- 页面、评分数据、图片、小文件和压缩媒体预览存放在本仓库。
- 超过 5 MB 的原始文件存放在本仓库 `dashboard-assets-20261102` Release，文件名带原件 SHA256 前缀。大于 50 MB 的 WAV 使用无损 ZIP 封装，解压后与原件逐字节一致；看板的“打开原文件”链接指向原件或其 ZIP。
- `asset-manifest.json` 列出全部 939 个输入、答卷和评测来源文件的原路径、大小、SHA256 和存储位置。
- 网页压缩预览仅供浏览，不替代原始交付物，不能用于重新判定像素、音质、响度或评分。93 分钟源片直接从 Releases 加载原文件，首次加载可能较慢。
- 题包和答卷各自的 `SOURCES.md`、`CREDITS.md`、README 等保留来源、署名与许可说明；本仓库不为第三方素材另授许可。

## 本地下载可用文件

克隆或下载本仓库后，使用 Python 运行：

```sh
python download_originals.py
python case_dashboard/serve.py --open
```

下载脚本只获取本次已上传的原件，自动解压长 WAV、按原路径保存并核对 SHA256，将相关看板链接改为本地路径；已正确下载的文件会跳过。未上传的大文件会跳过。原始全集约 6.64 GB，本轻量版不承诺完整还原全集。脚本不运行任何答卷代码，不需要 GitHub 令牌。

在线版与本地版均保留全部题面、答卷索引和评分记录。`case_dashboard/README.md` 描述原始本地全集；在线版文件范围以本说明为准。发布与验证统计见 `publication-report.json` 和相关检查报告。

## 第12题结果更新（2026-11-03）

[查看第12题答卷与评分](https://nanxiang-git.github.io/OmniALE_v2/case_dashboard/dist/index.html#task-12/results)。Sol 总分65.2891/100（专家6/10），Luna 总分34.363/100（专家3/10）；两者硬门槛均未通过。含失分排行、门槛差距、逐角色召回、具体字幕例子及 Sol 标签解析边界。Luna 完整冻结视频和7个交付物已上传；Sol 保留已有压缩预览。其他题目数据未在此次刷新。

## 第3题原生 API 实验更新（2026-11-04）

[查看第3题看板](https://nanxiang-git.github.io/OmniALE_v2/case_dashboard/dist/index.html#task-03/results) · [查看成片与评分报告](https://nanxiang-git.github.io/OmniALE_v2/case_dashboard/dist/case3-api-report/index.html)。普通版 Resolve 通过内部 Lua 桥接调用原生 API，启动之后没有使用 GUI 自动操作。gpt-6.1-sol / high 在 120 分钟预算内完成，实际约 94.1 分钟。

ALE 质量原始分 **50.9294/100**，正式分仍待校准。报告包含两段完整输入/输出视频、失分计算、具体错误示例、独立工程复验及完整冻结交付包（约 57 MB）。DRP 独立导入、素材重定位并重渲染后，两段各 100 帧与提交视频逐像素一致。全片语义审查未通过；线性光合成尚未确证，完整软件合规状态保留为待核实。原始质量分不等于全面通过，运行期间基础设施修正等边界在报告中说明。

新版题面与公开文件一并发布，原始视频不变，旧版 v2 答卷保留在历史入口。未发布隐藏参考或私有评分材料。本轮新增文件清单及验证见 `case3-publication-report.json`；本轮完整交付 ZIP 直接存放于仓库，未转码。
