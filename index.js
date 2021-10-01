import 'dotenv/config';
import got from 'got';
import TelegramBot from 'node-telegram-bot-api';
import {ImageMagick} from 'pdf-images';
import {createWriteStream} from 'fs';

const telegramToken = process.env.TELEGRAM_TOKEN;
const bot = new TelegramBot(telegramToken, {polling: true});
const chatId = 831526627; //-1001541014190;
const dateSchedule = new Date();

dateSchedule.setDate(dateSchedule.getDate() + 1);

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
}, 600000);

bot.onText(/\/id/, async (msg) => {
  await bot.sendMessage(msg.chat.id, msg.chat.id);
});

bot.onText(/\/расписание (.+)/, async (msg, match) => {
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

function getSchedule(text) {
  let siteOne = req(
      `https://ciur.ru/stmit/commondocs/${nameFileSchedule(text)}`);
  let siteTwo = req(
      `http://stmit.ru/wp-content/uploads/2021/09/${nameFileSchedule(text)}`);
  if (siteOne) {
    let pdfSchedule = siteOne.pipe(createWriteStream('schedule.pdf'));
  } else {

  }
  return;
}

function nameFileSchedule(text, date) {
  if (text === 'сегодня') {
    return `Расписание ${date.getDate()}.${date.toLocaleString('default',
        {month: '2-digit'})}.${date.getFullYear()}.pdf`;
  }
  if (text === 'завтра') {
    return `Расписание ${date.getDate() + 1}.${date.toLocaleString(
        'default',
        {month: '2-digit'})}.${date.getFullYear()}.pdf`;
  }
  if (text === 'послезавтра') {
    return `Расписание ${date.getDate() + 2}.${date.toLocaleString(
        'default',
        {month: '2-digit'})}.${date.getFullYear()}.pdf`;
  }
}

/**
 * @param {object} option
 */

function req(option) {
  try {
    return got(option);
  } catch (e) {
    console.log(e);
    return false;
  }

}
