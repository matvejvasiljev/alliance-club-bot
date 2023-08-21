const { Telegraf } = require('telegraf');

const { botToken } = require('./config');

const bot = new Telegraf(botToken, {
  polling: true,
  channelMode: true,
});

module.exports = bot;
