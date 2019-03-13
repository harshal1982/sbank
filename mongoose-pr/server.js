
var express = require('express');
var app = express();
var path = require('path');
var passport = require('passport');
var flash = require('connect-flash');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var config = require('./settings/config');
var jwt = require('jsonwebtoken');
var debug = require('debug')('gateway:server:appjs');
var commonFunctions = require('./utils/commonFunctions');
var helmet = require('helmet');
var cluster = require('cluster');
//const MongoStore = require('connect-mongo')(session);
//const db = require('./settings/db');
const http = require('http');
require('./settings/passport')(passport);
//var RateLimit = require('express-rate-limit');

// if (cluster.isMaster) {
// 	// Count the machine's CPUs
// 	var cpuCount = require('os').cpus().length;

// 	// Create a worker for each CPU
// 	for (var i = 0; i < cpuCount; i += 1) {
// 		cluster.fork();
// 	}
// } else {
app.use(helmet());
app.set('trust proxy', 1);
// var limiter = new RateLimit({
// 	windowMs: 15 * 60 * 1000, // 15 minutes 
// 	max: 100, // limit each IP to 100 requests per windowMs 
// 	delayMs: 0 // disable delaying - full speed until the max limit is reached 
// });
// app.use(limiter);
var sessionStore = new session.MemoryStore();

app.set('port', process.env.PORT || 3000);

app.use(morgan('dev'));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs'); // set up ejs for templating

app.use(express.static(path.join(__dirname, 'public'), { extensions: ['html', 'htm'] }));

app.use(session({
	secret: config.secret,
	cookie: {
		maxAge: config.maxAge,
		secure: config.secureSession,
		httpOnly: config.httpOnly,
		name: 'gatewaySid',
		path: "/"
	},
	saveUninitialized: true,
	resave: false,
	//store: new MongoStore({ mongooseConnection: db }) //sessionStore //
}));

app.set('secret', config.secret);
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

app.use(function (req, res, next) {
	global.__appRoot = path.resolve(__dirname);
	next();
});

// login & logout routes
require('./routes/login')(app, passport);

//token authentication
require('./routes/jwtAuthentication')(app);

// service api routes
require('./routes/actionAPI')(app, passport);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
});

// error handler
app.use(function (err, req, res, next) {
	commonFunctions.logObj(debug, req.sessionID, 'Environment:-' + config.env);
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'dev' ? err : {};
	debug(req.query.web);
	// render the error page
	res.status(err.status || 500);
	if (err.status == 404 && !req.query.web) {
		res.render('error');
	} else {
		res.send(commonFunctions.returnFailureObj(debug, req.sessionID, err.message));
	}
});

http.createServer(app).listen(app.get('port'), function () {
	console.log("Listening on port " + app.get('port'));
});
// }

// cluster.on('exit', function (worker) {
// 	// Replace the dead worker,
// 	// we're not sentimental
// 	console.log('Worker %d died :(', worker.id);
// 	cluster.fork();
// });
