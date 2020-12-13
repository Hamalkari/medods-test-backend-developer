const httpStatus = require('http-status');
const { extractAccessToken, verifyToken } = require('../utils/auth');

async function authMiddleware(ctx, next) {
  try {
    const accessToken = extractAccessToken(ctx.headers.authorization);

    if (!accessToken)
      ctx.throw(httpStatus.UNAUTHORIZED, 'Access токен не найден');

    await verifyToken(accessToken);

    return next();
  } catch (error) {
    ctx.throw(httpStatus.UNAUTHORIZED, error.message);
  }
}

module.exports = authMiddleware;
