function getEvacuationMessage(suggestions: any):any {
    const column1: any = {
    type: 'bubble',
    direction: 'ltr',
    hero: {
      type: 'image',
      url: getChoosePlaceMap(0),
      size: 'full',
      aspectRatio: '20:13',
      aspectMode: 'cover',
      action: {
        type: 'uri',
        uri: 'https://www.google.com/maps/dir/?api=1&origin=%E7%9B%AE%E5%89%8D%E6%89%80%E5%9C%A8%E4%BD%8D%E7%BD%AE&destination=${suggestions[0]}',
        label: 'View',
      },
    },
    body: {
      type: 'box',
      layout: 'vertical',
      contents: [
        {
          type: 'text',
          text: '[1] : ${suggestions[0]}',
          weight: 'bold',
          size: 'xl',
        },
        {
          type: 'text',
          text: '${suggestions[0]}',
          wrap: true,
        },
        {
          type: 'button',
          action: {
            type: 'uri',
            uri: 'https://www.google.com/maps/dir/?api=1&origin=%E7%9B%AE%E5%89%8D%E6%89%80%E5%9C%A8%E4%BD%8D%E7%BD%AE&destination=${suggestions[0]}',
            label: 'Go to Map',
          },
        },
      ],
    },
  };

  
  const column2: any = {
    type: 'bubble',
    direction: 'ltr',
    hero: {
      type: 'image',
      url: getChoosePlaceMap(1),
      size: 'full',
      aspectRatio: '20:13',
      aspectMode: 'cover',
      action: {
        type: 'uri',
        uri: 'https://www.google.com/maps/dir/?api=1&origin=%E7%9B%AE%E5%89%8D%E6%89%80%E5%9C%A8%E4%BD%8D%E7%BD%AE&destination=${suggestions[1]}',
        label: 'View',
      },
    },
    body: {
      type: 'box',
      layout: 'vertical',
      contents: [
        {
          type: 'text',
          text: '[2] : ${suggestions[1]}',
          weight: 'bold',
          size: 'xl',
        },
        {
          type: 'text',
          text: '',
          wrap: true,
        },
        {
          type: 'button',
          action: {
            type: 'uri',
            uri: 'https://www.google.com/maps/dir/?api=1&origin=%E7%9B%AE%E5%89%8D%E6%89%80%E5%9C%A8%E4%BD%8D%E7%BD%AE&destination=${suggestions[1]}',
            label: 'Go to Map',
          },
        },
      ],
    },
  };

  const column3: any= {
    type: 'bubble',
    direction: 'ltr',
    hero: {
      type: 'image',
      url: getChoosePlaceMap(2),
      size: 'full',
      aspectRatio: '20:13',
      aspectMode: 'cover',
      action: {
        type: 'uri',
        uri: 'https://www.google.com/maps/dir/?api=1&origin=%E7%9B%AE%E5%89%8D%E6%89%80%E5%9C%A8%E4%BD%8D%E7%BD%AE&destination=${suggestions[2]}',
        label: 'View',
      },
    },
    body: {
      type: 'box',
      layout: 'vertical',
      contents: [
        {
          type: 'text',
          text: '[3] : ${suggestions[0]}',
          weight: 'bold',
          size: 'xl',
        },
        {
          type: 'text',
          text: '',
          wrap: true,
        },
        {
          type: 'button',
          action: {
            type: 'uri',
            uri: 'https://www.google.com/maps/dir/?api=1&origin=%E7%9B%AE%E5%89%8D%E6%89%80%E5%9C%A8%E4%BD%8D%E7%BD%AE&destination=${suggestions[2]}',
            label: 'Go to Map',
          },
        },
      ],
    },
  };

  // 創建 Carousel 容器
  const carouselContainer: any = {
    type: 'carousel',
    contents: [column1, column2, column3],
    direction: 'ltr',
  };

  // 創建 Flex Message
  const flexMessage: any = {
    type: 'flex',
    altText: 'Carousel Message',
    contents: carouselContainer,
  };

  return flexMessage;
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
