from pathlib import Path
from PIL import Image,ImageOps
import json,shutil
ROOT=Path(__file__).resolve().parents[1];OLD=ROOT/'doc/platform-art-20260923/prepared';NEW=ROOT/'doc/chapter-expansion-20260925/prepared';OUT=ROOT/'public/art/platform-v1'
def load(n):return Image.open(OLD/(n+'.png')).convert('RGBA')
def width(im,w):return im.resize((w,round(im.height*w/im.width)),Image.Resampling.NEAREST)
def height(im,h):return im.resize((round(im.width*h/im.height),h),Image.Resampling.NEAREST)
def blank():return Image.new('RGBA',(640,640))
def tile(dst,im,x,y,w,h):
 for yy in range(y,y+h,im.height):
  for xx in range(x,x+w,im.width):dst.alpha_composite(im.crop((0,0,min(im.width,x+w-xx),min(im.height,y+h-yy))),(xx,yy))
manifest=json.loads((OUT/'manifest.json').read_text());dims={}
for id in ['delivery-console','channel-ledger','meeting-board']:
 im=Image.open(NEW/(id+'.png'));shutil.copy2(NEW/(id+'.png'),OUT/(id+'.png'));dims[id]=list(im.size)
 if id not in manifest['coverage']:manifest['coverage'].append(id)
wall=height(load('north-wall'),64);side=width(load('side-wall'),34);door=width(load('door-white-v3'),48)
for scene,source in [('delivery','office'),('channel','records'),('meeting','fund')]:
 base=blank();tile(base,width(load(source+'-floor'),256),0,0,640,640)
 north=blank();tile(north,wall,0,24,640,64)
 if scene!='channel':
  win=width(load('office-window'),110)
  for x in [140,440]:north.alpha_composite(win,(x,87-win.height))
 sides=blank();tile(sides,side,0,24,34,588);tile(sides,ImageOps.mirror(side),606,24,34,588)
 front=blank();tile(front,wall,0,548,294,64);tile(front,wall,346,548,294,64);front.alpha_composite(door,(296,548))
 for name,im in [('base',base),('north',north),('side',sides),('front',front)]:
  im.save(OUT/f'{scene}-{name}.png')
  if f'{scene}-{name}' not in manifest['coverage']:manifest['coverage'].append(f'{scene}-{name}')
 for ext in ['tmx','tsx']:
  text=(ROOT/f'public/map/{source}.{ext}').read_text().replace(source,scene);(ROOT/f'public/map/{scene}.{ext}').write_text(text)
# Only cut the newly added northern door in original admitted layers.
for scene in ['fund','office','records']:
 im=load(scene+'-north');im.paste((0,0,0,0),(294,16,346,88));im.alpha_composite(door,(296,88-door.height));im.save(OUT/f'{scene}-north.png')
(OUT/'manifest.json').write_text(json.dumps(manifest,indent=2))
(ROOT/'src/chapter-art-dimensions.json').write_text(json.dumps(dims,indent=2))
(NEW/'assembly.json').write_text(json.dumps({'reuse':'same-game accepted walls, door, floor and secondary furniture; zero generation references','newFurniture':dims,'rooms':['delivery','channel','meeting'],'operations':['magenta key removal and tight alpha crop','uniform nearest scaling','north behind sides; south covers sides','open northern doors in fund/office/records'],'status':'pending-scene-review'},indent=2))
