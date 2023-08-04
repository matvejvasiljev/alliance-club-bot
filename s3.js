const EasyYandexS3 = require('easy-yandex-s3').default;
const { storageIdnKey, storageSecretKey, bucketName } = require('./config');

// Инициализация
const s3 = new EasyYandexS3({
  auth: {
    accessKeyId: storageIdnKey,
    secretAccessKey: storageSecretKey,
  },
  Bucket: bucketName,
  // debug: true, // Дебаг в консоли, потом можете удалить в релизе
});

module.exports = s3;
