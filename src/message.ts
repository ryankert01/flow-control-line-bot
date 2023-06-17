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

const images = [
    'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/Tower_of_Taipei_101%28cropped%29.jpg/250px-Tower_of_Taipei_101%28cropped%29.jpg',
    'https://content.shopback.com/tw/wp-content/uploads/2020/10/16151231/xingyi-shopping.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Taipei_World_Trade_Center_International_Trade_Building_20090617.jpg/1200px-Taipei_World_Trade_Center_International_Trade_Building_20090617.jpg',
    'https://cc.tvbs.com.tw/img/program/upload/2019/01/08/20190108174637-05aeede7.jpg',
  ];
  
const locations = [
    'Taipei 101', 
    'Xinyi plaza', 
    'Taipei trade center', 
    'Breeze Nan Shan'
];
function getDangerousAreaMessage(dangerous_areas: any):any {

    return{
        "type": "imagemap",
        "baseUrl": "https://example.com/bot/images/rm001",
        "altText": "This is an imagemap",
        "baseSize": {
          "width": 1040,
          "height": 1040
        },
        "video": {
          "originalContentUrl": "https://example.com/video.mp4",
          "previewImageUrl": "https://example.com/video_preview.jpg",
          "area": {
            "x": 0,
            "y": 0,
            "width": 1040,
            "height": 585
          },
          "externalLink": {
            "linkUri": "https://example.com/see_more.html",
            "label": "See More"
          }
        },
        "actions": [
          {
            "type": "uri",
            "linkUri": "https://example.com/",
            "area": {
              "x": 0,
              "y": 586,
              "width": 520,
              "height": 454
            }
          },
          {
            "type": "message",
            "text": "Hello",
            "area": {
              "x": 520,
              "y": 586,
              "width": 520,
              "height": 454
            }
          }
        ]
      }

    
    /*return {
        type: "text",
        text: `You are in a dangerous area! Please avoid the following areas: ${dangerous_areas.join(', ')}
安安，您在哪裡附近呢?:
1. Taipei 101
2. Xinyi plaza
3. Taipei trade center
4. Breeze Nan Shan`
     };*/
}

// choose_place_id is the id of the place that user choose
function getChoosePlaceMapMessage(prefered_place:number, choose_place_id: any):any {
    return {
        type: "text",
        text: "your chosen place: " + prefered_place + " " + choose_place_id + " ",
    };
}



export { getEvacuationMessage, getDangerousAreaMessage, getChoosePlaceMapMessage };
