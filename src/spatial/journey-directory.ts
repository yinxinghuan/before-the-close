export type JourneySummary={id:string;title:string;createdAt:number;updatedAt:number;progress:string}
export type JourneyDirectory={version:1;activeId:string|null;journeys:JourneySummary[]}

export function emptyJourneyDirectory():JourneyDirectory{return {version:1,activeId:null,journeys:[]}}
export function addJourney(directory:JourneyDirectory,journey:JourneySummary):JourneyDirectory{
 if(directory.journeys.some(item=>item.id===journey.id))throw new Error(`duplicate journey ${journey.id}`)
 return {...directory,activeId:journey.id,journeys:[journey,...directory.journeys]}
}
export function selectJourney(directory:JourneyDirectory,id:string):JourneyDirectory{
 if(!directory.journeys.some(item=>item.id===id))throw new Error(`unknown journey ${id}`)
 return {...directory,activeId:id}
}
export function removeJourney(directory:JourneyDirectory,id:string):JourneyDirectory{
 const journeys=directory.journeys.filter(item=>item.id!==id)
 return {...directory,journeys,activeId:directory.activeId===id?(journeys[0]?.id??null):directory.activeId}
}
