'use strict'
let sinon = require('sinon')

class CategoryTestHelper {
  constructor () {
    this.req = {
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
    }

    this.res = {
      status: sinon.spy(),
      send: sinon.spy()
    }

    this.categories = [
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
    ]
  }
}

module.exports = CategoryTestHelper
