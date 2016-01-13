var itemRoutes = function(Item, User, Category){
  var Router = require('restify-router').Router;
  var itemRouter = new  Router();

  var itemController = require('../controllers/itemController')(Item, Category);
  var userController = require('../controllers/userController')(User);

  // Base routes for getting all, or creating
  itemRouter.post('/', userController.requireSignIn, itemController.addItem)
  itemRouter.get('/', userController.requireSignIn, itemController.getItems);

  // Route for pulling personal records
  itemRouter.get('/records', userController.requireSignIn, itemController.getPersonalRecords);

  // Item by ID routes
  itemRouter.get('/:itemId', userController.requireSignIn, itemController.getItemById, itemController.requireAuthorization, function(req,res){
    res.json(req.item);
  })
  itemRouter.put('/:itemId', userController.requireSignIn, itemController.getItemById, itemController.requireAuthorization, itemController.updateItem)
  itemRouter.del('/:itemId', userController.requireSignIn, itemController.getItemById, itemController.requireAuthorization, itemController.deleteItem);

  return itemRouter;
};

module.exports = itemRoutes;
