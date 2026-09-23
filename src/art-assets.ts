import sample from '../doc/platform-art-20260923/prepared/sample-manifest.json';
const trial=import.meta.env?.DEV?new URLSearchParams(location.search).get('artTrial'):null;
export const platformArtEnabled=!['legacy','actor','room'].includes(trial||'');
export const platformArtRoot='./art/platform-v1/';
export function portraitAsset(index:number,thumb=false){
 const name=`portrait-${index}${thumb?'-thumb':''}`;
 return platformArtEnabled&&(sample.coverage as string[]).includes(name)?`${platformArtRoot}${name}.png`:`./art/${name}.png`;
}
