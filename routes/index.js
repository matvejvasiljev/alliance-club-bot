const router = require('express').Router();
const { getAllNews, getNews, getPhoto } = require('../controllers/news');

router.get('/news/:idNews/photo', getPhoto);
router.get('/news/:idNews', getNews);
router.get('/news', getAllNews);

module.exports = router;
