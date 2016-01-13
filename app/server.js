var restify = require('restify'),
    mongoose = require('mongoose'),
    nconf = require('nconf'),
    util = require('util');

// Loap up our config settings, args & env override the json file
console.log(__dirname);
nconf.argv().env().file({ file: 'config.json' });

// Set up the connection to Mongolab, based on config settings
var dbconf = nconf.get('mongodb');
var connectionString = 'mongodb://localhost/' + dbconf.db;
if (dbconf.host !== 'localhost') {
  connectionString = util.format(
    'mongodb://%s:%s@%s:%s/%s', dbconf.username, dbconf.password, dbconf.host, dbconf.port, dbconf.db);
}
var db = mongoose.connect(connectionString);

var Category = require('./models/categoryModel');
var Item = require('./models/itemModel');
var User = require('./models/userModel');

var app = restify.createServer();

app.pre(restify.pre.sanitizePath());

// Set up CORS
restify.CORS.ALLOW_HEADERS.push('x-access-token');
app.use(restify.CORS());
app.use(restify.fullResponse());

app.use(restify.queryParser());
app.use(restify.bodyParser());

var categoryRouter = require('./routes/categoryRoutes')(app, Category, User);
var itemRouter = require('./routes/itemRoutes')(Item, User, Category);
var userRouter = require('./routes/userRoutes')(User);

categoryRouter.applyRoutes(app, '/categories');
itemRouter.applyRoutes(app, '/items');
userRouter.applyRoutes(app, '/user');

app.get('/',function(req, res){
    res.send("Welcome to the Track My Tries API");
});

// Global error handling
// app.use(function(err, req, res, next) {
//   res.status(err.status || 500);
//   res.send({
//     message: err.message,
//     error: err
//   });
// });

app.listen(nconf.get('PORT'), function(){
    console.log('%s is running on %s', nconf.get('name'), app.url);
});
