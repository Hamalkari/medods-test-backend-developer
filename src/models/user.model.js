const { Schema, model } = require('mongoose');

const UserSchema = new Schema({}, { timestamps: true });

const UserModel = model('User', UserSchema, 'users');

module.exports = UserModel;
