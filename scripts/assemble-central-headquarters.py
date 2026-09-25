"""Assemble this platform run only. All transforms recorded; no historical art reads."""
from pathlib import Path
import json
from PIL import Image,ImageOps
ROOT=Path(__file__).resolve().parents[1];RUN=ROOT/'doc/platform-art-20260923';OUT=ROOT/'public/art/platform-v1';SOURCE=RUN/'prepared'
manifest=json.loads((OUT/'manifest.json').read_text());manifest.setdefault('derivedSources',{})
def load(id):return Image.open(SOURCE/(id+'.png')).convert('RGBA')
def width(im,w):return im.resize((w,round(im.height*w/im.width)),Image.Resampling.NEAREST)
def height(im,h):return im.resize((round(im.width*h/im.height),h),Image.Resampling.NEAREST)
def blank():return Image.new('RGBA',(640,640))
def tile(dst,im,x,y,w,h):
 for yy in range(y,y+h,im.height):
  for xx in range(x,x+w,im.width):dst.alpha_composite(im.crop((0,0,min(im.width,x+w-xx),min(im.height,y+h-yy))),(xx,yy))
# Same-run material: independently assemble narrow cap and tall face, no stretch.
source_wall=load('north-wall')
def wall_strip(h):
 face=height(source_wall.crop((0,110,source_wall.width,320)),h-12)
 trim=height(source_wall.crop((0,320,source_wall.width,368)),6)
 cap=height(source_wall.crop((0,84,source_wall.width,110)),6)
 out=Image.new('RGBA',(face.width,h));tile(out,cap,0,0,face.width,6);out.alpha_composite(face,(0,6));tile(out,trim,0,h-6,face.width,6);return out
wall=wall_strip(128);frontwall=wall_strip(120);side=width(load('side-wall'),8)
doors=json.loads((ROOT/'src/door-layout.json').read_text())
for scene in ['lobby','fund','study','archive','partnerroom','meeting','office','records','client','delivery','channel']:
 source=scene if scene in ['fund','office','records','client'] else 'records' if scene in ['archive','channel'] else 'office' if scene=='delivery' else 'fund'

 base=blank();tile(base,width(load(source+'-floor'),256),0,0,640,640)
 north=blank();sides=blank();front=blank();parts={}
 roomdoors={k:v for k,v in doors.items() if v['room']==scene}
 tile(north,wall,34,0,572,128)
 if scene in ['study','partnerroom']:
  window=width(load('office-window'),110)
  for x in [140,440]:north.alpha_composite(window,(x,127-window.height))
 for edge,x in [('W',26),('E',606)]:
  strip=side if edge=='W' else ImageOps.mirror(side);cursor=0
  for id,d in sorted([(k,v) for k,v in roomdoors.items() if v['side']==edge],key=lambda pair:pair[1]['y']):
   lo=d['y']-34;hi=d['y']+34
   tile(sides,strip,x,cursor,8,lo-cursor);cursor=hi
   end=wall.crop((0,0,8,8));sides.alpha_composite(end,(x,lo))
   # Threshold uses the same wall-top material and lies below the actor.
   tile(base,wall.crop((0,0,8,4)),x,lo,8,hi-lo)
   near=blank();near.alpha_composite(end,(x,hi));leaf=blank();door=width(Image.open(OUT/'side-leaf-v3.png').convert('RGBA'),48)
   if edge=='W':door=ImageOps.mirror(door)
   leaf.alpha_composite(door,(34 if edge=='W' else 606-door.width,lo-door.height))
   parts['door-'+id+'-near']=near;parts['door-'+id+'-leaf']=leaf
  tile(sides,strip,x,cursor,8,576-cursor)
 south=sorted([d for d in roomdoors.values() if d['side']=='S'],key=lambda d:d['x']);cursor=26
 for d in south:
  tile(front,frontwall,cursor,456,d['x']-26-cursor,120);cursor=d['x']+26
  # Open doorway: full upright jambs plus a separately depth-sorted open leaf.
  front.alpha_composite(frontwall.crop((0,0,6,120)),(d['x']-26,456));front.alpha_composite(frontwall.crop((0,0,6,120)),(d['x']+20,456))
 tile(front,frontwall,cursor,456,614-cursor,120)
 for d in roomdoors.values():
  if d['side']=='N':
   north.paste((0,0,0,0),(d['x']-26,48,d['x']+26,128));north.alpha_composite(wall.crop((0,0,6,80)),(d['x']-26,48));north.alpha_composite(wall.crop((0,0,6,80)),(d['x']+20,48))
 for id,d in roomdoors.items():
  if d['side'] not in ['N','S']:continue
  foot=128 if d['side']=='N' else 576
  # Reuse same-run sill material; keep it behind actor and leaf.
  tile(base,wall.crop((0,124,40,128)),d['x']-20,foot-8,40,8)
  leaf=Image.new('RGBA',(1280,640))
  for state,source_id in enumerate(['front-framed-v3','front-frame-open-v3']):
   door=width(Image.open(OUT/(source_id+'.png')).convert('RGBA'),68)
   leaf.alpha_composite(door,(state*640+d['x']-34,foot-door.height))
  parts['door-'+id+'-leaf']=leaf

 for decor,x in ([('wall-decor-0',115),('wall-decor-2',395)] if scene=='lobby' else [('wall-decor-1',80)] if scene=='office' else [('wall-decor-1',220)] if scene in ['fund','archive'] else [('wall-decor-2',220)] if scene=='meeting' else []):
  ornament=width(Image.open(OUT/(decor+'.png')).convert('RGBA'),130 if scene=='lobby' else 190)
  assert all(x+ornament.width <= d['x']-26 or x >= d['x']+26 for d in roomdoors.values() if d['side']=='N'), f'{scene}: decoration overlaps doorway'
  north.alpha_composite(ornament,(x,126-ornament.height))
 for name,im in {'base':base,'north':north,'side':sides,'front':front,**parts}.items():
  im.save(OUT/f'{scene}-{name}.png');manifest['coverage'].append(scene+'-'+name) if scene+'-'+name not in manifest['coverage'] else None;manifest['derivedSources'][scene+'-'+name]=([source+'-floor','north-wall'] if name=='base' else ['north-wall'] if name=='front' else ['side-wall','north-wall'] if name=='side' or name.endswith('-near') else (['front-framed-v3','front-frame-open-v3'] if roomdoors[name[5:-5]]['side'] in ['N','S'] else ['side-leaf-v3']) if name.endswith('-leaf') else ['north-wall']+(['office-window'] if scene in ['study','partnerroom'] else ['wall-decor-0','wall-decor-2'] if scene=='lobby' else ['wall-decor-1'] if scene in ['office','fund','archive'] else ['wall-decor-2'] if scene=='meeting' else []))

manifest['wallAssembly']={'northHeight':128,'southHeight':120,'sideThickness':8,'capHeightApprox':6,'source':'north-wall','capCrop':[0,84,source_wall.width,110],'faceCrop':[0,110,source_wall.width,320],'trimCrop':[0,320,source_wall.width,368],'trimHeight':6,'southY':[456,576],'northFoot':128,'scale':'uniform face and cap strips assembled independently'}
(OUT/'manifest.json').write_text(json.dumps(manifest,indent=2))
for ext in ['tmx','tsx']:(ROOT/f'public/map/lobby.{ext}').write_text((ROOT/f'public/map/fund.{ext}').read_text().replace('fund','lobby'))
