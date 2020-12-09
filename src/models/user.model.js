const { Schema, model } = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const UserSchema = new Schema(
  {
    _id: {
      type: String,
      default: uuidv4,
    },
  },
  { timestamps: true },
);

const UserModel = model('User', UserSchema, 'users');

UserModel.create();

module.exports = UserModel;
