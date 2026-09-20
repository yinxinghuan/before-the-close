from pathlib import Path
import json,subprocess,sys,copy
m=json.loads(Path('public/art/hero-assembly.json').read_text());results=[]
def run(name,obj,expected):
 p=Path('_qa/'+name+'.json');p.write_text(json.dumps(obj));r=subprocess.run([sys.executable,'scripts/audit-hero-sheet.py',str(p),'--root','.'],capture_output=True,text=True);assert (r.returncode==0)==expected,(name,r.stdout,r.stderr);results.append({'case':name,'passed':True,'auditExit':r.returncode});p.unlink()
run('actual-multi-frame',m,True)
b=copy.deepcopy(m);b['frames'][2]['sourceRect']=b['frames'][0]['sourceRect'];b['frames'][2]['sourceFrameSha256']=b['frames'][0]['sourceFrameSha256'];run('same-source-cell',b,False)
b=copy.deepcopy(m);b['frames'][2]['sourceFrameSha256']='0'*64;run('forged-crop-hash',b,False)
b=copy.deepcopy(m);b['frames'][2]['operations'].append('reflect-lower-body');run('partial-reflection',b,False)
Path('_qa/hero-audit.json').write_text(json.dumps(results,indent=2));print(results)
