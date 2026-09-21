export const GAME_UUID='233b6970-d7f6-4d54-bc20-4213eefc6ba5';
export const RELEASE_ID='before-the-close-rpgjs-r7';
if(typeof window!=='undefined')(window as any).__GAME_UUID__='233b6970-d7f6-4d54-bc20-4213eefc6ba5';
export function getGameUuid(){return GAME_UUID}
export function getGameApiBase(){return '/'+getGameUuid()}
// Reserved for same-worker diagnostics; gameplay has no network persistence.
export const API_BASE=getGameApiBase();
