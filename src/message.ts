function getEvacuationMessage(suggestions: any):any {
    return {
        type: "text",
        text: `You can go to :
[1] ${suggestions[0]}
[2] ${suggestions[1]}
[3] ${suggestions[2]}`};
}

function getDangerousAreaMessage(dangerous_areas: any):any {
    return {
        type: "text",
        text: `You are in a dangerous area! Please avoid the following areas: ${dangerous_areas.join(', ')}
安安，您在哪裡附近呢?:
1. metro-entry-1
2. metro-entry-2
3. bus-station-1
4. bus-station-2`
      };
}

// choose_place_id is the id of the place that user choose
function getChoosePlaceMap(choose_place_id: any):any {
    return {
        type: "text",
        text: "choose place",
        };
}



export { getEvacuationMessage, getDangerousAreaMessage, getChoosePlaceMap };