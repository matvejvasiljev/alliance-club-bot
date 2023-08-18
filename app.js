const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
// const helmet = require('helmet');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const limiter = require('./middlewares/rateLimit');
const bot = require('./bot');
const botActions = require('./botActions');
const {
  cacert, addressCors, useSsl, useSslValidate, dbURL,
} = require('./config');
const router = require('./routes/index');

const app = express();
// app.use(helmet());
app.use(express.json());
mongoose.connect(dbURL, {
  useNewUrlParser: true,
  ssl: useSsl,
  sslValidate: useSslValidate,
  sslCA: useSsl ? cacert : undefined,
}).then(() => console.log('mongodb is connected'))
  .catch((err) => console.log(err));
app.use(cors({
  origin: [addressCors, 'http://192.168.194.101:3000'],
}));
app.use(requestLogger);
app.use(limiter);
botActions();
bot.launch();
app.use(router);
app.use(errorLogger);
// app.use(errors());
// app.use(handleError);

module.exports = app;
