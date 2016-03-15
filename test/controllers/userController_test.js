/* globals describe, it, beforeEach, afterEach */
'use strict'

let chai = require('chai')
let expect = chai.expect
let sinon = require('sinon')
let sinonChai = require('sinon-chai')
let proxyquire = require('proxyquire')
chai.use(sinonChai)

describe('User Controller Tests', function () {
  // Fake Mongoose model for testing
  class User {
    constructor (user) {
      this.email = user.email
      this.name = user.name
      this.roles = user.roles
      this.loginType = user.loginType
      this.password = user.password
      this.externalId = user.externalId
      this.save = saveStub
      this.toObject = function () {
        return {
          email: this.email,
          name: this.name,
          loginType: this.loginType,
          externalId: this.externalId,
          roles: this.roles,
          password: this.password
        }
      }
    }
  }
  User.findOne = sinon.stub()
  User.findById = sinon.stub()

  // Set up the various mocks/stubs
  let bcryptMock = {
    genSalt: sinon.stub(),
    hash: sinon.stub(),
    compare: sinon.stub()
  }
  let jwtMock = {
    sign: sinon.stub(),
    verify: sinon.stub()
  }
  let requestMock = sinon.stub()
  let saveStub = sinon.stub()
  let req = {}
  let res = {
    status: sinon.spy(),
    send: sinon.spy()
  }
  let userFindResult
  let userController = proxyquire('../../app/controllers/userController', {
    'request': requestMock,
    'jsonwebtoken': jwtMock,
    'bcryptjs': bcryptMock
  })(User)

  beforeEach(function () {
    userFindResult = new User({
      email: 'test@test.com',
      loginType: 'local',
      name: 'Tester',
      roles: ['user'],
      password: '$2a$10$ypRm.aKBx3463hmnFFIgZebmdz0PGHihpMn5Wwco3v4k7jsgsA79q'
    })
  })

  afterEach(function () {
    // Reset all the stubs and spies, might be a better way than this...
    saveStub.reset()
    res.send.reset()
    bcryptMock.genSalt.reset()
    bcryptMock.hash.reset()
    bcryptMock.compare.reset()
    jwtMock.sign.reset()
    jwtMock.verify.reset()
    requestMock.reset()
    req = {}
    res = {
      status: sinon.spy(),
      send: sinon.spy()
    }
  })

  describe('signup tests', function () {
    beforeEach(function () {
      req.body = {
        email: 'test@test.com',
        loginType: 'local',
        name: 'Tester',
        roles: ['user'],
        password: 'test123',
        confirmPassword: 'test123'
      }
    })

    it('should return user and token with successful sign up', function (done) {
      let saveResult = new User(req.body)

      let expectedSignUpResult = {
        token: 'testJwtPart1.testJwtPart2.testJwtPart3',
        user: {
          _id: undefined,
          email: 'test@test.com',
          loginType: 'local',
          name: 'Tester',
          roles: ['user']
        }
      }

      bcryptMock.genSalt.yields(null, 'testSalt')
      bcryptMock.hash.yields(null, 'testHash')
      jwtMock.sign.returns('testJwtPart1.testJwtPart2.testJwtPart3')
      User.findOne.yields(null, null)
      saveStub.yields(null, saveResult)

      userController.signup(req, res, function (err) {
        expect(err).to.be.undefined
        expect(res.send).to.have.been.calledWith(201, expectedSignUpResult)
        done()
      })
    })

    it('should return error if email is not supplied', function () {
      req.body.email = null

      userController.signup(req, res)
      expect(res.send).to.have.been.calledWith(403, 'User email is required')
    })

    it('should return error if user already exists', function () {
      User.findOne.yields(null, {email: 'test@test.com'})

      userController.signup(req, res)
      expect(res.send).to.have.been.calledWith(403, 'A user with that email address already exists')
    })

    it('should return error if password does not match confirm password', function () {
      req.body.confirmPassword = 'test321'

      userController.signup(req, res)
      expect(res.send).to.have.been.calledWith(403, 'New password and confirm new password must match')
    })

    it('should return error if password does not meet complexity rules')

    it('should return error if user query fails', function (done) {
      User.findOne.yields('FINDERROR', null)

      userController.signup(req, res, function (err) {
        expect(err).to.equal('FINDERROR')
        expect(res.send).to.not.have.been.called
        done()
      })
    })

    it('should return error if bcrypt fails to generate Salt', function (done) {
      bcryptMock.genSalt.yields('SALTERROR', null)
      User.findOne.yields(null, null)

      userController.signup(req, res, function (err) {
        expect(err).to.equal('SALTERROR')
        expect(res.send).to.not.have.been.called
        done()
      })
    })

    it('should return error if bcrypt fails to create password hash', function (done) {
      bcryptMock.genSalt.yields(null, 'testSalt')
      bcryptMock.hash.yields('HASHERROR', null)
      User.findOne.yields(null, null)

      userController.signup(req, res, function (err) {
        expect(err).to.equal('HASHERROR')
        expect(res.send).to.not.have.been.called
        done()
      })
    })

    it('should return error if save of new user account fails', function (done) {
      bcryptMock.genSalt.yields(null, 'testSalt')
      bcryptMock.hash.yields(null, 'testHash')
      User.findOne.yields(null, null)
      saveStub.yields('SAVEERROR', null)

      userController.signup(req, res, function (err) {
        expect(err).to.equal('SAVEERROR')
        expect(res.send).to.not.have.been.called
        done()
      })
    })
  })

  describe('signin tests', function () {
    beforeEach(function () {
      req.body = {
        email: 'test@test.com',
        password: 'test123'
      }
    })

    it('should return user and token with successful login', function (done) {
      let expectedSignInResult = {
        token: 'testJwtPart1.testJwtPart2.testJwtPart3',
        user: {
          _id: undefined,
          email: 'test@test.com',
          loginType: 'local',
          name: 'Tester',
          roles: ['user']
        }
      }

      // delete password property, just for unit test coverage
      delete userFindResult.password

      User.findOne.yields(null, userFindResult)
      bcryptMock.compare.yields(null, true)
      jwtMock.sign.returns('testJwtPart1.testJwtPart2.testJwtPart3')

      userController.signin(req, res, function (err) {
        expect(err).to.be.undefined
        expect(res.send).to.have.been.calledWith(200, expectedSignInResult)
        done()
      })
    })

    it('should return error on signin if email is not supplied', function () {
      req.body.email = null

      userController.signin(req, res)
      expect(res.send).to.have.been.calledWith(403, 'User email is required')
    })

    it('should return error if user not found', function (done) {
      User.findOne.yields(null, null)

      userController.signin(req, res, function (err) {
        expect(err).to.be.undefined
        expect(res.send).to.have.been.calledWith(404, 'User not found, or password incorrect')
        done()
      })
    })

    it('should return error if password is incorrect', function (done) {
      User.findOne.yields(null, userFindResult)
      bcryptMock.compare.yields(null, false)

      userController.signin(req, res, function (err) {
        expect(err).to.be.undefined
        expect(res.send).to.have.been.calledWith(404, 'User not found, or password incorrect')
        done()
      })
    })

    it('should return error if user query fails', function (done) {
      User.findOne.yields('USERFINDERROR', null)

      userController.signin(req, res, function (err) {
        expect(err.toString()).to.contain('USERFINDERROR')
        expect(res.send).to.not.have.been.called
        done()
      })
    })

    it('should return error if bcrypt check fails', function (done) {
      User.findOne.yields(null, userFindResult)
      bcryptMock.compare.yields('BCRYPTERROR', false)

      userController.signin(req, res, function (err) {
        expect(err.toString()).to.contain('BCRYPTERROR')
        expect(res.send).to.not.have.been.called
        done()
      })
    })
  })

  describe('changePassword tests', function () {
    beforeEach(function () {
      req.body = {
        _id: '1234567890',
        email: 'test@test.com',
        currentPassword: 'test123',
        newPassword: 'test124',
        confirmNewPassword: 'test124'
      }
      req.user = {
        _id: '1234567890',
        email: 'test@test.com',
        loginType: 'local',
        name: 'Tester',
        roles: ['user'],
        password: '$2a$10$ypRm.aKBx3463hmnFFIgZebmdz0PGHihpMn5Wwco3v4k7jsgsA79q'
      }
    })

    it('should return 201 status on successful password change', function (done) {
      bcryptMock.compare.yields(null, true)
      bcryptMock.genSalt.yields(null, 'testSalt')
      bcryptMock.hash.yields(null, 'testHash')
      jwtMock.sign.returns('testJwtPart1.testJwtPart2.testJwtPart3')
      User.findById.yields(null, userFindResult)
      userFindResult.save.yields(null)

      userController.changePassword(req, res, function (err) {
        expect(err).to.be.undefined
        expect(res.send).to.have.been.calledWith(200, 'Password updated')
        done()
      })
    })

    it('should return error if new password does not match confirm new password', function (done) {
      req.body.confirmNewPassword = 'somethingelse'

      userController.changePassword(req, res, function (err) {
        expect(err).to.be.undefined
        expect(res.send).to.have.been.calledWith(403, 'New password and confirm new password must match.')
        done()
      })
    })

    it('should return error if password does not meet complexity rules')

    it('should return error if current password is not supplied', function (done) {
      req.body.currentPassword = null

      userController.changePassword(req, res, function (err) {
        expect(err.toString()).to.contain('Current Password is required.')
        expect(res.send).to.not.have.been.called
        done()
      })
    })

    it('should return error if current password is not correct', function (done) {
      bcryptMock.compare.yields(null, false)
      User.findById.yields(null, userFindResult)

      userController.changePassword(req, res, function (err) {
        expect(err).to.be.undefined
        expect(res.send).to.have.been.calledWith(403, 'Current password incorrect')
        done()
      })
    })

    it('should return error if user query fails', function (done) {
      User.findById.yields('USERFINDERROR', null)

      userController.changePassword(req, res, function (err) {
        expect(err).to.equal('USERFINDERROR')
        expect(res.send).to.not.have.been.called
        done()
      })
    })

    it('should return error if user not found', function (done) {
      User.findById.yields(null, null)

      userController.changePassword(req, res, function (err) {
        expect(err.toString()).to.contain('Logged in user not found in users collection.')
        expect(res.send).to.not.have.been.called
        done()
      })
    })

    it('should return error if bcrypt fails to compare current password', function (done) {
      bcryptMock.compare.yields('BCRYPTERROR', false)
      User.findById.yields(null, userFindResult)

      userController.changePassword(req, res, function (err) {
        expect(err).to.equal('BCRYPTERROR')
        expect(res.send).to.not.have.been.called
        done()
      })
    })

    it('should return error if bcrypt fails to hash new password', function (done) {
      bcryptMock.compare.yields(null, true)
      bcryptMock.genSalt.yields('BCRYPTERROR', null)
      User.findById.yields(null, userFindResult)

      userController.changePassword(req, res, function (err) {
        expect(err.toString()).to.contain('BCRYPTERROR')
        expect(res.send).to.not.have.been.called
        done()
      })
    })

    it('should return error if save of new user password fails', function (done) {
      bcryptMock.compare.yields(null, true)
      bcryptMock.genSalt.yields(null, 'testSalt')
      bcryptMock.hash.yields(null, 'testHash')
      jwtMock.sign.returns('testJwtPart1.testJwtPart2.testJwtPart3')
      User.findById.yields(null, userFindResult)
      userFindResult.save.yields('USERSAVEERROR')

      userController.changePassword(req, res, function (err) {
        expect(err).to.equal('USERSAVEERROR')
        expect(res.send).to.not.have.been.called
        done()
      })
    })
  })

  describe('authorizeFb tests', function () {
    let fbUserResult

    beforeEach(function () {
      req.body = {
        accessToken: 'testaccesstoken'
      }

      fbUserResult = new User({
        email: 'test@test.com',
        loginType: 'fb',
        externalId: '123456',
        name: 'Tester',
        roles: ['user'],
        password: '$2a$10$ypRm.aKBx3463hmnFFIgZebmdz0PGHihpMn5Wwco3v4k7jsgsA79q'
      })
    })

    it('should return status 200 and user and token if FB login successful for existing user', function (done) {
      let fbInfo = '{"id":"123456","name":"Tester","email":"test@test.com"}'
      // let requestStub = sinon.stub().yields(null, {statusCode: 200}, fbInfo)
      // let controller = proxyquire('../../app/controllers/userController', { 'request': requestStub })

      let expectedSignInResult = {
        token: 'testJwtPart1.testJwtPart2.testJwtPart3',
        user: {
          _id: undefined,
          email: 'test@test.com',
          loginType: 'fb',
          name: 'Tester',
          roles: ['user']
        }
      }

      requestMock.yields(null, {statusCode: 200}, fbInfo)
      User.findOne.yields(null, fbUserResult)
      jwtMock.sign.returns('testJwtPart1.testJwtPart2.testJwtPart3')

      userController.authorizeFb(req, res, function (err) {
        expect(err).to.be.undefined
        expect(res.send).to.have.been.calledWith(200, expectedSignInResult)
        done()
      })
    })

    it('should return status 201 and user and token if login successful for new user', function (done) {
      let fbInfo = '{"id":"123456","name":"Tester","email":"test@test.com"}'
      // let requestStub = sinon.stub().yields(null, {statusCode: 200}, fbInfo)
      // let controller = proxyquire('../../app/controllers/userController', { 'request': requestStub })

      let expectedSignInResult = {
        token: 'testJwtPart1.testJwtPart2.testJwtPart3',
        user: {
          _id: undefined,
          email: 'test@test.com',
          loginType: 'fb',
          name: 'Tester',
          roles: ['user']
        }
      }

      requestMock.yields(null, {statusCode: 200}, fbInfo)
      User.findOne.yields(null, null)
      saveStub.yields(null, fbUserResult)
      jwtMock.sign.returns('testJwtPart1.testJwtPart2.testJwtPart3')

      userController.authorizeFb(req, res, function (err) {
        expect(err).to.be.undefined
        expect(res.send).to.have.been.calledWith(201, expectedSignInResult)
        done()
      })
    })

    it('should return error if no FB access token present', function (done) {
      req.body = {}

      userController.authorizeFb(req, res, function (err) {
        expect(err.toString()).to.contain('No facebook access token supplied')
        expect(res.send).to.not.have.been.called
        done()
      })
    })

    it('should return error if save of new user fails', function (done) {
      let fbInfo = '{"id":"123456","name":"Tester","email":"test@test.com"}'
      // let requestStub = sinon.stub().yields(null, {statusCode: 200}, fbInfo)
      // let controller = proxyquire('../../app/controllers/userController', { 'request': requestStub })

      requestMock.yields(null, {statusCode: 200}, fbInfo)
      User.findOne.yields(null, null)
      saveStub.yields('USERSAVEERROR', null)
      jwtMock.sign.returns('testJwtPart1.testJwtPart2.testJwtPart3')

      userController.authorizeFb(req, res, function (err) {
        expect(err.toString()).to.contain('USERSAVEERROR')
        expect(res.send).to.not.have.been.called
        done()
      })
    })

    it('should return error if FB API call fails', function (done) {
      // let requestStub = sinon.stub().yields('FBERROR', {statusCode: 500}, null)
      // let controller = proxyquire('../../app/controllers/userController', { 'request': requestStub })

      requestMock.yields('FBERROR', {statusCode: 500}, null)
      userController.authorizeFb(req, res, function (err) {
        expect(err.toString()).to.contain('FBERROR')
        expect(res.send).to.not.have.been.called
        done()
      })
    })

    it('should return error if FB API does not return status 200', function (done) {
      // let requestStub = sinon.stub().yields(null, {statusCode: 500}, null)
      // let controller = proxyquire('../../app/controllers/userController', { 'request': requestStub })

      requestMock.yields(null, {statusCode: 500}, null)

      userController.authorizeFb(req, res, function (err) {
        expect(err.toString()).to.contain('FB API returned status code: 500')
        expect(res.send).to.not.have.been.called
        done()
      })
    })

    it('should return error if user query fails', function (done) {
      let fbInfo = '{"id":"123456","name":"Tester","email":"test@test.com"}'
      // let requestStub = sinon.stub().yields(null, {statusCode: 200}, fbInfo)
      // let controller = proxyquire('../../app/controllers/userController', { 'request': requestStub })

      requestMock.yields(null, {statusCode: 200}, fbInfo)
      User.findOne.yields('USERFINDERROR', null)

      userController.authorizeFb(req, res, function (err) {
        expect(err.toString()).to.contain('USERFINDERROR')
        expect(res.send).to.not.have.been.called
        done()
      })
    })
  })

  describe('requireSignIn tests', function () {
    let next
    function runRequiresSignInTest () {
      let decodedUser = {
        _id: undefined,
        email: 'test@test.com',
        loginType: 'local',
        name: 'Tester',
        roles: ['user']
      }

      jwtMock.verify.yields(null, decodedUser)

      userController.requireSignIn(req, res, next)
      expect(next).to.have.been.called
      expect(next.args[0].length).to.equal(0)
      expect(req.user).to.eql(decodedUser)
    }

    beforeEach(function () {
      next = sinon.spy()
    })

    it('should set user on request and call next if token included in req body', function () {
      req.body = {
        token: 'testJwtPart1.testJwtPart2.testJwtPart3'
      }

      runRequiresSignInTest()
    })

    it('should set user on request and call next if token included in query string', function () {
      req.query = {
        token: 'testJwtPart1.testJwtPart2.testJwtPart3'
      }

      runRequiresSignInTest()
    })

    it('should set user on request and call next if token included in req header', function () {
      req = {
        headers: {
          'x-access-token': 'testJwtPart1.testJwtPart2.testJwtPart3'
        }
      }

      runRequiresSignInTest()
    })

    it('should call return 401 and error message if no token is present', function () {
      userController.requireSignIn(req, res, next)
      expect(next).to.not.have.been.called
      expect(res.send).to.have.been.calledWith(401, new Error('No access token provided.'))
    })

    it('should return 401 and error if token fails to verify', function () {
      req.body = {
        token: 'testJwtPart1.testJwtPart2.testJwtPart3'
      }

      let error = new Error('ERROR')
      jwtMock.verify.yields(error, null)

      userController.requireSignIn(req, res, next)
      expect(next).to.not.have.been.called
      expect(res.send).to.have.been.calledWith(401, error)
    })
  })
})
