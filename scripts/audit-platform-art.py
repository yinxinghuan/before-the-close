"""Audit provenance and shipped coverage, not aesthetic quality."""
from pathlib import Path
import json,hashlib
from collections import Counter
root=Path(__file__).resolve().parents[1];run=root/'doc/platform-art-20260923'
records={p.stem:json.loads(p.read_text()) for p in (run/'requests').glob('*.json')}
for id,r in records.items():
 assert r['response']['status']=='succeeded',id
 refs=r['request']['reference_urls'];parents=r['parents']
 assert len(refs)==len(parents),id
 assert r['request']['mode']==('edit' if parents else 'text'),id
 for url,parent in zip(refs,parents):assert parent in records and records[parent]['response']['media']['url']==url,id
 assert hashlib.sha256((run/'raw'/f'{id}.webp').read_bytes()).hexdigest()==r['sha256'],id
 visiting=set();seen=set()
 def visit(id):
  assert id not in visiting,'reference cycle'
  if id in seen:return
  visiting.add(id)
  for parent in records[id]['parents']:visit(parent)
  visiting.remove(id);seen.add(id)
 visit(id)
m=json.loads((run/'prepared/sample-manifest.json').read_text())
expected={'hero','poster'}|{f'npc-{p}' for p in ['partner','analyst','founder','finance','client']}|{f'portrait-{i}{suffix}' for i in range(5) for suffix in ['', '-thumb']}|{f'{s}-{kind}' for s in ['fund','office','records','client'] for kind in ['base','north','side','front']}|{f'{s}-furniture-{i}' for s in ['fund','office','records','client'] for i in range(6)}
for id,d in json.loads((root/'src/door-layout.json').read_text()).items():
 if d['side'] in ['E','W']:expected|={d['room']+'-door-'+id+'-'+part for part in ['near','leaf']}
assert expected==set(m['coverage']),{'missing':sorted(expected-set(m['coverage'])),'extra':sorted(set(m['coverage'])-expected)}
for name in expected:
 src=(run/'prepared'/f'{name}.png').read_bytes();dst=(root/'public/art/platform-v1'/f'{name}.png').read_bytes();assert src==dst,name
report={'requests':len(records),'modes':dict(Counter(r['request']['mode'] for r in records.values())),'models':dict(Counter(r['request']['model'] for r in records.values())),'historicalReferenceCount':0,'runtimeFiles':len(expected),'coverageMissing':[],'visualQuality':'not determined by this audit'}
(run/'audit.json').write_text(json.dumps(report,indent=2));print(json.dumps(report))
