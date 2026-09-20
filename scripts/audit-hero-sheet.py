#!/usr/bin/env python3
import argparse,json,sys,hashlib
from pathlib import Path
from PIL import Image

p=argparse.ArgumentParser();p.add_argument('manifest',type=Path);p.add_argument('--root',type=Path,default=Path('.'));p.add_argument('--require-accepted',action='store_true');a=p.parse_args()
errors=[]
try:m=json.loads(a.manifest.read_text())
except Exception as exc:print(f'FAIL: cannot read manifest: {exc}',file=sys.stderr);sys.exit(1)
def check(ok,msg):
 if not ok:errors.append(msg)
check(m.get('version')==2,'manifest version must be 2')
check(m.get('directions')==['down','left','right','up'],'directions must be down/left/right/up')
check(m.get('sourceService')=='AlterU Media Service','sourceService must be AlterU Media Service')
check(m.get('partialLimbReflectionAllowed') is False,'partial limb reflection must be forbidden')
if a.require_accepted:check(m.get('status')=='accepted','hero status must be accepted')
frames=m.get('frames') or [];check(len(frames)==12,'expected exactly 12 frame records')
index={(f.get('row'),f.get('column')):f for f in frames}
check(len(index)==12 and all((r,c) in index for r in range(4) for c in range(3)),'missing or duplicate frame coordinates')
for frame in frames:
 ops=frame.get('operations') or [];joined=' '.join(ops).lower()
 check(bool(frame.get('requestId')) and bool(frame.get('taskId')) and bool(frame.get('sourceSha256')),'every frame needs request/task/SHA provenance')
 check(not any(token in joined for token in ['partial','lower-body','opposite-leg','other-leg','reflect-leg']),'partial limb synthesis is forbidden')
 check(frame.get('footY') is not None and frame.get('headX') is not None,'every frame needs foot/head anchors')
for row in (0,1,3):
 if (row,0) in index and (row,2) in index:
  first,last=index[(row,0)],index[(row,2)]
  if (first.get('taskId'),first.get('sourceSha256'))==(last.get('taskId'),last.get('sourceSha256')):
   rects=[];hashes=[]
   for frame in [first,last]:
    try:
     source=a.root/frame['sourcePath'];raw=source.read_bytes();check(hashlib.sha256(raw).hexdigest()==frame['sourceSha256'],'source SHA does not match file')
     image=Image.open(source);rect=frame['sourceRect'];check(len(rect)==4 and 0<=rect[0]<rect[2]<=image.width and 0<=rect[1]<rect[3]<=image.height,'invalid source rectangle')
     digest=hashlib.sha256(image.crop(rect).tobytes()).hexdigest();check(digest==frame['sourceFrameSha256'],'source crop SHA mismatch');rects.append(rect);hashes.append(digest)
    except Exception as exc:errors.append(f'cannot verify multi-frame source: {exc}')
   check(len(rects)==2 and rects[0]!=rects[1] and len(set(hashes))==2,f'row {row} motion phases reuse the same image cell')
for column in range(3):
 if (1,column) in index and (2,column) in index:
  check('mirror-full-frame' in (index[(2,column)].get('operations') or []),f'right frame {column} must mirror the complete left frame')
visible=[f.get('visibleHeight') for f in frames if isinstance(f.get('visibleHeight'),(int,float))]
feet=[f.get('footY') for f in frames if isinstance(f.get('footY'),(int,float))]
heads=[f.get('headX') for f in frames if isinstance(f.get('headX'),(int,float))]
check(len(visible)==12 and max(visible)-min(visible)<=2,'visible height drift exceeds 2 px')
check(len(feet)==12 and max(feet)-min(feet)<=1,'foot baseline drift exceeds 1 px')
check(len(heads)==12 and max(heads)-min(heads)<=2,'head anchor drift exceeds 2 px')
sheet=m.get('sheet') or {};path=a.root/sheet.get('path','')
try:
 image=Image.open(path).convert('RGBA');check(image.size==(768,1024),'sheet must be 768x1024')
 for row in range(4):
  for column in range(3):
   cell=image.crop((column*256,row*256,(column+1)*256,(row+1)*256));box=cell.getbbox();check(box is not None,f'empty frame {row},{column}')
   if box and (row,column) in index:check(list(box)==index[(row,column)].get('bbox'),f'bbox mismatch at {row},{column}')
except Exception as exc:errors.append(f'cannot inspect sheet: {exc}')
if errors:
 for error in errors:print('FAIL: '+error,file=sys.stderr)
 sys.exit(1)
print(json.dumps({'passed':True,'status':m.get('status'),'frames':len(frames),'sheet':str(path)}))
