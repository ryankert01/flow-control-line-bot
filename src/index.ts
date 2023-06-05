import express from 'express';
import dotenv from 'dotenv';
import { TextEventMessage, WebhookEvent, Client } from '@line/bot-sdk';
import { PrismaClient } from '@prisma/client'
import { add_user } from './utils'
import { send } from 'process';
import { assert } from 'console';

// global variables
var dangerous_areas: any[] = []

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

app.post('/dangerous', (req, res) => {
  const isDangerous = req.body.is_dangerous;
  const dangerousAreas = req.body.dangerous_areas;
  dangerous_areas = dangerousAreas;
  sendDangerousAreasMessages();
  res.status(200).json({ message: 'Dangerous areas received successfully' });
  console.log(dangerousAreas);
});

async function getLineUserIds() {
  const users = await prisma.user.findMany();
  return users.map((user) => user.lineId);
}

async function sendDangerousAreasMessages() {
  const lineUserIds = await getLineUserIds();
  for (const lineUserId of lineUserIds) {
    console.log(lineUserId);
    if (!lineUserId) { // impossible
      continue;
    }
    await client.pushMessage(lineUserId, {
      type: "text",
      text: `You are in a dangerous area! Please avoid the following areas: ${dangerous_areas.join(', ')}`
    });
  }
}

const client = new Client(config);

const prisma = new PrismaClient()



async function handleEvent(event: WebhookEvent) {
  if (event.type === 'follow') {
    const lineUserId = event.source.userId!;

    const current_user = await add_user(lineUserId, prisma)
    client.pushMessage(lineUserId, { type: 'text', text: `Your user id is ${current_user}` });
  }
  
  if (event.type === 'message') {
    const lineUserId = event.source.userId!;

    const current_user = await add_user(lineUserId, prisma)

    const message = (event.message as TextEventMessage)?.text;
    const replyToken = event.replyToken!;
    // Process the received message and prepare a response
    const response = `You selected: ${message}, and your user id is ${current_user}`;
    // Send the response back to the user
    return client.replyMessage(replyToken, { type: 'text', text: response });
  }
}

app.listen(3000, () => {
  console.log('Line bot is running on port 3000');
});


