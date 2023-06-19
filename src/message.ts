function getEvacuationMessage(suggestions: any):any {
  let evac_image: string[] = [""];

  for(var i = 0 ; i < 3 ; i++){
    switch(suggestions[i]){
      case "台北101/世貿捷運站":{
        evac_image.push("https://github.com/ryankert01/flow-control-line-bot/blob/main/map_pics/101%20MRT%20station.png");// station picture url
        break;
      }
      case "台北君悅酒店巴士站":{
        evac_image.push("https://github.com/ryankert01/flow-control-line-bot/blob/main/map_pics/%E5%90%9B%E6%82%85%E9%85%92%E5%BA%97%E5%B7%B4%E5%A3%AB%E7%AB%99.png");
        break;
      }
      case "101國際購物中心公車站":{
        evac_image.push("https://github.com/ryankert01/flow-control-line-bot/blob/main/map_pics/101%E5%9C%8B%E9%9A%9B%E8%B3%BC%E7%89%A9%E4%B8%AD%E5%BF%83.png");
        break;
      }
      case "台北101公車站":{
        evac_image.push("https://github.com/ryankert01/flow-control-line-bot/blob/main/map_pics/%E5%8F%B0%E5%8C%97101%E5%85%AC%E8%BB%8A%E7%AB%99.png");
        break;
      }
      case "象山捷運站":{
        evac_image.push("https://github.com/ryankert01/flow-control-line-bot/blob/main/map_pics/%E8%B1%A1%E5%B1%B1%E6%8D%B7%E9%81%8B%E7%AB%99.png");
        break;
      }
      case "世貿中心(莊敬)公車":{
        evac_image.push("https://github.com/ryankert01/flow-control-line-bot/blob/main/map_pics/%E4%B8%96%E8%B2%BF%E4%B8%AD%E5%BF%83%E8%8E%8A%E6%95%AC%E5%85%AC%E8%BB%8A.png");// station picture url
        break;
      }
      case "市政府捷運站":{
        evac_image.push("https://github.com/ryankert01/flow-control-line-bot/blob/main/map_pics/%E5%B8%82%E6%94%BF%E5%BA%9C%E6%8D%B7%E9%81%8B%E7%AB%99.png");
        break;
      }
      case "興雅國中公車站":{
        evac_image.push("https://github.com/ryankert01/flow-control-line-bot/blob/main/map_pics/%E8%88%88%E9%9B%85%E5%9C%8B%E4%B8%AD%E5%85%AC%E8%BB%8A%E7%AB%99.png");
        break;
      }
      case "世貿中心(基隆路)公車站":{
        evac_image.push("https://github.com/ryankert01/flow-control-line-bot/blob/main/map_pics/%E4%B8%96%E8%B2%BF%E5%9F%BA%E9%9A%86%E8%B7%AF%E5%85%AC%E8%BB%8A%E7%AB%99.png");
        break;
      }
      case "松壽路口公車站":{
        evac_image.push("https://github.com/ryankert01/flow-control-line-bot/blob/main/map_pics/%E6%9D%BE%E5%A3%BD%E8%B7%AF%E5%8F%A3%E5%85%AC%E8%BB%8A%E7%AB%99.png");
        break;
      }
      case "YouBike信義廣場":{
        evac_image.push("https://github.com/ryankert01/flow-control-line-bot/blob/main/map_pics/Youbike%E4%BF%A1%E7%BE%A9%E5%BB%A3%E5%A0%B4.png");
        break;
      }
    }
  }
  return {
      "type": "template",
      "altText": "請選擇一個疏散地點",
      "template": {
        "type": "carousel",
        "columns": [
          {
            "thumbnailImageUrl": evac_image[0],
            "imageBackgroundColor": "#FFFFFF",
            "title": `推薦疏散地點(1) \n${suggestions[0]}`,
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
            "thumbnailImageUrl": evac_image[1],
            "imageBackgroundColor": "#000000",
            "title": `推薦疏散地點(2) \n${suggestions[1]}`,
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
              "thumbnailImageUrl": evac_image[2],
              "imageBackgroundColor": "#000000",
              "title": `推薦疏散地點(3) \n${suggestions[2]}`,
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

  return{
      "type": "imagemap",
      "baseUrl": "https://raw.githubusercontent.com/ryankert01/flow-control-line-bot/main/NewPicture",
      "altText": "如果你在下列位置，請點選圖片",
      "baseSize": {
        "width": 1040,
        "height": 1040
      },
      "actions": [
        {
          "type": "message",
          "text": "您點擊了圖片 Taipei 101",
          "area": {
            "x": 0,
            "y": 0,
            "width": 520,
            "height": 520
          }
        },
        {
          "type": "message",
          "text": "您點擊了圖片 Xinyi plaza",
          "area": {
            "x": 520,
            "y": 0,
            "width": 520,
            "height": 520
          }
        },
        {
          "type": "message",
          "text": "您點擊了圖片 Taipei world trade center",
          "area": {
            "x": 0,
            "y": 520,
            "width": 520,
            "height": 520
          }
        },
        {
          "type": "message",
          "text": "您點擊了圖片 Breeze Nan San",
          "area": {
            "x": 520,
            "y": 520,
            "width": 520,
            "height": 520
          }
        }
      ]
  }    
}

// choose_place_id is the id of the place that user choose
function getChoosePlaceMapMessage(prefered_place:number, choose_place_id: number, choose_place_name: String):any {
  // replace all the space with '+' in the place name
  choose_place_name = choose_place_name.replace(/ /g, '+');
  return {
      "type": "template",
      "altText": "這是替您規劃的疏散路線指引",
      "template": {
        "type": "image_carousel",
        "columns": [
          {
            "imageUrl": `https://raw.githubusercontent.com/ryankert01/flow-control-line-bot/main/map_pics/${prefered_place}-${choose_place_id}.png`,
            "action": {
              "type": "uri",
              "label": "Navigate",
              "uri": `https://www.google.com/maps/dir/?api=1&origin=%E7%9B%AE%E5%89%8D%E6%89%80%E5%9C%A8%E4%BD%8D%E7%BD%AE&destination=${choose_place_name}&travelmode=walking&dir_action=navigate`
            }
          }
        ]
      }
    };
}



export { getEvacuationMessage, getDangerousAreaMessage, getChoosePlaceMapMessage };
