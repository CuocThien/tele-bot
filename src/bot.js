const TelegramBot = require('node-telegram-bot-api');
const { A4, STICKER } = require('./constants');
const dotenv = require('dotenv');
const _ = require('lodash');

dotenv.config();

// Replace YOUR_TOKEN with your actual bot token from BotFather
const token = process.env.TELEGRAM_BOT_TOKEN;
// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, { polling: true });

// Handle '/start' command
bot.onText(/\/chichang/, (msg) => {
    if (_.isEmpty(msg)) return;
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, 'Kêu chụy mài cái giề?? Coi trừng kao!!');
});

bot.onText(/\/morningmood/, (msg) => {
    if (_.isEmpty(msg)) return;
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, 'Nothing good :(((');
    bot.sendSticker(chatId, STICKER.KHOC_MO_DUT_DUT)
});

bot.onText(/\/fack/, (msg) => {
    if (_.isEmpty(msg)) return;
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, 'GIÀ - NGHÈO - ĐÓI');
});

// Handle '/help' command
bot.onText(/\/a4/, (msg) => {
    if (_.isEmpty(msg)) return;
    const chatId = msg.chat.id;
    const max = 25;
    const index = Math.floor(Math.random() * max);
    bot.sendMessage(chatId, A4.A4[index]);
});

// Handle other messages (auto-reply)
bot.on('message', (msg) => {
    if (_.isEmpty(msg)) return;
    const chatId = msg.chat.id;
    const userMessage = msg.text;
    if (_.isEmpty(userMessage)) {
        return;
    };

    // Ignore commands to avoid duplicate responses
    if (userMessage.startsWith('/')) return;

    // Example auto-reply logic
    const changLe = ['trang', 'chang', 'c chang', 'c trang', 'chị trang', 'chị chang', 'bà chang']
    const isExistChang = changLe.some((msg) => userMessage.toLowerCase().includes(msg))
    if (isExistChang) {
        bot.sendMessage(chatId, 'Kêu chụy mài cái giề??');
        bot.sendSticker(chatId, STICKER.LIEC_LIEC);
    }
    return;
});
