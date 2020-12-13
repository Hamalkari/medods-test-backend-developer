const httpStatus = require('http-status');

async function notFoundHandler(ctx) {
  ctx.status = httpStatus.NOT_FOUND;

  ctx.body = {
    message: 'Не найдено',
  };
}

module.exports = notFoundHandler;
