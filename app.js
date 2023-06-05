const express = require('express');
const { WebhookEvent, Client } = require('@line/bot-sdk');

const config = {
  channelAccessToken: 'fscVi562vez/vIW0jq8FjYGanUaX3FO4d5vq7tDdYB7AzgiMiO+SeDaVE87hEwWFYblDw8gLwJVrTL5Qe7E6tqCZrwSPjXd2OTO4qdUoG8O+pIQteA5HjIN+xYPSCJ6Lqg+GknQPDH4z1afAUXeFQAdB04t89/1O/w1cDnyilFU=',
  channelSecret: '2bd0dd733a1bb41a62276223b379f017',
};
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post('/webhook', (req, res) => {
  Promise.all(req.body.events.map(handleEvent))
    .then((result) => res.json(result))
    .catch((error) => {
      console.error('Error processing events:', error);
      res.status(500).end();
    });
});


const client = new Client(config);

function handleEvent(event) {
  if (event.type === 'message') {
    const message = event.message.text;
    const replyToken = event.replyToken;
    // Process the received message and prepare a response
    const response = `You selected: ${message}`;
    // Send the response back to the user
    return client.replyMessage(replyToken, { type: 'text', text: response });
  }
}

app.listen(3000, () => {
  console.log('Line bot is running on port 3000');
});