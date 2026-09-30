export {seriesAtlas as dynamicAtlas,seriesObjective as supplementalObjective} from './series-presentation.mjs';
import {seriesEntries,seriesEntryOpen} from './series-presentation.mjs';
export const dynamicRoomEntryOpen=h=>seriesEntries(h).some(e=>seriesEntryOpen(h,e));
