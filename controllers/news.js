// const { Blob } = require('buffer');
const News = require('../models/news');
const apiTg = require('../utils/apiTg');
const bot = require('../bot');

module.exports.createNews = async (data) => {
  console.log('data: ', data);
  try {
    const news = await News.create({
      message: data.message,
      title: data.title,
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
    const newsWithPhotos = await Promise.all(news.map(async (item) => {
      const fileUrl = await bot.telegram.getFileLink(item.fileId);
      const image = await apiTg.get(fileUrl.href);
      return { data: { news: item, photo: image.data } };
    }));
    res.status(200).send(newsWithPhotos);
  } catch (err) {
    console.log(err.message);
    next(err);
  }
};
