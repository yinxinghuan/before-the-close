from pathlib import Path
from PIL import Image
import json,hashlib
root=Path(__file__).resolve().parents[1];run=root/'doc/door-completion-20260925';out=root/'public/art/platform-v1';records=[]
for id in ['front-framed-v3','side-leaf-v3']:
 im=Image.open(run/'raw'/f'{id}.webp').convert('RGBA');px=im.load()
 for y in range(im.height):
  for x in range(im.width):
   r,g,b,a=px[x,y]
   if r>170 and b>140 and g<100:px[x,y]=(r,g,b,0)
 box=im.getbbox();im=im.crop(box);im.save(out/f'{id}.png')
 if id=='front-framed-v3':
  # Extract fixed frame from same image; remove only the movable panel region.
  opening=(260-box[0],238-box[1],765-box[0],817-box[1]);frame=im.copy();frame.paste((0,0,0,0),opening);frame.save(out/'front-frame-open-v3.png')
 records.append({'id':id,'bounds':box,'size':im.size,'sha256':hashlib.sha256((out/f'{id}.png').read_bytes()).hexdigest(),'operations':['magenta key','trim transparent margin']})
(run/'v3-preparation.json').write_text(json.dumps({'assets':records,'frameExtractionSourceRect':[260,238,765,817],'note':'Open frame extracted by removing panel pixels only. No shape warping.'},indent=2))
m=out/'manifest.json';d=json.loads(m.read_text());d['coverage']=[x for x in d['coverage'] if x!='front-open-leaf'];d['coverage']+= [x for x in ['front-framed-v3','side-leaf-v3','front-frame-open-v3'] if x not in d['coverage']];m.write_text(json.dumps(d,indent=2))
