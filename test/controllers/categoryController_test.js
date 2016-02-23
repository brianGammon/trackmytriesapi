/* globals describe, it, beforeEach */
'use strict'

let chai = require('chai')
let expect = chai.expect
let sinon = require('sinon')
let sinonChai = require('sinon-chai')
chai.use(sinonChai)

describe('Category Controller Tests', () => {
  let req
  let res
  let categories
  let saveStub = sinon.stub()
  let next = sinon.spy()
  let controller = require('../../app/controllers/categoryController')
  let CategoryTestHelper = require('../helpers/categoryTestHelper')

  class Category {
    constructor () {
      this.find = sinon.stub()
      this.findById = sinon.stub()
      this.save = saveStub
    }
  }

  beforeEach(() => {
    // Reset our test data each time
    let helper = new CategoryTestHelper()
    req = helper.req
    res = helper.res
    categories = helper.categories

    // Reset the stubs
    next.reset()
    saveStub.reset()
  })

  describe('get all categories tests', () => {
    let model

    beforeEach(() => {
      model = new Category(null)
    })

    it('should return all categories', () => {
      model.find.yields(null, categories)
      controller(model).getAll(req, res, next)

      expect(res.send).to.have.been.calledWith(200, categories)
      expect(next).to.not.have.been.called
    })

    it('should throw error if find() fails on model', () => {
      model.find.yields('ERROR', null)
      controller(model).getAll(req, res, next)

      expect(res.send).to.not.have.been.called
      expect(next).to.have.been.calledWith('ERROR')
    })
  })

  describe('get single category by ID tests', () => {
    let model

    beforeEach(() => {
      model = new Category(null)
    })

    it('returns a category by ID', () => {
      req.params = { categoryId: 12345 }
      model.findById.yields(null, categories[0])
      controller(model).getById(req, res, next)

      expect(model.findById).to.have.been.calledWith(12345)
      expect(req.category).to.eql(categories[0])
      expect(next).to.have.been.called
    })

    it('should return 404 if requested category does not exist', () => {
      req.params = { categoryId: 54321 }
      model.findById.yields(null, null)
      controller(model).getById(req, res, next)

      expect(model.findById).to.have.been.calledWith(54321)
      expect(res.send).to.have.been.calledWith(404, 'Category not found')
      expect(next).to.not.have.been.called
    })

    it('should throw an error if find function errors out', () => {
      req.params = { categoryId: 12345 }
      model.findById.yields('ERROR', null)
      controller(model).getById(req, res, next)

      expect(model.findById).to.have.been.calledWith(12345)
      expect(res.send).to.not.have.been.called
      expect(next).to.have.been.calledWith('ERROR')
    })
  })

  describe('insert new category tests', () => {
    it('should save new category', () => {
      saveStub.yields(null)
      controller(Category).insert(req, res, next)

      expect(saveStub).to.have.been.called
      expect(res.send).to.have.been.calledWith(201)
    })

    it('should call next with error if model fails to save', () => {
      saveStub.yields('ERROR')
      controller(Category).insert(req, res, next)

      expect(saveStub).to.have.been.called
      expect(res.send).to.not.have.been.called
      expect(next).to.have.been.calledWith('ERROR')
    })
  })

  describe('update existing category tests', () => {
    it('should update category', () => {
      req.category.save.yields(null)
      controller(Category).update(req, res, next)

      expect(req.category.save).to.have.been.called
      // Remove the stub method to help with the expect eql call below
      delete req.category.save
      delete req.category.remove

      expect(req.category).to.be.eql(req.body)
    })

    it('should call next with an error if save fails on model', () => {
      req.category.save.yields('ERROR')
      controller(Category).update(req, res, next)

      expect(req.category.save).to.have.been.called
      expect(res.send).to.not.have.been.called
      expect(next).to.have.been.calledWith('ERROR')
    })
  })

  describe('delete() tests', () => {
    it('should delete the category based on ID passed in', () => {
      req.category.remove.yields(null)
      controller(Category).delete(req, res, next)

      expect(req.category.remove).to.have.been.called
      expect(res.send).to.have.been.calledWith(204, 'Category removed')
      // expect(req.category).to.be.eql(req.body)
    })

    it('should call next with an error if delete fails on model', () => {
      req.category.remove.yields('ERROR')
      controller(Category).delete(req, res, next)

      expect(req.category.remove).to.have.been.called
      expect(res.send).to.not.have.been.called
      expect(next).to.have.been.calledWith('ERROR')
    })
  })
})
