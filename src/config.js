require('dotenv').config();

const tokenInfo = {
  jwtSecret: process.env.JWT_SECRET || 'very-secret-key',
  expiresAccessToken: process.env.EXPIRES_ACCESS_TOKEN,
  expiresRefreshToken: process.env.EXPIRES_REFRESH_TOKEN,
  algorithm: 'HS512',
};

module.exports = {
  env: process.env.NODE_ENV,
  port: process.env.PORT || 3000,
  mongodbUri: process.env.MONGODB_URI,
  tokenInfo,
};
