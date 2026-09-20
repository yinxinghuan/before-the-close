from PIL import Image,ImageFilter
import numpy as np, json, hashlib
from pathlib import Path
from collections import deque
root=Path('materials');out=Path('public/art');out.mkdir(exist_ok=True)
def cut(im):
 im=im.convert('RGBA');a=np.array(im);rgb=a[:,:,:3].astype(int);bg=(rgb.min(2)>165)&((rgb.max(2)-rgb.min(2))<65);h,w=bg.shape;visited=np.zeros((h,w),bool);q=deque()
 for x in range(w):
  for y in [0,h-1]:
   if bg[y,x]:q.append((x,y));visited[y,x]=True
 for y in range(h):
  for x in [0,w-1]:
   if bg[y,x]:q.append((x,y));visited[y,x]=True
 while q:
  x,y=q.popleft()
  for nx,ny in [(x-1,y),(x+1,y),(x,y-1),(x,y+1)]:
   if 0<=nx<w and 0<=ny<h and bg[ny,nx] and not visited[ny,nx]:visited[ny,nx]=True;q.append((nx,ny))
 a[visited,3]=0;im=Image.fromarray(a);im.putalpha(im.getchannel('A').filter(ImageFilter.MinFilter(3)));box=im.getbbox();return im.crop(box) if box else im
for id,n in [('furniture',2)]:
 im=Image.open(root/f'{id}.png');w,h=im.size
 for i in range(n*n):
  tile=im.crop((i%n*w//n+8,i//n*h//n+8,(i%n+1)*w//n-8,(i//n+1)*h//n-8));tile=cut(tile);tile.save(out/f'{id}-{i}.png')
im=Image.open(root/'floor.png');w,h=im.size
for i in range(4):im.crop((i%2*w//2+10,i//2*h//2+10,(i%2+1)*w//2-10,(i//2+1)*h//2-10)).save(out/f'floor-{i}.png')
Image.open(root/'wall.png').save(out/'wall.png')
atlas=Image.new('RGBA',(768,1024));frames=[]
for row,id in enumerate(['hero-front-v3','hero-side-v3','hero-side-v3','hero-back-v3']):
 im=Image.open(root/f'{id}.png');w,h=im.size
 for col in range(3):
  sid='hero-side-stand' if row in [1,2] and col==1 else id
  source=Image.open(root/f'{sid}.png');sw,sh=source.size
  rect=[0,0,sw,sh] if sid=='hero-side-stand' else [col*sw//3+4,4,(col+1)*sw//3-4,sh-4]
  raw=source.crop(rect);meta=json.loads((root/f'{sid}.json').read_text());tile=cut(raw)
  scale=216/tile.height;tile=tile.resize((round(tile.width*scale),216),Image.Resampling.LANCZOS)
  # Anchor by the head, not a swinging hand or foot at the outer silhouette.
  alpha=np.array(tile)[:,:,3];ys,xs=np.where(alpha[:50]>128);head=(int(xs.min())+int(xs.max()))/2 if len(xs) else tile.width/2
  cell=Image.new('RGBA',(256,256));cell.alpha_composite(tile,(round(128-head),32))
  if row==2:cell=cell.transpose(Image.Transpose.FLIP_LEFT_RIGHT)
  atlas.alpha_composite(cell,(col*256,row*256));box=cell.getbbox();a=np.array(cell)[:,:,3];ys,xs=np.where(a[32:82]>128);headX=(int(xs.min())+int(xs.max()))/2
  frames.append({'row':row,'column':col,'sourcePath':f'materials/{sid}.png','sourceRect':rect,'sourceFrameSha256':hashlib.sha256(raw.tobytes()).hexdigest(),'sourceSha256':meta['sha256'],'requestId':meta['requestId'],'taskId':meta['task']['task_id'],'operations':['crop-source-cell','remove-connected-background','scale-uniform','align-head-and-foot']+(['mirror-full-frame'] if row==2 else []),'bbox':list(box),'footY':box[3],'headX':headX,'visibleHeight':box[3]-box[1]})
atlas.save(out/'hero.png');(out/'hero-assembly.json').write_text(json.dumps({'version':2,'status':'candidate','directions':['down','left','right','up'],'sourceService':'AlterU Media Service','partialLimbReflectionAllowed':False,'sheet':{'path':'public/art/hero.png'},'frames':frames},indent=2))
# Additional platform media are processed once available; no substitute art is drawn.
for name,cols,rows in [('office-extra',2,2),('portraits',2,3)]:
 path=root/f'{"portraits-v2" if name=="portraits" else name}.png'
 if not path.exists():continue
 im=Image.open(path);w,h=im.size
 for i in range(cols*rows):
  tile=im.crop((i%cols*w//cols+6,i//cols*h//rows+6,(i%cols+1)*w//cols-6,(i//cols+1)*h//rows-6))
  if name!='portraits':tile=cut(tile)
  tile.save(out/f'{"portrait" if name=="portraits" else name}-{i}.png')
for name in ['door','window']:
 if (root/f'{name}.png').exists():cut(Image.open(root/f'{name}.png')).save(out/f'{name}.png')
ids=['partner','analyst','founder','finance','client']
if all((root/f'npc-{id}.png').exists() for id in ids):
 sheet=Image.new('RGBA',(384,2560));manifest=[]
 for n,id in enumerate(ids):
  im=Image.open(root/f'npc-{id}.png');w,h=im.size
  for facing,cellid in enumerate([0,1,1,3]):
   tile=cut(im.crop((cellid%2*w//2+6,cellid//2*h//2+6,(cellid%2+1)*w//2-6,(cellid//2+1)*h//2-6)))
   if facing==2:tile=tile.transpose(Image.Transpose.FLIP_LEFT_RIGHT)
   scale=108/tile.height;tile=tile.resize((round(tile.width*scale),108),Image.Resampling.LANCZOS)
   for col in range(3):sheet.alpha_composite(tile,(col*128+(128-tile.width)//2,(n*4+facing)*128+16))
   manifest.append({'id':id,'facing':facing,'sourceCell':cellid,'mirror':facing==2})
 sheet.save(out/'npcs.png');(out/'npc-assembly.json').write_text(json.dumps(manifest,indent=2))
if (root/'poster-title.png').exists():Image.open(root/'poster-title.png').save('public/poster.png')

for name,cols,rows,offset in [('portraits-a',2,2,0),('portraits-b',2,1,4)]:
 if not (root/f'{name}.png').exists():continue
 im=Image.open(root/f'{name}.png');w,h=im.size
 for i in range(cols*rows):im.crop((i%cols*w//cols,i//cols*h//rows,(i%cols+1)*w//cols,(i//cols+1)*h//rows)).save(out/f'portrait-{offset+i}.png')

if (root/'analyst-walk.png').exists() and (out/'npcs.png').exists():
 sheet=Image.open(out/'npcs.png');im=Image.open(root/'analyst-walk.png');w,h=im.size
 for col,source in [(0,0),(2,1)]:
  tile=cut(im.crop((source*w//2+6,6,(source+1)*w//2-6,h-6)));tile=tile.resize((round(tile.width*108/tile.height),108),Image.Resampling.LANCZOS)
  for facing in [1,2]:
   part=tile if facing==1 else tile.transpose(Image.Transpose.FLIP_LEFT_RIGHT);cell=Image.new('RGBA',(128,128));cell.alpha_composite(part,((128-part.width)//2,16));sheet.paste(cell,(col*128,(4+facing)*128))
 sheet.save(out/'npcs.png')
