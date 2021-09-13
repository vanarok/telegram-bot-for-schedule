require('dotenv').config();
const https = require('https');
const TelegramBot = require('node-telegram-bot-api');
const telegramToken = process.env.TELEGRAM_TOKEN;
const x = new TelegramBot(telegramToken, {polling: true});
const chatId = 831526627//-1001541014190; //831526627
const url = 'https://ciur.ru/stmit/commondocs/';

x.onText(/\/id/, async (msg) => {
  await x.sendMessage(msg.chat.id, msg.chat.id);
});

x.onText(/расписание (.+)/, async (msg, match) => {
  await x.sendMessage(msg.chat.id, await urlSchedule(match[1]));
});

function urlSchedule(match) {
  let date = new Date();
  let d = 0;
  if (match === 'сегодня') {
    d = `Расписание ${date.getDate()}.${date.toLocaleString('default',
        {month: '2-digit'})}.${date.getFullYear()}.pdf`;
  }
  if (match === 'завтра') {
    d = `Расписание ${date.getDate() + 1}.${date.toLocaleString('default',
        {month: '2-digit'})}.${date.getFullYear()}.pdf`;
  }
  if (match === 'послезавтра') {
    d = `Расписание ${date.getDate() + 2}.${date.toLocaleString('default',
        {month: '2-digit'})}.${date.getFullYear()}.pdf`;
  }
  return new Promise((resolve) => {
    const req = https.request(
        url + encodeURIComponent(d),
        (res) => {
          if (res.statusCode === 404) resolve('Расписание отсутствует');
          else resolve(url +
              encodeURIComponent(d));
        },
    );
    req.end();
  });
}

const dateSchedule = new Date();

setInterval(() => {
  let nameFile = `Расписание ${dateSchedule.getDate()}.${dateSchedule.toLocaleString(
      'default',
      {month: '2-digit'})}.${dateSchedule.getFullYear()}.pdf`;
  console.log(nameFile);
  let req = https.request(url + encodeURIComponent(nameFile),
      (res) => {
        if (res.statusCode === 200) {
          x.sendDocument(chatId, url + encodeURIComponent(nameFile)+'?random=58');
          dateSchedule.setDate(dateSchedule.getDate() + 1);
        }
      },
  );
  req.end();
}, 6000);