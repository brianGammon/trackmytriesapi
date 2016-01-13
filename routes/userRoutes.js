var userRoutes = function(User){
  var Router = require('restify-router').Router;
  var userRouter = new  Router();

  var userController = require('../controllers/userController')(User);

  userRouter.post('/password', userController.requireSignIn, userController.changePassword);
	userRouter.post('/signup', userController.signup);
	userRouter.post('/signin', userController.signin);

  return userRouter;
};

module.exports = userRoutes;
