require('dotenv').config()
const https = require('https');
const TelegramBot = require('node-telegram-bot-api');
const telegramToken = process.env.TELEGRAM_TOKEN;
const bot = new TelegramBot(telegramToken, {polling: true});
const months = [
  'января',
  'февраля',
  'марта',
  'апреля',
  'мая',
  'июня',
  'июля',
  'августа',
  'сентября',
  'октября',
  'ноября',
  'декабря'];

bot.onText(/\/schedule (.+)/, async (msg, match) => {
  await bot.sendMessage(msg.chat.id, await urlSchedule(match[1]));
});

function urlSchedule(match) {
  const date = new Date();
  let d = 0;
  if (match === 'now') {
    d = `${date.getDate()} ${months[date.getMonth()]}.pdf`;
  }
  if (match === 'tomorrow') {
    d = `${date.getDate() + 1} ${months[date.getMonth()]}.pdf`;
  }
  if (match === 'aftertomorrow') {
    d = `${date.getDate() + 2} ${months[date.getMonth()]}.pdf`;
  }
  return new Promise((resolve) => {
    const req = https.request(
        'https://ciur.ru/stmit/commondocs/' + encodeURIComponent(d),
        (res) => {
          if (res.statusCode === 404) resolve('Расписание еще не готово');
          else resolve('https://ciur.ru/stmit/commondocs/' +
              encodeURIComponent(d));
        },
    );
    req.end();
  });
}
