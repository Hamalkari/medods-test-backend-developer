const httpStatus = require('http-status');
const { env } = require('../config');

async function errorHandler(ctx, next) {
  try {
    await next();
  } catch (error) {
    ctx.status = error.status || httpStatus['INTERNAL_SERVER_ERROR'];

    ctx.body = {
      message: error.message || 'Проблемы на сервере!',
      ...(env === 'development' && { stack: error.stack }),
    };
  }
}

module.exports = errorHandler;
