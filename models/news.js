const mongoose = require('mongoose');

mongoose.set('strictQuery', false);

const newsSchema = new mongoose.Schema({

  message: {
    type: String,
    required: true,
  },
  imageLink: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Admin',
  },
  publishedAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
  tgMsgId: {
    type: String,
    required: true,
    unique: true,
  },
  fileId: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('News', newsSchema);
