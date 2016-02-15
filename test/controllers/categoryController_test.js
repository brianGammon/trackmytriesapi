/* globals describe, it, beforeEach */
'use strict';
/* eslint node/no-unpublished-require: 0 */
var chai = require('chai'),
    expect = chai.expect,
    sinon = require('sinon'),
    sinonChai = require('sinon-chai');

chai.use(sinonChai);

describe('Category Controller Tests', function () {
  var controller,
      req,
      res,
      categories,
      Category,
      saveStub = sinon.stub(),
      next = sinon.spy();

  beforeEach(function () {
    req = {
      body: {
        name: 'Test',
        description: 'This is for the unit tests',
        goalType: 'test',
        valueType: 'test'
      },
      category: {
        name: 'NameBeforeUpdate',
        description: 'This is the desc before updating',
        goalType: 'test',
        valueType: 'test',
        save: sinon.stub(),
        remove: sinon.stub()
      },
      params: {}
    };

    res = {
      status: sinon.spy(),
      send: sinon.spy()
    };

    categories = [
      {
        _id: 'abc123',
        name: 'sit ups',
        description: 'Number of sit ups in 2 minutes',
        goalType: 'more',
        valueType: 'number'
      },
      {
        _id: 'abc124',
        name: 'push ups',
        description: 'Number of push ups in 2 minutes',
        goalType: 'more',
        valueType: 'number'
      }
    ];

    Category = function() {
      this.find = sinon.stub()
      this.findById = sinon.stub()
      this.save = saveStub
    };

    controller = require('../../app/controllers/categoryController');

    next.reset();
    saveStub.reset();
  });

  describe('get all categories tests', function () {
    var model;

    beforeEach(function () {
      model = new Category(null);
    });

    it('should return all categories', function () {
      model.find.yields(null, categories);
      controller(model).getAll(req, res, next);

      expect(res.send).to.have.been.calledWith(200, categories);
      expect(next).to.not.have.been.called;
    });

    it('should throw error if find() fails on model', function () {
      model.find.yields('ERROR', null);
      controller(model).getAll(req, res, next);

      expect(res.send).to.not.have.been.called;
      expect(next).to.have.been.calledWith('ERROR');
    });

  });

  describe('get single category by ID tests', function () {
    var model;

    beforeEach(function () {
      model = new Category(null);
    });

    it('returns a category by ID', function () {
      req.params = { categoryId: 12345 };
      model.findById.yields(null, categories[0]);
      controller(model).getById(req, res, next);

      expect(model.findById).to.have.been.calledWith(12345);
      expect(req.category).to.eql(categories[0]);
      expect(next).to.have.been.called;
    });

    it('should return 404 if requested category does not exist', function () {
      req.params = { categoryId: 54321 };
      model.findById.yields(null, null);
      controller(model).getById(req, res, next);

      expect(model.findById).to.have.been.calledWith(54321);
      expect(res.send).to.have.been.calledWith(404, 'Category not found');
      expect(next).to.not.have.been.called;
    });

    it('should throw an error if find function errors out', function () {
      req.params = { categoryId: 12345 };
      model.findById.yields('ERROR', null);
      controller(model).getById(req, res, next);

      expect(model.findById).to.have.been.calledWith(12345);
      expect(res.send).to.not.have.been.called;
      expect(next).to.have.been.calledWith('ERROR');
    });
  });

  describe('insert new category tests', function () {
    it('should save new category', function () {
      saveStub.yields(null);
      controller(Category).insert(req, res, next);

      expect(saveStub).to.have.been.called;
      expect(res.send).to.have.been.calledWith(201);
    });

    it('should call next with error if model fails to save', function () {
      saveStub.yields('ERROR');
      controller(Category).insert(req, res, next);

      expect(saveStub).to.have.been.called;
      expect(res.send).to.not.have.been.called;
      expect(next).to.have.been.calledWith('ERROR');
    });
  });

  describe('update existing category tests', function () {
    it('should update category', function () {
      req.category.save.yields(null);
      controller(Category).update(req, res, next);

      expect(req.category.save).to.have.been.called;
      // Remove the stub method to help with the expect eql call below
      delete req.category.save;
      delete req.category.remove;

      expect(req.category).to.be.eql(req.body);
    });

    it('should call next with an error if save fails on model', function () {
      req.category.save.yields('ERROR');
      controller(Category).update(req, res, next);

      expect(req.category.save).to.have.been.called;
      expect(res.send).to.not.have.been.called;
      expect(next).to.have.been.calledWith('ERROR');
    });
  });

  describe('delete() tests', function () {
    it('should delete the category based on ID passed in', function () {
      req.category.remove.yields(null);
      controller(Category).delete(req, res, next);

      expect(req.category.remove).to.have.been.called;
      expect(res.send).to.have.been.calledWith(204, 'Category removed');
      //expect(req.category).to.be.eql(req.body);
    });

    it('should call next with an error if delete fails on model', function () {
      req.category.remove.yields('ERROR');
      controller(Category).delete(req, res, next);

      expect(req.category.remove).to.have.been.called;
      expect(res.send).to.not.have.been.called;
      expect(next).to.have.been.calledWith('ERROR');
    });
  });
});
