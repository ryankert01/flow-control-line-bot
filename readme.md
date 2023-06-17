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

## TO-DOs

1. (solved) disturbing message

   [參考資料](https://afan0918.github.io/line-bot-developers-1/)

   ```
   感謝您的訊息！

   很抱歉，本帳號無法個別回覆用戶的訊息。
   敬請期待我們下次發送的內容喔(moon smile)
   ```

2. input: post json handling
3. voting mechanism
4. output: offset api (determined by voting)

- postman to pretend!!!
