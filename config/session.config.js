const session = require('express-session');
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo')(session);

// vamos a utilizar este middleware en app.js,por lo tanto lo tenemos que exportar
module.exports = app => {
  app.use(
    session({
      secret: process.env.SESS_SECRET,
      resave: false,
      saveUninitialized: true,
      cookie: { maxAge: 1000 * 60 * 60 * 24 }, // 60sec * 60min * 24h => 1 day
      store: new MongoStore({
        // <== ADDED !!!
        mongooseConnection: mongoose.connection,
        // ttl => time to live
        ttl: 1000 * 60 * 60 * 24 // 60sec * 60min * 24h => 1 day
      })
    })
  );
};
