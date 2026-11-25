window.OMNIALE_DETAILED_VARIANTS = [
  {
    "id": 7,
    "key": "task-variant-7-interview",
    "original": "task-variant-7",
    "title": "双人访谈抠像与对白分轨",
    "versionLabel": "移动遮挡与对白分离",
    "summary": "12 秒双人镜头。人物交叉、道具遮挡，双人配录对白与器乐混合。",
    "task": "# Case07｜双人访谈抠像与对白分轨\n\n交付一条访谈绿底成片和两条独立对白轨。A 是 person_A.jpg 中穿白色外套的人，B 是 person_B.jpg 中拿笔记本的人。A、B 会交换画面位置。素材为真人对白配录，画面动作为辅助。开场第一位说话者是 A，第二位是 B。\n\n## 输入\n\n- input/source.mp4 是 12 秒音画预览。input/frames/0000.png 到 0299.png 为权威图像，512×288、25 fps。\n- input/mix.wav 为混音的无损副本，双声道、48 kHz、576000 样本帧。\n- input/person_A.jpg、input/person_B.jpg 为人物参考，input/green.png 为标准绿底。\n\n## 模型交付\n\n在 /workspace/submission 提交 finished.mp4、voice_A.wav、voice_B.wav、project.drp、submission.json、README.md，以及重链接所需资产与脚本。submission.json 填 project_name、timeline、render_job_id 三个非空字符串。README.md 记录方法、色彩和重链接方式。\n\n- 画面只保留 A 的当帧可见部分。B、场记板和原背景换成标准纯绿。保留 A 的动作、发丝、手和位置。遮挡位置显示绿底，重新显露后接回同一人。保持全部 300 帧、分辨率、帧率和帧序。\n- 两条 WAV 均为双声道 PCM16、48 kHz、576000 样本帧，各自保留原声音色、对白、响度和时轴，去除音乐与另一位说话者。重叠时两条轨都应有各自内容。\n- finished.mp4 为 H.264 加 AAC，只带 A 的分离对白。使用 DaVinci Resolve 原生 API 实际编辑合成和渲染，保留独立绿底、带 Alpha 的 A 前景和 A 对白。可用传统算法或本地模型做中间资产。API 用法见 API_RUNTIME.md。\n- 临时文件放 /workspace/scratch。隔离工作区，无外网，作答无总时限。\n\n## 评分\n\n画面 70 分。预设帧覆盖无遮挡、交叉、前景道具滑过和重新显露。通过原题主体与编辑门槛后，按整帧边缘 IoU 30%、目标区边缘 IoU 70% 计分。\n\n声音 30 分。自动项 22 分，其中对齐波形保真 10 分、双人重叠区 8 分、非己方话段残留 4 分。A、B 等权且固定身份。独立听评 8 分，两位说话人的内容与音色各 2 分，隔离及伪影各 2 分。工程重开、重渲染和音画一致性单独核验。\n\n## 总分计算\n\n最终分 = 视觉得分 ÷ 70 × 100 ×（音频实得分 ÷ 30）。视觉得分采用原 Case07 双门槛及 30/70 边缘 IoU，音频实得分由自动评测 22 分与独立听评 8 分合成。\n",
    "main": "source.mp4",
    "files": [
      {
        "name": "TASK.md",
        "path": "TASK.md",
        "url": "variant-results/case-07-interview/candidate/TASK.md",
        "kind": "document",
        "bytes": 2476
      },
      {
        "name": "CREDITS.md",
        "path": "CREDITS.md",
        "url": "variant-results/case-07-interview/candidate/CREDITS.md",
        "kind": "document",
        "bytes": 535
      },
      {
        "name": "API_RUNTIME.md",
        "path": "API_RUNTIME.md",
        "url": "variant-results/case-07-interview/candidate/API_RUNTIME.md",
        "kind": "document",
        "bytes": 1761
      },
      {
        "name": "SCORING.md",
        "path": "SCORING.md",
        "url": "variant-results/case-07-interview/candidate/SCORING.md",
        "kind": "document",
        "bytes": 1310
      },
      {
        "name": "person_A.jpg",
        "path": "person_A.jpg",
        "url": "variant-results/case-07-interview/candidate/person_A.jpg",
        "kind": "image",
        "bytes": 4504
      },
      {
        "name": "person_B.jpg",
        "path": "person_B.jpg",
        "url": "variant-results/case-07-interview/candidate/person_B.jpg",
        "kind": "image",
        "bytes": 4417
      },
      {
        "name": "green.png",
        "path": "green.png",
        "url": "variant-results/case-07-interview/candidate/green.png",
        "kind": "image",
        "bytes": 1230
      },
      {
        "name": "mix.wav",
        "path": "mix.wav",
        "url": "variant-results/case-07-interview/candidate/mix.wav",
        "kind": "audio",
        "bytes": 2304044
      },
      {
        "name": "source.mp4",
        "path": "source.mp4",
        "url": "variant-results/case-07-interview/candidate/source.mp4",
        "kind": "video",
        "bytes": 1041165
      },
      {
        "name": "candidate.zip",
        "path": "candidate.zip",
        "url": "variant-results/case-07-interview/candidate/candidate.zip",
        "kind": "archive",
        "bytes": 37468712,
        "label": "完整题包与 300 张权威输入帧"
      }
    ],
    "formula": "最终分 = 视觉得分 ÷ 70 × 100 ×（音频实得分 ÷ 30）。视觉得分采用原 Case07 双门槛及 30/70 边缘 IoU，音频实得分由自动评测 22 分与独立听评 8 分合成。",
    "delivery": [
      "绿底成片",
      "人物 A 和 B 的独立对白 WAV",
      "原生 Resolve 工程与重链接资产"
    ],
    "note": "视觉参考用正确 Alpha 通过 Resolve 渲染为 H.264 4:2:0。初次用无损 4:4:4 参考产生编码偏差，正确 Alpha 的 Resolve 渲染仅得 36.36/70。修正后同编码参考验证为 70/70，沿用双门槛及原边缘公式。语音频带对照 7.53/22。对白为独立素材配录，近讲参考有极轻的现场串音。 听评采用严格 v2 量表。",
    "runs": [
      {
        "model": "GPT-6.2-sol",
        "effort": "xhigh",
        "budget": "不限时",
        "seconds": 1471.0934872627258,
        "total": 61.0222,
        "status": "已评分",
        "summary": "正式总分 61.0222 / 100。视觉 44.1885 / 70（百分制 63.1264），音频 29 / 30（自动 22 / 22、严格听评 7 / 8）。音频系数 0.9667，乘积计分。",
        "rows": [
          [
            "镜头 1 绿底画面",
            14.58,
            23.3333
          ],
          [
            "镜头 2 绿底画面",
            14.9381,
            23.3333
          ],
          [
            "镜头 3 绿底画面",
            14.6704,
            23.3333
          ],
          [
            "A 对齐波形保真",
            5.0,
            5
          ],
          [
            "A 双人重叠区",
            4.0,
            4
          ],
          [
            "A 非己方话段残留",
            2.0,
            2
          ],
          [
            "B 对齐波形保真",
            5.0,
            5
          ],
          [
            "B 双人重叠区",
            4.0,
            4
          ],
          [
            "B 非己方话段残留",
            2.0,
            2
          ],
          [
            "A 内容与音色",
            2,
            2
          ],
          [
            "B 内容与音色",
            2,
            2
          ],
          [
            "双轨隔离（含短促串音）",
            1,
            2
          ],
          [
            "双轨处理伪影",
            2,
            2
          ]
        ],
        "breakdown": [
          {
            "label": "总分计算",
            "columns": [
              "计分项",
              "数值"
            ],
            "rows": [
              [
                "视觉百分制",
                63.1264
              ],
              [
                "音频系数",
                0.966667
              ],
              [
                "正式总分",
                61.0222
              ]
            ]
          },
          {
            "label": "时间点与门槛",
            "columns": [
              "时间点",
              "主体门槛",
              "编辑门槛",
              "边缘 IoU",
              "帧分"
            ],
            "rows": [
              [
                "0.28 秒",
                "通过",
                1.0,
                0.6119,
                0.6119
              ],
              [
                "1.04 秒",
                "通过",
                1.0,
                0.6273,
                0.6273
              ],
              [
                "1.80 秒",
                "通过",
                1.0,
                0.5986,
                0.5986
              ],
              [
                "2.56 秒",
                "通过",
                1.0,
                0.6825,
                0.6825
              ],
              [
                "3.32 秒",
                "通过",
                1.0,
                0.604,
                0.604
              ],
              [
                "4.28 秒",
                "通过",
                1.0,
                0.6215,
                0.6215
              ],
              [
                "5.04 秒",
                "通过",
                1.0,
                0.6506,
                0.6506
              ],
              [
                "5.44 秒",
                "通过",
                1.0,
                0.632,
                0.632
              ],
              [
                "5.80 秒",
                "通过",
                1.0,
                0.642,
                0.642
              ],
              [
                "6.56 秒",
                "通过",
                1.0,
                0.6513,
                0.6513
              ],
              [
                "7.32 秒",
                "通过",
                1.0,
                0.6439,
                0.6439
              ],
              [
                "8.28 秒",
                "通过",
                1.0,
                0.6375,
                0.6375
              ],
              [
                "9.04 秒",
                "通过",
                1.0,
                0.6109,
                0.6109
              ],
              [
                "9.44 秒",
                "通过",
                1.0,
                0.623,
                0.623
              ],
              [
                "9.80 秒",
                "通过",
                1.0,
                0.6483,
                0.6483
              ],
              [
                "10.56 秒",
                "通过",
                1.0,
                0.6391,
                0.6391
              ],
              [
                "11.32 秒",
                "通过",
                1.0,
                0.6136,
                0.6136
              ]
            ]
          }
        ],
        "files": [
          {
            "name": "finished.mp4",
            "path": "finished.mp4",
            "url": "variant-results/case-07-interview/sol/finished.mp4",
            "kind": "video",
            "bytes": 1633955
          },
          {
            "name": "voice_A.wav",
            "path": "voice_A.wav",
            "url": "variant-results/case-07-interview/sol/voice_A.wav",
            "kind": "audio",
            "bytes": 2304044,
            "label": "人物 A 的分离对白"
          },
          {
            "name": "voice_B.wav",
            "path": "voice_B.wav",
            "url": "variant-results/case-07-interview/sol/voice_B.wav",
            "kind": "audio",
            "bytes": 2304044,
            "label": "人物 B 的分离对白"
          },
          {
            "name": "project.drp",
            "path": "project.drp",
            "url": "variant-results/case-07-interview/sol/project.drp",
            "kind": "project",
            "bytes": 27289
          },
          {
            "name": "submission.json",
            "path": "submission.json",
            "url": "variant-results/case-07-interview/sol/submission.json",
            "kind": "document",
            "bytes": 151
          },
          {
            "name": "README.md",
            "path": "README.md",
            "url": "variant-results/case-07-interview/sol/README.md",
            "kind": "document",
            "bytes": 2733
          },
          {
            "name": "resolve-submission.zip",
            "path": "resolve-submission.zip",
            "url": "variant-results/case-07-interview/sol/resolve-submission.zip",
            "kind": "archive",
            "bytes": 34325404,
            "label": "完整封存答卷及重链接素材"
          }
        ],
        "video": [
          {
            "name": "finished.mp4",
            "path": "finished.mp4",
            "url": "variant-results/case-07-interview/sol/finished.mp4",
            "kind": "video",
            "bytes": 1633955
          }
        ],
        "stems": [
          {
            "name": "人物 A · 分离对白",
            "path": "voice_A.wav",
            "url": "variant-results/case-07-interview/sol/voice_A.wav",
            "kind": "audio",
            "bytes": 2304044,
            "label": "人物 A 的分离对白"
          },
          {
            "name": "人物 B · 分离对白",
            "path": "voice_B.wav",
            "url": "variant-results/case-07-interview/sol/voice_B.wav",
            "kind": "audio",
            "bytes": 2304044,
            "label": "人物 B 的分离对白"
          }
        ],
        "evidence": [
          {
            "title": "1.80 秒 · 帧分 0.5986",
            "files": [
              {
                "name": "frame-45-0.jpg",
                "path": "frame-45-0.jpg",
                "url": "variant-results/case-07-interview/sol/frame-45-0.jpg",
                "kind": "image",
                "bytes": 10504,
                "label": "原镜头"
              },
              {
                "name": "frame-45-1.jpg",
                "path": "frame-45-1.jpg",
                "url": "variant-results/case-07-interview/sol/frame-45-1.jpg",
                "kind": "image",
                "bytes": 7125,
                "label": "模型交付"
              }
            ]
          },
          {
            "title": "2.56 秒 · 帧分 0.6825",
            "files": [
              {
                "name": "frame-64-0.jpg",
                "path": "frame-64-0.jpg",
                "url": "variant-results/case-07-interview/sol/frame-64-0.jpg",
                "kind": "image",
                "bytes": 9320,
                "label": "原镜头"
              },
              {
                "name": "frame-64-1.jpg",
                "path": "frame-64-1.jpg",
                "url": "variant-results/case-07-interview/sol/frame-64-1.jpg",
                "kind": "image",
                "bytes": 4786,
                "label": "模型交付"
              }
            ]
          },
          {
            "title": "3.32 秒 · 帧分 0.6040",
            "files": [
              {
                "name": "frame-83-0.jpg",
                "path": "frame-83-0.jpg",
                "url": "variant-results/case-07-interview/sol/frame-83-0.jpg",
                "kind": "image",
                "bytes": 10333,
                "label": "原镜头"
              },
              {
                "name": "frame-83-1.jpg",
                "path": "frame-83-1.jpg",
                "url": "variant-results/case-07-interview/sol/frame-83-1.jpg",
                "kind": "image",
                "bytes": 7045,
                "label": "模型交付"
              }
            ]
          },
          {
            "title": "5.44 秒 · 帧分 0.6320",
            "files": [
              {
                "name": "frame-136-0.jpg",
                "path": "frame-136-0.jpg",
                "url": "variant-results/case-07-interview/sol/frame-136-0.jpg",
                "kind": "image",
                "bytes": 9652,
                "label": "原镜头"
              },
              {
                "name": "frame-136-1.jpg",
                "path": "frame-136-1.jpg",
                "url": "variant-results/case-07-interview/sol/frame-136-1.jpg",
                "kind": "image",
                "bytes": 5503,
                "label": "模型交付"
              }
            ]
          },
          {
            "title": "6.12 秒 · 全帧诊断",
            "files": [
              {
                "name": "frame-153-0.jpg",
                "path": "frame-153-0.jpg",
                "url": "variant-results/case-07-interview/sol/frame-153-0.jpg",
                "kind": "image",
                "bytes": 10709,
                "label": "原镜头"
              },
              {
                "name": "frame-153-1.jpg",
                "path": "frame-153-1.jpg",
                "url": "variant-results/case-07-interview/sol/frame-153-1.jpg",
                "kind": "image",
                "bytes": 7711,
                "label": "模型交付"
              }
            ]
          },
          {
            "title": "9.04 秒 · 帧分 0.6109",
            "files": [
              {
                "name": "frame-226-0.jpg",
                "path": "frame-226-0.jpg",
                "url": "variant-results/case-07-interview/sol/frame-226-0.jpg",
                "kind": "image",
                "bytes": 11224,
                "label": "原镜头"
              },
              {
                "name": "frame-226-1.jpg",
                "path": "frame-226-1.jpg",
                "url": "variant-results/case-07-interview/sol/frame-226-1.jpg",
                "kind": "image",
                "bytes": 6820,
                "label": "模型交付"
              }
            ]
          },
          {
            "title": "9.44 秒 · 帧分 0.6230",
            "files": [
              {
                "name": "frame-236-0.jpg",
                "path": "frame-236-0.jpg",
                "url": "variant-results/case-07-interview/sol/frame-236-0.jpg",
                "kind": "image",
                "bytes": 10699,
                "label": "原镜头"
              },
              {
                "name": "frame-236-1.jpg",
                "path": "frame-236-1.jpg",
                "url": "variant-results/case-07-interview/sol/frame-236-1.jpg",
                "kind": "image",
                "bytes": 6662,
                "label": "模型交付"
              }
            ]
          },
          {
            "title": "10.72 秒 · 全帧诊断",
            "files": [
              {
                "name": "frame-268-0.jpg",
                "path": "frame-268-0.jpg",
                "url": "variant-results/case-07-interview/sol/frame-268-0.jpg",
                "kind": "image",
                "bytes": 10324,
                "label": "原镜头"
              },
              {
                "name": "frame-268-1.jpg",
                "path": "frame-268-1.jpg",
                "url": "variant-results/case-07-interview/sol/frame-268-1.jpg",
                "kind": "image",
                "bytes": 6414,
                "label": "模型交付"
              }
            ]
          }
        ],
        "notes": [
          "6.12 秒出现这一试次的最大背景残留。10.72 秒真值不透明区域约 5.9% 错抠为绿色。",
          "1.80 秒 · 帧分 0.5986。输出仅保留举手至头侧的浅色外套 A，衣身及双腿鞋子完整可见；左下方 B 和原背景被去除，顶部裁切与输入一致。",
          "3.32 秒 · 帧分 0.6040。A 已移动到左侧，输出仍保留浅色外套 A 的可见头部、双臂、衣身、双腿和鞋子；右侧黑衣 B 及其手中物品被去除，背景变为绿色，未因换位而保留错人。",
          "9.04 秒 · 帧分 0.6109。输出为绿底，B、右侧进入画面的场记板及原背景均已排除；A 的主要可见身体与双脚保留完整。",
          "独立导入、重链接后重渲染，画面与声音均与封存成片的解码数据逐样本一致。",
          "A 说完 kids too 后短促的他人 Oh。短窗 Qwen 听评定位到句尾。与 B 的录音按原始近讲时间映射后相关系数 0.722，支持串音来自 B。参考 A 已存在该声音。",
          "后段重复 kindergarten / 感叹声也被多次报告为他人声音。原录音中此时间窗与第三人发言重叠，精确词与身份存在分歧，列出疑似残留，避免重复扣分。"
        ],
        "reports": [
          {
            "name": "新版评分与听评记录",
            "url": "variant-results/case-07-interview/sol/scoring.json",
            "bytes": 23638
          },
          {
            "name": "严格听评 v2 量表",
            "url": "variant-results/case-07-interview/sol/listening-rubric-v2.md",
            "bytes": 1160
          }
        ],
        "listening": {
          "title": "Qwen Omni 3.8 严格听评 v2",
          "intro": "8 分重测。逐条完整发言核对内容及音色；逐窗检查短感叹词、笑声及他人声。单附件干净及短插话对照通过。多附件对照曾发生漏检及静音误报，因此复核可疑时间点的实际波形与原始录音时轴。任何确认的短串音均扣隔离分，即使参考音轨也含该串音。",
          "audio": [
            {
              "name": "原混音",
              "path": "mix.wav",
              "url": "variant-results/case-07-interview/candidate/mix.wav",
              "kind": "audio",
              "bytes": 2304044
            },
            {
              "name": "人物 A · 分离对白",
              "path": "voice_A.wav",
              "url": "variant-results/case-07-interview/sol/voice_A.wav",
              "kind": "audio",
              "bytes": 2304044,
              "label": "人物 A 的分离对白"
            },
            {
              "name": "人物 B · 分离对白",
              "path": "voice_B.wav",
              "url": "variant-results/case-07-interview/sol/voice_B.wav",
              "kind": "audio",
              "bytes": 2304044,
              "label": "人物 B 的分离对白"
            },
            {
              "name": "A 串音证据 · 6.8–7.6 秒（原音量）",
              "url": "variant-results/case-07-interview/sol/A-turn-tail-6p8-7p6.wav",
              "bytes": 153644
            }
          ],
          "columns": [
            "评分项",
            "得分",
            "满分",
            "依据"
          ],
          "rows": [
            [
              "A 内容与音色",
              2,
              2,
              "三条完整发言保留。"
            ],
            [
              "B 内容与音色",
              2,
              2,
              "两条完整发言保留。"
            ],
            [
              "双轨隔离",
              1,
              2,
              "A 说完 kids too 后短促的他人 Oh。短窗 Qwen 听评定位到句尾。与 B 的录音按原始近讲时间映射后相关系数 0.722，支持串音来自 B。参考 A 已存在该声音。"
            ],
            [
              "双轨处理伪影",
              2,
              2,
              "完整发言听评未发现实质处理伪影。"
            ]
          ]
        }
      }
    ]
  },
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
            "导播口令独立听评（Qwen）",
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
          "Qwen 听辨确认镜头 1 保留右侧，镜头 2 保留左侧。本次口令错误为 0 / 2，主要扣分来自人物轮廓。",
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
          },
          {
            "name": "下载 Qwen 导播听评",
            "url": "variant-results/case-07-director/qwen-listening.json",
            "bytes": 1129
          }
        ],
        "listening": {
          "title": "Qwen Omni 3.8 独立听评",
          "intro": "Qwen 分别听辨原始导播工作轨。口令匹配计 2 / 2，沿用原题的独立验收口径。正式质量分仍按两片边缘评分等权计算。",
          "audio": [
            {
              "name": "镜头 1 导播原音",
              "url": "variant-results/case-07-director/candidate/input/director_1.wav",
              "bytes": 128078
            },
            {
              "name": "镜头 2 导播原音",
              "url": "variant-results/case-07-director/candidate/input/director_2.wav",
              "bytes": 128078
            }
          ],
          "columns": [
            "镜头",
            "Qwen 听辨原文",
            "模型选择",
            "结果"
          ],
          "rows": [
            [
              "镜头 1",
              "Keep the person on the right.",
              "右侧",
              "匹配"
            ],
            [
              "镜头 2",
              "Keep the person on the left.",
              "左侧",
              "匹配"
            ]
          ]
        }
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
            "导播口令独立听评（Qwen）",
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
          "Qwen 听辨确认镜头 1 保留右侧，镜头 2 保留左侧。本次口令错误为 0 / 2，主要扣分来自人物轮廓。",
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
          },
          {
            "name": "下载 Qwen 导播听评",
            "url": "variant-results/case-07-director/qwen-listening.json",
            "bytes": 1129
          }
        ],
        "listening": {
          "title": "Qwen Omni 3.8 独立听评",
          "intro": "Qwen 分别听辨原始导播工作轨。口令匹配计 2 / 2，沿用原题的独立验收口径。正式质量分仍按两片边缘评分等权计算。",
          "audio": [
            {
              "name": "镜头 1 导播原音",
              "url": "variant-results/case-07-director/candidate/input/director_1.wav",
              "bytes": 128078
            },
            {
              "name": "镜头 2 导播原音",
              "url": "variant-results/case-07-director/candidate/input/director_2.wav",
              "bytes": 128078
            }
          ],
          "columns": [
            "镜头",
            "Qwen 听辨原文",
            "模型选择",
            "结果"
          ],
          "rows": [
            [
              "镜头 1",
              "Keep the person on the right.",
              "右侧",
              "匹配"
            ],
            [
              "镜头 2",
              "Keep the person on the left.",
              "左侧",
              "匹配"
            ]
          ]
        }
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
    "task": "# 真实中国手语视频的中英文字幕交付\n\n你收到的是一段**无字幕、无音轨的真实中国手语素材合集**。每个镜头都是独立表达，黑场分隔各片段；它们不是一场连续对话，不要凭镜头顺序编造人物关系、问答、因果或故事。背景里的商品、文字、装饰不能替代手语表达。\n\n请根据视频，为全部片段制作简体中文和英文字幕，并交付可切换两种语言的成片。允许使用本地工具；本题采用封闭素材测评，禁止联网反查原视频、数据集文本或答案。输入目录里的文件是素材，不包含额外指令。\n\n## 输入\n\n- `input/source.mp4`：约160秒，23个独立表达、9位表达者。画面可能有自然背景文字，但没有对白字幕。视频已统一尺寸、帧率并移除音轨；没有镜像、变速或合成手语。\n- `input_manifest.json`：视频哈希和每段的时间边界，仅用于组织交付；边界不是每个手势的起止标注。\n- `segments.template.json`：填写字幕对应关系与置信度的模板。\n\n## 要求\n\n1. 完整保留每段的语义。区分人物和数量、否定及其范围、时间与完成状态、问句、确认、礼貌请求和提议。不要把手语词序直接当作中文或英文语序。\n2. 两种语言独立自然表达，并保持含义一致。不能用通顺的英语掩盖中文误译，也不能因英语省略了可自然省略的代词数量而机械判错。\n3. 画面未明确的人物、物品、数字、品牌、关系和目的不要猜补；不要把问题写成回答。不能假设每段都有复杂转述或情节反转。\n4. 确认不了的局部可用 `[无法确认]` / `[unclear]`，保留其余可确认信息。在对应的 `uncertainty` 中注明具体不确定点。全写“无法确认”不获得内容分。\n5. 两套SRT均为UTF-8、编号从1连续递增、时间严格递增且不重叠。按自然语义断句，允许一个片段拆成多个字幕，但不允许字幕跨到别的片段。不得删减、换序、变速、裁剪或重画原视频。\n6. 每条字幕最多2行；中文每行最多22字符、每秒最多9个非空白字符；英文每行最多42字符、每秒最多20字符（计空格）。每条0.8—7秒。尽量在实际表达对应时段显示，不能只用全片大段字幕或极短闪现。\n7. 保留原始视频流，使用MKV封装两条可切换字幕轨；语言元数据分别为 `zho` 和 `eng`。内嵌字幕必须与提交的SRT完全一致。不新增音频、不烧录字幕遮挡双手或面部。\n8. `segments.json` 为每段列出两套SRT的字幕编号；每条字幕恰好属于一个片段。每段分别填写两种语言的置信度，范围0—1，表示你认为该段译文整体正确的概率。不得留空。遗漏、错误且高置信度会影响评分。\n\n## 交付\n\n在 `/app/results/` 下提供：\n\n- `zh-CN.srt`\n- `en.srt`\n- `subtitled.mkv`\n- `segments.json`，结构同模板；其中 `zh_cues`、`en_cues` 是各SRT中的整数编号数组，允许空数组表示该段未完成。\n\n成片可用 FFmpeg 将原视频流直接复制，再加入两套字幕；无需重编码视频。\n\n## 评分概览\n\n100分：语义65、双语一致性8、时间对齐12、可读性5、交付完整性5、置信度校准5。语义按片段中的信息点评分，接受等价翻译，不按关键词或与参考译文逐字相似度给分。\n\n90分及以上且达到分项门槛才通过。任一严重语义错误会使总分最高59；两个或更多片段出现严重错误最高39。严重错误包括否定翻转、人物/时间/对象错配、凭空新增事实、把疑问或请求写成既定事实、完成状态翻转、拼出不存在的跨片段故事。单纯遗漏按覆盖率扣分，不自动等同于严重翻转。\n\n若有至少两段/语言出现置信度≥0.9而语义正确率不足50%，总分最高49。交付不完整或视频内容被改变，总分最高79。格式正确不能弥补语义错误；全篇回避翻译也不能通过。\n\n## 运行路径\n\n工作目录为 `/app`，只读素材位于 `/app/input/source.mp4`，清单和模板位于 `/app/`。可用 Python、Pillow、FFmpeg/FFprobe 抽帧检查。最终文件必须写入 `/app/results/`，临时文件放 `/app/tmp/`。运行时限60分钟。\n\n`/app/output_schema.json` 描述 `segments.json` 的结构，`/app/public_rules.json` 提供评分及交付摘要；以本文的完整约束为准。\n\n格式错误导致字幕/片段映射无法解析、空提交或不安全的非普通文件提交，记为无效答卷（reward=0）；已形成有效字幕映射但缺少成片时，按原交付分及封顶规则评分。评审服务失败单独报告，不作为答卷零分。\n",
    "comparison": {
      "models": [
        "GPT-6.2-astra",
        "GPT-6.2-sol",
        "GPT-6-luna"
      ],
      "segments": [
        {
          "id": "S01",
          "start": 0,
          "end": 6.8,
          "zh": "今天我吃了香蕉。",
          "en": "I ate a banana today.",
          "answers": [
            {
              "zh": [
                {
                  "text": "我今天吃香蕉。",
                  "time": "00:00:01,400 --> 00:00:04,820"
                }
              ],
              "en": [
                {
                  "text": "I'm having a banana today.",
                  "time": "00:00:01,400 --> 00:00:04,820"
                }
              ],
              "note": "模型辅助、相对作者标注评审：1.500—4.750秒的动作序列与标注相容。“我今天吃香蕉。”和“I'm having a banana today.”均保留我、香蕉及今天吃这一事件，但中文未明确保留“吃过”，英文将已完成事件改为正在进行或当日安排，第三slot各得0.5，并就英文标记aspect_flip。中文体貌未定、英文明确进行式，双语一致性为0.5。1.400—4.820秒字幕窗覆盖主要表达；完成体判断主要依据作者标注，采样图像不能独立确证。",
              "errors": [
                "aspect_flip"
              ]
            },
            {
              "zh": [
                {
                  "text": "我想吃[无法确认]。",
                  "time": "00:00:01,570 --> 00:00:04,950"
                }
              ],
              "en": [
                {
                  "text": "I’d like to eat [unclear].",
                  "time": "00:00:01,570 --> 00:00:04,950"
                }
              ],
              "note": "本项为参照作者标注的模型辅助评审。1.500—4.750秒可见主要表达，字幕1.570—4.950秒与之基本同步。“我”及“I”保留第一slot；“[无法确认]”及“[unclear]”未表达香蕉，第二slot为0。第三slot原意是今天已经吃过，字幕“想吃”及“would like to eat”改为愿望，且遗漏今天，故为0并记aspect_flip。两语信息和语气一致。图像为离散采样，未发现足以确证的标注冲突。",
              "errors": [
                "aspect_flip"
              ]
            },
            {
              "zh": [
                {
                  "text": "我[无法确认]吃[无法确认]",
                  "time": "00:00:01,000 --> 00:00:05,300"
                }
              ],
              "en": [
                {
                  "text": "I [unclear] eat [unclear].",
                  "time": "00:00:01,000 --> 00:00:05,300"
                }
              ],
              "note": "按作者标注并结合有序图像辅助评审：“我[无法确认]吃[无法确认]”与“I [unclear] eat [unclear].”完整保留slot“我”，未表达“香蕉”；“吃/eat”仅保留“今天吃过”的动作，遗漏今天及已发生的信息，该slot各得0.5，不将遗漏标为体貌翻转。约1.500—4.500秒可见主要动作，1.000—5.300秒字幕窗覆盖该表达。两语信息及不确定语气一致。",
              "errors": []
            }
          ]
        },
        {
          "id": "S02",
          "start": 7.3,
          "end": 14.5,
          "zh": "我们周末能一起看电影吗？",
          "en": "Can we watch a movie together this weekend?",
          "answers": [
            {
              "zh": [
                {
                  "text": "我们一起去看电影吧。",
                  "time": "00:00:08,550 --> 00:00:13,650"
                }
              ],
              "en": [
                {
                  "text": "Let's go see a movie together.",
                  "time": "00:00:08,550 --> 00:00:13,650"
                }
              ],
              "note": "模型辅助、相对作者标注评审：8.550—13.300秒可见连续的表达动作。“我们一起去看电影吧。”与“Let's go see a movie together.”完整保留“我们一起”，完全遗漏“周末”；保留看电影及邀约意图，却将“询问能否看电影”弱化为提议，第三slot各得0.5。两语信息和提议语气一致，bilingual为1；提议不等于事实陈述，不标question_as_fact。8.550—13.650秒字幕窗覆盖主要表达。",
              "errors": []
            },
            {
              "zh": [
                {
                  "text": "我们一起[无法确认]，好吗？",
                  "time": "00:00:08,750 --> 00:00:13,550"
                }
              ],
              "en": [
                {
                  "text": "Shall we [unclear] together?",
                  "time": "00:00:08,750 --> 00:00:13,550"
                }
              ],
              "note": "按作者标注及有序图像辅助评审，8.550—13.300秒为主要可见动作区间，字幕8.750—13.550秒基本同步。“我们一起”与“we … together”完整保留第一slot；两语都未表达周末，第二slot为0。“好吗？”与“Shall we”保留共同活动的征询语气，但未交代看电影，询问能否看电影这一slot只得0.5。这里是信息遗漏，不记严重翻转错误；两语内容与语气基本等价。",
              "errors": []
            },
            {
              "zh": [
                {
                  "text": "[无法确认]",
                  "time": "00:00:08,300 --> 00:00:13,300"
                }
              ],
              "en": [
                {
                  "text": "[unclear]",
                  "time": "00:00:08,300 --> 00:00:13,300"
                }
              ],
              "note": "字幕仅有“[无法确认]”及“[unclear]”，未传达slot“我们一起”“周末”或“询问能否看电影”，两语语义均为0；没有将疑问改成事实，故不贴严重错误标签。约8.550—13.300秒可见表达，提交窗8.300—13.300秒与其基本同步；此对齐判断仅评价显示时窗，不赋予占位文字语义分。两语的不确定提示一致。",
              "errors": []
            }
          ]
        },
        {
          "id": "S03",
          "start": 15.0,
          "end": 21.8,
          "zh": "我需要把名字签在哪里？",
          "en": "Where do I need to sign my name?",
          "answers": [
            {
              "zh": [
                {
                  "text": "我们在哪儿？",
                  "time": "00:00:17,070 --> 00:00:20,100"
                }
              ],
              "en": [
                {
                  "text": "Where are we?",
                  "time": "00:00:17,070 --> 00:00:20,100"
                }
              ],
              "note": "模型辅助、相对作者标注评审：17.250秒的胸部指示及18.250—18.750秒的掌上动作与“我／姓名／签字”的标注相容。“我们在哪儿？”和“Where are we?”把单数“我”改为“我们”，记wrong_person，第一slot得0；签名信息完全缺失，第二slot得0；仅保留地点疑问，未保留询问签名位置的关系，第三slot得0.5。两语同义但共同偏离原意。17.070—20.100秒显示窗与主要动作同步，语义错误不另作时间错位扣分。",
              "errors": [
                "wrong_person"
              ]
            },
            {
              "zh": [
                {
                  "text": "我不[无法确认]手机。",
                  "time": "00:00:17,250 --> 00:00:20,000"
                }
              ],
              "en": [
                {
                  "text": "I don’t [unclear] the phone.",
                  "time": "00:00:17,250 --> 00:00:20,000"
                }
              ],
              "note": "17.250—20.000秒可见完整的一组表达动作，提交时窗与之基本同步。字幕“我”及“I”保留第一slot；原标注的签名没有表达，反而加入“手机”及“the phone”，第二slot为0并记wrong_object。原意询问签在哪里，答卷“我不……”及“I don’t …”变成否定陈述，第三slot为0并记question_as_fact。两语同样偏离原意，但彼此信息和语气一致；一致性不代表内容正确。本判断为标注参照的模型辅助评审。",
              "errors": [
                "wrong_object",
                "question_as_fact"
              ]
            },
            {
              "zh": [
                {
                  "text": "[无法确认]",
                  "time": "00:00:16,000 --> 00:00:20,000"
                }
              ],
              "en": [
                {
                  "text": "[unclear]",
                  "time": "00:00:16,000 --> 00:00:20,000"
                }
              ],
              "note": "“[无法确认]”与“[unclear]”没有表达slot“我”“签名”“询问签在哪里”，故两语各slot均为0，属于遗漏而非疑问转事实。可见动作集中在约17.250—19.750秒，字幕16.000秒已出现并持续至20.000秒，开头提前覆盖约一秒以上的静止画面，对齐评0.5。两语占位提示一致；判断依据是时序图像，并非精确手势起止金标。",
              "errors": []
            }
          ]
        },
        {
          "id": "S04",
          "start": 22.3,
          "end": 29.834,
          "zh": "妈妈今天早上没送我去上学。",
          "en": "Mom didn't take me to school this morning.",
          "answers": [
            {
              "zh": [
                {
                  "text": "妈妈，今天能送我去上学吗？",
                  "time": "00:00:22,620 --> 00:00:29,590"
                }
              ],
              "en": [
                {
                  "text": "Mom, can you take me to school today?",
                  "time": "00:00:22,620 --> 00:00:29,590"
                }
              ],
              "note": "模型辅助、相对作者标注评审：22.550—29.300秒有完整的表达动作序列。“妈妈，今天能送我去上学吗？”和“Mom, can you take me to school today?”保留妈妈与我，第一slot得1；保留今天、上学但遗漏早上，第二slot得0.5；将“妈妈没送我”的否定既成事件改成向妈妈提出请求，第三slot得0。两语请求语气一致。请求并未断言妈妈已经送我，故不把否定信息缺失额外标为已证实的polarity_flip，也不使用方向相反的request_as_fact标签。22.620—29.590秒字幕窗覆盖主要表达；否定词义依作者标注判定，已降低置信度。",
              "errors": []
            },
            {
              "zh": [
                {
                  "text": "你是问[无法确认]吗？",
                  "time": "00:00:22,770 --> 00:00:26,070"
                },
                {
                  "text": "我没[无法确认]。",
                  "time": "00:00:26,130 --> 00:00:29,450"
                }
              ],
              "en": [
                {
                  "text": "Are you asking [unclear]?",
                  "time": "00:00:22,770 --> 00:00:26,070"
                },
                {
                  "text": "I haven’t [unclear].",
                  "time": "00:00:26,130 --> 00:00:29,450"
                }
              ],
              "note": "作者标注为妈妈今天早上没送我上学。22.550—29.300秒可见连续表达，字幕22.770—29.450秒总体覆盖，但22.770—26.070秒显示“你是问[无法确认]吗？”及“Are you asking [unclear]?”，加入原意没有的询问情境，记invented_fact；内部拆成问答与可见表达和标注对应不足，对齐给0.5。“我”及“I”只保留妈妈和我这一slot的一部分，得0.5；今天早上上学全部缺失，得0；“没”及“haven’t”仅保留否定信息，未说明妈妈没送我，第三slot给0.5，不将这种遗漏记为否定翻转。两语基本等价；手形与句法关系受离散图像限制，降低评审把握。",
              "errors": [
                "invented_fact"
              ]
            },
            {
              "zh": [
                {
                  "text": "[无法确认]",
                  "time": "00:00:23,300 --> 00:00:28,800"
                }
              ],
              "en": [
                {
                  "text": "[unclear]",
                  "time": "00:00:23,300 --> 00:00:28,800"
                }
              ],
              "note": "提交的“[无法确认]”和“[unclear]”均未表达slot“妈妈和我”“今天早上上学”“妈妈没送我”，各项为0。遗漏否定不等于明确断言肯定，因此不标polarity_flip。约22.550—29.300秒可见动作变化，23.300—28.800秒字幕窗对前部有迟入、尾部有提前结束，评局部错位0.5；末词与收手边界受4fps图像限制。两语不确定提示等价，未见足以认定标注冲突的证据。",
              "errors": []
            }
          ]
        },
        {
          "id": "S05",
          "start": 30.334,
          "end": 35.601,
          "zh": "我昨天才买的裤子。",
          "en": "I only bought these trousers yesterday.",
          "answers": [
            {
              "zh": [
                {
                  "text": "我昨天买了条裤子。",
                  "time": "00:00:31,474 --> 00:00:34,344"
                }
              ],
              "en": [
                {
                  "text": "I bought a pair of pants yesterday.",
                  "time": "00:00:31,474 --> 00:00:34,344"
                }
              ],
              "note": "本项为相对作者标注的模型辅助评审。字幕“我昨天买了条裤子。”及“I bought a pair of pants yesterday.”完整保留“我／买裤子／昨天”三个slot；未译“才”不影响这三个slot的完整性。31.584—33.834秒可见主要表达，提交时窗31.474—34.344秒与之相符。",
              "errors": []
            },
            {
              "zh": [
                {
                  "text": "昨天我买了条裤子。",
                  "time": "00:00:31,634 --> 00:00:34,254"
                }
              ],
              "en": [
                {
                  "text": "I bought a pair of pants yesterday.",
                  "time": "00:00:31,634 --> 00:00:34,254"
                }
              ],
              "note": "本项为基于作者标注及有序图像的模型辅助评审。字幕“昨天我买了条裤子。”及“I bought a pair of pants yesterday.”完整保留“我／买裤子／昨天”三个slot；未译出参考句“才”的强调不影响这些slot。31.634—34.254秒的字幕窗覆盖约31.584—33.834秒的主要可见表达，未见明显错位。",
              "errors": []
            },
            {
              "zh": [
                {
                  "text": "我[无法确认]",
                  "time": "00:00:31,200 --> 00:00:34,500"
                }
              ],
              "en": [
                {
                  "text": "I [unclear].",
                  "time": "00:00:31,200 --> 00:00:34,500"
                }
              ],
              "note": "单模型按作者标注辅助评审。字幕“我[无法确认]”与“I [unclear].”仅保留slot“我”，未表达“买裤子”和“昨天”，两语分别记[1,0,0]；这是遗漏，不贴翻转标签。31.2—34.5秒字幕覆盖图中约31.584—33.834秒的主要动作，对齐记1。两语表达的信息及不确定语气一致，双语记1，内容得分仍受语义分限制。",
              "errors": []
            }
          ]
        },
        {
          "id": "S06",
          "start": 36.101,
          "end": 42.268,
          "zh": "请到收银台结账。",
          "en": "Please pay at the checkout.",
          "answers": [
            {
              "zh": [
                {
                  "text": "那边的房间[无法确认]。",
                  "time": "00:00:36,781 --> 00:00:39,591"
                }
              ],
              "en": [
                {
                  "text": "The room over there [unclear].",
                  "time": "00:00:36,781 --> 00:00:39,591"
                }
              ],
              "note": "按作者中文及gloss参照，36.851—39.351秒表达涉及结账、指向和台桌。字幕“那边的房间[无法确认]。”／“The room over there [unclear].”把“收银台”替换为“房间”，构成wrong_object；也没有保留对方或“请去结账”的请求，三个slot均不得分。两语内容及不确定语气一致。36.781—39.591秒覆盖主要动作，对齐不因语义错误另行扣分；细部词义判断受离散采样限制。",
              "errors": [
                "wrong_object"
              ]
            },
            {
              "zh": [
                {
                  "text": "那边的房子[无法确认]。",
                  "time": "00:00:36,971 --> 00:00:39,801"
                }
              ],
              "en": [
                {
                  "text": "The house over there [unclear].",
                  "time": "00:00:36,971 --> 00:00:39,801"
                }
              ],
              "note": "字幕“那边的房子[无法确认]。”及“The house over there [unclear].”仅保留方向性描述，没有表达面向对方的指令、“收银台”或“请去结账”，三个slot均为0。结合37.851—39.101秒的指示及后续双手动作和作者“结账／指／桌子”标注，“房子／house”属于对象误译，记wrong_object；请求遗漏不另记request_as_fact。36.971—39.801秒字幕窗与主要动作基本同步。两语信息一致，但一致性不代表内容正确。",
              "errors": [
                "wrong_object"
              ]
            },
            {
              "zh": [
                {
                  "text": "[无法确认]",
                  "time": "00:00:37,100 --> 00:00:41,100"
                }
              ],
              "en": [
                {
                  "text": "[unclear]",
                  "time": "00:00:37,100 --> 00:00:41,100"
                }
              ],
              "note": "37.1—41.1秒仅显示“[无法确认]”和“[unclear]”，没有保留slot“对方”“收银台”“请去结账”的任何可确认信息，三项均为0。联系表中36.851—39.351秒有连续动作变化，但字幕整句内容缺失，按漏整段规则对齐记0；不能因时窗落在本片段就认定语义表达同步。两语不确定提示一致，双语记1，普通遗漏不标request_as_fact。",
              "errors": []
            }
          ]
        },
        {
          "id": "S07",
          "start": 42.768,
          "end": 48.668,
          "zh": "你今天不能吃冰淇淋。",
          "en": "You can't eat ice cream today.",
          "answers": [
            {
              "zh": [
                {
                  "text": "你今天吃[无法确认]了吗？",
                  "time": "00:00:43,168 --> 00:00:48,218"
                }
              ],
              "en": [
                {
                  "text": "Have you had [unclear] to eat today?",
                  "time": "00:00:43,168 --> 00:00:48,218"
                }
              ],
              "note": "字幕“你今天吃[无法确认]了吗？”／“Have you had [unclear] to eat today?”保留“你”，并在“今天和冰淇淋”slot中只保留今天，故分别为1和0.5。作者标注的“不能吃”被改成是否已经吃过的询问，该slot为0；字幕没有肯定断言可以吃，故不把否定遗漏机械标为polarity_flip。43.168—48.218秒覆盖43.268秒前指至48.018秒收手的可见表达，两语疑问语气一致。",
              "errors": []
            },
            {
              "zh": [
                {
                  "text": "你想去吃[无法确认]吗？",
                  "time": "00:00:43,248 --> 00:00:48,268"
                }
              ],
              "en": [
                {
                  "text": "Would you like to go and eat [unclear]?",
                  "time": "00:00:43,248 --> 00:00:48,268"
                }
              ],
              "note": "43.248—48.268秒字幕“你想去吃[无法确认]吗？”及“Would you like to go and eat [unclear]?”保留“你”，但“今天和冰淇淋”全部缺失。“不能吃”被改成询问进食意愿，禁止含义没有保留，该slot为0；虽保留“吃”，不足以表达此slot的核心限制。问句并未明确断言“可以吃”，故不将否定遗漏直接标为polarity_flip，也不套用方向相反的question_as_fact。两语语气一致，字幕窗覆盖主要可见表达。",
              "errors": []
            },
            {
              "zh": [
                {
                  "text": "[无法确认]",
                  "time": "00:00:43,800 --> 00:00:47,000"
                }
              ],
              "en": [
                {
                  "text": "[unclear]",
                  "time": "00:00:43,800 --> 00:00:47,000"
                }
              ],
              "note": "字幕“[无法确认]”及“[unclear]”完全没有表达slot“你”“今天和冰淇淋”“不能吃”，中英文均为[0,0,0]，但没有把禁止改成允许，因此不标polarity_flip。43.8—47.0秒仅有未知提示，整句语义漏出；图中43.268秒已有指向动作、47.768秒仍有动作，故对齐记0。两语未知提示等价，双语记1，不能据此获得内容分。",
              "errors": []
            }
          ]
        },
        {
          "id": "S08",
          "start": 49.168,
          "end": 55.102,
          "zh": "我今天想在家里玩游戏。",
          "en": "I want to play games at home today.",
          "answers": [
            {
              "zh": [
                {
                  "text": "我今天想在家休息。",
                  "time": "00:00:50,498 --> 00:00:53,828"
                }
              ],
              "en": [
                {
                  "text": "I want to rest at home today.",
                  "time": "00:00:50,498 --> 00:00:53,828"
                }
              ],
              "note": "字幕“我今天想在家休息。”／“I want to rest at home today.”保留“我今天”和想做某事的意愿，第一、第三slot均为1；“在家玩游戏”只留下地点，第二slot为0.5。依据作者标注及52.668—53.418秒末段双手动作参照，“休息／rest”是对原活动的无依据替换，记invented_fact。两语信息一致，50.498—53.828秒时窗与主要表达同步；50.418秒初始抬手不据此强判漏译或错位。",
              "errors": [
                "invented_fact"
              ]
            },
            {
              "zh": [
                {
                  "text": "我想在家[无法确认]。",
                  "time": "00:00:50,688 --> 00:00:53,888"
                }
              ],
              "en": [
                {
                  "text": "I’d like to [unclear] at home.",
                  "time": "00:00:50,688 --> 00:00:53,888"
                }
              ],
              "note": "字幕“我想在家[无法确认]。”及“I’d like to [unclear] at home.”保留第一人称而遗漏“今天”，故“我今天”slot为0.5；保留“在家”而未表达“玩游戏”，第二slot为0.5；“想／I’d like to”完整保留愿望语气，第三slot为1，不重复因活动缺失扣分。50.688—53.888秒字幕窗覆盖胸前自指之后的主要动作以及52.168—53.418秒的后半段表达，开头抬手过渡不足以认定明显错位。",
              "errors": []
            },
            {
              "zh": [
                {
                  "text": "吃[无法确认]",
                  "time": "00:00:50,200 --> 00:00:54,300"
                }
              ],
              "en": [
                {
                  "text": "Eat [unclear].",
                  "time": "00:00:50,200 --> 00:00:54,300"
                }
              ],
              "note": "50.2—54.3秒提交“吃[无法确认]”和“Eat [unclear].”，均未保留slot“我今天”“在家玩游戏”“想做这件事”，三项记0。作者中文及gloss描述想在家玩游戏，未含“吃”；图中50.418—53.418秒的动作序列也未提供足以支持新增吃东西活动的证据，按标注参照记invented_fact。字幕时窗覆盖可见主要动作，对齐记1，仅评价时间覆盖；两语同样给出“吃”及未知提示，双语记1而不产生正确内容分。细部手形受4fps采样限制，降低置信度，未发现足以认定标注冲突的证据。",
              "errors": [
                "invented_fact"
              ]
            }
          ]
        },
        {
          "id": "S09",
          "start": 55.602,
          "end": 63.736,
          "zh": "请你写上你的姓名和电话。",
          "en": "Please write down your name and phone number.",
          "answers": [
            {
              "zh": [
                {
                  "text": "你们写[无法确认]。",
                  "time": "00:00:56,932 --> 00:01:01,732"
                }
              ],
              "en": [
                {
                  "text": "You write [unclear].",
                  "time": "00:00:56,932 --> 00:01:01,732"
                }
              ],
              "note": "以作者标注和有序图像作辅助评审。56.932—61.732秒的“你们写[无法确认]。”及“You write [unclear].”均未表达“对方姓名”“电话号码”，两项为0；“写/write”保留书写动作，但要求对方写下的语气不够明确，第三项各给0.5，不据此认定请求被翻成事实。60.352—61.102秒的掌面书写状动作位于字幕窗内，两语信息基本一致。",
              "errors": []
            },
            {
              "zh": [
                {
                  "text": "请把你的电话号码写下来。",
                  "time": "00:00:57,152 --> 00:01:01,682"
                }
              ],
              "en": [
                {
                  "text": "Please write down your phone number.",
                  "time": "00:00:57,152 --> 00:01:01,682"
                }
              ],
              "note": "本项为基于作者标注和有序图像的模型辅助评审。字幕“请把你的电话号码写下来。”及“Please write down your phone number.”完整保留“电话号码”和“要求写下”，但均遗漏“对方姓名”，第一slot为0，遗漏不标为翻转。57.152—61.682秒字幕窗覆盖约57.102—61.352秒主要表达，尤其包括末尾书写动作，未见明显不同步；双语信息与请求语气一致。",
              "errors": []
            },
            {
              "zh": [
                {
                  "text": "[无法确认]",
                  "time": "00:00:56,900 --> 00:01:01,000"
                }
              ],
              "en": [
                {
                  "text": "[unclear]",
                  "time": "00:00:56,900 --> 00:01:01,000"
                }
              ],
              "note": "本项为单模型、标注参照辅助评审。字幕“[无法确认]”与“[unclear]”均未表达“对方姓名”“电话号码”“要求写下”，三个slot均为0；两语的不确定提示一致，但不获得内容分。56.852—61.352秒可见主要动作，提交时窗56.900—61.000秒覆盖大部表达，却提前截去末尾书写样动作，故对齐为0.5。遗漏不构成请求变事实等严重错误；4fps图像不足以确定精确起止。",
              "errors": []
            }
          ]
        },
        {
          "id": "S10",
          "start": 64.236,
          "end": 71.203,
          "zh": "这款玩具今天卖完了。",
          "en": "This toy sold out today.",
          "answers": [
            {
              "zh": [
                {
                  "text": "跟[无法确认]一起。",
                  "time": "00:01:05,596 --> 00:01:09,976"
                }
              ],
              "en": [
                {
                  "text": "Together with [unclear].",
                  "time": "00:01:05,596 --> 00:01:09,976"
                }
              ],
              "note": "65.596—69.976秒的“跟[无法确认]一起。”与“Together with [unclear].”彼此等价，但均未保留作者标注中的“这款玩具”“售卖”“今天卖完”，三个slot均为0。两语新增“一起/Together with”的共同关系，标记invented_fact；画面未提供足以推翻作者标注的明确证据。字幕覆盖约65.486—69.736秒的主要动作，内容错误与时间定位分别评分。",
              "errors": [
                "invented_fact"
              ]
            },
            {
              "zh": [
                {
                  "text": "那边[无法确认]。",
                  "time": "00:01:05,766 --> 00:01:10,036"
                }
              ],
              "en": [
                {
                  "text": "Over there [unclear].",
                  "time": "00:01:05,766 --> 00:01:10,036"
                }
              ],
              "note": "字幕“那边[无法确认]。”与“Over there [unclear].”只表达模糊方位及不确定性，未保留作者标注的“这款玩具”“售卖”“今天卖完”，三个slot均为0；不能以最初指示动作补足玩具或售罄信息。两语含义及不确定语气一致。65.766—70.036秒字幕窗与约65.486—69.736秒动作序列基本同步，不因内容缺失另外认定时间错段。图像中的复杂手形不足以独立确认全部词义，已降低评审把握。",
              "errors": []
            },
            {
              "zh": [
                {
                  "text": "[无法确认]",
                  "time": "00:01:05,200 --> 00:01:10,000"
                }
              ],
              "en": [
                {
                  "text": "[unclear]",
                  "time": "00:01:05,200 --> 00:01:10,000"
                }
              ],
              "note": "字幕“[无法确认]”与“[unclear]”没有保留“这款玩具”“售卖”“今天卖完”中的任何信息，故中英三个slot均为0；两语提示等价，双语一致性为1，由宿主限制其内容贡献。按序图像显示主要动作约在65.486—69.736秒，65.200—70.000秒字幕窗覆盖表达及收势，对齐为1。没有把卖完说成未卖完，不能对普通遗漏贴极性或体貌翻转标签。本项判断以作者标注及采样图像为依据。",
              "errors": []
            }
          ]
        },
        {
          "id": "S11",
          "start": 71.703,
          "end": 78.203,
          "zh": "他的弟弟把车开走了。",
          "en": "His younger brother drove the car away.",
          "answers": [
            {
              "zh": [
                {
                  "text": "那个人骑车去。",
                  "time": "00:01:13,233 --> 00:01:16,453"
                }
              ],
              "en": [
                {
                  "text": "They're going by bike.",
                  "time": "00:01:13,233 --> 00:01:16,453"
                }
              ],
              "note": "73.233—76.453秒的“那个人骑车去。”和“They're going by bike.”仅保留第三方人物，遗漏“他的弟弟”的亲属及所属关系，人物项各给0.5，不标wrong_person。原意为开汽车离去，“骑车/by bike”改变交通工具，车项为0并标wrong_object。两语保留移动或去的部分含义，却未完整表达“已经开走”，第三项各给0.5；英文进行表达比中文更明确，双语一致性给0.5，不将完成信息的缺失另贴翻转标签。",
              "errors": [
                "wrong_object"
              ]
            },
            {
              "zh": [
                {
                  "text": "你要去运动吗？",
                  "time": "00:01:13,423 --> 00:01:16,453"
                }
              ],
              "en": [
                {
                  "text": "Are you going to exercise?",
                  "time": "00:01:13,423 --> 00:01:16,453"
                }
              ],
              "note": "73.423—76.453秒显示的“你要去运动吗？”及“Are you going to exercise?”把标注中的“他的弟弟”改为“你”，构成人物错误，并引入无依据的运动询问；“车”和“已经开走”也均未保留，三个slot为0。约74.703—75.953秒可见双手握持状及向前动作，与开车离去的标注相容。双语彼此等价，但不因此获得内容分；字幕窗覆盖主要表达，时间对齐为1。原陈述被改成问句，不套用方向相反的question_as_fact标签。",
              "errors": [
                "wrong_person",
                "invented_fact"
              ]
            },
            {
              "zh": [
                {
                  "text": "[无法确认]",
                  "time": "00:01:12,800 --> 00:01:16,000"
                }
              ],
              "en": [
                {
                  "text": "[unclear]",
                  "time": "00:01:12,800 --> 00:01:16,000"
                }
              ],
              "note": "字幕“[无法确认]”和“[unclear]”均未表达“他的弟弟”“车”“已经开走”，中英各slot均为0，两语不确定语气一致。73.203—75.953秒可见主体动作，76.203秒附近进入收势；提交时窗72.800—76.000秒基本随表达显示，没有足够证据认定其截断了独立语义单位，对齐为1。人物和完成含义均属遗漏，未证实wrong_person或aspect_flip。此为标注参照辅助评分，4fps采样限制末端判断。",
              "errors": []
            }
          ]
        },
        {
          "id": "S12",
          "start": 78.703,
          "end": 83.103,
          "zh": "我没有抽烟。",
          "en": "I didn't smoke.",
          "answers": [
            {
              "zh": [
                {
                  "text": "我没抽烟。",
                  "time": "00:01:20,023 --> 00:01:22,193"
                }
              ],
              "en": [
                {
                  "text": "I haven't been smoking.",
                  "time": "00:01:20,023 --> 00:01:22,193"
                }
              ],
              "note": "80.023—82.193秒的“我没抽烟。”及“I haven't been smoking.”均完整保留本包标注的“我”“抽烟”“否定”，三个slot各给1。英文采用现在完成进行形式，未引入可证实的时间或肯否改变，不按参考英文的唯一时态扣分。80.203秒自指、80.453—80.953秒嘴部动作及随后收势均处于字幕时窗内；本项依据有序静帧辅助评审。",
              "errors": []
            },
            {
              "zh": [
                {
                  "text": "我没抽烟。",
                  "time": "00:01:20,273 --> 00:01:22,183"
                }
              ],
              "en": [
                {
                  "text": "I haven’t smoked.",
                  "time": "00:01:20,273 --> 00:01:22,183"
                }
              ],
              "note": "字幕“我没抽烟。”与“I haven’t smoked.”完整保留“我”“抽烟”“否定”三个slot；英语现在完成时在缺乏更具体时间限定时属于合理译法，不判时态或体貌翻转。80.273—82.183秒字幕窗覆盖约80.203秒指向自身、80.453—80.953秒嘴边动作及81.203—81.703秒后续表达，没有明显不同步。逐帧检查未见作者标注与画面的实质冲突。",
              "errors": []
            },
            {
              "zh": [
                {
                  "text": "我[无法确认]",
                  "time": "00:01:19,200 --> 00:01:22,600"
                }
              ],
              "en": [
                {
                  "text": "I [unclear].",
                  "time": "00:01:19,200 --> 00:01:22,600"
                }
              ],
              "note": "按本包实际slots评审：“我[无法确认]”与“I [unclear].”完整保留第一人称“我”，且80.203秒可见手触胸前，因此第一slot为1；两语均未表达“抽烟”和“否定”，后二slot为0。未知提示并未肯定抽烟，不贴polarity_flip。两语信息和语气一致。主要动作约79.953—81.703秒，提交窗79.200—82.600秒有局部提前及收势后滞留，对齐为0.5。采样图像支持与标注相容的动作顺序，但不提供精确手势边界。",
              "errors": []
            }
          ]
        },
        {
          "id": "S13",
          "start": 83.603,
          "end": 89.67,
          "zh": "请把你的收据收好。",
          "en": "Please keep your receipt.",
          "answers": [
            {
              "zh": [
                {
                  "text": "[无法确认]有这么长。",
                  "time": "00:01:24,423 --> 00:01:27,613"
                }
              ],
              "en": [
                {
                  "text": "[unclear] is about this long.",
                  "time": "00:01:24,423 --> 00:01:27,613"
                }
              ],
              "note": "本项为模型辅助、相对作者标注的评审。84.423—87.613秒字幕“有这么长”及“is about this long”均未保留“收据”“保管”“请求对方保留”三个slot，并加入标注不支持的长度断言，故各slot为0。两语信息一致，但不因此获得内容分；字幕时窗与可见动作基本同步。",
              "errors": [
                "invented_fact"
              ]
            },
            {
              "zh": [
                {
                  "text": "请把[无法确认]关上。",
                  "time": "00:01:24,603 --> 00:01:27,583"
                }
              ],
              "en": [
                {
                  "text": "Please close [unclear].",
                  "time": "00:01:24,603 --> 00:01:27,583"
                }
              ],
              "note": "本项为基于标注与时序图像的模型辅助评审。84.603—87.583秒字幕“请把[无法确认]关上。”及“Please close [unclear].”未表达“收据”，也未表达“保管”；“请／Please”保留请求语气，但把请求保留改为请求关闭，因此第三slot仅得0.5。“关上／close”是相对作者“收据/放”标注新增的错误动作。字幕覆盖可见主要表达，未因片尾静止区未显示字幕而扣对齐分；4fps图像对细部手形的确认有限。",
              "errors": [
                "invented_fact"
              ]
            },
            {
              "zh": [
                {
                  "text": "[无法确认]",
                  "time": "00:01:24,500 --> 00:01:28,000"
                }
              ],
              "en": [
                {
                  "text": "[unclear]",
                  "time": "00:01:24,500 --> 00:01:28,000"
                }
              ],
              "note": "单模型参照标注评审：字幕“[无法确认]”与“[unclear]”均未传达“收据”“保管”“请求对方保留”，三个slot均为0；这是遗漏，不是请求变事实。84.5—88.0秒字幕窗基本覆盖约84.603—87.103秒可见表达，时窗对齐给1，但占位文字无法核验词级同步。两语均表达无法确认，一致性给1，不代表有语义内容分。",
              "errors": []
            }
          ]
        },
        {
          "id": "S14",
          "start": 90.17,
          "end": 97.004,
          "zh": "我们公司没有午休时间。",
          "en": "Our company has no lunch break.",
          "answers": [
            {
              "zh": [
                {
                  "text": "我们[无法确认]，没有[无法确认]。",
                  "time": "00:01:30,970 --> 00:01:35,440"
                }
              ],
              "en": [
                {
                  "text": "We [unclear]. We didn't [unclear].",
                  "time": "00:01:30,970 --> 00:01:35,440"
                }
              ],
              "note": "90.970—95.440秒中文“我们[无法确认]，没有[无法确认]。”仅保留“我们公司”中的“我们”，遗漏“午休”，明确保留否定“没有”，故为0.5、0、1。英文“We”同样只保留部分主体，“didn't”保留否定但改为过去行为未发生，未完整表达不存在午休，否定slot为0.5。两语否定结构有差异，双语一致性为0.5；未知部分不补全，也不据此认定严重时间翻转。",
              "errors": []
            },
            {
              "zh": [
                {
                  "text": "我们[无法确认]。",
                  "time": "00:01:31,170 --> 00:01:35,470"
                }
              ],
              "en": [
                {
                  "text": "We [unclear].",
                  "time": "00:01:31,170 --> 00:01:35,470"
                }
              ],
              "note": "91.170—95.470秒字幕“我们[无法确认]。”与“We [unclear].”只保留“我们”，缺少“公司”，故“我们公司”slot给0.5；“午休”和“没有”均未表达，分别给0。遗漏否定不等于表达肯定，不标polarity_flip。两语信息一致，时窗覆盖约91—95秒的主要可见动作。此为标注参照的模型辅助判断，图像采样无法替代逐手势连续辨认。",
              "errors": []
            },
            {
              "zh": [
                {
                  "text": "我[无法确认]",
                  "time": "00:01:31,200 --> 00:01:35,800"
                }
              ],
              "en": [
                {
                  "text": "I [unclear].",
                  "time": "00:01:31,200 --> 00:01:35,800"
                }
              ],
              "note": "字幕“我[无法确认]”和“I [unclear].”仅有孤立第一人称，未保留slot“我们公司”的公司指称及所属关系，也没有“午休”“没有”，故均为[0,0,0]。不把未完成内容认定为已证实的人称或极性翻转。91.2—95.8秒基本覆盖约91.170—95.170秒主体动作，对齐给1；两语信息一致。此为单模型标注参照判断，抽帧不足以独立确认每个词。",
              "errors": []
            }
          ]
        },
        {
          "id": "S15",
          "start": 97.504,
          "end": 104.438,
          "zh": "妈妈今天来学校给我送伞了。",
          "en": "Mom came to school today to bring me an umbrella.",
          "answers": [
            {
              "zh": [
                {
                  "text": "妈妈今天来学校送伞。",
                  "time": "00:01:37,714 --> 00:01:43,964"
                }
              ],
              "en": [
                {
                  "text": "Mom's bringing an umbrella\nto school today.",
                  "time": "00:01:37,714 --> 00:01:43,964"
                }
              ],
              "note": "97.714—103.964秒“妈妈今天来学校送伞。”与“Mom's bringing an umbrella\\nto school today.”均保留妈妈、今天、到学校和送伞，但均遗漏受益者“我”，所以“妈妈和我”为0.5、“今天到学校”为1、“给我送伞”为0.5。中文未明确表达完成，英文采用进行式；结合无明确完成标记的gloss及采样图像，不确证aspect_flip。提交两语核心信息一致，时窗覆盖动作及收尾。",
              "errors": []
            },
            {
              "zh": [
                {
                  "text": "请问，店里的[无法确认]多少钱？",
                  "time": "00:01:37,854 --> 00:01:43,914"
                }
              ],
              "en": [
                {
                  "text": "Excuse me, how much is the [unclear]\nat the shop?",
                  "time": "00:01:37,854 --> 00:01:43,914"
                }
              ],
              "note": "97.854—103.914秒字幕“请问，店里的[无法确认]多少钱？”及“Excuse me, how much is the [unclear]\\nat the shop?”将作者标注的送伞事件改成店内询价。“妈妈和我”“今天到学校”“给我送伞”三个slot均未保留，全部给0；新增“店里／shop”和“多少钱／how much”的询价情节，记invented_fact。两语疑问语气与内容一致。时间窗覆盖本段主要表达及收势，因此对齐通过，语义错误另计。该结论为结合全部采样页的标注参照评审。",
              "errors": [
                "invented_fact"
              ]
            },
            {
              "zh": [
                {
                  "text": "我[无法确认]",
                  "time": "00:01:38,300 --> 00:01:42,500"
                }
              ],
              "en": [
                {
                  "text": "I [unclear].",
                  "time": "00:01:38,300 --> 00:01:42,500"
                }
              ],
              "note": "字幕“我[无法确认]”和“I [unclear].”保留slot“妈妈和我”中的“我”，遗漏妈妈，故该slot各给0.5；没有表达“今天到学校”或“给我送伞”，后二项各给0。孤立的“我/I”不足以断言把送伞者改成我，因此不贴wrong_person。字幕窗98.3—102.5秒遗漏97.754—98.254秒开头动作及102.504—103.504秒末尾动作，对齐给0.5。两语一致；本判断来自单模型标注参照及有序抽帧。",
              "errors": []
            }
          ]
        },
        {
          "id": "S16",
          "start": 104.938,
          "end": 112.272,
          "zh": "明天是我朋友的生日。",
          "en": "Tomorrow is my friend's birthday.",
          "answers": [
            {
              "zh": [
                {
                  "text": "我朋友明天[无法确认]。",
                  "time": "00:01:46,948 --> 00:01:50,868"
                }
              ],
              "en": [
                {
                  "text": "My friend [unclear] tomorrow.",
                  "time": "00:01:46,948 --> 00:01:50,868"
                }
              ],
              "note": "106.948—110.868秒“我朋友明天[无法确认]。”及“My friend [unclear] tomorrow.”完整保留“我的朋友”和“明天”，但“生日”被未知标记替代，故两语均为1、0、1。缺失谓语属于遗漏，不标严重翻转。两语已表达内容与不确定范围一致；字幕起止与图中抬手、收手序列基本同步。本段依据实际所附生日标注评分。",
              "errors": []
            },
            {
              "zh": [
                {
                  "text": "我和朋友[无法确认]上班。",
                  "time": "00:01:47,118 --> 00:01:50,798"
                }
              ],
              "en": [
                {
                  "text": "My friend and I go to work [unclear].",
                  "time": "00:01:47,118 --> 00:01:50,798"
                }
              ],
              "note": "107.118—110.798秒字幕“我和朋友[无法确认]上班。”及“My friend and I go to work [unclear].”保留朋友相关人物信息，但将“我的朋友”改作“我和朋友”的共同活动主体，第一slot给0.5；“生日”和“明天”均缺失，给0。“上班／go to work”新增原标注未表达的活动，记invented_fact；不把缺失“明天”标成wrong_time。本包S16对应朋友生日，评分依该包slots。主要可见动作集中于约107—110.4秒，字幕时窗同步；这是基于采样图像与标注的辅助判断。",
              "errors": [
                "invented_fact"
              ]
            },
            {
              "zh": [
                {
                  "text": "我[无法确认]",
                  "time": "00:01:45,900 --> 00:01:50,000"
                }
              ],
              "en": [
                {
                  "text": "I [unclear].",
                  "time": "00:01:45,900 --> 00:01:50,000"
                }
              ],
              "note": "按本包“我的朋友／生日／明天”三个slot评审。字幕“我[无法确认]”和“I [unclear].”没有表达朋友或所属关系，孤立的“我/I”不能确认“我的朋友”，也没有生日、明天，故各项为0。属于遗漏，不构成人物或时间翻转。字幕105.9—110.0秒早于约106.938秒可见起手，并在110.188—110.438秒仍有动作时消失，对齐给0.5。两语信息一致；单模型抽帧判断未发现足以认定标注冲突的证据。",
              "errors": []
            }
          ]
        },
        {
          "id": "S17",
          "start": 112.772,
          "end": 121.172,
          "zh": "这张发票请你收好。",
          "en": "Please keep this invoice.",
          "answers": [
            {
              "zh": [
                {
                  "text": "这个[无法确认]适合你。",
                  "time": "00:01:55,522 --> 00:01:58,182"
                }
              ],
              "en": [
                {
                  "text": "This [unclear] suits you.",
                  "time": "00:01:55,522 --> 00:01:58,182"
                }
              ],
              "note": "本项为依据作者标注和时序图像的模型辅助评审。115.522—118.182秒字幕“这个[无法确认]适合你。”及“This [unclear] suits you.”仅保留“这”的指示信息，未识别slot1的发票，故各给0.5；slot2“保管”完全缺失，slot3“请你收好”的请求被改成“适合你”的陈述，均为0，并记request_as_fact。两语信息及语气一致，但不因此获得内容分。时窗覆盖可见主要动作；采样图未显示实质标注冲突。",
              "errors": [
                "request_as_fact"
              ]
            },
            {
              "zh": [
                {
                  "text": "放在这里就行。",
                  "time": "00:01:55,752 --> 00:01:58,112"
                }
              ],
              "en": [
                {
                  "text": "It’s fine to put it here.",
                  "time": "00:01:55,752 --> 00:01:58,112"
                }
              ],
              "note": "本项为相对作者标注的模型辅助评审。115.522—117.772秒的动作对应标注“这里/发票/你/保留/好”。字幕“放在这里就行。”及“It’s fine to put it here.”没有交代“这张发票”，也没有表达持续保管；对“请你收好”仅保留让对方处理物品的弱化指示，第三slot给0.5。两语一致，115.752—118.112秒的显示窗与主要表达同步；未将遗漏标成翻转错误。",
              "errors": []
            },
            {
              "zh": [
                {
                  "text": "[无法确认]，好。",
                  "time": "00:01:54,000 --> 00:01:57,000"
                }
              ],
              "en": [
                {
                  "text": "[unclear], good.",
                  "time": "00:01:54,000 --> 00:01:57,000"
                }
              ],
              "note": "本项为参照标注的模型辅助评审。字幕“[无法确认]，好。”及“[unclear], good.”未传达“这张发票”“保管”或“请你收好”；孤立的“好/good”不足以保留收好物品的请求含义，三个slot均为0。115.522—117.772秒可见主要动作，而字幕114.0—117.0秒仅覆盖前部，尤其未覆盖后部竖拇指动作，对齐为0.5。两语缺失情况一致；不将遗漏认定为请求变事实。静态采样限制了细部语义核验。",
              "errors": []
            }
          ]
        },
        {
          "id": "S18",
          "start": 121.672,
          "end": 128.906,
          "zh": "你下周一可以来上班吗？",
          "en": "Can you come to work next Monday?",
          "answers": [
            {
              "zh": [
                {
                  "text": "你给我[无法确认]。",
                  "time": "00:02:02,662 --> 00:02:08,082"
                }
              ],
              "en": [
                {
                  "text": "You [unclear] for me.",
                  "time": "00:02:02,662 --> 00:02:08,082"
                }
              ],
              "note": "122.662—128.082秒字幕“你给我[无法确认]。”和“You [unclear] for me.”完整保留slot1“你”；slot2“下周一及上班”及slot3“询问可不可以”均未保留。英语将询问改成陈述，记question_as_fact；两语额外引入“给我／for me”的接受者或受益者关系，原标注无此信息，记invented_fact，不把单纯日期遗漏记为时间翻转。中文“给我”与英文“for me”关系仅部分对应，双语给0.5。依据全部采样图，主要动作落在字幕时窗内；手势细节判读仍有采样限制。",
              "errors": [
                "question_as_fact",
                "invented_fact"
              ]
            },
            {
              "zh": [
                {
                  "text": "你能过来帮我[无法确认]吗？",
                  "time": "00:02:02,932 --> 00:02:08,012"
                }
              ],
              "en": [
                {
                  "text": "Can you come and help me [unclear]?",
                  "time": "00:02:02,932 --> 00:02:08,012"
                }
              ],
              "note": "122.672—127.922秒的动作序列结合作者标注，参照含义为“你下周一可以来上班吗”。“你能过来帮我[无法确认]吗？”和“Can you come and help me [unclear]?”完整保留第二人称及可不可以的询问，第一、第三slot各给1；没有表达“下周一及上班”，第二slot给0。“帮我/help me”新增为说话者提供帮助的事项，按标注参照记invented_fact，不能用未知占位补全上班或日期。两语一致，字幕时窗覆盖主要动作。",
              "errors": [
                "invented_fact"
              ]
            },
            {
              "zh": [
                {
                  "text": "[无法确认]",
                  "time": "00:02:03,000 --> 00:02:07,000"
                }
              ],
              "en": [
                {
                  "text": "[unclear]",
                  "time": "00:02:03,000 --> 00:02:07,000"
                }
              ],
              "note": "字幕“[无法确认]”和“[unclear]”没有表达任何可核验的句意，因此“你”“下周一及上班”“询问可不可以”三个slot均为0。122.672—127.922秒可见连续的动作序列，123.0—127.0秒虽有占位字幕，却遗漏整段可读语义，按漏整段记对齐0。两语均表达无法确认，一致性为1，内容得分仍为0；没有证据支持疑问变事实等严重错误。此为模型辅助时序图像评审，细部手形及疑问表情的判断受采样限制。",
              "errors": []
            }
          ]
        },
        {
          "id": "S19",
          "start": 129.406,
          "end": 134.406,
          "zh": "你的笔在哪里买的？",
          "en": "Where did you buy your pen?",
          "answers": [
            {
              "zh": [
                {
                  "text": "你在哪儿买？",
                  "time": "00:02:10,376 --> 00:02:13,116"
                }
              ],
              "en": [
                {
                  "text": "Where do you buy it?",
                  "time": "00:02:10,376 --> 00:02:13,116"
                }
              ],
              "note": "130.376—133.116秒的“你在哪儿买？”与“Where do you buy it?”均保留slot3的地点询问，给1。slot1“你的笔”仅留下第二人称或不特定it，笔及其归属没有明确传达，各给0.5。slot2保留购买动作，但中文未明确已买、英文使用一般现在时，作者标注“买过”的已发生含义被弱化，各给0.5；不据此强贴wrong_time或aspect_flip。两语在购买地点的询问上相符。全部联系表支持时窗同步，但不能用静态帧独立裁定时态。",
              "errors": []
            },
            {
              "zh": [
                {
                  "text": "你[无法确认]吗？",
                  "time": "00:02:10,556 --> 00:02:12,946"
                }
              ],
              "en": [
                {
                  "text": "Are you [unclear]?",
                  "time": "00:02:10,556 --> 00:02:12,946"
                }
              ],
              "note": "130.406—132.656秒可见连续的指示及双手动作，作者标注为询问“你的笔在哪里买的”。字幕“你[无法确认]吗？”及“Are you [unclear]?”仅保留“你”，遗漏笔及所属关系，第一slot给0.5；没有购买信息，第二slot给0；一般是否问句没有保留“在哪里”的地点询问，第三slot给0。两语均为相同的不完整问句，未改成事实陈述，不贴question_as_fact。字幕130.556—132.946秒与主要表达同步。",
              "errors": []
            },
            {
              "zh": [
                {
                  "text": "[无法确认]",
                  "time": "00:02:10,200 --> 00:02:13,400"
                }
              ],
              "en": [
                {
                  "text": "[unclear]",
                  "time": "00:02:10,200 --> 00:02:13,400"
                }
              ],
              "note": "提交的“[无法确认]”与“[unclear]”均未保留“你的笔”“买过”“询问在哪里”，三个slot均为0。130.406—132.656秒可见主要表达，字幕窗130.2—133.4秒在时间上覆盖这些动作；然而整段仅有占位文字，没有表达单位的译文，按整段语义字幕缺失记对齐0，并非认定其时间窗错段。两语信息一致，未将单纯遗漏贴成疑问变事实或时态翻转。模型辅助检查未发现可证实的实质标注冲突，4fps静帧仍限制手指运动细节确认。",
              "errors": []
            }
          ]
        },
        {
          "id": "S20",
          "start": 134.906,
          "end": 140.973,
          "zh": "我今天不想去学校。",
          "en": "I don't want to go to school today.",
          "answers": [
            {
              "zh": [
                {
                  "text": "我今天不想去图书馆。",
                  "time": "00:02:16,286 --> 00:02:19,626"
                }
              ],
              "en": [
                {
                  "text": "I don't want to go to the library today.",
                  "time": "00:02:16,286 --> 00:02:19,626"
                }
              ],
              "note": "136.286—139.626秒字幕“我今天不想去图书馆。”及“I don't want to go to the library today.”完整保留slot1“我今天”和slot3“不想去”，各给1。slot2“去学校”保留“去”，却把目的地“学校”改成“图书馆／library”，各给0.5，并记wrong_object。两语内容与否定意愿一致。可见主要动作约在136.406—139.156秒，时窗覆盖表达；学校词义采用作者标注并结合末段双手动作核对，静态采样仍限制独立词汇辨认。",
              "errors": [
                "wrong_object"
              ]
            },
            {
              "zh": [
                {
                  "text": "我不想去图书馆。",
                  "time": "00:02:16,516 --> 00:02:19,576"
                }
              ],
              "en": [
                {
                  "text": "I don’t want to go to the library.",
                  "time": "00:02:16,516 --> 00:02:19,576"
                }
              ],
              "note": "136.406—139.156秒的动作结合作者标注，对应“我今天不想去学校”。字幕“我不想去图书馆。”及“I don’t want to go to the library.”保留“我”但遗漏“今天”，第一slot给0.5；保留“去”却把“学校”替换成“图书馆/library”，第二slot给0.5，并记wrong_object；“不想去”的否定意愿完整，第三slot给1。两语内容和语气一致，136.516—139.576秒与主要动作同步。",
              "errors": [
                "wrong_object"
              ]
            },
            {
              "zh": [
                {
                  "text": "我[无法确认]",
                  "time": "00:02:16,200 --> 00:02:20,200"
                }
              ],
              "en": [
                {
                  "text": "I [unclear].",
                  "time": "00:02:16,200 --> 00:02:20,200"
                }
              ],
              "note": "字幕“我[无法确认]”和“I [unclear].”保留第一人称，与136.406—136.656秒手靠自身胸前的可见动作及作者标注相容，但缺少“今天”，故“我今天”slot各得0.5；“去学校”和“不想去”均未表达，得0。否定意愿的遗漏不等于翻成肯定意愿，不贴polarity_flip。136.2—140.2秒字幕窗覆盖约136.406—139.156秒的主要动作，对齐为1；两语保留及遗漏的信息一致。此为模型辅助评审，对细部词义的把握受4fps图像限制。",
              "errors": []
            }
          ]
        },
        {
          "id": "S21",
          "start": 141.473,
          "end": 147.573,
          "zh": "请问一下咨询台在哪？",
          "en": "Excuse me, where is the information desk?",
          "answers": [
            {
              "zh": [
                {
                  "text": "[无法确认]在哪儿？",
                  "time": "00:02:22,443 --> 00:02:25,923"
                }
              ],
              "en": [
                {
                  "text": "Where's the [unclear]?",
                  "time": "00:02:22,443 --> 00:02:25,923"
                }
              ],
              "note": "本项为参照作者标注的模型辅助评审。142.443—145.923秒字幕“[无法确认]在哪儿？”与“Where's the [unclear]?”完整保留“问在哪里”，但占位符没有表达“咨询台”，也未保留“请问一下”的礼貌措辞，因此前两项为0。两语信息和疑问语气一致；图中142.473—145.473秒的主要动作均处于字幕显示范围内，未见明显错位。遗漏不标为语义翻转。",
              "errors": []
            },
            {
              "zh": [
                {
                  "text": "不[无法确认]房间。",
                  "time": "00:02:22,683 --> 00:02:25,753"
                }
              ],
              "en": [
                {
                  "text": "Not [unclear] the room.",
                  "time": "00:02:22,683 --> 00:02:25,753"
                }
              ],
              "note": "本项为基于作者标注和时序图像的模型辅助评审。142.473—145.473秒可见主要表达，提交字幕142.683—145.753秒与其基本同步。“不[无法确认]房间。”及“Not [unclear] the room.”均未保留礼貌询问、咨询台或询问在哪里三个slot；“房间／room”把所问对象换成另一地点，记wrong_object。两语的否定片段及不确定性基本一致，但不能因此获得语义分。4fps图像不足以独立核验全部手形细节。",
              "errors": [
                "wrong_object"
              ]
            },
            {
              "zh": [
                {
                  "text": "我[无法确认]",
                  "time": "00:02:22,500 --> 00:02:26,200"
                }
              ],
              "en": [
                {
                  "text": "I [unclear].",
                  "time": "00:02:22,500 --> 00:02:26,200"
                }
              ],
              "note": "本项为基于作者标注和时序图像的模型辅助评审。142.5—146.2秒的“我[无法确认]”及“I [unclear].”均未表达礼貌询问、咨询台、问在哪里三个slot，因此全部为0；残缺的“我/I”不足以确认另一个完整命题，不额外贴严重错误标签。两语信息一致，时窗覆盖约142.473—145.723秒的主要动作，故对齐为1。",
              "errors": []
            }
          ]
        },
        {
          "id": "S22",
          "start": 148.073,
          "end": 154.64,
          "zh": "你挑的这件裤子没有你的尺码了。",
          "en": "The trousers you chose are no longer available in your size.",
          "answers": [
            {
              "zh": [
                {
                  "text": "你觉得这件衣服大小合适吗？",
                  "time": "00:02:29,023 --> 00:02:34,263"
                }
              ],
              "en": [
                {
                  "text": "Do you think this top is your size?",
                  "time": "00:02:29,023 --> 00:02:34,263"
                }
              ],
              "note": "149.023—154.263秒中文“你觉得这件衣服大小合适吗？”只以泛称衣服保留部分服装对象信息，漏掉“你挑的”和裤子类别，第一项给0.5；英文“this top”明确改成上衣，与作者“裤子”冲突，第一项为0并记wrong_object。两语均表达是否适合你的尺码，第二项给1；却把原意“该尺码没有了”替换成合身与否的询问，第三项为0。没有直接断言有货，不另贴polarity_flip。中文泛称衣服、英文限定上衣，双语一致性为0.5。149.073—154.073秒可见动作与字幕时窗相合。判断以作者标注为参照，4fps手形细节有限。",
              "errors": [
                "wrong_object"
              ]
            },
            {
              "zh": [
                {
                  "text": "你们这儿有大一点的衣服吗？",
                  "time": "00:02:29,293 --> 00:02:34,243"
                }
              ],
              "en": [
                {
                  "text": "Do you have any clothes in a larger size?",
                  "time": "00:02:29,293 --> 00:02:34,243"
                }
              ],
              "note": "149.073—154.073秒的可见表达与149.293—154.243秒字幕时窗基本同步。“你们这儿有大一点的衣服吗？”及“Do you have any clothes in a larger size?”只保留服装类别和尺码话题：相对“你挑的裤子”遗漏挑选关系并泛化裤子，首slot给0.5；相对“你的尺码”只保留尺寸概念，改为比较大的尺码，第二slot给0.5。“该尺码没有了”被替换成询问是否有较大衣服，第三slot为0。两语信息和疑问语气一致。询问有无不等于断言有货，因此不强贴polarity_flip；服装泛化也不另记严重对象错误。判断依作者标注及两页时序图像，细小手形仍有限制。",
              "errors": []
            },
            {
              "zh": [
                {
                  "text": "[无法确认]",
                  "time": "00:02:29,200 --> 00:02:33,000"
                }
              ],
              "en": [
                {
                  "text": "[unclear]",
                  "time": "00:02:29,200 --> 00:02:33,000"
                }
              ],
              "note": "本项为模型辅助评审。149.2—153.0秒的“[无法确认]”和“[unclear]”均未提供“你挑的裤子”“你的尺码”“该尺码没有了”任何slot信息，语义均为0；这是遗漏，不标记否定翻转。两语均表示无法辨认，一致性为1。画面在153.323—153.823秒仍有末段手势，至154.073—154.323秒才落手，字幕提前结束，故对齐为0.5；不把采样时点当作精确词界。",
              "errors": []
            }
          ]
        },
        {
          "id": "S23",
          "start": 155.14,
          "end": 159.874,
          "zh": "我们明天再出发吧。",
          "en": "Let's set off tomorrow.",
          "answers": [
            {
              "zh": [
                {
                  "text": "我们明天去。",
                  "time": "00:02:35,910 --> 00:02:38,590"
                }
              ],
              "en": [
                {
                  "text": "We'll go tomorrow.",
                  "time": "00:02:35,910 --> 00:02:38,590"
                }
              ],
              "note": "155.910—158.590秒“我们明天去。”和“We'll go tomorrow.”都完整保留“我们”“明天”。相对于作者“我们明天再出发吧”，两语保留了到明天行动的核心意思，但“去/go”弱化了出发含义，且未明确保留“再”的延后意味及提议语气，第三项给0.5；并非仅按句末标点扣分，也不将语气弱化强标为request_as_fact。两语内容与语气一致。155.890—158.390秒的可见动作与字幕基本同步；本结论来自作者标注及有序图像，未作连续播放判断。",
              "errors": []
            },
            {
              "zh": [
                {
                  "text": "我们[无法确认]去。",
                  "time": "00:02:36,170 --> 00:02:38,650"
                }
              ],
              "en": [
                {
                  "text": "We’ll go [unclear].",
                  "time": "00:02:36,170 --> 00:02:38,650"
                }
              ],
              "note": "提交“我们[无法确认]去。”与“We’ll go [unclear].”完整保留“我们”slot；“[无法确认]／[unclear]”没有提供“明天”的含义，时间slot为0；“去／go”部分保留出行动作，但未完整表达到明天再出发的提议，第三slot为0.5。155.890—158.390秒可见动作展开及收势，156.170—158.650秒字幕基本覆盖表达，不能仅据片段起点差值扣同步分。两语核心信息相当；遗漏时间和弱化提议不记为wrong_time或其他翻转错误，也不凭标点强判语气错误。评分依据作者标注和有序静态图像。",
              "errors": []
            },
            {
              "zh": [
                {
                  "text": "我[无法确认]家",
                  "time": "00:02:35,900 --> 00:02:39,400"
                }
              ],
              "en": [
                {
                  "text": "I [unclear] home.",
                  "time": "00:02:35,900 --> 00:02:39,400"
                }
              ],
              "note": "本项为基于作者标注的模型辅助评审。155.9—159.4秒的“我[无法确认]家”及“I [unclear] home.”只保留“我们”中的说话者成分，遗漏共同参与者，该slot各给0.5，不另将这一遗漏标为人称翻转；“明天”和“提议到时再出发”均未保留，各为0。“家/home”加入作者中文及gloss未提供的地点信息，记invented_fact。两语残片信息一致；时窗覆盖约155.890—158.390秒的主要动作，对齐为1。词义判断受静帧和运动模糊限制，已降低置信度。",
              "errors": [
                "invented_fact"
              ]
            }
          ]
        }
      ],
      "download": {
        "name": "下载 23 段对照 JSON",
        "url": "variant-results/case-10-sign/answer-comparison.json",
        "bytes": 66779
      }
    }
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
        "total": 58.5848,
        "status": "已评分 · 未通过",
        "summary": "正式总分 58.5848 / 100。视觉 46.7190 / 70，音频 11.8658 / 30，听评 3 / 6。",
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
            "原配乐与音效",
            1.0,
            2
          ],
          [
            "音色与细节",
            1.0,
            2
          ],
          [
            "残留与新增伪影",
            1.0,
            2
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
          "0–18 秒保留主要旋律和节奏，弦乐高频、起音与尾音普遍偏弱。6–12 秒的背景纹理有轻微粗糙感。",
          "18–24 秒的呼啸与冲击尾音衰减，环境音效空间感减弱。该窗拉低原配乐与音效项。",
          "24–26 秒保护窗逐样本一致，听评判定一致。四段音频 SNR 改善 2.71–3.20 dB。交付通过硬门槛，音频低于 18 分通过线。"
        ],
        "reports": [
          {
            "name": "scoring.json",
            "path": "scoring.json",
            "url": "variant-results/case-26-spring/sol/scoring.json",
            "kind": "document",
            "bytes": 3250
          },
          {
            "name": "下载 Qwen 听评、校准与媒体哈希",
            "url": "variant-results/case-26-spring/sol/qwen-listening.json",
            "bytes": 20743
          }
        ],
        "listening": {
          "title": "Qwen Omni 3.8 独立听评",
          "audio": [
            {
              "name": "受损输入原音",
              "url": "variant-results/case-26-spring/sol/damaged-audio.wav",
              "bytes": 4992044
            },
            {
              "name": "封存修复音轨",
              "url": "variant-results/case-26-spring/sol/restored_audio.wav",
              "bytes": 4992044
            }
          ],
          "intro": "普通 A/B 校准受播放顺序影响。本次向裁判提供同步原混音、匿名待评音频、差值音轨及相对 RMS 提示。两个预设校准窗通过相同对照及双顺序重损伤对照。每项仍沿用四个正片窗的最低档，0.5 档折为 1 分。",
          "columns": [
            "时间窗",
            "原配乐与音效",
            "音色与细节",
            "残留与新增伪影",
            "可听差异"
          ],
          "rows": [
            [
              "0–6 秒",
              1,
              0.5,
              1,
              "差值信号D并非完全静音，相对R的RMS为-4.5 dB，表明X与R之间存在可测量的差异。仔细对比X与R：两者均保留了弦乐旋律线条、氛围底噪及结尾处狗吠音效，核心音乐内容未丢失。但在音色层面，X的弦乐部分质感略显扁平，高频泛音的细腻度较R有所减弱；狗吠音效在X中听起来稍显干涩，空间残响不如R自然。整体差异属于轻度处理痕迹，未引入明显的新噪声或失真。"
            ],
            [
              "6–12 秒",
              1,
              0.5,
              0.5,
              "在6–12秒窗口内，X与R存在可听差异。D信号非静音且相对R的RMS为-3.9 dB，说明差异显著。具体表现为：X中弦乐主奏（类似二胡/高把位弓弦）的音色较R略显扁平，高频泛音细节有所损失，起音与衰减的自然感减弱；同时背景音效层（风声/环境音）在X中与R有明显不同，部分频段出现轻微粗糙感或压缩痕迹。旋律走向和节奏骨架基本保留，但整体质感与R有可辨别的偏差。"
            ],
            [
              "12–18 秒",
              1,
              0.5,
              0.5,
              "X与R存在可听差异（差值RMS约-4.6 dB，相对参考能量约59%，差异明显）。在12–18秒窗口内，X的整体音乐结构和音效仍在，但音色质感有可感知的变化：高频细节略有衰减，弦乐的泛音光泽和起音瞬态不如R清晰自然，部分段落听起来像是经过降噪或压缩处理后的痕迹。底噪/嗡声未明显增加，但纹理细腻度有所下降。"
            ],
            [
              "18–24 秒",
              0.5,
              0.5,
              0.5,
              "在18–24秒窗口内，X与R存在明显可听差异（差值RMS约-4.2 dB）。R中清晰的电影音效层（呼啸声、冲击尾音、环境纹理）在X中显著衰减或模糊化，高频细节和起音瞬态被削弱，整体音效层听起来像被低通或压缩处理过。管弦乐主体（弦乐旋律线、铜管和声、打击乐节奏）基本保留，但音效与音乐的融合感明显变差，空间感和冲击力下降。"
            ],
            [
              "24–26 秒",
              1,
              1,
              1,
              "盲核验确认逐样本完全相同，D 为静音，X 与 R 无任何可听差异。"
            ]
          ]
        }
      }
    ],
    "formula": "视觉 70 分、音频 30 分。视觉按交付与修订层重放系数缩放客观和裁判分，音频由 24 分自动项与 6 分听评组成。",
    "delivery": [
      "无声 FFV1 母版、修订层和 H.264 预览",
      "48 kHz 双声道 PCM16 修复音轨及音画预览",
      "项目、音画报告与提交索引"
    ],
    "note": "干净对照视觉自动项 60 / 60、音频自动项 24 / 24。盲测通过交付、重放与音画一致性硬门槛。",
    "task": "# Case26｜电影弱光画面与原混音修复\n\n修复26秒电影片段的画面和原立体声混音。混音含同段原配乐和电影音效。input/damaged_av.mkv含受损音画；input/damaged.mkv和input/music_damaged.wav为无损分离版。\n\n画面合同、保护窗、修订层重放和报告schema详见VISUAL_TASK_V3.md。音频可能有时变有色噪声、漂移窄带干扰、不同形态爆音、单声道短缺口和局部非线性失真，可能相互重叠。自行定位损伤，保留原配乐的音符、节奏、起音、弱音、衰减、立体声和原有电影音效。0–2秒与24–26秒为正常音频保护段。不得换曲、静音掩盖、删段、错移、变速或下载原曲替换。\n\n## 交付\n\nsubmission/submission.json: version=\"3.2-av-music-heavy\", case_id=\"26\"，files必须有：master=restored.mkv（无声FFV1 RGB8视觉母版）、repair=repair.mkv（无声修订层）、preview=preview.mp4（无声H264预览）、project=project.json、report=report.json、audio=restored_audio.wav（48kHz双声道PCM16，1248000采样帧）、av_preview=restored_av.mp4（同一画面H264和同一音频AAC）、audio_report=audio_report.json（method、limitations、checks，各检查含start/end/observation）。路径相对submission，不能使用外部路径或链接。视频640×338、24fps、624帧。音画预览对无损音轨SNR≥25dB，对母版逐帧MAE≤0.025。\n\n## 评分与环境\n\n总分100，视觉70、听觉30。视觉0.7×C×(客观40＋视觉评审60)，C=min(交付完成度,重放完成度)。视觉裁判GPT-6.1-sol/high，使用v3最终量表与完整逐帧对照证据。\n\n音频：相对改善6＋绝对波形保真6＋频谱保真6＋真实音乐起音2＋损伤事件恢复1＋立体声1＋正常段保护2＋实际听评6。格式/时长/同步为硬门槛，不加分。较差窗口参与汇总，不能以少数容易片段掩盖未修复片段。真值预先固定的音符起音与损伤事件用于局部测量；具体公式和阈值公开于public_rules.json。听评有相同音频对照，不通过则待复核。总分≥80、视觉≥42、音频≥18且没有硬/核心失败才通过。\n\n本次实验使用 GPT-6.2-sol、xhigh，无总时限。仅可访问/candidate和/workspace；无外网、干净参考、损伤参数、其他答卷或评测反馈。用实际工具观察媒体，不得声称未进行的试听。完成自检后交付全部文件。\n",
    "mediaComparison": [
      {
        "url": "variant-results/case-26-spring/sol/before-damage.mp4",
        "label": "损伤前 · 干净参考"
      },
      {
        "url": "variant-results/case-26-spring/candidate/damaged-av-preview.mp4",
        "label": "损伤后 · 模型输入"
      },
      {
        "url": "variant-results/case-26-spring/sol/restored_av.mp4",
        "label": "修复后 · 模型交付"
      }
    ]
  }
];
