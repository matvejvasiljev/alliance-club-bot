const express = require('express');
const helmet = require('helmet');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const limiter = require('./middlewares/rateLimit');

const app = express();
app.use(helmet());
app.use(express.json());

app.use(requestLogger);
app.use(limiter);
// app.use(router);
app.use(errorLogger);
// app.use(errors());
// app.use(handleError);

module.exports = app;
