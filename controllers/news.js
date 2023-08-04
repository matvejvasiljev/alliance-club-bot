const News = require('../models/news');

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
    });

    await news.save();
    return news;
  } catch (err) {
    console.log(err.message);
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
