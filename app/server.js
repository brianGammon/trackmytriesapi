'use strict'

let restify = require('restify')
let app = restify.createServer()
let mongoose = require('mongoose')
let config = require('./config.js')
let Category = require('./models/categoryModel')
let Item = require('./models/itemModel')
let User = require('./models/userModel')

// Connect to Mongo
mongoose.connect(config.connectionString)

// Set up CORS, prep app
app.pre(restify.pre.sanitizePath())
restify.CORS.ALLOW_HEADERS.push('x-access-token')
app.use(restify.CORS())
app.use(restify.fullResponse())
app.use(restify.queryParser())
app.use(restify.bodyParser())

// Routing
let categoryRouter = require('./routes/categoryRoutes')(Category, User)
let itemRouter = require('./routes/itemRoutes')(Item, User, Category)
let userRouter = require('./routes/userRoutes')(User)
categoryRouter.applyRoutes(app, '/categories')
itemRouter.applyRoutes(app, '/items')
userRouter.applyRoutes(app, '/user')

// Hello world route
app.get('/', (req, res) => {
  res.send('Welcome to the Track My Tries API')
})

// Global error handling
// app.use(function(err, req, res, next) {
//   res.status(err.status || 500)
//   res.send({
//     message: err.message,
//     error: err
//   })
// })

// Start me up
app.listen(config.serverPort, () => {
  console.log(`${config.appName} is running on ${app.url}`)
})
