export function seriesActions(head:any):any[];
export function seriesInteraction(head:any,id:string):{status:string;ordinal:number|null;prerequisite:any};
export function seriesEntries(head:any):any[];
export function seriesOffer(head:any,live?:boolean):[string,string]|null;
export function goalOffer(head:any,live?:boolean):[string,string]|null;
