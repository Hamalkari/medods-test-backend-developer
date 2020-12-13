const { Schema, model } = require('mongoose');
const bcrypt = require('bcrypt');

const KeystoreSchema = new Schema(
  {
    user: {
      type: Schema.Types.String,
      required: true,
      ref: 'User',
    },
    accessTokenPrm: {
      type: String,
      required: true,
    },
    refreshTokenPrm: {
      type: String,
      required: true,
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

KeystoreSchema.index({ user: 1, accessTokenPrm: 1, refreshTokenPrm: 1 });

KeystoreSchema.pre('save', async function () {
  const keystore = this;
  const SALT_ROUNDS = 10;

  if (!keystore.isModified('refreshToken')) return;

  const refreshTokenHash = await bcrypt.hash(
    keystore.refreshToken,
    SALT_ROUNDS,
  );

  keystore.refreshToken = refreshTokenHash;
});

KeystoreSchema.methods.compareRefreshToken = function (plainRefreshToken) {
  const keystore = this;

  return bcrypt.compare(plainRefreshToken, keystore.refreshToken);
};

const KeystoreModel = model('KeyStore', KeystoreSchema, 'keystores');

module.exports = KeystoreModel;
