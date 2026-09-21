from PIL import Image,ImageFilter
import numpy as np,json,hashlib
from pathlib import Path
from collections import deque
root=Path('materials');out=Path('public/art')
def cut(im):
 im=im.convert('RGBA');a=np.array(im);rgb=a[:,:,:3].astype(int);bg=(rgb.min(2)>165)&((rgb.max(2)-rgb.min(2))<70);h,w=bg.shape;seen=np.zeros((h,w),bool);q=deque()
 for x in range(w):
  for y in (0,h-1):
   if bg[y,x] and not seen[y,x]:seen[y,x]=1;q.append((x,y))
 for y in range(h):
  for x in (0,w-1):
   if bg[y,x] and not seen[y,x]:seen[y,x]=1;q.append((x,y))
 while q:
  x,y=q.popleft()
  for nx,ny in ((x-1,y),(x+1,y),(x,y-1),(x,y+1)):
   if 0<=nx<w and 0<=ny<h and bg[ny,nx] and not seen[ny,nx]:seen[ny,nx]=1;q.append((nx,ny))
 a[seen,3]=0;im=Image.fromarray(a);im.putalpha(im.getchannel('A').filter(ImageFilter.MinFilter(3)));box=im.getbbox();return im.crop(box) if box else im
manifest={'version':2,'status':'accepted','sourceService':'AlterU Media Service','orientationContract':{'primary':'axis-aligned-front-B-view','accent':'maximum-one-diagonal-per-room'},'assets':[]}
for scene in ['fund','office','records','client']:
 sid=f'ny-{scene}-axis-furniture-pack-v3';im=Image.open(root/f'{sid}.png');w,h=im.size;meta=json.loads((root/f'{sid}.json').read_text())
 for i in range(4):
  rect=[i%2*w//2+10,i//2*h//2+10,(i%2+1)*w//2-10,(i//2+1)*h//2-10];tile=cut(im.crop(rect));path=out/f'{scene}-furniture-{i}.png';tile.save(path)
  manifest['assets'].append({'scene':scene,'index':i,'asset':str(path),'orientation':'diagonal-accent' if i==3 else 'axis-aligned','sourcePath':f'materials/{sid}.png','sourceRect':rect,'sourceSha256':meta['sha256'],'requestId':meta['requestId'],'taskId':meta['task']['task_id'],'dimensions':list(tile.size),'operations':['crop-source-cell','remove-connected-background']})
(out/'scene-media-assembly.json').write_text(json.dumps(manifest,indent=2))
fund=dict(manifest)
fund['assets']=[asset for asset in manifest['assets'] if asset['scene']=='fund']
(out/'fund-furniture-assembly.json').write_text(json.dumps(fund,indent=2)+'\n')
