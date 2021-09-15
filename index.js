require('dotenv').config();
const https = require('https');
const TelegramBot = require('node-telegram-bot-api');
const telegramToken = process.env.TELEGRAM_TOKEN;
const bot = new TelegramBot(telegramToken, {polling: true});
const chatId = 831526627; //-1001541014190; //831526627
const url = 'https://ciur.ru/stmit/commondocs/';
const {ImageMagick} = require('pdf-images');
const dateSchedule = new Date();

bot.onText(/\/id/, async (msg) => {
  await bot.sendMessage(msg.chat.id, msg.chat.id);
});

bot.onText(/расписание (.+)/, async (msg, match) => {
  let images = await schedule(match[1]);
  if (typeof images === 'string') {
    await bot.sendMessage(msg.chat.id, images);
    return;
  }
  for (let i in images) {
    console.log(images[i]);
    await bot.sendPhoto(msg.chat.id, images[i]);
  }
});

function schedule(match) {
  let date = new Date();
  let nameFile = undefined;

  if (match === 'сегодня') {
    nameFile = `Расписание ${date.getDate()}.${date.toLocaleString('default',
        {month: '2-digit'})}.${date.getFullYear()}.pdf`;
  }
  if (match === 'завтра') {
    nameFile = `Расписание ${date.getDate() + 1}.${date.toLocaleString(
        'default',
        {month: '2-digit'})}.${date.getFullYear()}.pdf`;
  }
  if (match === 'послезавтра') {
    nameFile = `Расписание ${date.getDate() + 2}.${date.toLocaleString(
        'default',
        {month: '2-digit'})}.${date.getFullYear()}.pdf`;
  }
  nameFile = encodeURIComponent(nameFile);

  return new Promise((resolve) => {
    let req = https.request(
        url + nameFile,
        (res) => {
          if (res.statusCode === 200) {
            let images = ImageMagick.convert(url +
                nameFile, '/tmp', 'img').images;

            resolve(images);
          } else {
            resolve('Расписание отсутствует');
          }
        },
    );
    req.end();
  });
}

dateSchedule.setDate(dateSchedule.getDate());

setInterval(() => {
  let nameFile = `Расписание ${dateSchedule.getDate()}.${dateSchedule.toLocaleString(
      'default',
      {month: '2-digit'})}.${dateSchedule.getFullYear()}.pdf`;
  nameFile = encodeURIComponent(nameFile);

  let req = https.request(url + nameFile,
      (res) => {
        if (res.statusCode === 200) {
          let images = ImageMagick.convert(url +
              nameFile, '/tmp', 'img').images;

          console.log(images);
          for (let i in images) {
            bot.sendPhoto(chatId, images[i]);
          }
          dateSchedule.setDate(dateSchedule.getDate() + 1);
        }
      },
  );
  req.end();
}, 60000);