"""Local wall-clock audit utilities; no recognition services are used."""
import datetime, json, os, subprocess, time, fcntl
from pathlib import Path

ROOT = Path('/workspace/submission')
LOG = ROOT / 'research_log.json'

def now():
    return datetime.datetime.now(datetime.timezone.utc).isoformat()

def record(kind, label, started, **details):
    with open(ROOT / '.audit.lock', 'w') as lock:
        fcntl.flock(lock, fcntl.LOCK_EX)
        _record_locked(kind, label, started, **details)

def _record_locked(kind, label, started, **details):
    data = json.loads(LOG.read_text()) if LOG.exists() else {
        'task_started_unix': json.loads(Path('/workspace/DEADLINE.json').read_text())['start_unix'],
        'deadline': None,
        'restrictions': 'No subagents, recognition models, source tracing, or media uploads. Network uses environment HTTP proxy.',
        'events': []}
    ended = time.time()
    data['events'].append(dict(kind=kind, label=label, start_unix=started,
        end_unix=ended, elapsed_seconds=round(ended-started, 3), **details))
    data['last_updated_utc'] = now()
    data['total_elapsed_seconds'] = round(ended-data['task_started_unix'],3)
    LOG.write_text(json.dumps(data, ensure_ascii=False, indent=2))

def run(label, args, **kwargs):
    started = time.time()
    result = subprocess.run(args, **kwargs)
    record('command', label, started, command=args, returncode=result.returncode)
    result.check_returncode()
    return result

if __name__ == '__main__':
    import sys
    run(sys.argv[1], sys.argv[2:])
