const Koa = require('koa');
const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');
const helmet = require('koa-helmet');
const cors = require('@koa/cors');
const logger = require('koa-logger');
const mongoose = require('mongoose');

const { env, mongodbUri } = require('./config');
const notFoundHandler = require('./middlewares/notFound');
const erorrHandler = require('./middlewares/error');

const app = new Koa();
const router = new Router();

const authRoute = require('./routes/auth.route');

router.use('/auth', authRoute.routes());

mongoose.connect(mongodbUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

mongoose.connection.on('erorr', console.error);

if (env === 'development') {
  app.use(logger());
}

app.use(erorrHandler);

app.use(helmet());
app.use(cors());
app.use(
  bodyParser({
    enableTypes: ['json'],
  }),
);

app.use(router.allowedMethods());
app.use(router.routes());

app.use(notFoundHandler);

module.exports = app;
