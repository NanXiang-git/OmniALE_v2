"use strict";
const rows = document.querySelector("#sign-scores");
const display = value => typeof value === "number"
  ? value.toFixed(3).replace(/\.?0+$/, "") : "待评";
const cell = (tag, content) => {
  const element = document.createElement(tag);
  element.textContent = content;
  return element;
};
function renderSign(sign) {
  rows.replaceChildren();
  for (const run of sign) {
    const component = run.components ?? {};
    const row = document.createElement("tr");
    const label = cell("th", run.model);
    label.scope = "row";
    row.append(label);
    for (const value of [run.score, run.raw_score ?? run.score, component.meaning, component.bilingual, component.timing,
      component.readability, component.delivery, component.calibration]) {
      row.append(cell("td", display(value)));
    }
    row.append(cell("td", run.status));
    rows.append(row);
  }
  const status = document.querySelector("#sign-status");
  const complete = sign.slice(0, 3).every(run => !["运行中", "评审中", "待运行"].includes(run.status));
  status.textContent = complete ? "三组盲测已结束" : "盲测进行中";
  status.classList.add(complete ? "ready" : "pending");
}
function renderMatte(matte) {
  const status = document.querySelector("#matte-status");
  status.textContent = matte.status;
  status.classList.add(matte.raw_score == null ? "pending" : "ready");
  const list = document.createElement("div");
  list.className = "metrics";
  const details = [
    [display(matte.raw_score) + " / 100", "视觉质量"],
    [matte.cues == null ? "待评" : matte.cues + " / 2", "导播口令选择"],
    ["待核验", "Resolve 工程"]
  ];
  for (const [value, name] of details) {
    const item = document.createElement("div");
    item.className = "metric";
    item.append(cell("strong", value), cell("span", name));
    list.append(item);
  }
  document.querySelector("#matte-results").replaceChildren(list);
}
fetch("results.json", {cache: "no-cache"})
  .then(response => {
    if (!response.ok) throw new Error("results.json: " + response.status);
    return response.json();
  })
  .then(data => {
    renderSign(data.case10);
    renderMatte(data.case07);
  })
  .catch(() => {
    rows.replaceChildren();
    const row = document.createElement("tr");
    const value = cell("td", "评分数据加载失败");
    value.colSpan = 10;
    row.append(value);
    rows.append(row);
    document.querySelector("#sign-status").textContent = "加载失败";
    document.querySelector("#matte-status").textContent = "加载失败";
  });
