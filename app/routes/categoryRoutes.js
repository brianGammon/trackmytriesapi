'use strict'

let categoryRoutes = (Category, User) => {
  let Router = require('restify-router').Router
  let categoryRouter = new Router()

  let categoryController = require('../controllers/categoryController')(Category)
  let userController = require('../controllers/userController')(User)

  categoryRouter.post('/', userController.requireSignIn, categoryController.insert)
  categoryRouter.get('/', categoryController.getAll)

  categoryRouter.get('/:categoryId', categoryController.getById, (req, res) => {
    res.json(req.category)
  })
  categoryRouter.put('/:categoryId', categoryController.getById, userController.requireSignIn, categoryController.update)
  categoryRouter.del('/:categoryId', categoryController.getById, userController.requireSignIn, categoryController.delete)

  return categoryRouter
}

module.exports = categoryRoutes
