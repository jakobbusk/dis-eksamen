var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var responseTime = require('response-time')
var indexRouter = require('./routes/index');
var rateLimiter = require('express-rate-limit');
var RedisStore = require('rate-limit-redis');
var Redis = require('ioredis');
const helmet = require('helmet');
const dotenv = require('dotenv');
dotenv.config();

var app = express();
app.use(helmet());


// REF: https://expressjs.com/en/guide/behind-proxies.html
app.set('trust proxy', 1); // sætter trust til digital ocean load balancer

var redisClient = new Redis(process.env.REDIS_URL);

const limiter = rateLimiter({
  windowMs: 1 * 60 * 1000,
  limit: 60, // 60 gange per minut per IP
  standardHeaders: true,
  legacyHeaders: false,
  store: new RedisStore.RedisStore({
    sendCommand: (...args) => redisClient.call(...args),
  })
})

// log ip
app.use((req, res, next) => {
  console.log("remoteAddress:", req.socket.remoteAddress);
  console.log("x-forwarded-for:", req.headers["x-forwarded-for"]);
  console.log("x-real-ip:", req.headers["x-real-ip"]);
  console.log("req.ip:", req.ip);
  next();
});

app.use(limiter);

app.use(responseTime())
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use('/', indexRouter);

module.exports = app;
