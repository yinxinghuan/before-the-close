from pathlib import Path
import subprocess,json,hashlib
R=Path(__file__).resolve().parents[1];D=R/'doc/location-music-20260925';rows=[]
for name in ['relayops','customer','settlement']:
 source=D/'raw'/f'{name}.mp3';out=R/'public/audio'/f'music-{name}.mp3'
 subprocess.run(['ffmpeg','-y','-hide_banner','-loglevel','error','-i',str(source),'-af','loudnorm=I=-20:TP=-2:LRA=7,afade=t=in:d=0.4,afade=t=out:st=43.8:d=1.2','-ar','44100','-ac','2','-c:a','libmp3lame','-b:a','160k',str(out)],check=True)
 probe=json.loads(subprocess.check_output(['ffprobe','-v','quiet','-show_format','-show_streams','-of','json',str(out)]));measure=subprocess.run(['ffmpeg','-hide_banner','-i',str(out),'-af','loudnorm=I=-20:TP=-2:LRA=7:print_format=json','-f','null','-'],capture_output=True,text=True,check=True);stats=json.JSONDecoder().raw_decode(measure.stderr[measure.stderr.rfind('{'):])[0];rows.append({'id':name,'duration':float(probe['format']['duration']),'sampleRate':probe['streams'][0]['sample_rate'],'channels':probe['streams'][0]['channels'],'sha256':hashlib.sha256(out.read_bytes()).hexdigest(),'stats':stats,'operations':['loudness normalization -20 LUFS / -2 dBTP','0.4s fade-in, 1.2s fade-out'],'listening':'pending human review'})
(D/'analysis.json').write_text(json.dumps(rows,indent=2));print(json.dumps(rows,indent=2))
