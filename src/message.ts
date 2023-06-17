function getEvacuationMessage(suggestions: any):any {
    return {
        type: "text",
        text: `You can go to :
[1] ${suggestions[0]}
[2] ${suggestions[1]}
[3] ${suggestions[2]}`
    };
}

function getDangerousAreaMessage(dangerous_areas: any):any {
    return {
        type: "text",
        text: `You are in a dangerous area! Please avoid the following areas: ${dangerous_areas.join(', ')}
安安，您在哪裡附近呢?:
1. Taipei 101
2. Xinyi plaza
3. Taipei trade center
4. Breeze Nan Shan`
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
