const User = require('../models/user.model');

function create(id) {
  return User.create({ _id: id });
}

function findById(id) {
  return User.findById(id);
}

module.exports = {
  create,
  findById,
};
