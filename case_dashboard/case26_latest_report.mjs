/** Export the current task and latest scored sealed submission for each model. */
import fs from 'node:fs/promises';
import {createReadStream} from 'node:fs';
import {createHash} from 'node:crypto';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const BASE = path.dirname(fileURLToPath(import.meta.url));
const SOURCE = path.resolve(BASE, '../case26_av_music_v2');
const OUT = path.join(BASE, 'dist/case26-current');
const read = async p => JSON.parse(await fs.readFile(p, 'utf8'));
const exists = async p => {try {await fs.access(p); return true;} catch {return false;}};
async function sha(p) {const h = createHash('sha256'); for await (const b of createReadStream(p)) h.update(b); return h.digest('hex');}
async function copy(source, relative) {
  const destination = path.join(OUT, relative), stat = await fs.stat(source);
  await fs.mkdir(path.dirname(destination), {recursive:true});
  const old = await fs.stat(destination).catch(() => null);
  if (!old || old.size !== stat.size || old.mtimeMs < stat.mtimeMs) {
    await fs.copyFile(source, destination);
    await fs.utimes(destination, stat.atime, stat.mtime);
  }
  return 'case26-current/' + relative;
}
async function* files(root, prefix = '') {
  for (const entry of await fs.readdir(path.join(root, prefix), {withFileTypes:true})) {
    const rel = prefix + entry.name;
    if (entry.isDirectory()) yield* files(root, rel + '/');
    else if (entry.isFile()) yield rel;
  }
}
export async function build() {
  const latest = new Map();
  for (const name of await fs.readdir(path.join(SOURCE, 'runs'))) {
    const run = path.join(SOURCE, 'runs', name), sp = path.join(run, 'environment/experiment_settings.json');
    if (!await exists(sp) || !await exists(path.join(run, 'evaluation/score.json'))) continue;
    const settings = await read(sp), score = await read(path.join(run, 'evaluation/score.json'));
    for (const attempt of await fs.readdir(path.join(run, 'sealed'))) {
      const sealed = path.join(run, 'sealed', attempt), submission = path.join(sealed, 'submission');
      if (!await exists(path.join(sealed, 'freeze.json')) || !await exists(path.join(submission, 'submission.json'))) continue;
      const manifest = await read(path.join(submission, 'submission.json'));
      let bound = true;
      for (const [key, rel] of Object.entries(manifest.files)) if (await sha(path.join(submission, rel)) !== score.submission_binding[key]) bound = false;
      if (!bound || Object.keys(manifest.files).length !== Object.keys(score.submission_binding).length) continue;
      const seal = await read(path.join(sealed, 'freeze.json')), ended = seal.host_end_unix;
      if (!latest.has(settings.model) || ended > latest.get(settings.model).ended) latest.set(settings.model, {run, settings, score, sealed, ended});
    }
  }
  if (!latest.size) throw new Error('No scored, bound submissions found');
  await fs.mkdir(OUT, {recursive:true});
  const candidate = path.join(SOURCE, 'case_26/candidate'), publicFiles = [];
  for await (const rel of files(candidate)) {
    const source = path.join(candidate, rel), name = path.basename(rel), ext = path.extname(rel);
    const kind = ['.mp4','.mkv'].includes(ext) ? 'video' : ext === '.wav' ? 'audio' : 'document';
    const item = {name, path:rel, url:await copy(source, 'candidate/' + rel), bytes:(await fs.stat(source)).size, kind};
    if (kind === 'document') item.text = await fs.readFile(source, 'utf8');
    if (name === 'damaged_av.mkv') Object.assign(item, {preview:'case26-current/media/input.mp4',meta:{width:640,height:338,duration:26,fps:'24/1'}});
    publicFiles.push(item);
  }
  await copy(path.join(SOURCE, 'dashboard/media/damaged_av.mp4'), 'media/input.mp4');
  await copy(path.join(SOURCE, 'dashboard/media/reference_av.mp4'), 'media/reference.mp4');
  const models = [];
  for (const {run,settings,score,sealed,ended} of [...latest.values()].sort((a,b) => b.ended-a.ended)) {
    const model = settings.model, key = model.replace('gpt-', '').replaceAll('.', '-');
    const audit = await read(path.join(run, 'audit.json'));
    if (!audit.integrity_passed || !audit.solver_model_and_effort_verified) throw new Error('Audit failed: ' + model);
    if (score.formal_total == null || score.pending.length) throw new Error('Incomplete grade: ' + model);
    const submission = path.join(sealed, 'submission'), manifest = await read(path.join(submission, 'submission.json')), artifacts = [];
    for await (const rel of files(submission)) artifacts.push({name:rel,bytes:(await fs.stat(path.join(submission,rel))).size,url:await copy(path.join(submission,rel),key+'/submission/'+rel)});
    const dash = await exists(path.join(run,'dashboard/trace.json')) ? path.join(run,'dashboard') : path.join(SOURCE, model === 'gpt-6-luna' ? 'dashboard/luna_xhigh' : 'dashboard');
    const media = await copy(path.join(dash, 'media/restored_browser.mp4'), key + '/preview.mp4'), links = {};
    for (const [filename,name] of [['evaluation/score.json','score'],['audit.json','audit'],['RUN_REPORT.md','report'],['environment/experiment_settings.json','settings']]) links[name] = await copy(path.join(run,filename), key+'/'+path.basename(filename));
    links.trace = await copy(path.join(dash,'trace.json'), key+'/trace.json');
    const vj = await read(path.join(run,'evaluation/visual_judge/judge.json')), aj = await read(path.join(run,'evaluation/audio_judge/judge.json'));
    models.push({key,model,effort:settings.reasoning_effort,budget:settings.wall_clock_seconds,seconds:audit.elapsed_seconds,
      ended,date:new Date((ended+8*3600)*1000).toISOString().slice(0,16).replace('T',' '),run:path.basename(run),harness:settings.harness,score,links,media,
      audio:'case26-current/'+key+'/submission/'+manifest.files.audio,artifacts,visualJudge:vj.items,audioJudge:aj.items,
      commands:audit.completed_commands ?? audit.commands,apiFailed:audit.api_failed,sealedFiles:audit.sealed_files});
  }
  const taskText = await fs.readFile(path.join(candidate,'TASK.md'),'utf8') + '\n\n## 当前看板的实验设置\n\n本页每个模型只显示最新一次有封存答卷的已评分实验。原题中的 Sol/high/60分钟是原实验配置；Luna、Astra 使用 xhigh、不限时的运行覆盖设置。各自预算、实际用时和成绩见“作答结果”。\n';
  const task = {title:'弱光画面与音乐修复',summary:'26秒弱光实拍与较重档受损音乐联合修复；保留真实动作、设计光变、音符节奏和正常片段。每个模型展示最新一次已评分实验。',
    versionLabel:'音画联合修复 v2 · 较重档',packageVersion:'3.2-av-music-heavy',directory:'case26_av_music_v2/case_26/candidate',resultKey:'task-05',experimentStatus:'completed',resultCount:models.length,
    resultSummary:models.map(m=>m.model.replace('gpt-','')+' '+m.score.formal_total.toFixed(4)).join(' · '),main:'input/damaged_av.mkv',files:publicFiles,task:taskText,contract:taskText,
    outputs:[{title:'联合修复交付与评分',text:taskText}],delivery:['restored.mkv / repair.mkv 视觉母版与修订层','restored_audio.wav 48kHz双声道','preview.mp4 / restored_av.mp4 预览','project / report / audio_report / submission JSON']};
  const payload = {case:task,models,selection:'latest_bound_scored_seal_per_model',input:'case26-current/media/input.mp4',reference:'case26-current/media/reference.mp4'};
  await fs.writeFile(path.join(OUT,'data.json'),JSON.stringify(payload,null,2),'utf8');
  await fs.writeFile(path.join(OUT,'data.js'),'window.CASE26_LATEST = '+JSON.stringify(payload).replaceAll('</','<\\/')+';\n','utf8');
  for (const name of ['integration.js','styles.css']) await fs.copyFile(path.join(BASE,'case26_current_ui',name),path.join(OUT,name));
  const index = path.join(BASE,'dist/index.html');
  let page = await fs.readFile(index,'utf8');
  page = page.replace(/\s*<script defer src="(?:case26-v3-report\/integration|case26-current\/(?:data|integration))\.js"><\/script>/g,'');
  page = page.replace(/\s*<link rel="stylesheet" href="case26-current\/styles.css">/g,'');
  page = page.replace('</head>','  <link rel="stylesheet" href="case26-current/styles.css">\n</head>');
  page = page.replace('<script defer src="app.js">','<script defer src="case26-current/data.js"></script>\n  <script defer src="case26-current/integration.js"></script>\n  <script defer src="app.js">');
  await fs.writeFile(index,page,'utf8');
  return {models:models.map(m=>m.model),scores:models.map(m=>m.score.formal_total)};
}
export const result = await build();
console.log(JSON.stringify(result));
