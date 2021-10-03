import 'dotenv/config';
import got from 'got';
import TelegramBot from 'node-telegram-bot-api';
import {ImageMagick} from 'pdf-images';
import {createWriteStream} from 'fs';
import cheerio from 'cheerio';

const telegramToken = process.env.TELEGRAM_TOKEN;
const bot = new TelegramBot(telegramToken, {polling: true});
const usChatId = 831526627; //-1001541014190;

bot.onText(/\/id/, async (msg) => {
  await bot.sendMessage(msg.chat.id, msg.chat.id);
});

bot.onText(/\/расписание (.+)/, async (msg, match) => {
  return getSchedule(match[1], new Date());
  //if (typeof images === 'string') {
  //  await bot.sendMessage(msg.chat.id, images);
  //  return;
  //}
  //for (let i in images) {
  //  console.log(images[i]);
  //  await bot.sendPhoto(msg.chat.id, images[i]);
  //}
});

async function fethHtml(url) {
  try {
    return got(url);
  } catch (e) {
    console.error(`ERROR:${url}`);
    return false;
  }

}
