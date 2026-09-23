"""Assemble this platform run only. All transforms recorded; no historical art reads."""
from pathlib import Path
import json
from PIL import Image,ImageOps
import numpy as np
ROOT=Path(__file__).resolve().parents[1];RUN=ROOT/'doc/platform-art-20260923';OUT=RUN/'prepared'
manifest={'status':'candidate','sourceManifest':'manifest.json','dimensions':{},'operations':[],'coverage':[],'derivedSources':{}}
def load(id):return Image.open(OUT/(id+'.png')).convert('RGBA')
def width(im,w):return im.resize((w,round(im.height*w/im.width)),Image.Resampling.NEAREST)
def height(im,h):return im.resize((round(im.width*h/im.height),h),Image.Resampling.NEAREST)
def blank():return Image.new('RGBA',(640,640))
def tile(dst,im,x,y,w,h):
 for yy in range(y,y+h,im.height):
  for xx in range(x,x+w,im.width):dst.alpha_composite(im.crop((0,0,min(im.width,x+w-xx),min(im.height,y+h-yy))),(xx,yy))
wall=height(load('north-wall'),64);side=width(load('side-wall'),34)
doors=json.loads((ROOT/'src/door-layout.json').read_text())
for scene in ['fund','office','records','client']:
 if not (OUT/(scene+'-floor.png')).exists():continue
 base=blank();tile(base,width(load(scene+'-floor'),256),0,0,640,640)
 north=blank();sides=blank();front=blank();parts={}
 roomdoors={k:v for k,v in doors.items() if v['room']==scene}
 tile(north,wall,0,24,640,64)
 if scene!='records' and (OUT/'office-window.png').exists():
  window=width(load('office-window'),110)
  for x in [140,440]:north.alpha_composite(window,(x,87-window.height))
 for edge,x in [('W',0),('E',606)]:
  strip=side if edge=='W' else ImageOps.mirror(side);cursor=24
  for id,d in sorted([(k,v) for k,v in roomdoors.items() if v['side']==edge],key=lambda pair:pair[1]['y']):
   lo=d['y']-34;hi=d['y']+34
   tile(sides,strip,x,cursor,34,lo-cursor);cursor=hi
   end=wall.crop((0,0,34,34));sides.alpha_composite(end,(x,lo))
   near=blank();near.alpha_composite(end,(x,hi));leaf=blank();door=width(load('door-white-v3'),48)
   if edge=='W':door=ImageOps.mirror(door)
   leaf.alpha_composite(door,(34 if edge=='W' else 606-door.width,lo-door.height))
   parts['door-'+id+'-near']=near;parts['door-'+id+'-leaf']=leaf
  tile(sides,strip,x,cursor,34,612-cursor)
 south=sorted([d for d in roomdoors.values() if d['side']=='S'],key=lambda d:d['x']);cursor=0
 for d in south:
  tile(front,wall,cursor,548,d['x']-26-cursor,64);cursor=d['x']+26
  door=width(load('door-white-v3'),48);front.alpha_composite(door,(d['x']-24,548))
 tile(front,wall,cursor,548,640-cursor,64)
 for d in roomdoors.values():
  if d['side']=='N':
   north.paste((0,0,0,0),(d['x']-26,16,d['x']+26,88));door=width(load('door-white-v3'),48);north.alpha_composite(door,(d['x']-24,88-door.height))
 for name,im in {'base':base,'north':north,'side':sides,'front':front,**parts}.items():
  im.save(OUT/f'{scene}-{name}.png');manifest['coverage'].append(scene+'-'+name);manifest['derivedSources'][scene+'-'+name]=[scene+'-floor','north-wall','side-wall','door-white-v3','office-window']
manifest['operations']+=['same-run north/side wall strips reused across rooms; uniform scale then repeat/crop','east side strip whole mirror','side walls cover north corners; south wall covers side corners','door leaves uniform width48; jamb endpoints cropped from same-run wall','floors independently generated per function, repeated at256 world units']
objects={'fund':['fund-desk','fund-meeting','fund-cabinet','fund-chair'],'office':['office-desk','office-forecast','office-shelf-v2','office-plant'],'records':['records-desk','records-cabinet-v2','records-table','records-cart'],'client':['client-desk','client-workbench','client-cabinet','client-cart']}
for scene,names in objects.items():
 for index,name in enumerate(names):
  if not (OUT/(name+'.png')).exists():continue
  im=load(name);key=f'{scene}-furniture-{index}';im.save(OUT/(key+'.png'));manifest['dimensions'][key]=list(im.size);manifest['coverage'].append(key);manifest['derivedSources'][key]=[name]
