const TelegramBot = require('node-telegram-bot-api');
const { botToken } = require('./config');
const { gameOptions, againOptions } = require('./options');

function tgBot() {
  const bot = new TelegramBot(botToken, { polling: true });
  const chats = {};
  bot.setMyCommands([
    { command: '/start', description: 'Включить бота' },
    { command: '/info_about_you', description: 'Информация о пользователе' },
    { command: '/game', description: 'Игра Отгадай цифру' },
  ]);

  const startGame = async (chatId) => {
    await bot.sendMessage(chatId, 'Сейчас я загадаю цифру от 0 до 9. Ваша задача её угадать с первой попытки. Удачи!');
    const randomNumber = Math.floor(Math.random() * 10);
    chats[chatId] = String(randomNumber);
    await bot.sendMessage(chatId, 'Я загадал. Отгадывайте!', gameOptions);
  };

  bot.on('message', async (msg) => {
    const { text } = msg;
    const chatId = msg.chat.id;
    if (!msg.from.is_bot) {
      if (text === '/start') {
        await bot.sendSticker(chatId, 'https://tlgrm.ru/_/stickers/325/867/3258671a-4e55-3636-9614-d33d81e4dc94/1.webp');
        return bot.sendMessage(chatId, `Здравствуйте, ${msg.from.first_name}`);
      }
      if (text === '/info_about_you') {
        return bot.sendMessage(chatId, `Вас зовут: ${msg.from.first_name} ${msg.from.last_name}. Ваш telegram_id: ${msg.from.id} `);
      }
      if (text === '/game') {
        return startGame(chatId);
      }
      return bot.sendMessage(chatId, 'Я Вас не понимаю');
    }
    return bot.sendMessage(chatId, 'Мне запретили разговаривать с ботами');
  });

  bot.on('callback_query', async (msg) => {
    const { data } = msg;
    const chatId = msg.message.chat.id;
    if (data === '/again') {
      return startGame(chatId);
    }
    if (data === chats[chatId]) {
      return bot.sendMessage(chatId, `Ты отгадал ${chats[chatId]}. Ура!!!`, againOptions);
    }
    return bot.sendMessage(chatId, `К сожалению, Вы не угадали, я загадал ${chats[chatId]}`, againOptions);
  });
}

module.exports = { tgBot };
