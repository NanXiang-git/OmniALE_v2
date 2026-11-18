# Case26 较重档 · GPT-6-luna / xhigh / 不限时

## 结果

|模型|推理|墙钟预算|视觉 /70|听觉 /30|总分 /100|
|---|---|---|---:|---:|---:|
|GPT-6.1-sol|high|60分钟|35.5940|14.1930|49.7870|
|GPT-6-luna|xhigh|不限时|25.6215|7.2789|32.9005|

Luna accepted=False。待评项：[]。
硬约束失败：["light_tile_error"]。
核心失败：["musical_content", "timbre_detail", "audible_artifacts", "restoration_quality"]。

## 配置与可比性

- 原冻结题包、输入媒体、真值、评分器均未修改；54项冻结文件与外部依赖通过哈希核验。
- Solver：gpt-6-luna，实际API返回xhigh，Codex CLI 0.163.0；不设墙钟截止、不设额外token预算。
- 实际耗时 1636.350 秒（27.27 分钟）；正常/异常退出码 0，timed_out=False。
- 禁止外网、真值访问、其他答卷与评分反馈；禁止子代理。公开题包保留原Sol/60分钟元数据，运行提示和DEADLINE.json明确覆盖为Luna不限时。
- 视觉裁判仍为GPT-6.1-sol/high，52窗原生帧对照及未核实项直接图像补充复核；音频仍为Qwen3.8-Omni-Flash真实音频、匿名A/B与同音频对照。
- 视觉70、听觉30。通过需总分≥80、视觉≥42、听觉≥18且无硬约束/核心失败。
- 两组推理强度、墙钟预算及凭据组不同；这次对比不能解释为相同算力预算下的模型能力差异。

## 运行轨迹与错误

首次启动使用Sol凭据，6次请求均404 model_not_found，无成功模型响应、无答卷；该记录保留为环境失败，不作为0分成绩。随后用既有Luna凭据在全新工作目录运行。

有效运行API请求 35 次，其中失败 0 次；完成命令 57 次，非零退出 2 次。封存 9 个文件。

轨迹显示模型曾混用频率与时间布尔掩码导致数组维度错误，随后修正；逆STFT返回值顺序错误曾造成中间音轨削波，模型自检后自行修正并重新导出。评分只使用最终封存答卷。正常退出的命令也可能包含实现错误，不能只靠退出码统计判定质量。

## 音频客观分解

客观 7.2789/24；听评三项满分各2，评分如下：

