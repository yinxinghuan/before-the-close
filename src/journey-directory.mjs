// Server directories are ordered by latest activity. Player-facing numbering
// must not swap merely because another journey was visited or checkpointed.
export function orderJourneys(journeys){
 return [...journeys].sort((a,b)=>b.created-a.created||a.id.localeCompare(b.id,'en'));
}
