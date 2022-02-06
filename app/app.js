const express = require('express');
const hbs = require('express-handlebars');
const session = require('express-session');
const mongoose = require('mongoose');
const { port, dburl, sessionKey } = require('./config'); // The given values are stored in the config file, where they are taken from the environment variables
const { mainMiddleware } = require('../middleware/main-middleware');
const { isAuth } = require('../middleware/is-auth');
const { MainRouter } = require('../routes/main-routes');
const { AdminRouter } = require('../routes/admin-routes');
const { UserRouter } = require('../routes/user-routes');
const { handlebarsHelpers } = require('../utils/handlebars-helpers');

class MyApp {
  constructor() {
    this._app();
    this._db();
    this._settings();
    this._middleware();
    this._views();
    this._routes();
    this._run();
  }

  _app() {
    this.app = express();
  }

  // eslint-disable-next-line class-methods-use-this
  _db() {
    mongoose.connect(dburl, () => {
      console.log('DB is connected');
    });
  }

  _middleware() {
    this.app.use('/', mainMiddleware);
    this.app.use('/admin/', isAuth);
  }

  _views() {
    this.app.engine('.hbs', hbs({ extname: '.hbs', helpers: handlebarsHelpers }));
    this.app.set('view engine', 'hbs');
  }

  _settings() {
    this.app.use(express.static('static'));
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(session({
      secret: sessionKey,
      saveUninitialized: true,
      cookie: { maxAge: 1000 * 60 * 60 },
      resave: false,
    }));
  }

  _routes() {
    this.app.use('/', MainRouter);
    this.app.use('/', UserRouter);
    this.app.use('/admin', AdminRouter);
  }

  _run() {
    this.app.listen(port, 'localhost', () => {
      console.log('Server is running');
    });
  }
}

new MyApp();
