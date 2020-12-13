const Keystore = require('../models/keystore.model');

function create({ userId, refreshToken, accessTokenPrm, refreshTokenPrm }) {
  return Keystore.create({
    user: userId,
    refreshToken,
    accessTokenPrm,
    refreshTokenPrm,
  });
}

function remove(id) {
  return Keystore.findByIdAndRemove(id);
}

function find({ userId, accessTokenPrm, refreshTokenPrm }) {
  return Keystore.findOne({
    user: userId,
    accessTokenPrm,
    refreshTokenPrm,
    blacklisted: false,
  });
}

module.exports = {
  create,
  find,
  remove,
};
