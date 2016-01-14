var userController = function(User){
  var jwt = require('jsonwebtoken'),
      bcrypt = require('bcryptjs'),
      config = require('../config.js');

  console.log(config.secretKey);

  function hashPassword(password, callback) {
    bcrypt.genSalt(10, function(err, salt) {
      bcrypt.hash(password, salt, function(err, hash) {
          callback(err, hash);
      });
    });
  }

  function generateJwtResponse(user) {
    // strip the password
    user = user.toObject();
    if (user.password) {
      // We don't send passwords in the token
      delete user.password;
    }

    var token = jwt.sign(user, config.secretKey, { expiresIn: "30days" })

    return { token: token, user: {_id: user._id, email: user.email, roles: user.roles}};
  }

  var signup = function(req,res, next){
    if (req.body.password !== req.body.confirmPassword) {
      return res.send(403, "New password and confirm new password must match.");
    }

    var newUser = new User(req.body);

    // check for uniqueness
    User.findOne({email: req.body.email || ''}, function (err, user) {
      if (err) {
        return next(err);
      }

      if (user) {
        return res.send(403, "A user with that email address already exists");
      } else {
        // hash the password
        hashPassword(newUser.password, function(err, hash) {
          newUser.password = hash;

          // save the user
          newUser.save(function(err,newUser){
            if(err) {
              return next(err);
            }

            // generate a jwt token
            var jwt = generateJwtResponse(newUser);

            // send the jwt, and the user
            res.send(201, jwt);
          });
        });
      }
    });
  }

  var signin = function (req, res, next) {
    // Look up the user
    User.findOne({email: req.body.email || ''},function(err,user) {
      if(err){
        return next(err);
      }

      if(!user) {
        return res.send(404, "User not found, or password incorrect");
      }

      bcrypt.compare(req.body.password, user.password, function(err, result) {
        if (err){
          return nex(err);
        }

        if (!result) {
          return res.send(404, "User not found, or password incorrect");
        }

        // Generate a JWT
        var jwt = generateJwtResponse(user);

        // send the jwt along with the user object
        res.send(jwt);
      });
    });
  }

  var changePassword = function (req, res, next) {
    // Validate fields
    if (req.body.newPassword !== req.body.confirmNewPassword) {
      return res.send(403, "New password and confirm new password must match.");
    }

    if(!req.body.currentPassword) {
      return next(new Error('Current Password is required.'));
    }

    // Look up the user
    User.findById(req.user._id,function(err,user){
      if(err){
        return next(err);
      }

      if(!user) {
        return next(new Error("Logged in user not found in users collection."))
      }

      bcrypt.compare(req.body.currentPassword, user.password, function(err, result){
        if (err) {
          return next(err);
        }

        if (!result) {
          return res.send(403, "Current password incorrect");
        }

        // Hash the new password
        hashPassword(req.body.newPassword, function(err, hash){
          if (err) {
            return next(err);
          }
          user.password = hash;
          user.save(function(err){
            if(err){
              return next(err);
            }
            // Add the jwt to the res/
            res.send("Password updated");
          });
        });
      });
    });
  }

  var requireSignIn = function(req, res, next){
    // Check the header for an auth token
    // check header or url parameters or post parameters for token
  	var token = (req.body ? req.body.token : null) || req.query.token || req.headers['x-access-token'];
    if (!token) {
  		return res.send(403, "No access token provided.");
  	}

		jwt.verify(token, config.secretKey, function(err, decoded) {
			if (err) {
				return next(err);
			}

			// if everything is good, save to request for use in other routes
			req.user = decoded;
			next();
		});
  }

  return {
    signup: signup,
    signin: signin,
    changePassword: changePassword,
    requireSignIn: requireSignIn
  }
}

module.exports = userController;