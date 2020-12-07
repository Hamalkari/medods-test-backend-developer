const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const helmet = require('koa-helmet');
const cors = require('@koa/cors');
const logger = require('koa-logger');
const mongoose = require('mongoose');

const { env, mongodbUri } = require('./config');
const notFoundHandler = require('./midddlewares/notFound');
const erorrHandler = require('./midddlewares/error');

const app = new Koa();

mongoose.connect(mongodbUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
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

app.use(notFoundHandler);

module.exports = app;