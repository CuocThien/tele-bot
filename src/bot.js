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

// bot.onText(/\/vesom/, (msg) => {
//     if (_.isEmpty(msg)) return;
//     const chatId = msg.chat.id;
//     const arrMsg = msg.text.split(' ');
//     if((Number(arrMsg[1 ]))){
//         bot.sendMessage(chatId, `Ngồi im đó thêm ${arrMsg[1]} phút đi con!! Muốn cũng không có được về sớm đâu!!!`);
//     }
//     return;
// });
bot.onText(/\/vesom/, (msg) => {
    if (_.isEmpty(msg)) return;
    const chatId = msg.chat.id;
    const arrMsg = msg.text.split(' ');

    // Extract the part after the command
    const expression = arrMsg.slice(1).join(' ');

    try {
        // Evaluate the expression
        const result = eval(expression);

        // Check if the result is a valid number
        if (!isNaN(result)) {
            if (result > 0) {
                return bot.sendMessage(chatId, `Ngồi im đó thêm ${result} phút đi con!! Muốn cũng không có được về sớm đâu!!!`);
            }
            returnbot.sendMessage(chatId, `Hết giờ thì xách cái đuýt về lẹ đi còn ngồi đó gõ gõ con khỉ! Đóng máy liền!!`);
        } else {
            return bot.sendMessage(chatId, "Gõ khùng điên gì đó? Quánh chetme bây giờ!! Koi trừng kao!!!");
        }
    } catch (error) {
        return bot.sendMessage(chatId, "Gõ khùng điên gì đó? Quánh chetme bây giờ!! Koi trừng kao!!!");
    }
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
