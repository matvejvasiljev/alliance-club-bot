const Admin = require('../models/admin');

module.exports.getAdmin = async (tgAdminId) => {
  try {
    const admin = await Admin.findOne({ tgAdminId });
    return admin;
  } catch (err) {
    return err.message;
  }
};
