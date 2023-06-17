"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const bot_sdk_1 = require("@line/bot-sdk");
const client_1 = require("@prisma/client");
const utils_1 = require("./utils");
const message_1 = require("./message");
const cors_1 = __importDefault(require("cors"));
function getLineUserIds() {
    return __awaiter(this, void 0, void 0, function* () {
        const users = yield prisma.user.findMany();
        return users.map((user) => user.lineId);
    });
}
function sendDangerousAreasMessages() {
    return __awaiter(this, void 0, void 0, function* () {
        const lineUserIds = yield getLineUserIds();
        console.log(dangerous_areas);
        for (const lineUserId of lineUserIds) {
            console.log("sending warning message to: ", lineUserId);
            if (!lineUserId) { // impossible
                continue;
            }
            yield client.pushMessage(lineUserId, (0, message_1.getDangerousAreaMessage)(dangerous_areas));
        }
    });
}
function handleEvent(event) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        if (event.type === 'follow') {
            const lineUserId = event.source.userId;
            const current_user = yield (0, utils_1.add_user)(lineUserId, prisma);
            client.pushMessage(lineUserId, { type: 'text', text: `Your user id is ${current_user}` });
        }
        if (event.type === 'postback') {
            const lineUserId = event.source.userId;
            const current_user = yield (0, utils_1.add_user)(lineUserId, prisma);
            const message = (_a = event.postback.data) === null || _a === void 0 ? void 0 : _a.text;
            console.log(message);
            if (message[1] === '.') { // original place
                const chosen = message.charCodeAt(0) - 48;
                orig_places[chosen] += 1;
                (0, utils_1.updateTraffic)(chosen, orig_places[chosen], prisma);
                var getUser = yield prisma.user.findUnique({
                    where: {
                        lineId: lineUserId,
                    },
                });
                console.log(getUser);
                if (getUser) {
                    (0, utils_1.updateUser)(lineUserId, chosen, prisma);
                    console.log("update successful", chosen);
                }
            }
            else if (message[0] === '[') { // evacuation place
                var chosen = message.charCodeAt(1) - 48;
                if (message[2] !== ']') {
                    chosen = chosen * 10 + message.charCodeAt(2) - 48;
                }
                evac_places[chosen] += 1;
                (0, utils_1.updatePlace)(chosen, evac_places[chosen], prisma);
                var getUser = yield prisma.user.findUnique({
                    where: {
                        lineId: lineUserId,
                    },
                });
                if (getUser) {
                    (0, utils_1.updateUser2)(lineUserId, chosen, prisma);
                    console.log("update successful", chosen);
                    console.log(getUser);
                    const preferred_place = getUser.prefered_place;
                    return client.replyMessage(event.replyToken, (0, message_1.getChoosePlaceMapMessage)(preferred_place, chosen));
                }
            }
            const replyToken = event.replyToken;
            // Process the received message and prepare a response
            const response = `You selected: ${message}, and your user id is ${current_user}`;
            // Send the response back to the user
            return client.replyMessage(replyToken, { type: 'text', text: response });
        }
    });
}
// global variables
var dangerous_areas = [];
var orig_places = [0, 0, 0, 0, 0];
var evac_places = [0, 0, 0, 0, 0];
var suggestions = ["", "", "", "", ""];
var evac_names = ["", "Taipei 101", "Taipei city hall", "Taipei 101 World Trade Center station", "101 international shopping center station"];
const app = (0, express_1.default)();
dotenv_1.default.config();
const config = {
    channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN,
    channelSecret: process.env.LINE_CHANNEL_SECRET,
};
const client = new bot_sdk_1.Client(config);
const prisma = new client_1.PrismaClient();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
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
    console.log(dangerousAreas);
    dangerous_areas = dangerousAreas;
    sendDangerousAreasMessages();
    res.status(200).json({ message: 'Dangerous areas received successfully' });
    console.log(req.body);
});
// an api that response with the number of people in each traffic
// using json
app.get('/traffic', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const traffic = yield (0, utils_1.getTraffic)(prisma);
    res.status(200).json(traffic);
}));
// an api that response with the number of people in each place
// using json
app.get('/places', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const places = yield (0, utils_1.getPlaces)(prisma);
    res.status(200).json(places);
}));
// an api that response with users data
// using json 
app.get('/users', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield prisma.user.findMany();
    res.status(200).json(users);
}));
// listen post that have a body of a list of users and suggestions for them
// and send line message to each user depending on their suggestion
app.post('/evacuation', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    console.log(body);
    res.status(200).json({ message: 'Evacuation received successfully' });
    // loop through all user
    for (const user of body) {
        const lineUserId = user.lineId;
        const suggestions = user.suggestion;
        console.log("sending evacuation message to: ", lineUserId);
        if (!lineUserId) { // impossible
            continue;
        }
        yield client.pushMessage(lineUserId, (0, message_1.getEvacuationMessage)(suggestions));
    }
}));
// listen post that have a body of suggestion for each place
// and send each suggestion to the corresponding user that is in that place
// by loop through the database and find the user that is in that place
// there's many places
// @deprecated
app.post('/suggestion', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    console.log(body);
    res.status(200).json({ message: 'Suggestions received successfully' });
    // loop through all user
    const users = yield prisma.user.findMany();
    for (const user of users) {
        if (user.prefered_place < 1)
            continue;
        const lineUserId = user.lineId;
        const evacuationPlaces = body[user.prefered_place - 1].suggestions;
        const evacuationPlacesName = [evac_names[evacuationPlaces[0]], evac_names[evacuationPlaces[1]], evac_names[evacuationPlaces[2]]];
        console.log("sending suggestion message to: ", lineUserId);
        if (!lineUserId) { // impossible
            continue;
        }
        yield client.pushMessage(lineUserId, {
            type: "text",
            text: `You are in a dangerous area! Please avoid the following areas: ${dangerous_areas.join(', ')}.
You are in ${evacuationPlacesName[0]}.
You can go to :
[${evacuationPlaces[0]}] ${evacuationPlacesName[0]}
[${evacuationPlaces[1]}] ${evacuationPlacesName[1]}
[${evacuationPlaces[2]}] ${evacuationPlacesName[2]}`
        });
    }
}));
app.listen(3000, () => {
    console.log('Line bot is running on port 3000');
});
function getTrafficcc(prisma) {
    return __awaiter(this, void 0, void 0, function* () {
        var getUser = yield prisma.user.findUnique({
            where: {
                lineId: "Ucd211142498029852cb840019b85b1f7",
            },
        });
        var preferedPlace = null;
        if (getUser)
            preferedPlace = getUser.prefered_place;
    });
}
getTrafficcc(prisma);
