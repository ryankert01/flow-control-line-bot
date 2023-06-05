import express from 'express';
import dotenv from 'dotenv';
import { TextEventMessage, WebhookEvent, Client } from '@line/bot-sdk';
import { PrismaClient } from '@prisma/client'
import { add_user } from './utils'

const app = express();

dotenv.config();
const config = {
  channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN!,
  channelSecret: process.env.LINE_CHANNEL_SECRET!,
};


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

const prisma = new PrismaClient()



async function handleEvent(event: WebhookEvent) {
  if (event.type === 'follow') {
    const lineUserId = event.source.userId!;

    add_user(lineUserId, prisma)
  }
  
  if (event.type === 'message') {
    const lineUserId = event.source.userId!;

    add_user(lineUserId, prisma)

    const message = (event.message as TextEventMessage)?.text;
    const replyToken = event.replyToken!;
    // Process the received message and prepare a response
    const response = `You selected: ${message}`;
    // Send the response back to the user
    return client.replyMessage(replyToken, { type: 'text', text: response });
  }
}

app.listen(3000, () => {
  console.log('Line bot is running on port 3000');
});


