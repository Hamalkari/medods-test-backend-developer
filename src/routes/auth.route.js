const Router = require('koa-router');
const httpStatus = require('http-status');
const { v4: uuidv4 } = require('uuid');

const router = new Router();

const UserService = require('../services/user.service');
const KeystoreService = require('../services/keystore.service');
const {
  issueTokens,
  extractAccessToken,
  verifyToken,
} = require('../utils/auth');

const authMiddleware = require('../middlewares/auth');

router.get('/issueTokens', async (ctx) => {
  const { GUID: userId } = ctx.query;

  if (!userId) ctx.throw(httpStatus.BAD_REQUEST, 'GUID не обнаружен');

  const user = await UserService.findById(userId);

  if (!user) {
    await UserService.create(userId);
  }

  const accessTokenPrm = uuidv4();
  const refreshTokenPrm = uuidv4();

  const { accessToken, refreshToken } = await issueTokens({
    userId,
    accessTokenPrm,
    refreshTokenPrm,
  });

  await KeystoreService.create({
    userId,
    refreshToken,
    accessTokenPrm,
    refreshTokenPrm,
  });

  ctx.status = httpStatus.OK;
  ctx.body = {
    accessToken,
    refreshToken,
  };
});

router.post('/refresh', async (ctx) => {
  try {
    const accessToken = extractAccessToken(ctx.headers.authorization);
    const { refreshToken } = ctx.request.body;

    if (!refreshToken)
      ctx.throw(httpStatus.UNAUTHORIZED, 'Refresh токен не обнаружен');

    if (!accessToken)
      ctx.throw(httpStatus.UNAUTHORIZED, 'Access токен не обнаружен');

    const accessTokenPayload = await verifyToken(accessToken, {
      ignoreExpiration: true,
    });

    const user = await UserService.findById(accessTokenPayload.sub);

    if (!user) ctx.throw(httpStatus.UNAUTHORIZED, 'Пользователь не найден');

    const refreshTokenPayload = await verifyToken(refreshToken);

    const keystore = await KeystoreService.find({
      userId: user._id,
      accessTokenPrm: accessTokenPayload.prm,
      refreshTokenPrm: refreshTokenPayload.prm,
    });

    if (!keystore || !(await keystore.compareRefreshToken(refreshToken)))
      ctx.throw(httpStatus.UNAUTHORIZED, 'Ошибка авторизации');

    await KeystoreService.remove(keystore._id);

    const accessTokenPrm = uuidv4();
    const refreshTokenPrm = uuidv4();

    const newTokens = await issueTokens({
      userId: user._id,
      accessTokenPrm,
      refreshTokenPrm,
    });

    await KeystoreService.create({
      userId: user._id,
      refreshToken: newTokens.refreshToken,
      accessTokenPrm,
      refreshTokenPrm,
    });

    ctx.status = httpStatus.OK;
    ctx.body = {
      accessToken: newTokens.accessToken,
      refreshToken: newTokens.refreshToken,
    };
  } catch (error) {
    ctx.throw(httpStatus.UNAUTHORIZED, error.message || 'Ошибка авторизации');
  }
});

router.get('/protected', authMiddleware, async (ctx) => {
  ctx.status = httpStatus.OK;
  ctx.body = {
    message: "It's protected route",
  };
});

module.exports = router;
