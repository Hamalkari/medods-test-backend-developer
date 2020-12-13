const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const { tokenInfo } = require('../config');

const signAsync = promisify(jwt.sign);
const verifyAsync = promisify(jwt.verify);

function extractAccessToken(autorization) {
  if (!autorization || !autorization.startsWith('Bearer ')) return null;

  const accessToken = autorization.split(' ')[1];

  return accessToken;
}

async function issueTokens({ userId, accessTokenPrm, refreshTokenPrm }) {
  const accessToken = await signAsync(
    { sub: userId, prm: accessTokenPrm },
    tokenInfo.jwtSecret,
    {
      algorithm: tokenInfo.algorithm,
      expiresIn: tokenInfo.expiresAccessToken,
    },
  );

  const refreshToken = await signAsync(
    { sub: userId, prm: refreshTokenPrm },
    tokenInfo.jwtSecret,
    {
      algorithm: tokenInfo.algorithm,
      expiresIn: tokenInfo.expiresRefreshToken,
    },
  );

  return {
    accessToken,
    refreshToken,
  };
}

function verifyToken(token, opts) {
  return verifyAsync(token, tokenInfo.jwtSecret, opts);
}

module.exports = {
  issueTokens,
  extractAccessToken,
  verifyToken,
};
