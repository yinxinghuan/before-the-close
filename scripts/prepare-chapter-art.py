"""Deterministic key removal + tight crop only. No drawing or geometry correction."""
from pathlib import Path
import json,hashlib
import numpy as np
from PIL import Image
ROOT=Path(__file__).resolve().parents[1];RUN=ROOT/'doc/chapter-expansion-20260925';OUT=RUN/'prepared';OUT.mkdir(exist_ok=True)
manifest={}
for p in sorted((RUN/'raw').glob('*.webp')):
 im=Image.open(p).convert('RGBA');a=np.array(im);rgb=a[:,:,:3].astype(int)
 # Include dark saturated key-color fringes; retain muted plum clothes and brown wood.
 keyed=(np.minimum(rgb[:,:,0],rgb[:,:,2])>30)&(rgb[:,:,1]<np.minimum(rgb[:,:,0],rgb[:,:,2])*.52)&(np.maximum(rgb[:,:,0],rgb[:,:,2])<np.minimum(rgb[:,:,0],rgb[:,:,2])*1.8)
 operations=[]
 if not p.stem.endswith('-floor') and not p.stem.startswith('portrait-') and p.stem!='poster':
  a[keyed,3]=0;im=Image.fromarray(a);bounds=im.getbbox();im=im.crop(bounds);operations=['remove explicit magenta chroma key','tight alpha crop; no deformation']
 else:bounds=(0,0,im.width,im.height)
 im.save(OUT/(p.stem+'.png'))
 r=json.loads((RUN/'requests'/(p.stem+'.json')).read_text());refs=r['request']['reference_urls']
 assert (not refs)==(r['request']['mode']=='text')
 assert len(refs)==len(r['parents'])
 for ref,parent in zip(refs,r['parents']):
  assert json.loads((RUN/'requests'/(parent+'.json')).read_text())['response']['media']['url']==ref
 assert r['sha256']==hashlib.sha256(p.read_bytes()).hexdigest()
 manifest[p.stem]={'size':[im.width,im.height],'source_sha256':r['sha256'],'source_bounds':bounds,'ratio':round(im.height/im.width,3),'mode':r['request']['mode'],'parents':r['parents'],'operations':operations,'status':'candidate'}
(OUT/'manifest.json').write_text(json.dumps(manifest,indent=2));print(json.dumps({k:v['size'] for k,v in manifest.items()}))
