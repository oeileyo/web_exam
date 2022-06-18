var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

const cheerio = require('cheerio');
const rp = require('request-promise')
const request = require('request');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// app.use('/', indexRouter);
// app.use('/users', usersRouter);

// catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   next(createError(404));
// });

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.get('/', (req, res) => {
  res.sendFile(__dirname + "/main.html")
    // res.send('dd')
});

app.get('/exchange/:val', (req, res) => {
  let oil = req.params.val;
  const url = `https://ru.investing.com/commodities/${oil}`
  rp(url)
      .then(function(html){
        const $ = cheerio.load(html);
        let data = [];
        $('#__next > div.desktop\\:relative.desktop\\:bg-background-default > div > div > div.grid.gap-4.tablet\\:gap-6.grid-cols-4.tablet\\:grid-cols-8.desktop\\:grid-cols-12.grid-container--fixed-desktop.general-layout_main__3tg3t > main > div > div.instrument-header_instrument-header__1SRl8.mb-5.bg-background-surface.tablet\\:grid.tablet\\:grid-cols-2 > div:nth-child(2) > div.instrument-price_instrument-price__3uw25.flex.items-end.flex-wrap.font-bold > span').each((idx, elem)=>{
          const price = $(elem).text();
          data.push(price);
        });

        $('#__next > div.desktop\\:relative.desktop\\:bg-background-default > div > div > div.grid.gap-4.tablet\\:gap-6.grid-cols-4.tablet\\:grid-cols-8.desktop\\:grid-cols-12.grid-container--fixed-desktop.general-layout_main__3tg3t > main > div > div.instrument-header_instrument-header__1SRl8.mb-5.bg-background-surface.tablet\\:grid.tablet\\:grid-cols-2 > div:nth-child(2) > div.instrument-price_instrument-price__3uw25.flex.items-end.flex-wrap.font-bold > div.text-xl.flex.items-end.flex-wrap > span.instrument-price_change-value__jkuml.ml-2\\.5.text-negative-main').each((idx, elem)=>{
          const diff = $(elem).text();
          data.push(diff);
        });
          console.log(data)
        res.send(data);
      })
      .catch(function(err){
        console.log(err);
      })
});


module.exports = app;
