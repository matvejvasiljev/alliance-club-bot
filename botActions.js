// const fs = require('fs');
// const axios = require('axios');
const bot = require('./bot');
const s3 = require('./s3');
const { getAdmin } = require('./controllers/admins');
const { createNews } = require('./controllers/news');
const { replays } = require('./utils/constants');

function botActions() {
  // const apiTg = axios.create({
  //   headers: {
  //     'Content-Type': 'application/json',
  //   },
  // });
  bot.start((ctx) => {
    ctx.replyWithHTML(`${ctx.update.message.from.first_name}, здравствуйте. Меня зовут <b>${ctx.botInfo.first_name}</b>. Я умею размещать новости на сайте нашего клуба`);
  });
  bot.on('photo', async (ctx) => {
    const msg = ctx.message;
    const tgAdminId = msg.from.id;
    const tgMsgId = msg.message_id;
    const publishedAt = new Date(msg.date * 1000);
    const fileId = msg.photo[msg.photo.length - 1].file_id;
    const firstName = msg.from?.first_name;
    const caption = msg?.caption;

    const admin = await getAdmin(tgAdminId);
    if (!admin) {
      ctx.reply(`${firstName}, ${replays.notAdmin}`);
      return;
    }
    if (!caption) {
      ctx.reply(`${firstName}, ${replays.notCaption}`);
      return;
    }
    if (!caption.includes('&&')) {
      ctx.reply(`${firstName}, ${replays.notTitle}`);
      return;
    }

    const title = caption.split('&&')[0].trim();
    const message = caption.split('&&')[1].trim();

    const fileUrl = await ctx.telegram.getFileLink(fileId);
    // const response = await apiTg.get(fileUrl.href);
    // const response = await res.json();
    // const filePath = `./${file.file_path}`
    // путь к файлу на сервере Telegram
    // const fileStream = fs.createWriteStream(filePath)
    // создаем поток для записи файла
    // await ctx.telegram.downloadFile(fileId, fileStream)
    // скачиваем файл и записываем его на диск

    ctx.reply(`${firstName}, ${replays.getSuccess}`);

    const imageLink = await s3.Upload(
      {
        path: fileUrl,
      },
      '/alliance/news/',
    );
    // console.log('admin: ', admin);
    // console.log('imageLink: ', imageLink);
    const data = {
      message,
      title,
      imageLink: imageLink.Location,
      admin: admin._id,
      tgMsgId,
      publishedAt,
    };
    await createNews(data);
  });

  bot.on('document', async (ctx) => {
    const { caption } = ctx.update.message;
    // const file = ctx.update.message.document;
    // const fileUrl = await ctx.telegram.getFileLink(file.file_id);
    // console.log(caption);
    console.log(caption);
    // console.log(fileUrl);
  });
}

module.exports = botActions;
