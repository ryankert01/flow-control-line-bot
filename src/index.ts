import express from 'express';
import dotenv from 'dotenv';
import { TextEventMessage, WebhookEvent, Client, PostbackEvent } from '@line/bot-sdk';
import { PrismaClient, User, Traffic, Places } from '@prisma/client'
import { add_user, updateUser, updateUser2, getPlaces, getTraffic, updatePlace, updateTraffic } from './utils'
import  {getEvacuationMessage ,getDangerousAreaMessage, getChoosePlaceMapMessage}  from './message'
import cors from 'cors';
import { get } from 'http';




async function getLineUserIds() {
  const users = await prisma.user.findMany();
  return users.map((user:any) => user.lineId);
}

async function sendDangerousAreasMessages() {
  const lineUserIds = await getLineUserIds();
  console.log(dangerous_areas);
  for (const lineUserId of lineUserIds) {
    console.log("sending warning message to: ", lineUserId);
    if (!lineUserId) { // impossible
      continue;
    }
    await client.pushMessage(lineUserId, getDangerousAreaMessage(dangerous_areas));
  }
}


async function handleEvent(event: WebhookEvent) {

  
  if (event.type === 'follow') {
    const lineUserId = event.source.userId!;

    const current_user = await add_user(lineUserId, prisma)
    client.pushMessage(lineUserId, { type: 'text', text: `Your user id is ${current_user}` });
  }
  
  if (event.type === 'postback') {
    const lineUserId = event.source.userId!;

    const current_user = await add_user(lineUserId, prisma)

    const message = event.postback.data as any;
    console.log(message)
    if (message[1] === '.') { // original place
      const chosen = message.charCodeAt(0) - 48;
      orig_places[chosen] += 1;
      updateTraffic(chosen, orig_places[chosen], prisma);
      var getUser: User | null = await prisma.user.findUnique({
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
      var chosen: number = message.charCodeAt(1) - 48;
      if (message[2] !== ']') {
        chosen = chosen * 10 + message.charCodeAt(2) - 48;
      }
      evac_places[chosen] += 1;
      updatePlace(chosen, evac_places[chosen], prisma);
      var getUser: User | null = await prisma.user.findUnique({
        where: {
          lineId: lineUserId,
        },
      });
      if (getUser) {
        updateUser2(lineUserId, chosen, prisma);
        console.log("update successful", chosen);
        console.log(getUser)
        const preferred_place: number = getUser.prefered_place;
        var getTraffic: Traffic | null = await prisma.traffic.findUnique({
          where: {
            id: preferred_place,
          },
        });
        if (getTraffic) {
          const choose_place_name: string = getTraffic.name;
          return client.replyMessage(event.replyToken, getChoosePlaceMapMessage(preferred_place, chosen, choose_place_name));
        }
      }
    }



    const replyToken = event.replyToken!;
    // Process the received message and prepare a response
    const response = `You selected: ${message}, and your user id is ${current_user}`;
    // Send the response back to the user
    return client.replyMessage(replyToken, { type: 'text', text: response });
  }

  if (event.type === 'message') {
    const message = event.message as TextEventMessage;
    const lineUserId = event.source.userId!;

    const current_user = await add_user(lineUserId, prisma)

    const replyToken = event.replyToken!;
    if (message[1] === '在') { // original place
      const chosen = message.charCodeAt(2) - 48;
      orig_places[chosen] += 1;
      updateTraffic(chosen, orig_places[chosen], prisma);
      var getUser: User | null = await prisma.user.findUnique({
        where: {
          lineId: lineUserId,
        },
      });
      console.log(getUser);
      if (getUser) {
        updateUser(lineUserId, chosen, prisma);
        console.log("update successful", chosen);
      }
    }
    
    // Process the received message and prepare a response

    if (message.text === 'admin') {
      var preferred_places, admin_traffic;
      var num_of_places = 0, num_of_traffic = 0;
      var num_of_users = 0, num_of_selected_traffic = 0, num_of_preferred_places = 0;
      var msg = "";
      await prisma.user.findMany().then((users: User[]) => {
        for (var user of users) {
          if (user.prefered_place !== -1) 
            num_of_preferred_places += 1;
          if (user.chose_place !== -1)
            num_of_selected_traffic += 1;
        }
        num_of_users = users.length;
        msg += "Number of users: " + num_of_users + "\n";
        msg += "Number of users who have chosen traffic: " + num_of_selected_traffic + "\n";
        msg += "Number of users who have chosen preferred places: " + num_of_preferred_places + "\n";
        msg += "\n";
      });

      
      await prisma.places.findMany().then((places: Places[]) => {
        num_of_places = places.length;
        preferred_places = "";
        for (var place of places) {
          preferred_places += place.name + ": " + place.chosen_Users_number+"\n";
        }

        msg += "用戶位置：\n"
        msg += preferred_places;
        msg += "\n";
      });

      

      await prisma.traffic.findMany().then((traffic: Traffic[]) => {
        num_of_traffic = traffic.length;
        admin_traffic = ""
        for (var tra of traffic) {
          admin_traffic += tra.name + ": " + tra.chosen_Users_number+" \n";
        }
        msg += "用戶選擇交通：\n"
        msg += admin_traffic;
      });
      return client.replyMessage(replyToken, { type: 'text', text: msg });
    }

    const response = `You sent: ${message.text}, and your user id is ${current_user}`;
    // Send the response back to the user
    return client.replyMessage(replyToken, { type: 'text', text: response });
  }
}

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

const client = new Client(config);

const prisma = new PrismaClient()

app.use(cors());
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
  console.log(dangerousAreas)
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

// an api that response with users data
// using json 
app.post('/users', async (req, res) => {
  const users = await prisma.user.findMany();
  res.status(200).json(users);
});

// listen post that have a body of a list of users and suggestions for them
// and send line message to each user depending on their suggestion
app.post('/evacuation', async (req, res) => {
  const body = req.body;
  console.log(body);
  res.status(200).json({ message: 'Evacuation received successfully' });
  
  // loop through all user
  for(const user of body) {
    const lineUserId = user.lineId;
    const suggestions = user.suggestion;
    console.log("sending evacuation message to: ", lineUserId);
    if (!lineUserId) { // impossible
      continue;
    }
    await client.pushMessage(lineUserId, getEvacuationMessage(suggestions));
  }
});


// listen post that have a body of suggestion for each place
// and send each suggestion to the corresponding user that is in that place
// by loop through the database and find the user that is in that place
// there's many places
// @deprecated
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


app.listen(3000, () => {
  console.log('Line bot is running on port 3000');
});

async function getTrafficcc(prisma: PrismaClient){
  var getUser: User | null = await prisma.user.findUnique({
    where: {
      lineId: "Ucd211142498029852cb840019b85b1f7",
    },
  });
  var preferedPlace = null
  if(getUser)
    preferedPlace = getUser.prefered_place;

}

getTrafficcc(prisma);
