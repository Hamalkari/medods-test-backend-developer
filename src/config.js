require('dotenv').config();

module.exports = {
  env: process.env.NODE_ENV,
  port: process.env.PORT || 3000,
  mongodbUri: process.env.MONGODB_URI,
  jwtSecret: process.env.JWT_SECRET || 'very-secret-key',
};
