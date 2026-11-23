window.OMNIALE_VARIANT_RESULTS = {
  "codex": "0.171.0",
  "solver_effort": "xhigh",
  "wall_clock_limit": null,
  "visual_judge": "gpt-6.2-sol",
  "audio_judge": "qwen3.8-omni-flash",
  "audio_endpoint": "https://dashscope.aliyuncs.com/api/v1/services/aigc/multimodal-generation/generation",
  "date": "2026-11-23",
  "runs": [
    {
      "case": 31,
      "model": "gpt-6.2-sol",
      "score": 66.365,
      "threshold": 80,
      "passed": false,
      "elapsed_seconds": 1893.2452597618103,
      "verified_solver_responses": 62,
      "solver_requests": 62,
      "sealed_files_verified": 7,
      "failed_gates": [
        "text_and_speakers",
        "overlap_content",
        "per_speaker_recall",
        "overlap_duration",
        "timing_floor",
        "alignment_records",
        "critical_content@30",
        "actual_preview@210",
        "critical_content@240",
        "actual_preview@240",
        "actual_preview@0"
      ],
      "unresolved_items_or_windows": 1
    },
    {
      "case": 31,
      "model": "gpt-6-luna",
      "score": 45.519,
      "threshold": 80,
      "passed": false,
      "elapsed_seconds": 2149.179276943207,
      "verified_solver_responses": 54,
      "solver_requests": 54,
      "sealed_files_verified": 7,
      "failed_gates": [
        "text_and_speakers",
        "overlap_content",
        "per_speaker_recall",
        "overlap_duration",
        "timing_floor",
        "format_floor",
        "ass_srt_equivalence",
        "alignment_records",
        "actual_preview@0",
        "critical_content@30",
        "critical_content@150",
        "critical_content@210"
      ],
      "unresolved_items_or_windows": 2
    },
    {
      "case": 40,
      "model": "gpt-6.2-sol",
      "score": 96.7982,
      "threshold": 80,
      "passed": false,
      "elapsed_seconds": 3507.288019180298,
      "verified_solver_responses": 135,
      "solver_requests": 136,
      "sealed_files_verified": 55,
      "failed_gates": [
        "critical_H07.A_content.relation"
      ],
      "unresolved_items_or_windows": 0
    },
    {
      "case": 40,
      "model": "gpt-6-luna",
      "score": 83.8994,
      "threshold": 80,
      "passed": false,
      "elapsed_seconds": 5771.348308801651,
      "verified_solver_responses": 116,
      "solver_requests": 116,
      "sealed_files_verified": 21,
      "failed_gates": [
        "offline_rebuild",
        "critical_H05.A_content.relation",
        "critical_role.Victor.A_stable.distinct"
      ],
      "unresolved_items_or_windows": 0
    },
    {
      "case": 46,
      "model": "gpt-6.2-sol",
      "score": 68.7346,
      "threshold": 85,
      "passed": false,
      "elapsed_seconds": 1606.7432866096497,
      "verified_solver_responses": 45,
      "solver_requests": 45,
      "sealed_files_verified": 28,
      "failed_gates": [],
      "unresolved_items_or_windows": 0
    },
    {
      "case": 46,
      "model": "gpt-6-luna",
      "score": 59,
      "threshold": 85,
      "passed": false,
      "elapsed_seconds": 1136.4223988056183,
      "verified_solver_responses": 46,
      "solver_requests": 46,
      "sealed_files_verified": 23,
      "failed_gates": [
        "critical_fact"
      ],
      "unresolved_items_or_windows": 0
    }
  ]
};
