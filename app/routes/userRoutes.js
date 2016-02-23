'use strict'

let userRoutes = (User) => {
  let Router = require('restify-router').Router
  let userRouter = new Router()

  let userController = require('../controllers/userController')(User)

  userRouter.post('/password', userController.requireSignIn, userController.changePassword)
  userRouter.post('/signup', userController.signup)
  userRouter.post('/signin', userController.signin)
  userRouter.post('/auth/fb', userController.authorizeFb)

  return userRouter
}

module.exports = userRoutes