# Actor assembly only if all NINE genuinely generated poses exist.
poses={d:[f'hero-{d}-a','hero-down-idle-v3' if d=='down' else f'hero-{d}-idle',f'hero-{d}-b'] for d in ['down','left','up']}
if all((OUT/(n+'.png')).exists() for group in poses.values() for n in group):
 sheet=Image.new('RGBA',(768,1024));frames=[]
 for row,direction in enumerate(['down','left','right','up']):
  source='left' if direction=='right' else direction
  for col,id in enumerate(poses[source]):
   im=height(load(id),216)
   if direction=='right':im=ImageOps.mirror(im)
   alpha=np.array(im)[:,:,3];ys,xs=np.where(alpha[:round(im.height*.29)]>128);head=(xs.min()+xs.max())/2
   x=round(128-head);y=243-im.height
   sheet.alpha_composite(im,(col*256+x,row*256+y))
   frames.append({'direction':direction,'column':col,'source':id,'operations':['uniform height216','head-centered','sole baseline243']+(['whole-frame mirror'] if direction=='right' else [])})
 sheet.save(OUT/'hero.png');manifest['heroFrames']=frames;manifest['coverage'].append('hero')
# Stationary cast: directional stands only, no invented patrol animation.
for person in ['partner','founder','finance','client']:
 if not all((OUT/f'npc-{person}-{d}.png').exists() for d in ['down','left','up']):continue
 sheet=Image.new('RGBA',(384,512))
 for row,d in enumerate(['down','left','right','up']):
  im=height(load('npc-'+person+'-'+('left' if d=='right' else d)),108)
  if d=='right':im=ImageOps.mirror(im)
  alpha=np.array(im)[:,:,3];ys,xs=np.where(alpha[:31]>128);head=(xs.min()+xs.max())/2
  for col in range(3):sheet.alpha_composite(im,(col*128+round(64-head),row*128+122-im.height))
 sheet.save(OUT/f'npc-{person}.png');manifest['coverage'].append('npc-'+person)
 manifest[person+'Animation']='stationary NPC; directional stands, no patrol gait; right whole-frame mirror'
# Analyst patrol: all 12 source poses generated explicitly; folder prevents mirroring.
analyst={d:[f'npc-analyst-{d}-a','npc-analyst-down' if d=='down' else f'npc-analyst-{d}-idle',f'npc-analyst-{d}-b'] for d in ['down','left','right','up']}
analyst['left'][2]='npc-analyst-left-b-v2'
analyst['left'][1]='npc-analyst-left-idle-v2'
if all((OUT/(n+'.png')).exists() for group in analyst.values() for n in group):
 sheet=Image.new('RGBA',(384,512));frames=[]
 for row,(direction,names) in enumerate(analyst.items()):
  for col,id in enumerate(names):
   im=height(load(id),108)
   alpha=np.array(im)[:,:,3];ys,xs=np.where(alpha[:31]>128);head=(xs.min()+xs.max())/2
   sheet.alpha_composite(im,(col*128+round(64-head),row*128+122-im.height))
   frames.append({'direction':direction,'column':col,'source':id,'operations':['uniform height108','head-centered','sole baseline122']})
 sheet.save(OUT/'npc-analyst.png');manifest['coverage'].append('npc-analyst');manifest['analystFrames']=frames
for scene in ['fund','office','records','client']:
 for index in [4,5]:
  key=f'{scene}-furniture-{index}';im=load('office-chair');im.save(OUT/(key+'.png'));manifest['dimensions'][key]=list(im.size);manifest['coverage'].append(key);manifest['derivedSources'][key]=['office-chair']
for i in range(5):
 name=f'portrait-{i}'
 if not (OUT/(name+'.png')).exists():continue
 source='portrait-0-v2' if i==0 else name
 im=load(source);im.save(OUT/(name+'.png'));manifest['coverage'].append(name);manifest['derivedSources'][name]=[source]
 im=im.resize((128,128),Image.Resampling.LANCZOS);im.save(OUT/(name+'-thumb.png'));manifest['coverage'].append(name+'-thumb')
if (OUT/'poster-release.png').exists():
 load('poster-release').save(OUT/'poster.png');manifest['coverage'].append('poster');manifest['derivedSources']['poster']=['poster-release']
(OUT/'sample-manifest.json').write_text(json.dumps(manifest,indent=2));print(manifest['coverage'])

# Install only this run's explicit runtime coverage; old files remain available for rollback.
import shutil
public=ROOT/'public/art/platform-v1';public.mkdir(parents=True,exist_ok=True)
for name in manifest['coverage']:shutil.copy2(OUT/(name+'.png'),public/(name+'.png'))
shutil.copy2(OUT/'sample-manifest.json',public/'manifest.json')
