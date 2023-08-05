const bot = require('./bot');
const { getAdmin } = require('./controllers/admins');
const { createNews } = require('./controllers/news');
const { replays } = require('./utils/constants');

function botActions() {
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
    ctx.reply(`${firstName}, ${replays.getSuccess}`);
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
  });

  // TODO сделать добавление новости через добавление документа
  // bot.on('document', async (ctx) => {
  // });
}

module.exports = botActions;