```json
{
  "automatic_scores": {
    "relative_improvement": 1.3102584655194223,
    "absolute_waveform": 0.26219160608439096,
    "spectral_fidelity": 1.2720981601932921,
    "musical_onsets": 1.4975202017289675,
    "damage_events": 0.035788148968509556,
    "stereo_preservation": 0.901091718447367,
    "normal_protection": 2.0
  },
  "listening": {
    "musical_content": {
      "rating": 0,
      "verified": true,
      "reason": "Minimum of four predeclared actual-media window ratings; protected control passed.",
      "evidence": [
        {
          "source_interval": [
            0,
            6
          ],
          "finding": "Same pattern as A: melody audible before and after a loud noise burst that masks the musical content during its duration."
        },
        {
          "source_interval": [
            6,
            12
          ],
          "finding": "The gentle piano melody of R is almost entirely buried under extreme distortion and broadband noise; core melodic content is lost or unrecognizable."
        },
        {
          "source_interval": [
            12,
            18
          ],
          "finding": "Same as A: faint melodic/rhythmic remnants are barely detectable under the overwhelming noise, but core content is severely masked."
        },
        {
          "source_interval": [
            18,
            24
          ],
          "finding": "The underlying melodic contour of R is faintly traceable through the dense reverb tail and added harmonic layers, but the core phrase structure is significantly obscured; the listener must actively extract it from the wash."
        },
        {
          "source_interval": [
            24,
            26
          ],
          "finding": "Same single piano note with identical pitch, attack, and sustain as reference R. No content lost or altered."
        }
      ]
    },
    "timbre_detail": {
      "rating": 0,
      "verified": true,
      "reason": "Minimum of four predeclared actual-media window ratings; protected control passed.",
      "evidence": [
        {
          "source_interval": [
            0,
            6
          ],
          "finding": "Timbral character of the music-box tone is obliterated during the noise burst and restored afterward, matching A's degradation profile."
        },
        {
          "source_interval": [
            6,
            12
          ],
          "finding": "R's clean, warm piano/keyboard timbre is completely obliterated by harsh clipping and digital corruption; no original timbral character survives."
        },
        {
          "source_interval": [
            12,
            18
          ],
          "finding": "Same as A: the original instrument timbre is entirely buried under the static layer; no recoverable timbral detail."
        },
        {
          "source_interval": [
            18,
            24
          ],
          "finding": "R's crisp, close-mic'd piano attack and natural string resonance are replaced by a smeared, cathedral-reverb timbre with synthetic pad/strings bleeding through. Some piano transient information survives but is heavily degraded."
        },
        {
          "source_interval": [
            24,
            26
          ],
          "finding": "Harmonic balance, resonance character, and decay profile match R without audible deviation."
        }
      ]
    },
    "audible_artifacts": {
      "rating": 0,
      "verified": true,
      "reason": "Minimum of four predeclared actual-media window ratings; protected control passed.",
      "evidence": [
        {
          "source_interval": [
            0,
            6
          ],
          "finding": "An equally loud, broadband static/noise burst corrupts the signal for ~2 s, identical in severity and character to A's artifact."
        },
        {
          "source_interval": [
            6,
            12
          ],
          "finding": "Severe clipping, heavy digital distortion, and pervasive noise floor dominate the entire segment; artifacts are not localized but total."
        },
        {
          "source_interval": [
            12,
            18
          ],
          "finding": "Same as A: pervasive severe static/hiss noise across the entire segment, representing wholesale damage to the audio signal."
        },
        {
          "source_interval": [
            18,
            24
          ],
          "finding": "Excessive reverb tail, low-frequency rumble from added layers, and a slight phasey/smearing quality constitute new defects not present in R."
        },
        {
          "source_interval": [
            24,
            26
          ],
          "finding": "No clicks, pops, clipping, compression pumping, or synthetic artifacts detected relative to R."
        }
      ]
    }
  }
}
```

## 视觉评分

```json
{
  "automatic_scores": {
    "restoration": 4.857083696789166,
    "motion_detail": 7.3555091082616135,
    "temporal": 1.6396552200818788,
    "lighting": 0.0,
    "protected": 4.0
  },
  "judge_scores": {
    "motion_evidence": 11.25,
    "restoration_quality": 0.0,
    "lighting_intent": 7.5
  },
  "metrics": {
    "master": {
      "width": 640,
      "height": 338,
      "fps": 24.0,
      "codec": "ffv1",
      "audio": []
    },
    "repair": {
      "maximum_sample_error": 1,
      "strength0_max_error": 0,
      "strength_half_max_midpoint_error": 0.5,
      "changed_channel_samples": 262497636
    },
    "preview": {
      "maximum_frame_mae": 0.011050598695874214,
      "minimum_frame_correlation": 0.9990897940784437
    },
    "frames_checked": 624,
    "block_psnr_gain_db": [
      2.103443770337974,
      1.9928659590134987,
      1.966434347225407,
      2.0323954180717307
    ],
    "motion_mae": 0.042178065729595586,
    "gradient_relative_error": 0.18722326755389374,
    "gradient_ratio": 0.9671744922222526,
    "temporal_residual": 0.023112499654406378,
    "maximum_frozen_run": 0,
    "protected_maximum_frame_mae": 0.0,
    "intent_projection_gains": [
      1.0054437366818276,
      1.0176858037379226
    ],
    "light_maximum_frame_tile_mae": 0.03683926537632942
  },
  "formal_total": 36.6022,
  "pending_judge": [],
  "critical_failures": [
    "restoration_quality"
  ]
}
```

## 解释边界

音频为原始完整器乐的受控重损伤；没有强参考修复程序证明全部损伤可恢复。听觉裁判的乐器名或人声类比不构成新增人声/替换音乐的事实证据。主观裁判存在波动，保留所有实际证据与独立零分复核；未核实项保持待定。

参见evaluation/score.json、audit.json、environment/comparability.json，以及看板的媒体对比、运行轨迹和错误分析。
