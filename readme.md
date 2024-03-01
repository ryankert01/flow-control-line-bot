## 2023數據驅動創新應用大賽作品說明
### 隊伍名稱: 阿對對隊

### 數據驅動:	

系統在偵測到實時數據變動，例如人流、人群密度、災難發生等資訊，經由系統處理後判斷若為發生危險情況，驅動伺服器發送line預警訊息通知使用者，並在與使用者的互動中獲取使用者位置資訊以及使用者逃生偏好，以便基於使用者行為來發送逃生路線指引。


### Data-Driven:
The system detects real-time data changes, such as pedestrian flow, crowd density, and disaster occurrences. After processing this information, it assesses whether a dangerous situation has occurred. If so, it triggers the server to send LINE warning messages to notify users. It also gathers user location information and escape preferences during interaction with users, to provide escape route guidance based on user behavior.

### 創新應用:	

目前大型商場的逃生系統具有：
1.逃生路線不易尋找
2.發生危險時不能確定逃生路線是否安全
3.逃生設施的人流分配不均可能造成效率不高的問題
而我們的系統可以在災害發生時，第一時間處理完所有的數據，並通知使用者有災害發生，透過官方line與使用者互動獲取使用者所在位置以及逃生路線偏好，經由計算逃生路線人群密度、路線是否安全等資訊，提供最適合的逃生路線，也能達到更合理的逃生人流分配。

我們使用Metis作為數據驅動中樞，並以Metis透過API的形式來驅動我們在Railway的後端，根據存儲在PostgreSQL的用戶訊息發出line訊息給用戶，接收到用戶訊息再進行決策回朔，使人流不易發生重疊。

### Innovative Applications:
The current escape systems in large shopping malls have issues: 
1. Escape routes are difficult to find.
2. It is uncertain whether escape routes are safe during emergencies.
3. Inefficient distribution of people using escape facilities can lead to low efficiency.

Our system can process all data immediately in the event of a disaster, notify users about the disaster, interact with users through the official LINE to obtain their locations and escape route preferences, calculate crowd density along escape routes, and determine route safety. This enables us to provide the most suitable escape routes and achieve a more rational distribution of the escaping crowds.

We use Metis as the data-driven hub and drive our backend on Railway through Metis via an API, based on user messages stored in PostgreSQL to send LINE messages to users. Upon receiving user messages, we perform decision backtracking to prevent overlapping of pedestrian flows.

![photo_2023-08-11 14 14 18](https://github.com/ryankert01/flow-control-line-bot/assets/91534261/66a46d93-5877-463c-8463-a52fb6f5719b)
![photo_2023-08-11 14 14 15](https://github.com/ryankert01/flow-control-line-bot/assets/91534261/6973758b-9c21-45c7-8809-d2542db800d0)




# Line bot

## npm

install

```sh
npm install
```

run

```sh
npm run start
```

## Docker

build

```sh
docker build -t line-bot-js .
```

run

```sh
docker run -p 3000:3000 line-bot-js
```

## ngrok deploy

run `ngrok.exe`

in cmd

```sh
ngrok.exe http 3000
```

### Line Developer

in [message-api](https://developers.line.biz/console/channel/1661267800/messaging-api), webhook URL change to

```
https://????????.ngrok-free.app/webhook
```
