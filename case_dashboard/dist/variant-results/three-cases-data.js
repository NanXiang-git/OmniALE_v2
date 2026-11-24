window.OMNIALE_DETAILED_VARIANTS = [
  {
    "id": 7,
    "original": "task-03",
    "title": "按导播口令提取人物",
    "summary": "两段四秒双人镜头。每段英语导播音频指定保留左侧或右侧人物。",
    "main": "clip_1.mp4",
    "files": [
      {
        "name": "TASK.md",
        "path": "TASK.md",
        "url": "variant-results/case-07-director/candidate/TASK.md",
        "kind": "document",
        "bytes": 1242,
        "text": "# Case07 按导播口令交付人物绿底素材\n\n输入有两段各 4 秒、25 fps、512×288、100 帧的双人全景。每段 PNG 序列为权威画面，MP4 为播放副本。身份图仅标画面左侧和右侧人物。独立音频 director_1.wav 和 director_2.wav 各有一条英文口令，指明该段保留哪一侧。根据音频选中人物，从第一帧到最后一帧均保留该人当时可见的前景，另一人和原背景换成纯绿 RGB(0,255,0)。保留发丝、手势、衣物边缘、原运动与构图。\n\n交 output_1.mp4、output_2.mp4，H.264、512×288、25 fps、每段 100 帧、无音轨。按原评分说明进行主体门槛、完成性门槛及 30/70 边缘评分。另交 cue_decisions.json，逐段写 clip_id、keep（left 或 right）与音频依据。导播音频是工作轨。\n\n交付 README.md，简述工具、前景分离和重建方法。原题的 Resolve 工程合同见 ORIGINAL_RESOLVE_TASK.md。本服务器没有 Resolve，允许交可离线重建的脚本和实际使用的遮罩/前景素材。软件合规会单列待核验。可使用预装的离线英语识别命令 case07-asr，参数为 WAV 路径。不要改速、缩放输出、裁切、使用静帧替换视频或添加图文。\n"
      },
      {
        "name": "SCORING.md",
        "path": "SCORING.md",
        "url": "variant-results/case-07-director/candidate/SCORING.md",
        "kind": "document",
        "bytes": 3076,
        "text": "# 公开评分规范\n\n## 主分\n\n每段固定 5 个隐藏时间点和目标 ROI，所有模型使用同一配置；片 2 的 ROI 覆盖两名目标。抽样不是由答卷内容决定。输入为权威 PNG，参考为用隐藏 RGBA 合成的绿底参考视频，对齐帧号计算。\n\n主体门槛沿用 ALE：`roi_input_cv=0.4*hist_corr+0.4*ORB_match+0.2*color_similarity`，要求 ≥0.3。实现包括输入/参考差分估计 mask（差值阈值 28）、形态学处理、异常面积回退非绿 mask、HSV 直方图、ORB 特征匹配；前景面积不足 2% 得 0。该分不是分割 mask IoU。\n\n视觉裁判逐帧看输入和输出，回答三个独立 YES/NO：真实抠像编辑、非原片复制、指定主体合理保留。YES 为 1、NO 为 0，平均 ≥0.5（至少两项 YES）过门槛。裁判不看隐藏参考，不直接打边缘质量分。\n\n两道门槛都通过时：`frame_score=0.3*full_frame_edge_iou+0.7*roi_edge_iou`；否则为 0。边缘由灰度 Canny(80,160) 获得，无额外膨胀容忍，交集/并集为空时为 0。`clip_score=mean(5帧)`；`raw_score=100*(clip_1_score+clip_2_score)/2`。\n\n缺失或无法解码的输出片该片为 0，不能从分母移除。可解码但格式不符时保留可计算的原始质量分并明确交付不合规；无法对齐到评分帧时该片为 0。缺少参考、评分基础设施异常、裁判结果缺失或不合法时不强制记 0，总分为 null。裁判须覆盖所有可评价的指定点，不能只提供有利帧。\n\n完全没有可见目标的帧不套主体保留门槛，放入全片诊断；本版抽样点都要求有可见目标。该主分不宣称反映全片时序质量或透明素材复用能力。\n\n## 合规与诊断\n\n- delivery_valid：检查必需的 DRP/README 非空、JSON schema、真实解码帧数、视频规格及帧时间间隔。\n- software_compliant：可信环境中核实 Resolve 工程、可编辑合成关系、时间线、渲染任务与最终产物对应，并按 PROJECT_HANDOFF.md 独立导入/重链接/重渲染；没有证据为 null，不能根据报告猜测通过。\n- semantic_compliant：独立评审完整两段视频，核对指定人物、干扰人物排除、遮挡与显露；每个失败必须引用实际帧号及观察。轻微修边误差不等同于主体身份违规。\n- diagnostics：逐帧记录纯背景区域绿色误差、目标内部对参考的颜色误差及异常位置提示。只作为定位证据，不新增主分、时序分或未经校准的硬门槛。\n\n裁判模型/版本/提示词须冻结，答案须绑定本次证据包 ID；禁止混用其他提交的评分或用 solver 自评代替独立裁判。\n\n## 正式计分口径（2026-11-04）\n\n根据用户决定，采用以上 ALE 方式计算的质量分作为 OmniALE 本题正式分数，formal_score=raw_score。不是 ALE 官方成绩，不宣称完成额外质量校准。交付、软件与全片语义合规独立报告；不设新的及格线。运行时原合同保存在对应实验目录，不回写历史输入。\n"
      },
      {
        "name": "submission.schema.json",
        "path": "submission.schema.json",
        "url": "variant-results/case-07-director/candidate/submission.schema.json",
        "kind": "document",
        "bytes": 2552
      },
      {
        "name": "report.schema.json",
        "path": "report.schema.json",
        "url": "variant-results/case-07-director/candidate/report.schema.json",
        "kind": "document",
        "bytes": 1245
      },
      {
        "name": "clip_1.mp4",
        "path": "clip_1.mp4",
        "url": "variant-results/case-07-director/candidate/input/clip_1.mp4",
        "kind": "video",
        "bytes": 162681
      },
      {
        "name": "clip_2.mp4",
        "path": "clip_2.mp4",
        "url": "variant-results/case-07-director/candidate/input/clip_2.mp4",
        "kind": "video",
        "bytes": 165443
      },
      {
        "name": "director_1.wav",
        "path": "director_1.wav",
        "url": "variant-results/case-07-director/candidate/input/director_1.wav",
        "kind": "audio",
        "bytes": 128078
      },
      {
        "name": "director_2.wav",
        "path": "director_2.wav",
        "url": "variant-results/case-07-director/candidate/input/director_2.wav",
        "kind": "audio",
        "bytes": 128078
      },
      {
        "name": "identity_1.jpg",
        "path": "identity_1.jpg",
        "url": "variant-results/case-07-director/candidate/input/identity_1.jpg",
        "kind": "image",
        "bytes": 29330
      },
      {
        "name": "identity_2.jpg",
        "path": "identity_2.jpg",
        "url": "variant-results/case-07-director/candidate/input/identity_2.jpg",
        "kind": "image",
        "bytes": 29340
      },
      {
        "name": "SOURCES.md",
        "path": "SOURCES.md",
        "url": "variant-results/case-07-director/candidate/input/SOURCES.md",
        "kind": "document",
        "bytes": 298,
        "text": "VideoMatte240K / RobustVideoMatting 官方评估素材中未用于原题的片段 0003、0004、0008。画面用数据集前景和 alpha 新合成。导播工作轨使用 Festival Lite 合成英语。素材溯源 https://github.com/PeterL1n/RobustVideoMatting/blob/master/documentation/training.md\n"
      }
    ],
    "runs": [
      {
        "model": "GPT-6.2-sol",
        "effort": "xhigh",
        "seconds": 877.9183945655823,
        "budget": "不限时",
        "total": null,
        "status": "视觉试验已评",
        "summary": "原始质量分 79.9499 / 100，导播口令 2 / 2，正式分待核。",
        "rows": [
          [
            "镜头 1 质量分",
            74.8524,
            100
          ],
          [
            "镜头 2 质量分",
            85.0474,
            100
          ],
          [
            "导播口令匹配",
            2,
            2
          ]
        ],
        "breakdown": [
          {
            "label": "镜头 1 · 5 个采样点",
            "columns": [
              "抽样",
              "主体门槛",
              "编辑门槛",
              "整帧边缘 IoU",
              "区域边缘 IoU",
              "帧分"
            ],
            "rows": [
              [
                1,
                "通过",
                "通过",
                0.763,
                0.763,
                0.763
              ],
              [
                2,
                "通过",
                "通过",
                0.732,
                0.732,
                0.732
              ],
              [
                3,
                "通过",
                "通过",
                0.7251,
                0.7251,
                0.7251
              ],
              [
                4,
                "通过",
                "通过",
                0.766,
                0.766,
                0.766
              ],
              [
                5,
                "通过",
                "通过",
                0.7565,
                0.7565,
                0.7565
              ]
            ]
          },
          {
            "label": "镜头 2 · 5 个采样点",
            "columns": [
              "抽样",
              "主体门槛",
              "编辑门槛",
              "整帧边缘 IoU",
              "区域边缘 IoU",
              "帧分"
            ],
            "rows": [
              [
                1,
                "通过",
                "通过",
                0.8739,
                0.8739,
                0.8739
              ],
              [
                2,
                "通过",
                "通过",
                0.8682,
                0.8682,
                0.8682
              ],
              [
                3,
                "通过",
                "通过",
                0.7944,
                0.7944,
                0.7944
              ],
              [
                4,
                "通过",
                "通过",
                0.8478,
                0.8478,
                0.8478
              ],
              [
                5,
                "通过",
                "通过",
                0.868,
                0.868,
                0.868
              ]
            ]
          }
        ],
        "files": [
          {
            "name": "output_1.mp4",
            "path": "output_1.mp4",
            "url": "variant-results/case-07-director/sol/output_1.mp4",
            "kind": "video",
            "bytes": 1416109
          },
          {
            "name": "output_2.mp4",
            "path": "output_2.mp4",
            "url": "variant-results/case-07-director/sol/output_2.mp4",
            "kind": "video",
            "bytes": 1958935
          },
          {
            "name": "cue_decisions.json",
            "path": "cue_decisions.json",
            "url": "variant-results/case-07-director/sol/cue_decisions.json",
            "kind": "document",
            "bytes": 269
          },
          {
            "name": "README.md",
            "path": "README.md",
            "url": "variant-results/case-07-director/sol/README.md",
            "kind": "document",
            "bytes": 1955,
            "text": "# Case07 人物绿底交付\n\n| 成片 | 保留对象 | 导播口令 |\n| --- | --- | --- |\n| `output_1.mp4` | 画面右侧的白大褂人物 | “Keep the person on the right.” |\n| `output_2.mp4` | 画面左侧拿笔记本的人物 | “Keep the person on the left.” |\n\n使用 FFmpeg 的 PocketSphinx 滤镜离线识别导播 WAV，逐段记录在 `cue_decisions.json`。两段成片均为 RGB 4:4:4 无损 H.264 MP4，512×288，25 fps，100 帧，4 秒，无音轨。完全透明区域解码为 RGB(0,255,0)。\n\n## 前景分离\n\nPython、NumPy、OpenCV 和 SciPy 从权威 PNG 序列的空场区域重建固定背景。按口令选定人物的一侧，逐帧比较源像素与背景，通过邻近不透明像素的线性光颜色估算边缘覆盖率，再从半透明像素中扣除原背景的颜色贡献。每个前景像素来自同一帧的实际画面。\n\n`assets/clip_1/` 和 `assets/clip_2/` 各含 100 张实际用来渲染的 16 位 RGBA PNG。RGB 为 sRGB，alpha 为直通覆盖率（straight alpha）。序列的 `0000.png` 到 `0099.png` 与成片逐帧对应，画幅内位置来自输入 PNG。\n\n## 离线重建\n\n在交付目录运行以下命令。需要 Python 3.10 或更新版本、NumPy、OpenCV 和带 `libx264rgb` 的 FFmpeg。脚本读取交付的 RGBA 序列，在线性光中合成 RGB(0,255,0) 绿底，再编码为 MP4。\n\n```sh\npython3 -B scripts/render.py --output /workspace/scratch/rebuild --scratch /workspace/scratch\n```\n\n如需从权威 PNG 重新提取前景，另需 SciPy。\n\n```sh\npython3 -B scripts/extract_foreground.py /candidate/input --assets /workspace/scratch/rebuilt_assets\npython3 -B scripts/render.py --assets /workspace/scratch/rebuilt_assets --output /workspace/scratch/rebuild --scratch /workspace/scratch\n```\n\n本次采用 `TASK.md` 允许的离线脚本交付，Resolve 软件合规待核验。正式边缘分和视觉门槛结果由持有隐藏参考及独立裁判结果的评测端计算。\n"
          }
        ],
        "video": [
          {
            "name": "output_1.mp4",
            "path": "output_1.mp4",
            "url": "variant-results/case-07-director/sol/output_1.mp4",
            "kind": "video",
            "bytes": 1416109
          },
          {
            "name": "output_2.mp4",
            "path": "output_2.mp4",
            "url": "variant-results/case-07-director/sol/output_2.mp4",
            "kind": "video",
            "bytes": 1958935
          }
        ],
        "evidence": [
          {
            "title": "镜头 1 · 1.96 秒",
            "files": [
              {
                "name": "frame_1_0.jpg",
                "path": "frame_1_0.jpg",
                "url": "variant-results/case-07-director/sol/frame_1_0.jpg",
                "kind": "image",
                "bytes": 8374,
                "label": "原镜头"
              },
              {
                "name": "frame_1_1.jpg",
                "path": "frame_1_1.jpg",
                "url": "variant-results/case-07-director/sol/frame_1_1.jpg",
                "kind": "image",
                "bytes": 7739,
                "label": "绿底成片"
              }
            ]
          },
          {
            "title": "镜头 2 · 1.96 秒",
            "files": [
              {
                "name": "frame_2_0.jpg",
                "path": "frame_2_0.jpg",
                "url": "variant-results/case-07-director/sol/frame_2_0.jpg",
                "kind": "image",
                "bytes": 8475,
                "label": "原镜头"
              },
              {
                "name": "frame_2_1.jpg",
                "path": "frame_2_1.jpg",
                "url": "variant-results/case-07-director/sol/frame_2_1.jpg",
                "kind": "image",
                "bytes": 8255,
                "label": "绿底成片"
              }
            ]
          }
        ],
        "notes": [
          "两段均按口令选择正确侧别，10 个抽样点均通过主体及视觉编辑门槛。",
          "两镜头最低抽样边缘分分别为 0.7251 与 0.7944。可在同帧对照检查人物轮廓及软边。",
          "从封存 RGBA 中间件和脚本重生成片，两个 MP4 的 SHA-256 均一致。Linux 试次缺少原题要求的 DRP、提交索引和报告，完整交付检查未通过。"
        ],
        "reports": [
          {
            "name": "scoring.json",
            "path": "scoring.json",
            "url": "variant-results/case-07-director/sol/scoring.json",
            "kind": "document",
            "bytes": 2368
          }
        ]
      },
      {
        "model": "GPT-6.1-sol",
        "effort": "high",
        "seconds": 1215.3297171592712,
        "budget": "120 分钟",
        "total": 70.9735,
        "status": "Windows 原生 Resolve 已评",
        "summary": "正式质量分 70.9735 / 100，两段格式及全片语义检查通过，原题无自动通过线。",
        "rows": [
          [
            "镜头 1 质量分",
            64.0831,
            100
          ],
          [
            "镜头 2 质量分",
            77.8639,
            100
          ],
          [
            "导播口令匹配",
            2,
            2
          ],
          [
            "独立重渲染逐像素一致",
            200,
            200
          ]
        ],
        "breakdown": [
          {
            "label": "镜头 1 · 5 个采样点",
            "columns": [
              "抽样",
              "主体门槛",
              "编辑门槛",
              "整帧边缘 IoU",
              "区域边缘 IoU",
              "帧分"
            ],
            "rows": [
              [
                1,
                "通过",
                "通过",
                0.682,
                0.682,
                0.682
              ],
              [
                2,
                "通过",
                "通过",
                0.6185,
                0.6185,
                0.6185
              ],
              [
                3,
                "通过",
                "通过",
                0.6046,
                0.6046,
                0.6046
              ],
              [
                4,
                "通过",
                "通过",
                0.6501,
                0.6501,
                0.6501
              ],
              [
                5,
                "通过",
                "通过",
                0.649,
                0.649,
                0.649
              ]
            ]
          },
          {
            "label": "镜头 2 · 5 个采样点",
            "columns": [
              "抽样",
              "主体门槛",
              "编辑门槛",
              "整帧边缘 IoU",
              "区域边缘 IoU",
              "帧分"
            ],
            "rows": [
              [
                1,
                "通过",
                "通过",
                0.7946,
                0.7946,
                0.7946
              ],
              [
                2,
                "通过",
                "通过",
                0.7899,
                0.7899,
                0.7899
              ],
              [
                3,
                "通过",
                "通过",
                0.746,
                0.746,
                0.746
              ],
              [
                4,
                "通过",
                "通过",
                0.7741,
                0.7741,
                0.7741
              ],
              [
                5,
                "通过",
                "通过",
                0.7886,
                0.7886,
                0.7886
              ]
            ]
          }
        ],
        "files": [
          {
            "name": "output_1.mp4",
            "url": "variant-results/case-07-director/windows-sol/output_1.mp4",
            "kind": "video",
            "label": "output_1.mp4",
            "bytes": 209565
          },
          {
            "name": "output_2.mp4",
            "url": "variant-results/case-07-director/windows-sol/output_2.mp4",
            "kind": "video",
            "label": "output_2.mp4",
            "bytes": 236916
          },
          {
            "name": "project.drp",
            "url": "variant-results/case-07-director/windows-sol/project.drp",
            "kind": "document",
            "label": "project.drp",
            "bytes": 79495
          },
          {
            "name": "submission.json",
            "url": "variant-results/case-07-director/windows-sol/submission.json",
            "kind": "document",
            "label": "submission.json",
            "bytes": 822
          },
          {
            "name": "report.json",
            "url": "variant-results/case-07-director/windows-sol/report.json",
            "kind": "document",
            "label": "report.json",
            "bytes": 3870
          },
          {
            "name": "README.md",
            "url": "variant-results/case-07-director/windows-sol/README.md",
            "kind": "document",
            "label": "README.md",
            "bytes": 8488
          },
          {
            "name": "cue_decisions.json",
            "url": "variant-results/case-07-director/windows-sol/cue_decisions.json",
            "kind": "document",
            "label": "cue_decisions.json",
            "bytes": 1042
          },
          {
            "name": "resolve-submission.zip",
            "url": "variant-results/case-07-director/windows-sol/resolve-submission.zip",
            "kind": "document",
            "label": "含重链接素材的完整封存答卷",
            "bytes": 37415308
          }
        ],
        "video": [
          {
            "name": "output_1.mp4",
            "url": "variant-results/case-07-director/windows-sol/output_1.mp4",
            "kind": "video",
            "label": "output_1.mp4",
            "bytes": 209565
          },
          {
            "name": "output_2.mp4",
            "url": "variant-results/case-07-director/windows-sol/output_2.mp4",
            "kind": "video",
            "label": "output_2.mp4",
            "bytes": 236916
          }
        ],
        "evidence": [
          {
            "title": "镜头 1 · 1.96 秒",
            "files": [
              {
                "name": "clip-1-input.jpg",
                "url": "variant-results/case-07-director/windows-sol/clip-1-input.jpg",
                "kind": "document",
                "label": "原镜头",
                "bytes": 9856
              },
              {
                "name": "clip-1-output.jpg",
                "url": "variant-results/case-07-director/windows-sol/clip-1-output.jpg",
                "kind": "document",
                "label": "Resolve 绿底交付",
                "bytes": 5748
              }
            ]
          },
          {
            "title": "镜头 2 · 1.96 秒",
            "files": [
              {
                "name": "clip-2-input.jpg",
                "url": "variant-results/case-07-director/windows-sol/clip-2-input.jpg",
                "kind": "document",
                "label": "原镜头",
                "bytes": 9994
              },
              {
                "name": "clip-2-output.jpg",
                "url": "variant-results/case-07-director/windows-sol/clip-2-output.jpg",
                "kind": "document",
                "label": "Resolve 绿底交付",
                "bytes": 7066
              }
            ]
          }
        ],
        "notes": [
          "两条口令均识别正确，10 个抽样点全部通过主体及编辑门槛。全片语义复核确认保留指定人物并排除另一人。",
          "两段最低边缘分均出现在 1.96 秒，第一段约 0.6046，第二段约 0.7460。分差来自边缘 IoU，第一段是主要失分。",
          "PNG 封装进 QuickTime 的初次试渲染出现黑底和边缘异常。最终改用 ProRes 4444 带 Alpha 前景，DRP 仍包含两条标明用途的诊断时间线。",
          "独立导入、重链接并重新渲染后，两段各 100 帧与封存 MP4 逐像素一致。",
          "项目保留可编辑的绿底和 Alpha 前景。完整端到端线性光合规待核。"
        ],
        "reports": [
          {
            "name": "scoring.json",
            "url": "variant-results/case-07-director/windows-sol/scoring.json",
            "kind": "document",
            "label": "scoring.json",
            "bytes": 39728
          }
        ]
      }
    ],
    "formula": "每片 5 帧。主体门槛与编辑门槛均通过时，帧分为 30% 整帧边缘 IoU 加 70% 目标区边缘 IoU。两片等权。口令匹配和 Resolve 合规独立核验。",
    "delivery": [
      "两个 4 秒 H.264 绿底 MP4",
      "逐镜导播口令判断",
      "Windows 试次应交 Resolve 工程、索引、报告及所需中间资产"
    ],
    "note": "",
    "task": "# Case07 按导播口令交付人物绿底素材\n\n输入有两段各 4 秒、25 fps、512×288、100 帧的双人全景。每段 PNG 序列为权威画面，MP4 为播放副本。身份图仅标画面左侧和右侧人物。独立音频 director_1.wav 和 director_2.wav 各有一条英文口令，指明该段保留哪一侧。根据音频选中人物，从第一帧到最后一帧均保留该人当时可见的前景，另一人和原背景换成纯绿 RGB(0,255,0)。保留发丝、手势、衣物边缘、原运动与构图。\n\n交 output_1.mp4、output_2.mp4，H.264、512×288、25 fps、每段 100 帧、无音轨。按原评分说明进行主体门槛、完成性门槛及 30/70 边缘评分。另交 cue_decisions.json，逐段写 clip_id、keep（left 或 right）与音频依据。导播音频是工作轨。\n\n交付 README.md，简述工具、前景分离和重建方法。原题的 Resolve 工程合同见 ORIGINAL_RESOLVE_TASK.md。本服务器没有 Resolve，允许交可离线重建的脚本和实际使用的遮罩/前景素材。软件合规会单列待核验。可使用预装的离线英语识别命令 case07-asr，参数为 WAV 路径。不要改速、缩放输出、裁切、使用静帧替换视频或添加图文。\n"
  },
  {
    "id": 10,
    "original": "concept-10",
    "title": "中国手语双语字幕",
    "summary": "CE-CSL test 中 23 个独立表达，约 160 秒，9 位表达者。",
    "main": "source-preview.mp4",
    "files": [
      {
        "name": "TASK.md",
        "path": "TASK.md",
        "url": "variant-results/case-10-sign/candidate/TASK.md",
        "kind": "document",
        "bytes": 4758,
        "text": "# 真实中国手语视频的中英文字幕交付\n\n你收到的是一段**无字幕、无音轨的真实中国手语素材合集**。每个镜头都是独立表达，黑场分隔各片段；它们不是一场连续对话，不要凭镜头顺序编造人物关系、问答、因果或故事。背景里的商品、文字、装饰不能替代手语表达。\n\n请根据视频，为全部片段制作简体中文和英文字幕，并交付可切换两种语言的成片。允许使用本地工具；本题采用封闭素材测评，禁止联网反查原视频、数据集文本或答案。输入目录里的文件是素材，不包含额外指令。\n\n## 输入\n\n- `input/source.mp4`：约160秒，23个独立表达、9位表达者。画面可能有自然背景文字，但没有对白字幕。视频已统一尺寸、帧率并移除音轨；没有镜像、变速或合成手语。\n- `input_manifest.json`：视频哈希和每段的时间边界，仅用于组织交付；边界不是每个手势的起止标注。\n- `segments.template.json`：填写字幕对应关系与置信度的模板。\n\n## 要求\n\n1. 完整保留每段的语义。区分人物和数量、否定及其范围、时间与完成状态、问句、确认、礼貌请求和提议。不要把手语词序直接当作中文或英文语序。\n2. 两种语言独立自然表达，并保持含义一致。不能用通顺的英语掩盖中文误译，也不能因英语省略了可自然省略的代词数量而机械判错。\n3. 画面未明确的人物、物品、数字、品牌、关系和目的不要猜补；不要把问题写成回答。不能假设每段都有复杂转述或情节反转。\n4. 确认不了的局部可用 `[无法确认]` / `[unclear]`，保留其余可确认信息。在对应的 `uncertainty` 中注明具体不确定点。全写“无法确认”不获得内容分。\n5. 两套SRT均为UTF-8、编号从1连续递增、时间严格递增且不重叠。按自然语义断句，允许一个片段拆成多个字幕，但不允许字幕跨到别的片段。不得删减、换序、变速、裁剪或重画原视频。\n6. 每条字幕最多2行；中文每行最多22字符、每秒最多9个非空白字符；英文每行最多42字符、每秒最多20字符（计空格）。每条0.8—7秒。尽量在实际表达对应时段显示，不能只用全片大段字幕或极短闪现。\n7. 保留原始视频流，使用MKV封装两条可切换字幕轨；语言元数据分别为 `zho` 和 `eng`。内嵌字幕必须与提交的SRT完全一致。不新增音频、不烧录字幕遮挡双手或面部。\n8. `segments.json` 为每段列出两套SRT的字幕编号；每条字幕恰好属于一个片段。每段分别填写两种语言的置信度，范围0—1，表示你认为该段译文整体正确的概率。不得留空。遗漏、错误且高置信度会影响评分。\n\n## 交付\n\n在 `/app/results/` 下提供：\n\n- `zh-CN.srt`\n- `en.srt`\n- `subtitled.mkv`\n- `segments.json`，结构同模板；其中 `zh_cues`、`en_cues` 是各SRT中的整数编号数组，允许空数组表示该段未完成。\n\n成片可用 FFmpeg 将原视频流直接复制，再加入两套字幕；无需重编码视频。\n\n## 评分概览\n\n100分：语义65、双语一致性8、时间对齐12、可读性5、交付完整性5、置信度校准5。语义按片段中的信息点评分，接受等价翻译，不按关键词或与参考译文逐字相似度给分。\n\n90分及以上且达到分项门槛才通过。任一严重语义错误会使总分最高59；两个或更多片段出现严重错误最高39。严重错误包括否定翻转、人物/时间/对象错配、凭空新增事实、把疑问或请求写成既定事实、完成状态翻转、拼出不存在的跨片段故事。单纯遗漏按覆盖率扣分，不自动等同于严重翻转。\n\n若有至少两段/语言出现置信度≥0.9而语义正确率不足50%，总分最高49。交付不完整或视频内容被改变，总分最高79。格式正确不能弥补语义错误；全篇回避翻译也不能通过。\n\n## 运行路径\n\n工作目录为 `/app`，只读素材位于 `/app/input/source.mp4`，清单和模板位于 `/app/`。可用 Python、Pillow、FFmpeg/FFprobe 抽帧检查。最终文件必须写入 `/app/results/`，临时文件放 `/app/tmp/`。运行时限60分钟。\n\n`/app/output_schema.json` 描述 `segments.json` 的结构，`/app/public_rules.json` 提供评分及交付摘要；以本文的完整约束为准。\n\n格式错误导致字幕/片段映射无法解析、空提交或不安全的非普通文件提交，记为无效答卷（reward=0）；已形成有效字幕映射但缺少成片时，按原交付分及封顶规则评分。评审服务失败单独报告，不作为答卷零分。\n"
      },
      {
        "name": "SOURCE_NOTICE.md",
        "path": "SOURCE_NOTICE.md",
        "url": "variant-results/case-10-sign/candidate/SOURCE_NOTICE.md",
        "kind": "document",
        "bytes": 159,
        "text": "# 素材来源\n\n中国手语 CE-CSL。各片段为独立表达，已统一尺寸、帧率并移除音轨。\n来源见 https://github.com/woshisad159/TFNet 。\n"
      },
      {
        "name": "input_manifest.json",
        "path": "input_manifest.json",
        "url": "variant-results/case-10-sign/candidate/input_manifest.json",
        "kind": "document",
        "bytes": 1987
      },
      {
        "name": "output_schema.json",
        "path": "output_schema.json",
        "url": "variant-results/case-10-sign/candidate/output_schema.json",
        "kind": "document",
        "bytes": 1990
      },
      {
        "name": "public_rules.json",
        "path": "public_rules.json",
        "url": "variant-results/case-10-sign/candidate/public_rules.json",
        "kind": "document",
        "bytes": 680
      },
      {
        "name": "segments.template.json",
        "path": "segments.template.json",
        "url": "variant-results/case-10-sign/candidate/segments.template.json",
        "kind": "document",
        "bytes": 3610
      },
      {
        "name": "source-preview.mp4",
        "path": "source-preview.mp4",
        "url": "variant-results/case-10-sign/candidate/source-preview.mp4",
        "kind": "video",
        "bytes": 33820150,
        "label": "完整输入视频",
        "poster": "variant-results/case-10-sign/candidate/poster.jpg"
      }
    ],
    "runs": [
      {
        "model": "GPT-6.2-astra",
        "effort": "xhigh",
        "seconds": 1391.808286190033,
        "budget": "不限时",
        "total": 39,
        "status": "未通过",
        "summary": "封顶前 60.284 / 100，最终 39 / 100。",
        "rows": [
          [
            "语义准确",
            29.909,
            65
          ],
          [
            "双语一致性",
            3.594,
            8
          ],
          [
            "时间对齐",
            12.0,
            12
          ],
          [
            "字幕可读性",
            5.0,
            5
          ],
          [
            "交付完整性",
            5,
            5
          ],
          [
            "置信度校准",
            4.78,
            5
          ]
        ],
        "files": [
          {
            "name": "zh-CN.srt",
            "path": "zh-CN.srt",
            "url": "variant-results/case-10-sign/astra/zh-CN.srt",
            "kind": "subtitle",
            "bytes": 1439
          },
          {
            "name": "en.srt",
            "path": "en.srt",
            "url": "variant-results/case-10-sign/astra/en.srt",
            "kind": "subtitle",
            "bytes": 1437
          },
          {
            "name": "segments.json",
            "path": "segments.json",
            "url": "variant-results/case-10-sign/astra/segments.json",
            "kind": "document",
            "bytes": 6825
          },
          {
            "name": "subtitled.mkv",
            "path": "subtitled.mkv",
            "url": "variant-results/case-10-sign/astra/subtitled.mkv",
            "kind": "video",
            "bytes": 63196677
          }
        ],
        "video": [
          {
            "name": "source-preview.mp4",
            "path": "source-preview.mp4",
            "url": "variant-results/case-10-sign/candidate/source-preview.mp4",
            "kind": "video",
            "bytes": 33820150,
            "label": "完整成片字幕预览",
            "tracks": [
              {
                "url": "variant-results/case-10-sign/astra/zh.vtt",
                "lang": "zh-CN",
                "label": "简体中文"
              },
              {
                "url": "variant-results/case-10-sign/astra/en.vtt",
                "lang": "en",
                "label": "English"
              }
            ],
            "poster": "variant-results/case-10-sign/candidate/poster.jpg"
          }
        ],
        "notes": [
          "适用 39 分封顶规则。多个片段存在严重语义错误、语义覆盖低于一半。",
          "S01 · 模型辅助、相对作者标注评审：1.500—4.750秒的动作序列与标注相容。“我今天吃香蕉。”和“I'm having a banana today.”均保留我、香蕉及今天吃这一事件，但中文未明确保留“吃过”，英文将已完成事件改为正在进行或当日安排，第三slot各得0.5，并就英文标记aspect_flip。中文体貌未定、英文明确进行式，双语一致性为0.5。1.400—4.820秒字幕窗覆盖主要表达；完成体判断主要依据作者标注，采样图像不能独立确证。",
          "S03 · 模型辅助、相对作者标注评审：17.250秒的胸部指示及18.250—18.750秒的掌上动作与“我／姓名／签字”的标注相容。“我们在哪儿？”和“Where are we?”把单数“我”改为“我们”，记wrong_person，第一slot得0；签名信息完全缺失，第二slot得0；仅保留地点疑问，未保留询问签名位置的关系，第三slot得0.5。两语同义但共同偏离原意。17.070—20.100秒显示窗与主要动作同步，语义错误不另作时间错位扣分。",
          "S06 · 按作者中文及gloss参照，36.851—39.351秒表达涉及结账、指向和台桌。字幕“那边的房间[无法确认]。”／“The room over there [unclear].”把“收银台”替换为“房间”，构成wrong_object；也没有保留对方或“请去结账”的请求，三个slot均不得分。两语内容及不确定语气一致。36.781—39.591秒覆盖主要动作，对齐不因语义错误另行扣分；细部词义判断受离散采样限制。"
        ],
        "reports": [
          {
            "name": "scoring.json",
            "path": "scoring.json",
            "url": "variant-results/case-10-sign/astra/scoring.json",
            "kind": "document",
            "bytes": 7850
          }
        ]
      },
      {
        "model": "GPT-6.2-sol",
        "effort": "xhigh",
        "seconds": 1007.0486104488373,
        "budget": "不限时",
        "total": 39,
        "status": "未通过",
        "summary": "封顶前 50.698 / 100，最终 39 / 100。",
        "rows": [
          [
            "语义准确",
            21.667,
            65
          ],
          [
            "双语一致性",
            2.667,
            8
          ],
          [
            "时间对齐",
            11.739,
            12
          ],
          [
            "字幕可读性",
            5.0,
            5
          ],
          [
            "交付完整性",
            5,
            5
          ],
          [
            "置信度校准",
            4.625,
            5
          ]
        ],
        "files": [
          {
            "name": "zh-CN.srt",
            "path": "zh-CN.srt",
            "url": "variant-results/case-10-sign/sol/zh-CN.srt",
            "kind": "subtitle",
            "bytes": 1519
          },
          {
            "name": "en.srt",
            "path": "en.srt",
            "url": "variant-results/case-10-sign/sol/en.srt",
            "kind": "subtitle",
            "bytes": 1526
          },
          {
            "name": "segments.json",
            "path": "segments.json",
            "url": "variant-results/case-10-sign/sol/segments.json",
            "kind": "document",
            "bytes": 7006
          },
          {
            "name": "subtitled.mkv",
            "path": "subtitled.mkv",
            "url": "variant-results/case-10-sign/sol/subtitled.mkv",
            "kind": "video",
            "bytes": 63196844
          }
        ],
        "video": [
          {
            "name": "source-preview.mp4",
            "path": "source-preview.mp4",
            "url": "variant-results/case-10-sign/candidate/source-preview.mp4",
            "kind": "video",
            "bytes": 33820150,
            "label": "完整成片字幕预览",
            "tracks": [
              {
                "url": "variant-results/case-10-sign/sol/zh.vtt",
                "lang": "zh-CN",
                "label": "简体中文"
              },
              {
                "url": "variant-results/case-10-sign/sol/en.vtt",
                "lang": "en",
                "label": "English"
              }
            ],
            "poster": "variant-results/case-10-sign/candidate/poster.jpg"
          }
        ],
        "notes": [
          "适用 39 分封顶规则。多个片段存在严重语义错误、语义覆盖低于一半。",
          "S01 · 本项为参照作者标注的模型辅助评审。1.500—4.750秒可见主要表达，字幕1.570—4.950秒与之基本同步。“我”及“I”保留第一slot；“[无法确认]”及“[unclear]”未表达香蕉，第二slot为0。第三slot原意是今天已经吃过，字幕“想吃”及“would like to eat”改为愿望，且遗漏今天，故为0并记aspect_flip。两语信息和语气一致。图像为离散采样，未发现足以确证的标注冲突。",
          "S03 · 17.250—20.000秒可见完整的一组表达动作，提交时窗与之基本同步。字幕“我”及“I”保留第一slot；原标注的签名没有表达，反而加入“手机”及“the phone”，第二slot为0并记wrong_object。原意询问签在哪里，答卷“我不……”及“I don’t …”变成否定陈述，第三slot为0并记question_as_fact。两语同样偏离原意，但彼此信息和语气一致；一致性不代表内容正确。本判断为标注参照的模型辅助评审。",
          "S04 · 作者标注为妈妈今天早上没送我上学。22.550—29.300秒可见连续表达，字幕22.770—29.450秒总体覆盖，但22.770—26.070秒显示“你是问[无法确认]吗？”及“Are you asking [unclear]?”，加入原意没有的询问情境，记invented_fact；内部拆成问答与可见表达和标注对应不足，对齐给0.5。“我”及“I”只保留妈妈和我这一slot的一部分，得0.5；今天早上上学全部缺失，得0；“没”及“haven’t”仅保留否定信息，未说明妈妈没送我，第三slot给0.5，不将这种遗漏记为否定翻转。两语基本等价；手形与句法关系受离散图像限制，降低评审把握。"
        ],
        "reports": [
          {
            "name": "scoring.json",
            "path": "scoring.json",
            "url": "variant-results/case-10-sign/sol/scoring.json",
            "kind": "document",
            "bytes": 8171
          }
        ]
      },
      {
        "model": "GPT-6-luna",
        "effort": "xhigh",
        "seconds": 791.6948938369751,
        "budget": "不限时",
        "total": 25.965,
        "status": "未通过",
        "summary": "封顶前 25.965 / 100，最终 25.965 / 100。",
        "rows": [
          [
            "语义准确",
            2.826,
            65
          ],
          [
            "双语一致性",
            0.348,
            8
          ],
          [
            "时间对齐",
            7.826,
            12
          ],
          [
            "字幕可读性",
            5.0,
            5
          ],
          [
            "交付完整性",
            5,
            5
          ],
          [
            "置信度校准",
            4.965,
            5
          ]
        ],
        "files": [
          {
            "name": "zh-CN.srt",
            "path": "zh-CN.srt",
            "url": "variant-results/case-10-sign/luna/zh-CN.srt",
            "kind": "subtitle",
            "bytes": 1177
          },
          {
            "name": "en.srt",
            "path": "en.srt",
            "url": "variant-results/case-10-sign/luna/en.srt",
            "kind": "subtitle",
            "bytes": 1061
          },
          {
            "name": "segments.json",
            "path": "segments.json",
            "url": "variant-results/case-10-sign/luna/segments.json",
            "kind": "document",
            "bytes": 4616
          },
          {
            "name": "subtitled.mkv",
            "path": "subtitled.mkv",
            "url": "variant-results/case-10-sign/luna/subtitled.mkv",
            "kind": "video",
            "bytes": 63196126
          }
        ],
        "video": [
          {
            "name": "source-preview.mp4",
            "path": "source-preview.mp4",
            "url": "variant-results/case-10-sign/candidate/source-preview.mp4",
            "kind": "video",
            "bytes": 33820150,
            "label": "完整成片字幕预览",
            "tracks": [
              {
                "url": "variant-results/case-10-sign/luna/zh.vtt",
                "lang": "zh-CN",
                "label": "简体中文"
              },
              {
                "url": "variant-results/case-10-sign/luna/en.vtt",
                "lang": "en",
                "label": "English"
              }
            ],
            "poster": "variant-results/case-10-sign/candidate/poster.jpg"
          }
        ],
        "notes": [
          "适用 39 分封顶规则。多个片段存在严重语义错误、语义覆盖低于一半。",
          "S08 · 50.2—54.3秒提交“吃[无法确认]”和“Eat [unclear].”，均未保留slot“我今天”“在家玩游戏”“想做这件事”，三项记0。作者中文及gloss描述想在家玩游戏，未含“吃”；图中50.418—53.418秒的动作序列也未提供足以支持新增吃东西活动的证据，按标注参照记invented_fact。字幕时窗覆盖可见主要动作，对齐记1，仅评价时间覆盖；两语同样给出“吃”及未知提示，双语记1而不产生正确内容分。细部手形受4fps采样限制，降低置信度，未发现足以认定标注冲突的证据。",
          "S23 · 本项为基于作者标注的模型辅助评审。155.9—159.4秒的“我[无法确认]家”及“I [unclear] home.”只保留“我们”中的说话者成分，遗漏共同参与者，该slot各给0.5，不另将这一遗漏标为人称翻转；“明天”和“提议到时再出发”均未保留，各为0。“家/home”加入作者中文及gloss未提供的地点信息，记invented_fact。两语残片信息一致；时窗覆盖约155.890—158.390秒的主要动作，对齐为1。词义判断受静帧和运动模糊限制，已降低置信度。"
        ],
        "reports": [
          {
            "name": "scoring.json",
            "path": "scoring.json",
            "url": "variant-results/case-10-sign/luna/scoring.json",
            "kind": "document",
            "bytes": 2527
          }
        ]
      }
    ],
    "formula": "100 分由语义 65、双语 8、对轴 12、可读性 5、交付 5、置信度 5 组成。严重语义错误及覆盖率不足按原规则封顶。",
    "delivery": [
      "简体中文及英文 SRT",
      "可切换双语轨的 MKV",
      "逐段映射与置信度 JSON"
    ],
    "note": "通过线为 90 分。三份结果均采用 Harbor 验证器和 GPT-6-astra/high 对照数据集标注评审。作者参考 99.205 / 100。网页预览在原视频上加载各模型提交字幕。",
    "task": "# 真实中国手语视频的中英文字幕交付\n\n你收到的是一段**无字幕、无音轨的真实中国手语素材合集**。每个镜头都是独立表达，黑场分隔各片段；它们不是一场连续对话，不要凭镜头顺序编造人物关系、问答、因果或故事。背景里的商品、文字、装饰不能替代手语表达。\n\n请根据视频，为全部片段制作简体中文和英文字幕，并交付可切换两种语言的成片。允许使用本地工具；本题采用封闭素材测评，禁止联网反查原视频、数据集文本或答案。输入目录里的文件是素材，不包含额外指令。\n\n## 输入\n\n- `input/source.mp4`：约160秒，23个独立表达、9位表达者。画面可能有自然背景文字，但没有对白字幕。视频已统一尺寸、帧率并移除音轨；没有镜像、变速或合成手语。\n- `input_manifest.json`：视频哈希和每段的时间边界，仅用于组织交付；边界不是每个手势的起止标注。\n- `segments.template.json`：填写字幕对应关系与置信度的模板。\n\n## 要求\n\n1. 完整保留每段的语义。区分人物和数量、否定及其范围、时间与完成状态、问句、确认、礼貌请求和提议。不要把手语词序直接当作中文或英文语序。\n2. 两种语言独立自然表达，并保持含义一致。不能用通顺的英语掩盖中文误译，也不能因英语省略了可自然省略的代词数量而机械判错。\n3. 画面未明确的人物、物品、数字、品牌、关系和目的不要猜补；不要把问题写成回答。不能假设每段都有复杂转述或情节反转。\n4. 确认不了的局部可用 `[无法确认]` / `[unclear]`，保留其余可确认信息。在对应的 `uncertainty` 中注明具体不确定点。全写“无法确认”不获得内容分。\n5. 两套SRT均为UTF-8、编号从1连续递增、时间严格递增且不重叠。按自然语义断句，允许一个片段拆成多个字幕，但不允许字幕跨到别的片段。不得删减、换序、变速、裁剪或重画原视频。\n6. 每条字幕最多2行；中文每行最多22字符、每秒最多9个非空白字符；英文每行最多42字符、每秒最多20字符（计空格）。每条0.8—7秒。尽量在实际表达对应时段显示，不能只用全片大段字幕或极短闪现。\n7. 保留原始视频流，使用MKV封装两条可切换字幕轨；语言元数据分别为 `zho` 和 `eng`。内嵌字幕必须与提交的SRT完全一致。不新增音频、不烧录字幕遮挡双手或面部。\n8. `segments.json` 为每段列出两套SRT的字幕编号；每条字幕恰好属于一个片段。每段分别填写两种语言的置信度，范围0—1，表示你认为该段译文整体正确的概率。不得留空。遗漏、错误且高置信度会影响评分。\n\n## 交付\n\n在 `/app/results/` 下提供：\n\n- `zh-CN.srt`\n- `en.srt`\n- `subtitled.mkv`\n- `segments.json`，结构同模板；其中 `zh_cues`、`en_cues` 是各SRT中的整数编号数组，允许空数组表示该段未完成。\n\n成片可用 FFmpeg 将原视频流直接复制，再加入两套字幕；无需重编码视频。\n\n## 评分概览\n\n100分：语义65、双语一致性8、时间对齐12、可读性5、交付完整性5、置信度校准5。语义按片段中的信息点评分，接受等价翻译，不按关键词或与参考译文逐字相似度给分。\n\n90分及以上且达到分项门槛才通过。任一严重语义错误会使总分最高59；两个或更多片段出现严重错误最高39。严重错误包括否定翻转、人物/时间/对象错配、凭空新增事实、把疑问或请求写成既定事实、完成状态翻转、拼出不存在的跨片段故事。单纯遗漏按覆盖率扣分，不自动等同于严重翻转。\n\n若有至少两段/语言出现置信度≥0.9而语义正确率不足50%，总分最高49。交付不完整或视频内容被改变，总分最高79。格式正确不能弥补语义错误；全篇回避翻译也不能通过。\n\n## 运行路径\n\n工作目录为 `/app`，只读素材位于 `/app/input/source.mp4`，清单和模板位于 `/app/`。可用 Python、Pillow、FFmpeg/FFprobe 抽帧检查。最终文件必须写入 `/app/results/`，临时文件放 `/app/tmp/`。运行时限60分钟。\n\n`/app/output_schema.json` 描述 `segments.json` 的结构，`/app/public_rules.json` 提供评分及交付摘要；以本文的完整约束为准。\n\n格式错误导致字幕/片段映射无法解析、空提交或不安全的非普通文件提交，记为无效答卷（reward=0）；已形成有效字幕映射但缺少成片时，按原交付分及封顶规则评分。评审服务失败单独报告，不作为答卷零分。\n"
  },
  {
    "id": 26,
    "original": "task-05",
    "title": "《Spring》电影原声音画修复",
    "summary": "连续 26 秒电影画面及同段原配乐与音效。画面和混音使用原题强损伤模块。",
    "main": "damaged-av-preview.mp4",
    "files": [
      {
        "name": "TASK.md",
        "path": "TASK.md",
        "url": "variant-results/case-26-spring/candidate/TASK.md",
        "kind": "document",
        "bytes": 2437,
        "text": "# Case26｜电影弱光画面与原混音修复\n\n修复26秒电影片段的画面和原立体声混音。混音含同段原配乐和电影音效。input/damaged_av.mkv含受损音画；input/damaged.mkv和input/music_damaged.wav为无损分离版。\n\n画面合同、保护窗、修订层重放和报告schema详见VISUAL_TASK_V3.md。音频可能有时变有色噪声、漂移窄带干扰、不同形态爆音、单声道短缺口和局部非线性失真，可能相互重叠。自行定位损伤，保留原配乐的音符、节奏、起音、弱音、衰减、立体声和原有电影音效。0–2秒与24–26秒为正常音频保护段。不得换曲、静音掩盖、删段、错移、变速或下载原曲替换。\n\n## 交付\n\nsubmission/submission.json: version=\"3.2-av-music-heavy\", case_id=\"26\"，files必须有：master=restored.mkv（无声FFV1 RGB8视觉母版）、repair=repair.mkv（无声修订层）、preview=preview.mp4（无声H264预览）、project=project.json、report=report.json、audio=restored_audio.wav（48kHz双声道PCM16，1248000采样帧）、av_preview=restored_av.mp4（同一画面H264和同一音频AAC）、audio_report=audio_report.json（method、limitations、checks，各检查含start/end/observation）。路径相对submission，不能使用外部路径或链接。视频640×338、24fps、624帧。音画预览对无损音轨SNR≥25dB，对母版逐帧MAE≤0.025。\n\n## 评分与环境\n\n总分100，视觉70、听觉30。视觉0.7×C×(客观40＋视觉评审60)，C=min(交付完成度,重放完成度)。视觉裁判GPT-6.1-sol/high，使用v3最终量表与完整逐帧对照证据。\n\n音频：相对改善6＋绝对波形保真6＋频谱保真6＋真实音乐起音2＋损伤事件恢复1＋立体声1＋正常段保护2＋实际听评6。格式/时长/同步为硬门槛，不加分。较差窗口参与汇总，不能以少数容易片段掩盖未修复片段。真值预先固定的音符起音与损伤事件用于局部测量；具体公式和阈值公开于public_rules.json。听评有相同音频对照，不通过则待复核。总分≥80、视觉≥42、音频≥18且没有硬/核心失败才通过。\n\n本次实验使用 GPT-6.2-sol、xhigh，无总时限。仅可访问/candidate和/workspace；无外网、干净参考、损伤参数、其他答卷或评测反馈。用实际工具观察媒体，不得声称未进行的试听。完成自检后交付全部文件。\n"
      },
      {
        "name": "VISUAL_TASK_V3.md",
        "path": "VISUAL_TASK_V3.md",
        "url": "variant-results/case-26-spring/candidate/VISUAL_TASK_V3.md",
        "kind": "document",
        "bytes": 2902,
        "text": "# Case26｜保留局部光变与动作细节的弱光修复（加重损伤版v3）\n\n修复26秒电影原片的受控退化：更明显的暗部颗粒、局部彩色斑噪和横向噪声、运动拖尾与异常快速闪动。制作方有意加入了移动暖色扫光与较慢的冷暗变化，这些须保留。previous_attempt.mp4是存在过度平滑、残影及光变压平问题的旧尝试，不能直接作为目标。\n\n输入damaged.mkv是权威RGB8母版：640×338、24fps、624帧、无声音。源动作来自原片动画，光变与退化由出题人施加，不声称自然相机故障或原片灯光设计。三段正常保护窗为帧[0,48)、[264,288)、[600,624)，应保持原有质感与颜色。其余区段均应有实际改善，不能只修静态背景。\n\n交付submission.json，索引restored.mkv、preview.mp4、repair.mkv、project.json、report.json。两条MKV均FFV1、RGB8、624帧、同尺寸和帧率、无声音；预览为H264 MP4，必须来自交付母版。报告说明方法/限制与最多6条自查证据，不得据模型名称宣称保真。\n\nrepair.mkv是可编辑修订层，每通道128代表不改，实际修订量为2×(像素−128)。project按schema记录输入、强度1.0和逐帧映射。通过replay.py可对原输入加修订层重建母版，每RGB样本容许1级量化差；把强度改为0或0.5应分别得到原片或中间修订。该合同用于重放结果、交接和调整强度，不等同证明你原本的降噪算法可复现。允许使用任何本地传统/专业/模型工具制作修订，评测不执行提交者任意代码。\n\n保留所有源动作、帧序、画幅和色彩约定；不裁切、镜像、换帧、改动人物动作或物件、叠字幕或统一消除所有曝光变化。不要以缩小后放大或整幅强模糊掩盖噪声。\n\n自动60分：交付5、修订层重放5、分段改善15、运动细节15、时序5、光变10、正常保护5。judge40分：动作证据15、实际修复质量15、光变意图10，均为核心条目。指标区域从真值固定生成，逐段/逐帧验收；总分≥80且无硬失败/核心失败才通过。无独立judge时正式总分待定。精确门槛、锚点和公式见visual_rules_v3.json。\n\n\n## 光变与保护段\n\n有意的暖色移动扫光位于4–10秒，较慢偏冷变暗位于17–21秒；它们属于需要保留的画面效果。正常保护窗为0–2秒、11–12秒、25–26秒（区间右端不含）。各受损区段必须实际改善，同时保留真实动作和自然运动模糊。不要把正常灯光变化全部拉平。\n\nprevious_attempt.mp4是对本版受损输入做强空间/时间平滑与曝光压平得到的失败示范，不是修复目标。数据含受控合成损伤，不声称是真实摄影机故障。公开数值评分规则与v2相同；跨版本分数不可直接视为同题条件下的能力提升或下降。\n"
      },
      {
        "name": "CREDITS.md",
        "path": "CREDITS.md",
        "url": "variant-results/case-26-spring/candidate/CREDITS.md",
        "kind": "document",
        "bytes": 341,
        "text": "Spring (2019), © Blender Foundation | studio.blender.org. Director Andy Goralczyk, music Torin Borrowdale, sound Sander Houtman. CC BY 4.0. Adaptation: synchronized excerpt, centered crop, controlled lighting and visual/audio degradation.\nhttps://studio.blender.org/projects/spring/pages/about/\nhttps://creativecommons.org/licenses/by/4.0/\n"
      },
      {
        "name": "public_rules.json",
        "path": "public_rules.json",
        "url": "variant-results/case-26-spring/candidate/public_rules.json",
        "kind": "document",
        "bytes": 4914
      },
      {
        "name": "visual_rules_v3.json",
        "path": "visual_rules_v3.json",
        "url": "variant-results/case-26-spring/candidate/visual_rules_v3.json",
        "kind": "document",
        "bytes": 5381
      },
      {
        "name": "output_schema.json",
        "path": "output_schema.json",
        "url": "variant-results/case-26-spring/candidate/output_schema.json",
        "kind": "document",
        "bytes": 1286
      },
      {
        "name": "project_schema.json",
        "path": "project_schema.json",
        "url": "variant-results/case-26-spring/candidate/project_schema.json",
        "kind": "document",
        "bytes": 820
      },
      {
        "name": "report_schema.json",
        "path": "report_schema.json",
        "url": "variant-results/case-26-spring/candidate/report_schema.json",
        "kind": "document",
        "bytes": 1291
      },
      {
        "name": "replay.py",
        "path": "replay.py",
        "url": "variant-results/case-26-spring/candidate/replay.py",
        "kind": "document",
        "bytes": 1231
      },
      {
        "name": "damaged-av-preview.mp4",
        "path": "damaged-av-preview.mp4",
        "url": "variant-results/case-26-spring/candidate/damaged-av-preview.mp4",
        "kind": "video",
        "bytes": 9829950,
        "label": "完整受损片段"
      }
    ],
    "runs": [
      {
        "model": "GPT-6.2-sol",
        "effort": "xhigh",
        "seconds": 1727.8343665599823,
        "budget": "不限时",
        "total": null,
        "status": "正式总分待评",
        "summary": "视觉 46.7191 / 70，音频自动 8.8658 / 24，总分上限 61.5848 / 100。",
        "rows": [
          [
            "分段画面改善",
            8.4,
            8.4
          ],
          [
            "运动细节",
            7.8933,
            8.4
          ],
          [
            "时序稳定",
            2.8,
            2.8
          ],
          [
            "光变保留",
            3.8258,
            5.6
          ],
          [
            "正常段保护",
            2.8,
            2.8
          ],
          [
            "动作证据",
            7.875,
            15.75
          ],
          [
            "实际修复质量",
            7.875,
            15.75
          ],
          [
            "光变意图",
            5.25,
            10.5
          ],
          [
            "音频相对改善",
            1.1743665834657686,
            6
          ],
          [
            "波形保真",
            0.21453055422569364,
            6
          ],
          [
            "频谱保真",
            3.4447319278045225,
            6
          ],
          [
            "原配乐起音",
            1.357917436772566,
            2
          ],
          [
            "损伤事件恢复",
            0.04326326680927958,
            1
          ],
          [
            "立体声保留",
            0.6309668584561308,
            1
          ],
          [
            "正常音频保护",
            2.0,
            2
          ],
          [
            "音频独立听评",
            null,
            6
          ]
        ],
        "files": [
          {
            "name": "restored_av.mp4",
            "path": "restored_av.mp4",
            "url": "variant-results/case-26-spring/sol/restored_av.mp4",
            "kind": "video",
            "bytes": 12941629
          },
          {
            "name": "restored_audio.wav",
            "path": "restored_audio.wav",
            "url": "variant-results/case-26-spring/sol/restored_audio.wav",
            "kind": "audio",
            "bytes": 4992044
          },
          {
            "name": "project.json",
            "path": "project.json",
            "url": "variant-results/case-26-spring/sol/project.json",
            "kind": "document",
            "bytes": 5719
          },
          {
            "name": "report.json",
            "path": "report.json",
            "url": "variant-results/case-26-spring/sol/report.json",
            "kind": "document",
            "bytes": 3016
          },
          {
            "name": "audio_report.json",
            "path": "audio_report.json",
            "url": "variant-results/case-26-spring/sol/audio_report.json",
            "kind": "document",
            "bytes": 2970
          },
          {
            "name": "submission.json",
            "path": "submission.json",
            "url": "variant-results/case-26-spring/sol/submission.json",
            "kind": "document",
            "bytes": 335
          },
          {
            "name": "restored.mkv",
            "label": "完整封存文件见服务器答卷目录",
            "kind": "video"
          },
          {
            "name": "repair.mkv",
            "label": "完整封存文件见服务器答卷目录",
            "kind": "video"
          },
          {
            "name": "preview.mp4",
            "label": "完整封存文件见服务器答卷目录",
            "kind": "video"
          }
        ],
        "video": [
          {
            "name": "restored_av.mp4",
            "path": "restored_av.mp4",
            "url": "variant-results/case-26-spring/sol/restored_av.mp4",
            "kind": "video",
            "bytes": 12941629,
            "label": "修复成片"
          }
        ],
        "evidence": [
          {
            "title": "8.75 秒同帧对照",
            "files": [
              {
                "name": "case26-spring-input-detail.jpg",
                "path": "case26-spring-input-detail.jpg",
                "url": "variant-results/case-26-spring/sol/case26-spring-input-detail.jpg",
                "kind": "image",
                "bytes": 243269
              },
              {
                "name": "case26-spring-output-detail.jpg",
                "path": "case26-spring-output-detail.jpg",
                "url": "variant-results/case-26-spring/sol/case26-spring-output-detail.jpg",
                "kind": "image",
                "bytes": 32024
              }
            ]
          },
          {
            "title": "14.5 秒同帧对照",
            "files": [
              {
                "name": "case26-spring-input-forest.jpg",
                "path": "case26-spring-input-forest.jpg",
                "url": "variant-results/case-26-spring/sol/case26-spring-input-forest.jpg",
                "kind": "image",
                "bytes": 252330
              },
              {
                "name": "case26-spring-output-forest.jpg",
                "path": "case26-spring-output-forest.jpg",
                "url": "variant-results/case-26-spring/sol/case26-spring-output-forest.jpg",
                "kind": "image",
                "bytes": 45699
              }
            ]
          }
        ],
        "notes": [
          "8.29–8.33 秒嘴缝出现碎暗线，握杖手指边缘偏软。9.79–9.83 秒眼下可见旧位置淡影。",
          "19.00–19.46 秒保留原切镜和结构位置变化，肋纹与放射细线更融合。三项视觉裁判均为 0.5 档。",
          "四段音频 SNR 改善 2.71–3.20 dB。即使听评满分，音频最高 14.87 / 30，低于 18 分门槛。",
          "Qwen 通过相同音频对照，交换顺序后仍无法稳定辨认重损伤对照。按原规则留空 6 分听评。"
        ],
        "reports": [
          {
            "name": "scoring.json",
            "path": "scoring.json",
            "url": "variant-results/case-26-spring/sol/scoring.json",
            "kind": "document",
            "bytes": 3163
          }
        ]
      }
    ],
    "formula": "视觉 70 分、音频 30 分。视觉按交付与修订层重放系数缩放客观和裁判分，音频由 24 分自动项与 6 分听评组成。",
    "delivery": [
      "无声 FFV1 母版、修订层和 H.264 预览",
      "48 kHz 双声道 PCM16 修复音轨及音画预览",
      "项目、音画报告与提交索引"
    ],
    "note": "干净对照视觉自动项 60 / 60、音频自动项 24 / 24。盲测通过交付、重放与音画一致性硬门槛。",
    "task": "# Case26｜电影弱光画面与原混音修复\n\n修复26秒电影片段的画面和原立体声混音。混音含同段原配乐和电影音效。input/damaged_av.mkv含受损音画；input/damaged.mkv和input/music_damaged.wav为无损分离版。\n\n画面合同、保护窗、修订层重放和报告schema详见VISUAL_TASK_V3.md。音频可能有时变有色噪声、漂移窄带干扰、不同形态爆音、单声道短缺口和局部非线性失真，可能相互重叠。自行定位损伤，保留原配乐的音符、节奏、起音、弱音、衰减、立体声和原有电影音效。0–2秒与24–26秒为正常音频保护段。不得换曲、静音掩盖、删段、错移、变速或下载原曲替换。\n\n## 交付\n\nsubmission/submission.json: version=\"3.2-av-music-heavy\", case_id=\"26\"，files必须有：master=restored.mkv（无声FFV1 RGB8视觉母版）、repair=repair.mkv（无声修订层）、preview=preview.mp4（无声H264预览）、project=project.json、report=report.json、audio=restored_audio.wav（48kHz双声道PCM16，1248000采样帧）、av_preview=restored_av.mp4（同一画面H264和同一音频AAC）、audio_report=audio_report.json（method、limitations、checks，各检查含start/end/observation）。路径相对submission，不能使用外部路径或链接。视频640×338、24fps、624帧。音画预览对无损音轨SNR≥25dB，对母版逐帧MAE≤0.025。\n\n## 评分与环境\n\n总分100，视觉70、听觉30。视觉0.7×C×(客观40＋视觉评审60)，C=min(交付完成度,重放完成度)。视觉裁判GPT-6.1-sol/high，使用v3最终量表与完整逐帧对照证据。\n\n音频：相对改善6＋绝对波形保真6＋频谱保真6＋真实音乐起音2＋损伤事件恢复1＋立体声1＋正常段保护2＋实际听评6。格式/时长/同步为硬门槛，不加分。较差窗口参与汇总，不能以少数容易片段掩盖未修复片段。真值预先固定的音符起音与损伤事件用于局部测量；具体公式和阈值公开于public_rules.json。听评有相同音频对照，不通过则待复核。总分≥80、视觉≥42、音频≥18且没有硬/核心失败才通过。\n\n本次实验使用 GPT-6.2-sol、xhigh，无总时限。仅可访问/candidate和/workspace；无外网、干净参考、损伤参数、其他答卷或评测反馈。用实际工具观察媒体，不得声称未进行的试听。完成自检后交付全部文件。\n"
  }
];
