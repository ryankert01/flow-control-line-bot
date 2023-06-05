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
// global variables
var dangerous_areas = [];
const app = (0, express_1.default)();
dotenv_1.default.config();
const config = {
    channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN,
    channelSecret: process.env.LINE_CHANNEL_SECRET,
};
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
    dangerous_areas = dangerousAreas;
    sendDangerousAreasMessages();
    res.status(200).json({ message: 'Dangerous areas received successfully' });
    console.log(req.body);
});
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
            yield client.pushMessage(lineUserId, {
                type: "text",
                text: `You are in a dangerous area! Please avoid the following areas: ${dangerous_areas.join(', ')}
安安，您在哪裡附近呢?:
1. metro-entry-1
2. metro-entry-2
3. bus-station-1
4. bus-station-2`
            });
        }
    });
}
function sendEvacuationMessages(lineUserId, chosen) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("sending evacuation message to: ", lineUserId);
        if (!lineUserId) { // impossible
            return;
        }
        yield client.pushMessage(lineUserId, {
            type: "text",
            text: `You have chosen ${chosen}`
        });
    });
}
const client = new bot_sdk_1.Client(config);
const prisma = new client_1.PrismaClient();
function handleEvent(event) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        if (event.type === 'follow') {
            const lineUserId = event.source.userId;
            const current_user = yield (0, utils_1.add_user)(lineUserId, prisma);
            client.pushMessage(lineUserId, { type: 'text', text: `Your user id is ${current_user}` });
        }
        if (event.type === 'message') {
            const lineUserId = event.source.userId;
            const current_user = yield (0, utils_1.add_user)(lineUserId, prisma);
            const message = (_a = event.message) === null || _a === void 0 ? void 0 : _a.text;
            if (message[1] === '.') {
                const chosen = message.charCodeAt(0) - 48;
                var getUser = yield prisma.user.findUnique({
                    where: {
                        lineId: lineUserId,
                    },
                });
                if (getUser) {
                    prisma.user.update({
                        where: {
                            lineId: lineUserId,
                        },
                        data: {
                            prefered_place: chosen,
                        },
                    });
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
app.listen(3000, () => {
    console.log('Line bot is running on port 3000');
});
