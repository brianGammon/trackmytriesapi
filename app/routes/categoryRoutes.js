var categoryRoutes = function (Category, User) {
  var Router = require('restify-router').Router
  var categoryRouter = new Router()

  var categoryController = require('../controllers/categoryController')(Category)
  var userController = require('../controllers/userController')(User)

  categoryRouter.post('/', userController.requireSignIn, categoryController.insert)
  categoryRouter.get('/', categoryController.getAll)

  categoryRouter.get('/:categoryId', categoryController.getById, function (req, res) {
    res.json(req.category)
  })
  categoryRouter.put('/:categoryId', categoryController.getById, userController.requireSignIn, categoryController.update)
  categoryRouter.del('/:categoryId', categoryController.getById, userController.requireSignIn, categoryController.delete)

  return categoryRouter
}

module.exports = categoryRoutes
