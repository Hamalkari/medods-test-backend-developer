const jwt = require('jsonwebtoken');
const { tokenInfo } = require('../../config');

function issueToken(data, opts) {
  const token = jwt.sign(data, tokenInfo.jwtSecret, {
    algorithm: tokenInfo.algorithm,
    ...opts,
  });

  return token;
}

module.exports = issueToken;
