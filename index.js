require('dotenv').config();
const express = require('express');
const ejsLayouts = require('express-ejs-layouts');
const session = require('express-session');
const passport = require('./config/ppConfig');
const flash = require('connect-flash');
const isLoggedIn = require('./middleware/isLoggedIn');
const helmet = require('helmet');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const db = require('./models');

const methodOverride = require('method-override');

const app = express();

app.set('view engine', 'ejs');

app.use(methodOverride('_method'));

app.use(require('morgan')('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(express.static(__dirname + "/public"));
app.use(ejsLayouts);
app.use(helmet());


const sessionStore = new SequelizeStore({
  db: db.sequelize,
  //this sets the session timer to 30min:
  expiration: 1000 * 60 *30
})

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  store: sessionStore
}));

sessionStore.sync();

app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

app.use(function(req, res, next){
  res.locals.alerts = req.flash();
  res.locals.currentUser = req.user;

  next();
});

app.get('/', function(req, res) {
  console.log(`User is ${req.user ? req.user.firstName : 'not logged in'}`);
  res.render('index');
});

app.get('/profile', isLoggedIn, function(req, res) {
  res.render('profile');
});

// Auth lock a controller
app.use('/auth', require('./controllers/auth'));
// app.use('/', isLoggedIn, require('./controllers/test'));

// Import controllers (routes from file) here:
app.use('/laugh', require('./controllers/laugh'));
app.use('/affirm', require('./controllers/affirm'));


var server = app.listen(process.env.PORT || 3000);

module.exports = server;
