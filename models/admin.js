const mongoose = require('mongoose');

mongoose.set('strictQuery', false);

const adminSchema = new mongoose.Schema(
  {
    tgAdminId: {
      type: String,
      required: true,
      unique: true,
    },
    tgName: {
      type: String,
    },
    firstName: {
      type: String,
    },
    lastName: {
      type: String,
    },
  },
);

module.exports = mongoose.model('Admin', adminSchema);
