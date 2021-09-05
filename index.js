const https = require('https');
const TelegramBot = require('node-telegram-bot-api');
const token = '***REMOVED***';
const bot = new TelegramBot(token, {polling: true});
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
  bot.sendMessage(msg.chat.id, await urlSchedule(match[1]));
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
  return new Promise((resolve, reject) => {
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
