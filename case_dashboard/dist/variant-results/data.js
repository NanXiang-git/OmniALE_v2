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
  ],
  "withdrawn_cases": [
    {
      "case": 31,
      "reason": "The earlier variant reused the original AMI IS1009a session and participants."
    }
  ]
};
