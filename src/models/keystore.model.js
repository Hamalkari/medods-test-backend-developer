const { Schema, model } = require('mongoose');
const bcrypt = require('bcrypt');

const KeystoreSchema = new Schema(
  {
    user: {
      type: Schema.Types.String,
      required: true,
      ref: 'User',
    },
    refreshToken: {
      type: Schema.Types.String,
      required: true,
    },
    blacklisted: {
      type: Schema.Types.Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

KeystoreSchema.index({ user: 1, refreshToken: 1 });

KeystoreSchema.pre('save', async function () {
  const keystore = this;
  const SALT_ROUNDS = 10;

  if (!keystore.isModified('refreshToken')) return;

  const refreshTokenHash = await bcrypt.hash(
    keystore.refreshToken,
    SALT_ROUNDS,
  );

  keystore.refreshToken = refreshTokenHash;

  await keystore.save();
});

const KeystoreModel = model('KeyStore', KeystoreSchema, 'keystores');

module.exports = KeystoreModel;
