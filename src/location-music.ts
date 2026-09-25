import {areaOf,type AreaId} from './locations';import type {SceneId} from './world';
export const locationTracks:Record<AreaId,string>={northline:'./audio/music.mp3',relayops:'./audio/music-relayops.mp3',customer:'./audio/music-customer.mp3',settlement:'./audio/music-settlement.mp3'};
export function musicForScene(scene:SceneId){return locationTracks[areaOf(scene)]}
