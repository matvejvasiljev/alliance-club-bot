const dotenv = require('dotenv');

dotenv.config();

module.exports = {
  port: process.env.PORT || 3001,
  nodeEnv: process.env.NODE_ENV || 'production',
  botToken: process.env.TG_BOT_TOKEN || '',
  storageIdnKey: process.env.OBJECT_STORAGE_IDN_KEY || '',
  storageSecretKey: process.env.OBJECT_STORAGE_SECRET_KEY || '',
  bucketName: process.env.BUCKET_NAME || '',
  addressCors: process.env.CORS_ADDRESS || 'http://localhost:3000',
  cacert: process.env.CACERT || './.mongodb/root.crt',
  useSsl: (process.env.USE_SSL || 'true') === 'true',
  useSslValidate: (process.env.USE_SSLVALIDATE || 'true') === 'true',
  dbURL: process.env.DB_URL || 'mongodb://127.0.0.1:27017/kino-garage',
};
