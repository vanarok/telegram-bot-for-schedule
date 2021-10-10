import 'dotenv/config';
import got from 'got';
import TelegramBot from 'node-telegram-bot-api';
import {ImageMagick} from 'pdf-images';
import cheerio from 'cheerio';
import * as fs from 'fs';

const telegramToken = process.env.TELEGRAM_TOKEN;
const bot = new TelegramBot(telegramToken, {polling: true});
const chatId = 1001541014190;
let nameFiles = [];

setInterval(serviceSendingSchedule, 60000)

bot.onText(/\/id/, async (msg) => {
  await bot.sendMessage(msg.chat.id, msg.chat.id);
});

bot.onText(/\/расписание/, async (msg) => {
  await bot.sendMessage(msg.chat.id, 'Кручу верчю расписание найти хочу');
  const images = await getImg(await getHref());
  for (let i = 0; i < images.length; i++) {
    await bot.sendPhoto(msg.chat.id, images[i]);
  }
});

async function serviceSendingSchedule() {
  const url = await getHref();

  if (!url.some(await matchingArrays)) {
    nameFiles = []
    nameFiles = nameFiles.concat(url);
    const images = await getImg(url);
    for (let i = 0; i < images.length; i++) {
      await bot.sendPhoto(chatId, images[i]);
    }
  }

}

async function getImg(url) {
  let arr = [];
  for (let i = 0; i < url.length; i++) {
    const path = `/tmp/${url[i].split('/')[7]}`;
    const buffer = await fetchHtml(url[i]);
    await saveToFile(path, buffer);
    arr = arr.concat(
        await ImageMagick.convert(path, '/tmp', 'schedule' + i).images);
  }
  return arr;
}

function matchingArrays(e) {
  for (let i = 0; i < nameFiles.length; i++) {
    if (e === nameFiles[i]) return true;
  }
}

async function saveToFile(path, buffer) {
  fs.open(path, 'a', function(err, fd) {

    // If the output file does not exists
    // an error is thrown else data in the
    // buffer is written to the output file
    if (err) {
      console.log('Cant open file');
    } else {
      fs.write(fd, buffer, 0, buffer.length,
          null, function(err, writtenbytes) {
            if (err) {
              console.log('Cant write to file');
            } else {
              console.log(writtenbytes +
                  ' characters added to file');
            }
          });
    }
  });
}

async function getHref() {
  const url = 'http://stmit.ru/%d1%81%d1%82%d1%83%d0%b4%d0%b5%d0%bd%d1%82%d1%83/%d1%80%d0%b0%d1%81%d0%bf%d0%b8%d1%81%d0%b0%d0%bd%d0%b8%d0%b5/';
  const html = await fetchHtml(url);
  if (html) {
    const $ = cheerio.load(html);
    return $('.embed_download > a').get().map(e => {
          return $(e).attr('href');
        },
    );
  } else return false;
}

async function fetchHtml(url) {
  try {
    return got(url).buffer();
  } catch (e) {
    console.error(`ERROR:${url}`);
    return false;
  }

}
