/* globals describe, it, beforeEach, afterEach */
'use strict'

let chai = require('chai')
let expect = chai.expect
let sinon = require('sinon')
let sinonChai = require('sinon-chai')

chai.use(sinonChai)

describe('Item Controller Tests', function () {
  // Set up mocks/stubs needed in all tests
  let saveStub = sinon.stub()
  let removeStub = sinon.stub()
  let execStub = sinon.stub()
  let next = sinon.stub()
  let req = {}
  let res = {
    send: sinon.spy(),
    status: sinon.spy()
  }

  // Fake Mongoose models for testing
  class Item {
    constructor (item) {
      this._id = item._id
      this.user = item.user
      this.category = item.category
      this.itemDateTime = item.itemDateTime
      this.valueNumber = item.valueNumber
      this.notes = item.notes
      this.save = saveStub
      this.remove = removeStub
      this.toObject = function () {
        return {
          _id: this._id,
          user: this.user,
          category: this.category,
          itemDateTime: this.itemDateTime,
          valueNumber: this.valueNumber,
          notes: this.notes
        }
      }
    }
  }
  Item.find = sinon.stub().returns({
    populate: function () {
      return this
    },
    lean: function () {
      return this
    },
    sort: function () {
      return this
    },
    exec: execStub
  })
  Item.findOne = sinon.stub().returns({
    populate: function () {
      return this
    },
    lean: function () {
      return this
    },
    sort: function () {
      return this
    },
    exec: execStub
  })
  Item.findById = sinon.stub().returns({
    populate: function () {
      return this
    },
    exec: execStub
  })

  class Category {}
  Category.find = sinon.stub().returns({
    lean: function () {
      return this
    },
    exec: execStub
  })

  // controller under test
  let itemController = require('../../app/controllers/itemController')(Item, Category)

  afterEach(function () {
    // Reset all the stubs and spies, might be a better way than this...
    saveStub.reset()
    execStub.reset()
    res.send.reset()
    next.reset()
    req = {}
    res = {
      status: sinon.spy(),
      send: sinon.spy()
    }
  })

  describe('getItems() Tests', function () {
    beforeEach(function () {
      req = {
        query: {
          categoryId: '1234567890'
        },
        user: {
          _id: '987654321'
        }
      }
    })

    it('should return all items', function () {
      let items = [
        {
          'user': 'b@trackmytries.com',
          'category': 'Pull Ups',
          'itemDateTime': '2012-08-06T05:00:00Z',
          'valueNumber': 0,
          'notes': ''
        },
        {
          'user': 'b@trackmytries.com',
          'category': 'Pull Ups',
          'itemDateTime': '2012-08-17T05:00:00Z',
          'valueNumber': 0,
          'notes': ''
        }
      ]

      execStub.yields(null, items)
      itemController.getItems(req, res, next)
      expect(res.send).to.have.been.calledWith(200, items)
    })

    it('should return error if find query fails', function () {
      execStub.yields('FINDERROR', null)
      itemController.getItems(req, res, function (err) {
        expect(err).to.equal('FINDERROR')
        expect(res.send).to.not.have.been.called
      })
    })
  })

  describe('getItemById() Tests', function () {
    beforeEach(function () {
      req = {
        params: {
          itemId: '987654321'
        }
      }
    })

    it('should return single item', function () {
      let item = {
        _id: '987654321',
        user: 'b@trackmytries.com',
        category: 'Pull Ups',
        itemDateTime: '2012-08-06T05:00:00Z',
        valueNumber: 0,
        notes: ''
      }

      execStub.yields(null, item)
      itemController.getItemById(req, res, next)
      expect(Item.findById).to.have.been.calledWith('987654321')
      expect(req.item).to.eql(item)
    })

    it('should return error if findById query fails', function () {
      execStub.yields('FINDERROR', null)
      itemController.getItemById(req, res, function (err) {
        expect(err).to.equal('FINDERROR')
        expect(res.send).to.not.have.been.called
      })
    })

    it('should return status 404 if item not found', function () {
      execStub.yields(null, null)
      itemController.getItemById(req, res, next)
      expect(res.send).to.have.been.calledWith(404, 'Item not found')
    })
  })

  describe('addItem() Tests', function () {
    beforeEach(function () {
      req.body = {
        user: 'b@trackmytries.com',
        category: 'Pull Ups',
        itemDateTime: '2012-08-06T05:00:00Z',
        valueNumber: 0,
        notes: 'addItem Test'
      }
    })

    it('should add new item', function () {
      let saveResult = new Item({
        _id: '987654321',
        user: 'b@trackmytries.com',
        category: 'Pull Ups',
        itemDateTime: '2012-08-06T05:00:00Z',
        valueNumber: 0,
        notes: 'addItem Test'
      })

      saveStub.yields(null, saveResult)

      itemController.addItem(req, res, next)
      expect(res.send).to.have.been.calledWith(201, saveResult)
    })

    it('should return error if save fails on model', function () {
      saveStub.yields('SAVEERROR', null)

      itemController.addItem(req, res, function (err) {
        expect(err).to.equal('SAVEERROR')
      })
    })
  })

  describe('updateItem() Tests', function () {
    beforeEach(function () {
      req.body = {
        _id: '987654321',
        user: 'r@trackmytries.com',
        category: 'Pull Ups Edited',
        itemDateTime: '2012-09-06T05:00:00Z',
        valueNumber: 1,
        notes: 'updated notes'
      }
      req.item = new Item({
        _id: '987654321',
        user: 'b@trackmytries.com',
        category: 'Pull Ups',
        itemDateTime: '2012-08-06T05:00:00Z',
        valueNumber: 0,
        notes: ''
      })
    })

    it('should update existing item', function () {
      let expectedItem = {
        _id: '987654321',
        user: 'r@trackmytries.com',
        category: 'Pull Ups Edited',
        itemDateTime: '2012-09-06T05:00:00Z',
        valueNumber: 1,
        notes: 'updated notes'
      }

      saveStub.yields(null)
      itemController.updateItem(req, res, next)

      let result = res.send.args[0][1]
      expect(result.user).to.equal(expectedItem.user)
      expect(result.category).to.equal(expectedItem.category)
      expect(result.itemDateTime).to.equal(expectedItem.itemDateTime)
      expect(result.valueNumber).to.equal(expectedItem.valueNumber)
      expect(result.notes).to.equal(expectedItem.notes)
      expect(res.send).to.have.been.calledWith(200)
    })

    it('should return error if save fails on model', function () {
      saveStub.yields('SAVEERROR')
      itemController.updateItem(req, res, function (err) {
        expect(err).to.equal('SAVEERROR')
      })
    })
  })

  describe('deleteItem() Tests', function () {
    beforeEach(function () {
      req.item = new Item({
        _id: '987654321',
        user: 'b@trackmytries.com',
        category: 'Pull Ups',
        itemDateTime: '2012-08-06T05:00:00Z',
        valueNumber: 0,
        notes: ''
      })
    })

    it('should delete item', function () {
      removeStub.yields(null)
      itemController.deleteItem(req, res, next)
      expect(res.send).to.have.been.calledWith(204, 'Item removed')
    })

    it('should return error if remove fails', function () {
      removeStub.yields('REMOVEERROR')
      itemController.deleteItem(req, res, function (err) {
        expect(err).to.equal('REMOVEERROR')
        expect(res.send).to.not.have.been.called
      })
    })
  })

  describe('getStats() Tests', function () {
    let ItemTestHelper = require('../helpers/itemTestHelper')
    let helper

    beforeEach(function () {
      helper = new ItemTestHelper()
    })

    it('should return stats for all categories', function (done) {
      req.query = {}
      req.user = {
        _id: 'b@trackmytries.com'
      }

      // execStub.onCall(0).yields(null, categories)
      Category.find.withArgs({}).returns({
        lean: function () {
          return this
        },
        exec: sinon.stub().yields(null, helper.categories)
      })

      execStub.onCall(0).yields(null, helper.items.slice(0, 4))
      execStub.onCall(1).yields(null, helper.items[1])

      execStub.onCall(2).yields(null, helper.items.slice(4, 8))
      execStub.onCall(3).yields(null, helper.items[5])

      execStub.onCall(4).yields(null, helper.items.slice(8, 12))
      execStub.onCall(5).yields(null, JSON.parse(JSON.stringify(helper.items[8])))

      execStub.onCall(6).yields(null, helper.items.slice(12))
      execStub.onCall(7).yields(null, helper.items[14])

      // let expectedItems = []
      // expectedItems.push(items[0])
      // expectedItems.push(items[2])
      // expectedItems.push(items[4])
      // expectedItems.push(items[6])

      itemController.getStats(req, res, function () {
        expect(res.send).to.be.calledWith(200)
        done()
      })
    })

    it('should return stats for single category', function (done) {
      let categoryId = '56ca941148e719f108539f96'

      req.query = {
        categoryId
      }

      req.user = {
        _id: 'b@trackmytries.com'
      }

      // execStub.onCall(0).yields(null, categories)
      Category.find.withArgs({_id: categoryId}).returns({
        lean: function () {
          return this
        },
        exec: sinon.stub().yields(null, helper.categories.slice(0, 1))
      })

      execStub.onCall(0).yields(null, helper.items.slice(0, 4))
      execStub.onCall(1).yields(null, helper.items[1])

      let expectedResult = JSON.parse(JSON.stringify(helper.categories[0]))
      expectedResult.stats = {
        best: helper.items[1],
        first: helper.items[3],
        latest: helper.items[0]
      }

      itemController.getStats(req, res, function () {
        expect(res.send).to.be.calledWith(200, expectedResult)
        done()
      })
    })

    it('should return error if category does not exist', function (done) {
      let categoryId = 'onethatdoesnotexist'

      req.query = {
        categoryId
      }
      req.user = {
        _id: 'b@trackmytries.com'
      }

      // execStub.onCall(0).yields(null, categories)
      Category.find.withArgs({_id: categoryId}).returns({
        lean: function () {
          return this
        },
        exec: sinon.stub().yields(null, null)
      })

      itemController.getStats(req, res, function (err) {
        expect(execStub).to.not.have.been.called
        expect(err.toString()).to.contain('Invalid category or no categories found')
        expect(res.send).to.not.have.been.called
        done()
      })
    })

    it('should return no stats for single category when it has no items', function (done) {
      let categoryId = '56ca941148e719f108539f96'
      let emptyItemList = []

      req.query = {
        categoryId
      }

      req.user = {
        _id: 'b@trackmytries.com'
      }

      // execStub.onCall(0).yields(null, categories)
      Category.find.withArgs({_id: categoryId}).returns({
        lean: function () {
          return this
        },
        exec: sinon.stub().yields(null, helper.categories.slice(0, 1))
      })

      execStub.onCall(0).yields(null, emptyItemList)

      itemController.getStats(req, res, function () {
        let result = res.send.args[0][1]
        expect(result.stats).to.not.exist
        expect(res.send).to.be.calledWith(200, helper.categories[0])
        done()
      })
    })

    it('should return no stats for any category when none have items', function (done) {
      let emptyItemList = []

      req.query = {}
      req.user = {
        _id: 'b@trackmytries.com'
      }

      // execStub.onCall(0).yields(null, categories)
      Category.find.withArgs({}).returns({
        lean: function () {
          return this
        },
        exec: sinon.stub().yields(null, helper.categories)
      })

      execStub.onCall(0).yields(null, emptyItemList)
      execStub.onCall(1).yields(null, emptyItemList)
      execStub.onCall(2).yields(null, emptyItemList)
      execStub.onCall(3).yields(null, emptyItemList)

      itemController.getStats(req, res, function () {
        expect(res.send).to.be.calledWith(200, helper.categories)
        done()
      })
    })

    it('should return error if category find query fails', function () {
      req.query = {}
      req.user = {
        _id: 'b@trackmytries.com'
      }

      Category.find.withArgs({}).returns({
        lean: function () {
          return this
        },
        exec: sinon.stub().yields('CATEGORYERROR', null)
      })

      itemController.getStats(req, res, next)
      expect(next).to.have.been.calledWith('CATEGORYERROR')
      expect(res.send).to.not.have.been.called
    })

    it('should return error if item find query fails', function () {
      req.query = {}
      req.user = {
        _id: 'b@trackmytries.com'
      }

      // execStub.onCall(0).yields(null, categories)
      Category.find.withArgs({}).returns({
        lean: function () {
          return this
        },
        exec: sinon.stub().yields(null, helper.categories)
      })

      execStub.onCall(0).yields('ITEMFINDERROR', null)

      itemController.getStats(req, res, next)
      expect(next).to.have.been.calledWith('ITEMFINDERROR')
      expect(res.send).to.not.have.been.called
    })

    it('should return error if item PR query fails', function () {
      req.query = {}
      req.user = {
        _id: 'b@trackmytries.com'
      }

      // execStub.onCall(0).yields(null, categories)
      Category.find.withArgs({}).returns({
        lean: function () {
          return this
        },
        exec: sinon.stub().yields(null, helper.categories)
      })

      execStub.onCall(0).yields(null, helper.items.splice(0, 4))
      execStub.onCall(1).yields('ITEMPRERROR', null)

      itemController.getStats(req, res, next)
      expect(next).to.have.been.calledWith('ITEMPRERROR')
      expect(res.send).to.not.have.been.called
    })
  })

  describe('requireAuthorization() Tests', function () {
    beforeEach(function () {
      req.item = new Item({
        _id: '987654321',
        user: {
          _id: 'b@trackmytries.com'
        },
        category: 'Pull Ups',
        itemDateTime: '2012-08-06T05:00:00Z',
        valueNumber: 0,
        notes: ''
      })
      req.user = {
        _id: 'b@trackmytries.com'
      }
    })

    it('should return true if user is autheroized', function () {
      req.item = new Item({
        _id: '987654321',
        user: {
          _id: 'b@trackmytries.com'
        },
        category: 'Pull Ups',
        itemDateTime: '2012-08-06T05:00:00Z',
        valueNumber: 0,
        notes: ''
      })
      req.user = {
        _id: 'b@trackmytries.com'
      }

      itemController.requireAuthorization(req, res, next)

      expect(next).to.have.been.called
      expect(res.send).to.not.have.been.called
    })

    it('should return status 403 if user is not authorized for item', function () {
      req.user = {
        _id: 'someoneelse@trackmytries.com'
      }

      itemController.requireAuthorization(req, res, next)

      expect(next).to.not.have.been.called
      expect(res.send).to.have.been.calledWith(403, 'Not authorized for that Item')
    })
  })
})
