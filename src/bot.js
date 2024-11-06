const TelegramBot = require('node-telegram-bot-api');
const { A4, STICKER } = require('./constants');
const dotenv = require('dotenv');
const _ = require('lodash');
const moment = require('moment');
const { Metrics } = require('./metrics');

dotenv.config();
const isWeekend = (date = moment()) => [0, 6].includes(date.weekday());
const metrics = new Metrics();

// Replace YOUR_TOKEN with your actual bot token from BotFather
const token = process.env.TELEGRAM_BOT_TOKEN;
// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, { polling: true });

// Handle '/start' command
bot.onText(/\/chichang/, (msg) => {
    if (_.isEmpty(msg)) return;
    const chatId = msg.chat.id;
    metrics.incrementCommandCount(chatId, 'chichang');
    bot.sendMessage(chatId, 'Kêu chụy mài cái giề?? Coi trừng kao!!');
});

bot.onText(/\/morningmood/, (msg) => {
    if (_.isEmpty(msg)) return;
    const chatId = msg.chat.id;
    metrics.incrementCommandCount(chatId, 'morningmood');
    bot.sendMessage(chatId, 'Nothing good :(((');
    bot.sendSticker(chatId, STICKER.KHOC_MO_DUT_DUT)
});

bot.onText(/\/fack/, (msg) => {
    if (_.isEmpty(msg)) return;
    const chatId = msg.chat.id;
    metrics.incrementCommandCount(chatId, 'fack');
    bot.sendMessage(chatId, 'GIÀ - NGHÈO - ĐÓI');
});

// Handle '/help' command
bot.onText(/\/a4/, (msg) => {
    if (_.isEmpty(msg)) return;
    const chatId = msg.chat.id;
    const max = 25;
    const index = Math.floor(Math.random() * max);
    metrics.incrementCommandCount(chatId, 'a4');
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
    // Use a regular expression to find the command and extract the expression
    const match = msg.text.match(/\/vesom\s*([\d+\-*/\s]+)/);
    const errorMsg = "Gõ khùng điên gì đó? Quánh chetme bây giờ!! Koi trừng kao!!!";
    if (match && match[1]) {
        const expression = match[1].trim();

        try {
            // Evaluate the expression
            const result = eval(expression);

            // Check if the result is a valid number
            if (!isNaN(result)) {
                if (result > 0) {
                    metrics.incrementCommandCount(chatId, 'vesom');
                    return bot.sendMessage(chatId, `Ngồi im đó thêm ${result} phút đi con!! Muốn cũng không có được về sớm đâu!!!`);
                }
                return bot.sendMessage(chatId, `Hết giờ thì xách cái đuýt về lẹ đi còn ngồi đó gõ gõ con khỉ! Đóng máy liền!!`);
            } else {
                return bot.sendMessage(chatId, errorMsg);
            }
        } catch (error) {
            return bot.sendMessage(chatId, errorMsg);
        }
    } else {
        return bot.sendMessage(chatId, errorMsg);
    };
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
    const changLe = ['trang', 'chang']
    const isExistChang = changLe.some((msg) => userMessage.toLowerCase().includes(msg))
    if (isExistChang) {
        bot.sendMessage(chatId, 'Kêu chụy mài cái giề??');
        bot.sendSticker(chatId, STICKER.LIEC_LIEC);
    }
    return;
});

bot.onText(/\/demnguoc/, (msg) => {
    if (_.isEmpty(msg)) return;
    const chatId = msg.chat.id;

    metrics.incrementCommandCount(chatId, 'demnguoc');
    const currentTime = new Date();
    const startWorkTime = new Date();
    startWorkTime.setHours(8, 0, 0, 0);
    const endTime = new Date();
    endTime.setHours(17, 30, 0, 0);

    if (isWeekend(moment(currentTime))) {
        bot.sendMessage(chatId, 'Thứ 7, chủ nhật làm lụng cái giề!!!');
        bot.sendSticker(chatId, STICKER.LIEC_LIEC);
        return;
    }

    if (currentTime.getTime() < startWorkTime.getTime()) {
        bot.sendMessage(chatId, 'Chưa tới giờ làm mà đòi về rồi!!!');
        bot.sendSticker(chatId, STICKER.LIEC_LIEC);
        return;
    }
    if (currentTime.getTime() > endTime.getTime()) {
        bot.sendMessage(chatId, 'Dề đi má!! Còn đếm ngược cái gì nữa!!');
        bot.sendSticker(chatId, STICKER.LIEC_LIEC);
        return;
    }

    const remainingMilliseconds = endTime.getTime() - currentTime.getTime();
    const remainingMinutes = Math.ceil(remainingMilliseconds / (1000 * 60));
    if (remainingMinutes > 30) {
        bot.sendMessage(chatId, `Còn ${remainingMinutes} phút nữa là được về! Cố lên!`);
        bot.sendSticker(chatId, STICKER.VUA_CODE_VUA_KHOC);
    }
    if (remainingMinutes <= 30 && remainingMinutes > 0) {
        bot.sendMessage(chatId, `Bạn đã có một ngày vất vả cống hiến cho tư bản, hãy thư giãn trong ${remainingMinutes} phút còn lại`);
        bot.sendSticker(chatId, STICKER.VUA_CODE_VUA_KHOC);
    }
    return;
});

bot.onText(/\/thongke/, (msg) => {
    if (_.isEmpty(msg)) return;
    const chatId = msg.chat.id;
    const allMetrics = metrics.getMetrics();
    const chatMetrics = allMetrics[chatId] || {};
    const today = moment().format('YYYY-MM-DD')
    let result = "Coi nè:\n";

    // Add rows to the table
    for (const [command, count] of Object.entries(chatMetrics[today])) {
        result += `- ${command}: ${count}\n`;
    }
    bot.sendMessage(chatId, result);
});