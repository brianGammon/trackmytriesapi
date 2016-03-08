/* globals describe, it, beforeEach */
'use strict'

let chai = require('chai')
let expect = chai.expect
let sinon = require('sinon')
let sinonChai = require('sinon-chai')
chai.use(sinonChai)

describe('Category Controller Tests', function () {
  // Set up mocks/stubs needed in most tests
  let req
  let res
  let categories
  let saveStub = sinon.stub()
  let next = sinon.spy()
  let execStub = sinon.stub()
  let CategoryTestHelper = require('../helpers/categoryTestHelper')

  // Fake Mongoose model for testing
  class Category {
    constructor () {
      this.save = saveStub
    }
  }
  Category.find = sinon.stub().returns({
    lean: function () {
      return this
    },
    exec: execStub
  })
  Category.findById = sinon.stub().returns({
    lean: function () {
      return this
    },
    exec: execStub
  })

  let controller = require('../../app/controllers/categoryController')(Category)

  beforeEach(function () {
    // Reset our test data each time
    let helper = new CategoryTestHelper()
    req = helper.req
    res = helper.res
    categories = helper.categories

    // Reset the stubs
    next.reset()
    saveStub.reset()
    execStub.reset()
  })

  describe('get all categories tests', function () {
    it('should return all categories', function () {
      Category.find.yields(null, categories)
      controller.getAll(req, res, next)

      expect(res.send).to.have.been.calledWith(200, categories)
      expect(next).to.not.have.been.called
    })

    it('should throw error if find() fails on model', function () {
      Category.find.yields('ERROR', null)
      controller.getAll(req, res, next)

      expect(res.send).to.not.have.been.called
      expect(next).to.have.been.calledWith('ERROR')
    })
  })

  describe('get single category by ID tests', function () {
    it('returns a category by ID', function () {
      req.params = { categoryId: 12345 }
      Category.findById.yields(null, categories[0])
      controller.getById(req, res, next)

      expect(Category.findById).to.have.been.calledWith(12345)
      expect(req.category).to.eql(categories[0])
      expect(next).to.have.been.called
    })

    it('should return 404 if requested category does not exist', function () {
      req.params = { categoryId: 54321 }
      Category.findById.yields(null, null)
      controller.getById(req, res, next)

      expect(Category.findById).to.have.been.calledWith(54321)
      expect(res.send).to.have.been.calledWith(404, 'Category not found')
      expect(next).to.not.have.been.called
    })

    it('should throw an error if find function errors out', function () {
      req.params = { categoryId: 12345 }
      Category.findById.yields('ERROR', null)
      controller.getById(req, res, next)

      expect(Category.findById).to.have.been.calledWith(12345)
      expect(res.send).to.not.have.been.called
      expect(next).to.have.been.calledWith('ERROR')
    })
  })

  describe('insert new category tests', function () {
    it('should save new category', function () {
      saveStub.yields(null)
      controller.insert(req, res, next)

      expect(saveStub).to.have.been.called
      expect(res.send).to.have.been.calledWith(201)
    })

    it('should call next with error if model fails to save', function () {
      saveStub.yields('ERROR')
      controller.insert(req, res, next)

      expect(saveStub).to.have.been.called
      expect(res.send).to.not.have.been.called
      expect(next).to.have.been.calledWith('ERROR')
    })
  })

  describe('update existing category tests', function () {
    it('should update category', function () {
      req.category.save.yields(null)
      controller.update(req, res, next)

      expect(req.category.save).to.have.been.called
      // Remove the stub method to help with the expect eql call below
      delete req.category.save
      delete req.category.remove

      expect(req.category).to.be.eql(req.body)
    })

    it('should call next with an error if save fails on model', function () {
      req.category.save.yields('ERROR')
      controller.update(req, res, next)

      expect(req.category.save).to.have.been.called
      expect(res.send).to.not.have.been.called
      expect(next).to.have.been.calledWith('ERROR')
    })
  })

  describe('delete() tests', function () {
    it('should delete the category based on ID passed in', function () {
      req.category.remove.yields(null)
      controller.delete(req, res, next)

      expect(req.category.remove).to.have.been.called
      expect(res.send).to.have.been.calledWith(204, 'Category removed')
      // expect(req.category).to.be.eql(req.body)
    })

    it('should call next with an error if delete fails on model', function () {
      req.category.remove.yields('ERROR')
      controller.delete(req, res, next)

      expect(req.category.remove).to.have.been.called
      expect(res.send).to.not.have.been.called
      expect(next).to.have.been.calledWith('ERROR')
    })
  })
})
