'use strict'

let itemRoutes = (Item, User, Category) => {
  let Router = require('restify-router').Router
  let itemRouter = new Router()

  let itemController = require('../controllers/itemController')(Item, Category)
  let userController = require('../controllers/userController')(User)

  // Base routes for getting all, or creating
  itemRouter.post('/', userController.requireSignIn, itemController.addItem)
  itemRouter.get('/', userController.requireSignIn, itemController.getItems)

  // Route for pulling statistics
  itemRouter.get('/stats', userController.requireSignIn, itemController.getStats)

  // Item by ID routes
  itemRouter.get('/:itemId', userController.requireSignIn, itemController.getItemById, itemController.requireAuthorization, function (req, res) {
    res.json(req.item)
  })
  itemRouter.put('/:itemId', userController.requireSignIn, itemController.getItemById, itemController.requireAuthorization, itemController.updateItem)
  itemRouter.del('/:itemId', userController.requireSignIn, itemController.getItemById, itemController.requireAuthorization, itemController.deleteItem)

  return itemRouter
}

module.exports = itemRoutes
