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
const client = new bot_sdk_1.Client(config);
const prisma = new client_1.PrismaClient();
function handleEvent(event) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        if (event.type === 'follow') {
            const lineUserId = event.source.userId;
            // Returns an object or null
            const getUser = yield prisma.user.findUnique({
                where: {
                    lineId: lineUserId,
                },
            });
            if (getUser) {
                const user = yield prisma.user.create({
                    data: {
                        lineId: lineUserId,
                    },
                });
                console.log(user);
            }
        }
        if (event.type === 'message') {
            const message = (_a = event.message) === null || _a === void 0 ? void 0 : _a.text;
            const replyToken = event.replyToken;
            // Process the received message and prepare a response
            const response = `You selected: ${message}`;
            // Send the response back to the user
            return client.replyMessage(replyToken, { type: 'text', text: response });
        }
    });
}
app.listen(3000, () => {
    console.log('Line bot is running on port 3000');
});
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const lineUserId = 'test12';
        // Returns an object or null
        const getUser = yield prisma.user.findUnique({
            where: {
                lineId: lineUserId,
            },
        });
        if (!getUser) {
            const user = yield prisma.user.create({
                data: {
                    lineId: lineUserId,
                },
            });
            console.log(user);
        }
        else {
            console.log('User already exists');
            console.log(getUser);
        }
    });
}
main()
    .then(() => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma.$disconnect();
}))
    .catch((e) => __awaiter(void 0, void 0, void 0, function* () {
    console.error(e);
    yield prisma.$disconnect();
    process.exit(1);
}));
