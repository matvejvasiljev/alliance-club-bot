const News = require('../models/news');
const apiTg = require('../utils/apiTg');
const bot = require('../bot');

module.exports.createNews = async (data) => {
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
    return err.message;
  }
};

module.exports.getAllNews = async (_, res, next) => {
  try {
    const news = await News.find({});
    res.status(200).send(news);
  } catch (err) {
    next(err);
  }
};

module.exports.getAllNewsForBot = async () => {
  try {
    const news = await News.find({});
    return news;
  } catch (err) {
    return err.message;
  }
};

module.exports.getNews = async (req, res, next) => {
  try {
    const news = await News.findById(req.params.idNews);
    res.status(200).send(news);
  } catch (err) {
    next(err);
  }
};

module.exports.getPhoto = async (req, res, next) => {
  try {
    const news = await News.findById(req.params.idNews);
    const fileUrl = await bot.telegram.getFileLink(news.fileId);
    const image = await apiTg.get(fileUrl.href, { responseType: 'arraybuffer' });
    res.contentType('image/jpeg');
    res.status(200).send(image.data);
  } catch (err) {
    next(err);
  }
};

module.exports.deleteNews = async (tgMsgId) => {
  try {
    await News.deleteOne({ tgMsgId });
    return 'Ok';
  } catch (err) {
    return err.message;
  }
};
