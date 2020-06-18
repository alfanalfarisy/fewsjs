var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var logger = require('morgan');
var flash = require('express-flash');
var session = require('express-session');
var mongoose = require('mongoose');
var expressValidator = require('express-validator');
var methodOverride = require('method-override');
var app = express();
const https = require('https')
const fs = require('fs')
const cors = require('cors')

var index = require('./routes/index');
var api = require('./routes/api');
var admin = require('./routes/admin');
var users = require('./routes/users');
var socketHub = require('./routes/socketHub');
var article = require('./routes/article');

// server = https.createServer({
//   key: fs.readFileSync('server.key'),
//   cert: fs.readFileSync('server.cert')
// }, app).listen(3000, () => {
//   console.log('Listening...')
// })


//MongoDB mongoose
mongoose.Promise = global.Promise;
mongoose.set('useCreateIndex', true)
mongoose.connect('mongodb://projek20:projek20@localhost/siagabanjir?replicaSet=rs0',{useNewUrlParser: true,useUnifiedTopology: true});
// mongoose.connect('mongodb://projek20:projek20@198.211.106.64:27017/siagabanjir',{useNewUrlParser: true,useUnifiedTopology: true});

//app io
app.io = require('socket.io')();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: true, limit: '1mb'}));
app.use(bodyParser.json({limit: '5mb'}));
app.use(flash());
app.use(express.static(path.join(__dirname, '/public')));
app.use(expressValidator());
app.use(methodOverride(function(req, res){
    if (req.body && typeof req.body == 'object' && '_method' in req.body)
    {
        var method = req.body._method;
        delete req.body._method;
        return method;
    }
}));


app.use(session({
  secret:"projek20",
  resave: true,
  saveUninitialized: true
  })
)

app.use('/', index.router);
app.use('/users', users);
app.use('/socketHub', socketHub.router);
app.use('/admin', admin.router);
app.use('/article', article);
app.use('/api', api);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

admin.sck(app.io);
socketHub.sck(app.io);
index.sck(app.io);
module.exports = app;

// app.io.attach(server);