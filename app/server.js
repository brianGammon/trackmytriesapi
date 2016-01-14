var restify = require('restify'),
    app = restify.createServer(),
    mongoose = require('mongoose'),
    config = require('./config.js'),
    Category = require('./models/categoryModel'),
    Item = require('./models/itemModel'),
    User = require('./models/userModel'),
    categoryRouter,
    itemRouter,
    userRouter;

// Connect to Mongo
mongoose.connect(config.connectionString);

// Set up CORS, prep app
app.pre(restify.pre.sanitizePath());
restify.CORS.ALLOW_HEADERS.push('x-access-token');
app.use(restify.CORS());
app.use(restify.fullResponse());
app.use(restify.queryParser());
app.use(restify.bodyParser());

// Routing
categoryRouter = require('./routes/categoryRoutes')(Category, User);
itemRouter = require('./routes/itemRoutes')(Item, User, Category);
userRouter = require('./routes/userRoutes')(User);
categoryRouter.applyRoutes(app, '/categories');
itemRouter.applyRoutes(app, '/items');
userRouter.applyRoutes(app, '/user');

// Hello world route
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

// Start me up
app.listen(config.serverPort, function(){
    console.log('%s is running on %s', config.appName, app.url);
});
