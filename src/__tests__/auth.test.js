const agent = require('supertest-koa-agent');
const { v4: uuidv4 } = require('uuid');
const app = require('../app');
const User = require('../models/user.model');
const Keystore = require('../models/keystore.model');

const issueToken = require('./helpers/issueToken');

const server = agent(app);

describe('Авторизация', () => {
  beforeAll(async (done) => {
    await User.deleteMany({});
    await Keystore.deleteMany({});

    done();
  });

  it('Пользователь может успешно получить пару токенов accessToken и refreshToken', async () => {
    const userId = uuidv4();
    const res = await server.get('/auth/issueTokens').query({ GUID: userId });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('accessToken');
    expect(res.body).toHaveProperty('refreshToken');
  });

  it('Пользователь может получить новую пару токенов, использую refreshToken', async () => {
    const userId = uuidv4();
    const firstRes = await server
      .get('/auth/issueTokens')
      .query({ GUID: userId });

    expect(firstRes.status).toBe(200);
    expect(firstRes.body).toHaveProperty('accessToken');
    expect(firstRes.body).toHaveProperty('refreshToken');

    const { accessToken, refreshToken } = firstRes.body;

    const secondRes = await server
      .post('/auth/refresh')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        refreshToken,
      });

    expect(secondRes.status).toBe(200);
    expect(secondRes.body).toHaveProperty('accessToken');
    expect(secondRes.body).toHaveProperty('refreshToken');
  });

  it('Пользователь не может получить новую пару токенов, использую просроченный Refresh токен', async () => {
    const userId = uuidv4();
    const firstRes = await server
      .get('/auth/issueTokens')
      .query({ GUID: userId });

    expect(firstRes.status).toBe(200);
    expect(firstRes.body).toHaveProperty('accessToken');
    expect(firstRes.body).toHaveProperty('refreshToken');

    const { accessToken } = firstRes.body;
    const expiredRefreshToken = issueToken(
      { sub: userId, prm: uuidv4() },
      { expiresIn: '1ms' },
    );

    const secondRes = await server
      .post('/auth/refresh')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        refreshToken: expiredRefreshToken,
      });

    expect(secondRes.status).toBe(401);
  });

  it('Пользователь не может использовать уже использованный Refresh токен для получения новых токенов', async () => {
    const userId = uuidv4();
    const firstRes = await server
      .get('/auth/issueTokens')
      .query({ GUID: userId });

    expect(firstRes.status).toBe(200);
    expect(firstRes.body).toHaveProperty('accessToken');
    expect(firstRes.body).toHaveProperty('refreshToken');

    const { accessToken, refreshToken } = firstRes.body;

    const secondRes = await server
      .post('/auth/refresh')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        refreshToken,
      });

    expect(secondRes.status).toBe(200);
    expect(secondRes.body).toHaveProperty('accessToken');
    expect(secondRes.body).toHaveProperty('refreshToken');

    const thirdRes = await server
      .post('/auth/refresh')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        refreshToken,
      });

    expect(thirdRes.status).toBe(401);
  });

  it('Refresh операцию для Access токена можно выполнить только тем Refresh токеном который был выдан вместе с ним', async () => {
    const userId = uuidv4();
    const firstRes = await server
      .get('/auth/issueTokens')
      .query({ GUID: userId });

    expect(firstRes.status).toBe(200);
    expect(firstRes.body).toHaveProperty('accessToken');
    expect(firstRes.body).toHaveProperty('refreshToken');

    const {
      accessToken: accessTokenOne,
      refreshToken: refreshTokenOne,
    } = firstRes.body;

    const secondRes = await server
      .get('/auth/issueTokens')
      .query({ GUID: userId });

    expect(secondRes.status).toBe(200);
    expect(secondRes.body).toHaveProperty('accessToken');
    expect(secondRes.body).toHaveProperty('refreshToken');

    const {
      accessToken: accessTokenTwo,
      refreshToken: refreshTokenTwo,
    } = secondRes.body;

    const thirdRes = await server
      .post('/auth/refresh')
      .set('Authorization', `Bearer ${accessTokenOne}`)
      .send({
        refreshToken: refreshTokenTwo,
      });

    expect(thirdRes.status).toBe(401);
  });
});
