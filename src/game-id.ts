export const GAME_UUID='233b6970-d7f6-4d54-bc20-4213eefc6ba5';
export const RELEASE_ID='before-the-close-public-goals-r20';
if(typeof window!=='undefined')(window as any).__GAME_UUID__='233b6970-d7f6-4d54-bc20-4213eefc6ba5';
export function getGameUuid(){return GAME_UUID}
export function getGameApiBase(){return '/'+getGameUuid()}
// Same-origin authority API; browser saves are recovery journals, not authority.
export const API_BASE=getGameApiBase();
