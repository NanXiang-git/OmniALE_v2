# OmniALE 本地题面、答卷与评分看板

双击根目录 `OmniALE看板.html` 浏览题面，或 `OmniALE答卷与评分.html` 直接查看答卷总览。页面脚本、样式和数据全部在本地，无需联网、安装前端依赖或登录。

推荐双击本目录 `启动看板.cmd`，以本地 HTTP 模式打开，再点击侧栏“答卷与评分”。它使用 Python 标准库，默认地址为 http://127.0.0.1:8765/case_dashboard/dist/index.html#results 。视频支持拖动和 HTTP Range 请求。关闭命令行即可停止服务器；如端口被占用，运行 `python serve.py --open --port 8766`。

## 展示范围

- 第3题已接入普通版 Resolve 原生 API 实验：正式质量分50.9294/100，采用ALE方式计分；两段完整成片、工程与完整交付包可下载，包含111条实际工具命令轨迹、46条已保存原生API回执、扣分明细及错误示例。DRP 独立重渲染逐像素一致，线性光合成仍待核实。新版与旧版 v2 成绩分开展示。报告入口：`dist/case3-api-report/index.html`。
- 14 道正式困难版题包：完整题面、434 个公开文件、交付合同、公开规则和输出 Schema；另保留 48 个 Case 概念。
- 14 份有效冻结答卷、450 个交付文件；逐文件核对冻结 SHA256，全部匹配。
- 另接入第12题gpt-6-luna/high独立试次（60分钟上限、实际27.54分钟、7个交付文件）。第12题结果详情可对比两模型分项、播放Luna成片并查看原始评分报告。
- 成片与主要音频播放、字幕定位、抠像透明帧、修复前后对照、Case47 事件时间轴与画面区域、Case48 六类对象状态时间轴。
- 每题提供“结果可视化、评分明细、交付文件、运行与来源”，包含逐项权重、已得分、待评项、硬门槛失败原因、程序测量值和原始评审记录。
- 第 10、11 题共用 Case23 编号但不是同一道任务，以独立 task key 区分。

媒体直接引用现有题包和冻结提交目录。请保留整个工作区的相对目录关系，不要只移动 HTML。视频封面来自实际抽帧；MKV 的 H.264 代理和 RGBA 样本只用于浏览，不替换原始交付物，不用于重新评分。

## 评分口径

2026-11-03已接入第11—14题现有评测：10题部分评分、3题未评分，第12题加用户提供的视听可读性专家标注6/10后，总分为65.2891/100，硬门槛未通过。专家分只覆盖该分项，关键语义与原声听审门槛仍未判定。未评项显示“待评”，不记为零分；评分条统一使用100分量尺。

第 8 题已核实小计为 82.077 分，包含程序分 77.077/80 和已确认裁判分 5/20，其余裁判分待评。提交中的验证报告明确标注为答题者自检，不作为独立评分。

第 12 题采用 `canonical_answers.json` 指定的 `case12_retry2`；第 1、2、6 题也采用最终汇总确认的有效试次。无效或基础设施异常旧试次不混入当前结果。

第12题Sol自动分59.2891/90，用户提供视听可读性专家标注6/10，总分65.2891/100。Luna自动分31.363/90，9个窗口的视觉烧录抽样通过，视听10分待专家标注；两者均有7项自动硬门槛失败。Luna重建的input占位符存在文件/目录歧义，保留原目录调用失败记录（该口径26.363/90），改传源视频文件后按原阈值验证通过，计重建5分，未改答卷代码。

## 更新索引

在项目根目录运行：

```powershell
python case_dashboard/build.py
python case_dashboard/build_results.py
```

需要 PATH 中可用的 `ffmpeg`、`ffprobe`。前者读取公开题面与概念总表；后者读取三批 `runs_*` 中明确选定的冻结答卷及已有评测记录，核对哈希并生成可视化数据。两者均不执行答卷脚本、不改写题包或答案。更新后重启本地服务器。

服务器仅提供 `dist/` 静态页面，以及 `allowed-files.json` 和 `allowed-results.json` 中列出的文件，不提供工作区目录列表。目前答卷和评测来源允许列表有523个文件。看板用于浏览题目及结果，不作为Solver的隔离沙箱。

## 结果数据接口

`dist/results.js` 定义 `window.OMNIALE_RESULTS_META` 和 `window.OMNIALE_RESULTS`。任务以 `task-01` 至 `task-14` 为唯一键。`window.OmniALE.setResults(records)` 可替换页面内存中的结果；`getResult(key)` 读取单题记录，`taskKeys()` 返回任务键。完整字段以 `build_results.py` 生成内容为准：

- `artifacts`、`reports`：交付物和评分来源，含名称、路径、URL、类型、大小及可选文本、媒体信息、预览地址。
- `automatic`、`judge`、`verified`、`total`：程序分、已确认裁判分、已核实小计、正式总分；缺失值为 `null`。
- `rows`：每项的 `id`、`label`、`maximum`、`points`、`group` 及可选评审依据。
- `checks`、`failures`、`pending`：检测明细、硬门槛失败和待评项。
- `visualization`：抠像样本、事件或对象状态数据；`integrity`、`attempt`、`seconds` 等保留冻结来源和运行记录。

## 文件与检查

- `dist/index.html`、`styles.css`、`app.js`：主页面和题面交互。
- `dist/results-ui.js`、`results.css`：结果展示与评分可视化。
- `dist/data.js`、`results.js`：构建生成的数据快照。
- `dist/assets/`、`result-assets/`：实际抽帧和浏览代理。
- `dist/vendor/marked.js`：本地 Markdown 渲染器，无 CDN 依赖。
- `build-report.json`、`result-build-report.json`：索引和冻结哈希核对记录。
- `qa-report.json`：文件直开及 HTTP 模式的 JSDOM 交互检查，覆盖题面、14 题的结果分区、文件与评测预览、时间轴、抠像切换、字幕、分页和搜索。
- `file-check-report.json`、`result-file-check-report.json`：文件链接、原文、预览、评分加总与 HTTP 分段读取检查。

浏览器目视与真实播放验收未完成：内置浏览器入口不可用，Edge 界面访问未获工具批准。JSDOM 检查不等同于浏览器渲染或实际播放测试。`qa/` 仅用于开发检查，看板运行不需要 Node.js。

第12题的同题模型对比下，`gpt-6-luna 最终视频` 默认展开，可直接播放或下载，并提供 SRT/ASS、README、独立字幕跳转和当前播放时间。自动分 31.363/90；视听可读性由用户专家标注为 3/10，总分 34.363/100，硬门槛未通过。

第12题“评分明细”含两个模型的失分排行、计分公式、硬门槛差距、逐角色召回、冻结字幕例子和评分边界。Luna 默认展开，Sol 可展开。Sol 的 ASS 重复行角色标签存在解析不对称：原等价率22.43%，诊断逐行去标签后100%；已突出说明，未改原成绩。使用 `python -B case_dashboard/case12_analysis.py` 可仅刷新该题解释；全量构建也已接入。检查记录：`qa/case12-analysis-check.json`。
