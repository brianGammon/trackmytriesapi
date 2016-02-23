'use strict'

let userController = (User) => {
  let jwt = require('jsonwebtoken')
  let bcrypt = require('bcryptjs')
  let config = require('../config.js')

  console.log(config.secretKey)

  let signup = (req, res, next) => {
    if (req.body.password !== req.body.confirmPassword) {
      return res.send(403, 'New password and confirm new password must match.')
    }

    let newUser = new User(req.body)

    // check for uniqueness
    User.findOne({email: req.body.email || ''}, (err, user) => {
      if (err) {
        return next(err)
      }

      if (user) {
        return res.send(403, 'A user with that email address already exists')
      } else {
        // hash the password
        hashPassword(newUser.password, (err, hash) => {
          if (err) {
            return next(err)
          }

          newUser.password = hash

          // save the user
          newUser.save((err, newUser) => {
            if (err) {
              return next(err)
            }

            // generate a token
            let token = generateJwtResponse(newUser)

            // send the token, and the user
            res.send(201, token)
          })
        })
      }
    })
  }

  let signin = (req, res, next) => {
    // Look up the user
    User.findOne({email: req.body.email || ''}, (err, user) => {
      if (err) {
        return next(err)
      }

      if (!user) {
        return res.send(404, 'User not found, or password incorrect')
      }

      bcrypt.compare(req.body.password, user.password, (err, result) => {
        if (err) {
          return next(err)
        }

        if (!result) {
          return res.send(404, 'User not found, or password incorrect')
        }

        // Generate a JWT
        let token = generateJwtResponse(user)

        // send the token along with the user object
        res.send(token)
      })
    })
  }

  let changePassword = (req, res, next) => {
    // Validate fields
    if (req.body.newPassword !== req.body.confirmNewPassword) {
      return res.send(403, 'New password and confirm new password must match.')
    }

    if (!req.body.currentPassword) {
      return next(new Error('Current Password is required.'))
    }

    // Look up the user
    User.findById(req.user._id, (err, user) => {
      if (err) {
        return next(err)
      }

      if (!user) {
        return next(new Error('Logged in user not found in users collection.'))
      }

      bcrypt.compare(req.body.currentPassword, user.password, (err, result) => {
        if (err) {
          return next(err)
        }

        if (!result) {
          return res.send(403, 'Current password incorrect')
        }

        // Hash the new password
        hashPassword(req.body.newPassword, (err, hash) => {
          if (err) {
            return next(err)
          }
          user.password = hash
          user.save((err) => {
            if (err) {
              return next(err)
            }
            // Add the token to the res/
            res.send('Password updated')
          })
        })
      })
    })
  }

  let requireSignIn = (req, res, next) => {
    // Check the header for an auth token
    // check header or url parameters or post parameters for token
    let token = (req.body ? req.body.token : null) || req.query.token || req.headers['x-access-token']
    if (!token) {
      return res.send(403, 'No access token provided.')
    }

    jwt.verify(token, config.secretKey, (err, decoded) => {
      if (err) {
        return next(err)
      }

			// if everything is good, save to request for use in other routes
      req.user = decoded
      next()
    })
  }

  let authorizeFb = (req, res, next) => {
    let request = require('request')
    let util = require('util')

    if (!req.body.accessToken) {
      return next(new Error('No facebook access token supplied'))
    }

    let url = util.format(config.fbApi, req.body.accessToken)

    request(url, (error, response, body) => {
      if (error) {
        return next(error)
      }

      if (response.statusCode !== 200) {
        return next(new Error('FB API returned status code: ' + response.status))
      }

      let fbInfo = JSON.parse(body)

      User.findOne({externalId: fbInfo.id, loginType: 'fb'}, (err, user) => {
        if (err) {
          return next(err)
        }

        if (!user) {
          // Need to create a new user
          let newUser = new User({
            name: fbInfo.name,
            email: fbInfo.email,
            password: 'not set',
            loginType: 'fb',
            externalId: fbInfo.id,
            roles: ['user']
          })

          newUser.save((err, newUser) => {
            if (err) {
              console.log(err)
              return next(err)
            }

            // generate a token token
            let token = generateJwtResponse(newUser)

            // send the token, and the user
            res.send(201, token)
          })
        } else {
          // Generate a JWT
          let token = generateJwtResponse(user)

          // send the token along with the user object
          res.send(token)
        }
      })
    })
  }

  function hashPassword (password, callback) {
    bcrypt.genSalt(10, (err, salt) => {
      if (err) {
        callback(err, null)
      }

      bcrypt.hash(password, salt, (err, hash) => {
        callback(err, hash)
      })
    })
  }

  function generateJwtResponse (user) {
    // strip the password
    user = user.toObject()
    if (user.password) {
      // We don't send passwords in the token
      delete user.password
    }
    let token = jwt.sign(user, config.secretKey, { expiresIn: '30days' })
    return {
      token: token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        loginType: user.loginType,
        roles: user.roles
      }
    }
  }

  return {
    signup,
    signin,
    changePassword,
    authorizeFb,
    requireSignIn
  }
}

module.exports = userController
