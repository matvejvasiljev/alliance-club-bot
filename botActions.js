const bot = require('./bot');
const { getAdmin } = require('./controllers/admins');
const { createNews, getAllNewsForBot, deleteNews } = require('./controllers/news');
const { replays } = require('./utils/constants');
const { idGroup } = require('./config');

function botActions() {
  bot.start((ctx) => {
    ctx.replyWithHTML(`${ctx.update.message.from.first_name}, здравствуйте. Меня зовут <b>${ctx.botInfo.first_name}</b>. Я умею размещать новости на сайте нашего клуба`);
  });

  const addNews = async (ctx, msg, tgAdminId) => {
    const tgMsgId = msg.message_id;
    const publishedAt = new Date(msg.date * 1000);
    const fileId = msg.photo[msg.photo.length - 1].file_id;
    const firstName = msg.from?.first_name;
    const caption = msg?.caption;
    const admin = await getAdmin(tgAdminId);
    let title = '';
    let message = '';
    if (!admin) {
      ctx.reply(`${firstName}, ${replays.notAdmin}`);
      return;
    }
    if (!caption) {
      ctx.reply(`${firstName}, ${replays.notCaption}`);
      return;
    }
    ctx.reply(`${firstName}, ${replays.getSuccess}`);
    if (!caption.includes('&&')) {
      const currentDate = new Date();
      const newTitle = `${currentDate.getDate()}.${currentDate.getMonth()}.${currentDate.getFullYear()} ${currentDate.getHours()}:${currentDate.getMinutes()}`;
      title = newTitle;
      message = caption.trim();
    } else {
      title = caption.split('&&')[0].trim();
      message = caption.split('&&')[1].trim();
      ctx.reply(`${firstName}, ${replays.notTitle}`);
    }
    const data = {
      message,
      title,
      admin: admin._id,
      tgMsgId,
      publishedAt,
      fileId,
    };
    const res = await createNews(data);
    if (res === 'Ok') {
      ctx.reply(replays.addNews);
    } else {
      ctx.reply(res);
    }
  };

  bot.on('photo', async (ctx) => {
    await addNews(ctx, ctx.message, ctx.from.id);
  });

  bot.command('show_news', async (ctx) => {
    const news = await getAllNewsForBot();
    let result = '';
    for (let i = 0; i < news.length; i += 1) {
      result += `<b>${i + 1}. ${news[i].title}</b> <i>${news[i].tgMsgId}</i>\n`;
    }
    ctx.replyWithHTML(`<b>Список новостей:</b>\n\n${result}`);
  });

  bot.command('delete', async (ctx) => {
    // console.log(ctx.update.message.from);
    const tgAdminId = ctx.update.message.from.id;
    const firstName = ctx.update.message.from?.first_name;
    const admin = await getAdmin(tgAdminId);
    if (!admin) {
      ctx.reply(`${firstName}, ${replays.notAdmin}`);
    } else {
      const tgMsgId = ctx.update.message.text.replace('/delete', '').trim();
      const result = await deleteNews(tgMsgId);
      if (result === 'Ok') {
        ctx.reply(`Запись ${tgMsgId} удалена`);
      } else {
        ctx.reply(result);
      }
    }
  });

  bot.on('channel_post', (ctx) => {
    const msg = ctx.channelPost;
    if (msg.photo && msg.caption) {
      bot.telegram.sendMessage(
        idGroup,
        `Данная публикация 👇 похожа на новость,\n(<b>${msg.author_signature}</b>)`,
        { parse_mode: 'HTML' },
      );
      const photoStr = msg.photo[msg.photo.length - 1].file_id;
      bot.telegram.sendPhoto(
        idGroup,
        photoStr,
        {
          caption: msg?.caption,
          parse_mode: 'HTML',
          reply_markup: {
            inline_keyboard: [
              [{ text: 'добавить', callback_data: 'add' }],
            ],
          },
        },
      );
    }
  });

  bot.action('add', async (ctx) => {
    await addNews(ctx, ctx.update.callback_query.message, ctx.update.callback_query.from.id);
  });

  // TODO сделать добавление новости через добавление документа
  // bot.on('document', async (ctx) => {
  // });
}

module.exports = botActions;
