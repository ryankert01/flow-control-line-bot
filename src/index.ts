import express from 'express';
import dotenv from 'dotenv';
import { TextEventMessage, WebhookEvent, Client } from '@line/bot-sdk';
import { PrismaClient } from '@prisma/client'
import { add_user, updateUser, updateUser2, getPlaces, getTraffic, updatePlace, updateTraffic } from './utils'
import { send } from 'process';
import { assert } from 'console';

// global variables
var dangerous_areas: string[] = [];
var orig_places: number[] = [0, 0, 0, 0, 0];
var evac_places: number[] = [0, 0, 0, 0, 0];
var suggestions: string[] = ["", "", "", "", ""];
var evac_names: string[] = ["", "Taipei 101", "Taipei city hall", "Taipei 101 World Trade Center station", "101 international shopping center station"];


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
  console.log(req.body);
});

// an api that response with the number of people in each traffic
// using json
app.get('/traffic', async (req, res) => {
  const traffic = await getTraffic(prisma);
  res.status(200).json(traffic);
});

// an api that response with the number of people in each place
// using json
app.get('/places', async (req, res) => {
  const places = await getPlaces(prisma);
  res.status(200).json(places);
});


// listen post that have a body of suggestion for each place
// and send each suggestion to the corresponding user that is in that place
// by loop through the database and find the user that is in that place
// there's many places
app.post('/suggestion', async (req, res) => {
  const body = req.body;
  console.log(body);
  res.status(200).json({ message: 'Suggestions received successfully' });
  
  // loop through all user
  const users = await prisma.user.findMany();
  for (const user of users) {
    if(user.prefered_place < 1) continue;
    const lineUserId = user.lineId;
    const evacuationPlaces = body[user.prefered_place-1].suggestions;
    const evacuationPlacesName = [evac_names[evacuationPlaces[0]], evac_names[evacuationPlaces[1]], evac_names[evacuationPlaces[2]]];
    console.log("sending suggestion message to: ", lineUserId);
    if (!lineUserId) { // impossible
      continue;
    }
    await client.pushMessage(lineUserId, {
      type: "text",
      text: `You are in a dangerous area! Please avoid the following areas: ${dangerous_areas.join(', ')}.
You are in ${evacuationPlacesName[0]}.
You can go to :
[${evacuationPlaces[0]}] ${evacuationPlacesName[0]}
[${evacuationPlaces[1]}] ${evacuationPlacesName[1]}
[${evacuationPlaces[2]}] ${evacuationPlacesName[2]}`
    });
  }
});



async function getLineUserIds() {
  const users = await prisma.user.findMany();
  return users.map((user) => user.lineId);
}

async function sendDangerousAreasMessages() {
  const lineUserIds = await getLineUserIds();
  console.log(dangerous_areas);
  for (const lineUserId of lineUserIds) {
    console.log("sending warning message to: ", lineUserId);
    if (!lineUserId) { // impossible
      continue;
    }
    await client.pushMessage(lineUserId, {
      type: "text",
      text: `You are in a dangerous area! Please avoid the following areas: ${dangerous_areas.join(', ')}
安安，您在哪裡附近呢?:
1. metro-entry-1
2. metro-entry-2
3. bus-station-1
4. bus-station-2`
    });
  }
}

async function sendEvacuationMessages(lineUserId: string, chosen: number) {
  console.log("sending evacuation message to: ", lineUserId);
  if (!lineUserId) { // impossible
    return;
  }
  await client.pushMessage(lineUserId, {
    type: "text",
    text: `You have chosen ${chosen}`
  });
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
    console.log(message)
    if (message[1] === '.') { // original place
      const chosen = message.charCodeAt(0) - 48;
      orig_places[chosen] += 1;
      updateTraffic(chosen, orig_places[chosen], prisma);
      var getUser: object | null = await prisma.user.findUnique({
        where: {
          lineId: lineUserId,
        },
      });
      console.log(getUser);
      if (getUser) {
        updateUser(lineUserId, chosen, prisma);
        console.log("update successful", chosen);
      }
    } else if (message[0] === '[') { // evacuation place
      const chosen = message.charCodeAt(1) - 48;
      evac_places[chosen] += 1;
      updatePlace(chosen, evac_places[chosen], prisma);
      var getUser: object | null = await prisma.user.findUnique({
        where: {
          lineId: lineUserId,
        },
      });
      if (getUser) {
        updateUser2(lineUserId, chosen, prisma);
        console.log("update successful", chosen);
      }
    }



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


