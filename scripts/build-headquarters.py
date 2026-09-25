"""Assemble admitted same-game platform assets; no image generation or repainting."""
from pathlib import Path
from PIL import Image,ImageOps
import json
R=Path(__file__).resolve().parents[1];O=R/'public/art/platform-v1';S=R/'doc/platform-art-20260923/prepared'
def load(n):return Image.open(S/(n+'.png')).convert('RGBA')
def width(im,w):return im.resize((w,round(im.height*w/im.width)),Image.Resampling.NEAREST)
def tile(dst,im,x,y,w,h):
 for yy in range(y,y+h,im.height):
  for xx in range(x,x+w,im.width):dst.alpha_composite(im.crop((0,0,min(im.width,x+w-xx),min(im.height,y+h-yy))),(xx,yy))
def blank():return Image.new('RGBA',(640,640))
wall=load('north-wall');wall=wall.resize((round(wall.width*64/wall.height),64),Image.Resampling.NEAREST);side=width(load('side-wall'),34);door=width(load('door-white-v3'),48)
manifest=json.loads((O/'manifest.json').read_text());doors=json.loads((R/'src/door-layout.json').read_text())
for scene,source in [('study','fund'),('archive','records'),('partnerroom','fund')]:
 layers={k:blank() for k in ['base','north','side','front']};tile(layers['base'],width(load(source+'-floor'),256),0,0,640,640)
 tile(layers['north'],wall,0,24,640,64);tile(layers['front'],wall,0,548,640,64)
 tile(layers['side'],side,0,24,34,588);tile(layers['side'],ImageOps.mirror(side),606,24,34,588)
 for d in doors.values():
  if d['room']!=scene:continue
  if d['side']=='N':layers['north'].paste((0,0,0,0),(294,16,346,88));layers['north'].alpha_composite(door,(296,88-door.height))
  if d['side']=='S':layers['front'].paste((0,0,0,0),(294,548,346,640));layers['front'].alpha_composite(door,(296,548))
 for k,im in layers.items():
  im.save(O/f'{scene}-{k}.png')
  if f'{scene}-{k}' not in manifest['coverage']:manifest['coverage'].append(f'{scene}-{k}')
 for ext in ['tmx','tsx']:(R/f'public/map/{scene}.{ext}').write_text((R/f'public/map/{source}.{ext}').read_text().replace(source,scene))
# Cut only the newly defined apertures in the existing admitted modular layers.
for scene,layer,y in [('fund','front',548),('meeting','north',88)]:
 im=Image.open(O/f'{scene}-{layer}.png').convert('RGBA');im.paste((0,0,0,0),(294,548 if y==548 else 16,346,640 if y==548 else 88));im.alpha_composite(door,(296,y if y==548 else y-door.height));im.save(O/f'{scene}-{layer}.png')
(O/'manifest.json').write_text(json.dumps(manifest,indent=2))
(R/'doc/headquarters-art.json').write_text(json.dumps({'source':'same-game platform-generated accepted assets','referencesSentToModel':[],'newGeneration':False,'operations':['nearest uniform scale','tile existing floor and wall','retain north behind side / south over side','door aperture alpha mask','reuse independent admitted furniture'],'rooms':['study','archive','partnerroom']},indent=2))
