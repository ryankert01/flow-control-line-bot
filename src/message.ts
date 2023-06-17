function getEvacuationMessage(suggestions: any):any {
    return {
        "type": "template",
        "altText": "this is a carousel template",
        "template": {
          "type": "carousel",
          "columns": [
            {
              "thumbnailImageUrl": "https://raw.githubusercontent.com/ryankert01/flow-control-line-bot/main/map_pics/1-1.png",
              "imageBackgroundColor": "#FFFFFF",
              "title": `推薦疏散地點(1) ${suggestions[0]}`,
              "text": "點選下方按鈕以選擇疏散地點",
              "defaultAction": {
                "type": "uri",
                "label": "選擇",
                "uri": "http://example.com/page/123"
              },
              "actions": [
                {
                  "type": "postback",
                  "label": "選擇",
                  "data": `[1] ${suggestions[0]}`
                },
              ]
            },
            {
              "thumbnailImageUrl": "https://raw.githubusercontent.com/ryankert01/flow-control-line-bot/main/map_pics/1-1.png",
              "imageBackgroundColor": "#000000",
              "title": `推薦疏散地點(2) ${suggestions[1]}`,
              "text": "點選下方按鈕以選擇疏散地點",
              "defaultAction": {
                "type": "uri",
                "label": "選擇",
                "uri": "http://example.com/page/222"
              },
              "actions": [
                {
                  "type": "postback",
                  "label": "選擇",
                  "data": `[2] ${suggestions[1]}`
                },
              ]
            },
            {
                "thumbnailImageUrl": "https://raw.githubusercontent.com/ryankert01/flow-control-line-bot/main/map_pics/1-1.png",
                "imageBackgroundColor": "#000000",
                "title": `推薦疏散地點(3) ${suggestions[2]}`,
                "text": "點選下方按鈕以選擇疏散地點",
                "defaultAction": {
                  "type": "uri",
                  "label": "選擇",
                  "uri": "http://example.com/page/222"
                },
                "actions": [
                  {
                    "type": "postback",
                    "label": "選擇",
                    "data": `[3] ${suggestions[2]}`
                  },
                ]
              }
          ],
          "imageAspectRatio": "rectangle",
          "imageSize": "cover"
        }
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
function getChoosePlaceMapMessage(prefered_place:number, choose_place_id: any):any {
    return {
        type: "text",
        text: "choose place: " + prefered_place + " " + choose_place_id + " ",
    };
}



export { getEvacuationMessage, getDangerousAreaMessage, getChoosePlaceMapMessage };
