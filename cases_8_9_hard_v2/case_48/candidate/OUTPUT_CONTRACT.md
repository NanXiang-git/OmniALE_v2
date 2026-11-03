# 输出结构

`states.csv`中的对象ID、状态值见input/objects.json。秒数为有限非负数；最多2000行。未知状态用空单元格，不写字符串null。不得把多个对象放在同一行。

`issues.json`只允许顶层issues和controls数组。issues最多60条，controls最多16条，所有id全局唯一。示意结构如下，时刻仅说明字段，不是视频答案：

```json
{
  "issues": [{
    "id": "my_issue_1",
    "object_id": "capsule",
    "time": 10,
    "before": {"start": 8, "end": 9},
    "after": {"start": 10, "end": 11},
    "reason": "填写实际观察、变更关系及为何没有合法解释。"
  }],
  "controls": [{
    "id": "my_review_1",
    "object_id": "switch",
    "time": 20,
    "before": {"start": 18, "end": 19},
    "after": {"start": 20, "end": 21},
    "classification": "legal",
    "reason": "填写真实的允许变化依据或证据不足原因。"
  }]
}
```

before/after必须是片内有效区间，每个≤3秒；before结束不得超过time+0.2秒，after需到达定位时刻之后。允许前后证据跨很长距离，但必须在reason中说明中间的遮挡、声音或时间层。controls的classification只能legal或unresolved。每条reason为12–2000字符。

不要把控制点未知状态错误地报成确认矛盾。推测性意见可放报告，不混入issues数组。文件各不超过2MB。评测不会执行候选脚本。
