const News = require('../models/news');
const apiTg = require('../utils/apiTg');
const bot = require('../bot');

module.exports.createNews = async (data) => {
  console.log('data: ', data);
  try {
    const news = await News.create({
      message: data.message,
      title: data.title,
      imageLink: data.imageLink,
      owner: data.admin._id,
      tgMsgId: data.tgMsgId,
      publishedAt: data.publishedAt,
      fileId: data.fileId,
    });

    await news.save();
    return 'Ok';
  } catch (err) {
    console.log(err.message);
    return err.message;
  }
};

module.exports.getAllNews = async (_, res, next) => {
  try {
    const news = await News.find({});
    const newNews = news.map(async (item) => {
      const fileUrl = await bot.telegram.getFileLink(item.fileId);
      const image = { photo: await apiTg.get(fileUrl.href).blob() };
      Object.assign(item, image);
    });
    res.status(200).send(newNews);
  } catch (err) {
    console.log(err.message);
    next(err);
  }
};
