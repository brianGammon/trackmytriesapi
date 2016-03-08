'use strict'

class ItemTestHelper {
  constructor () {
    this.categories = [
      {
        _id: '56ca941148e719f108539f96',
        name: 'Sit Ups',
        description: 'Number of sit ups completed in 2 minutes',
        valueType: 'number',
        goalType: 'more'
      },
      {
        _id: '56ca941148e719f108539f97',
        name: 'Push Ups',
        description: 'Number of push ups completed in 2 minutes',
        valueType: 'number',
        goalType: 'more'
      },
      {
        _id: '56ca941148e719f108539f98',
        name: 'Pull Ups',
        description: 'Number of pull ups completed',
        valueType: 'number',
        goalType: 'more'
      },
      {
        _id: '56ca941148e719f108539f99',
        name: '1.5 Mile Run',
        description: 'Time in minutes and seconds (MM:SS) to run 1.5 miles',
        valueType: 'duration',
        goalType: 'less'
      }
    ]

    this.items = [
      {
        index: 0,
        _id: '56ca941148e719f108539fd4',
        user: {
          _id: '56ca941148e719f108539f9b',
          email: 'b@trackmytries.com'
        },
        category: {
          _id: '56ca941148e719f108539f96',
          name: 'Sit Ups',
          description: 'Number of sit ups completed in 2 minutes',
          valueType: 'number',
          goalType: 'more'
        },
        valueNumber: 56,
        notes: '',
        itemDateTime: '2015-09-28T05:00:00.000Z'
      },
      {
        index: 1,
        _id: '56ca941148e719f108539fd3',
        user: {
          _id: '56ca941148e719f108539f9b',
          email: 'b@trackmytries.com'
        },
        category: {
          _id: '56ca941148e719f108539f96',
          name: 'Sit Ups',
          description: 'Number of sit ups completed in 2 minutes',
          valueType: 'number',
          goalType: 'more'
        },
        valueNumber: 56,
        notes: '',
        itemDateTime: '2015-05-21T05:00:00.000Z'
      },
      {
        index: 2,
        _id: '56ca941148e719f108539fb6',
        user: {
          _id: '56ca941148e719f108539f9b',
          email: 'b@trackmytries.com'
        },
        category: {
          _id: '56ca941148e719f108539f96',
          name: 'Sit Ups',
          description: 'Number of sit ups completed in 2 minutes',
          valueType: 'number',
          goalType: 'more'
        },
        valueNumber: 9,
        notes: '',
        itemDateTime: '2012-08-17T05:00:00.000Z'
      },
      {
        index: 3,
        _id: '56ca941148e719f108539fb5',
        user: {
          _id: '56ca941148e719f108539f9b',
          email: 'b@trackmytries.com'
        },
        category: {
          _id: '56ca941148e719f108539f96',
          name: 'Sit Ups',
          description: 'Number of sit ups completed in 2 minutes',
          valueType: 'number',
          goalType: 'more'
        },
        valueNumber: 4,
        notes: '',
        itemDateTime: '2012-08-06T05:00:00.000Z'
      },
      {
        index: 4,
        _id: '56d1fed4e75ed3791cbd592a',
        user: {
          _id: '56ca941148e719f108539f9b',
          email: 'b@trackmytries.com'
        },
        valueNumber: 44,
        category: {
          _id: '56ca941148e719f108539f97',
          name: 'Push Ups',
          description: 'Number of push ups completed in 2 minutes',
          valueType: 'number',
          goalType: 'more'
        },
        '__v': 0,
        itemDateTime: '2016-02-27T19:53:51.987Z'
      },
      {
        index: 5,
        _id: '56ca941148e719f108539fb4',
        user: {
          _id: '56ca941148e719f108539f9b',
          email: 'b@trackmytries.com'
        },
        category: {
          _id: '56ca941148e719f108539f97',
          name: 'Push Ups',
          description: 'Number of push ups completed in 2 minutes',
          valueType: 'number',
          goalType: 'more'
        },
        valueNumber: 59,
        notes: '',
        itemDateTime: '2015-09-28T05:00:00.000Z'
      },
      {
        index: 6,
        _id: '56ca941148e719f108539fa7',
        user: {
          _id: '56ca941148e719f108539f9b',
          email: 'b@trackmytries.com'
        },
        category: {
          _id: '56ca941148e719f108539f97',
          name: 'Push Ups',
          description: 'Number of push ups completed in 2 minutes',
          valueType: 'number',
          goalType: 'more'
        },
        valueNumber: 20,
        notes: '',
        itemDateTime: '2012-08-17T05:00:00.000Z'
      },
      {
        index: 7,
        _id: '56ca941148e719f108539fa6',
        user: {
          _id: '56ca941148e719f108539f9b',
          email: 'b@trackmytries.com'
        },
        category: {
          _id: '56ca941148e719f108539f97',
          name: 'Push Ups',
          description: 'Number of push ups completed in 2 minutes',
          valueType: 'number',
          goalType: 'more'
        },
        valueNumber: 19,
        notes: '',
        itemDateTime: '2012-08-06T05:00:00.000Z'
      },
      {
        index: 8,
        _id: '56d1fedce75ed3791cbd592b',
        user: {
          _id: '56ca941148e719f108539f9b',
          email: 'b@trackmytries.com'
        },
        valueNumber: 6,
        category: {
          _id: '56ca941148e719f108539f98',
          name: 'Pull Ups',
          description: 'Number of pull ups completed',
          valueType: 'number',
          goalType: 'more'
        },
        '__v': 0,
        itemDateTime: '2016-02-27T19:54:01.642Z'
      },
      {
        index: 9,
        _id: '56ca944a732213f508b6e4e1',
        user: {
          _id: '56ca941148e719f108539f9b',
          email: 'b@trackmytries.com'
        },
        valueNumber: 5,
        category: {
          _id: '56ca941148e719f108539f98',
          name: 'Pull Ups',
          description: 'Number of pull ups completed',
          valueType: 'number',
          goalType: 'more'
        },
        '__v': 0,
        itemDateTime: '2016-02-22T04:53:27.320Z'
      },
      {
        index: 10,
        _id: '56ca941148e719f108539fa0',
        user: {
          _id: '56ca941148e719f108539f9b',
          email: 'b@trackmytries.com'
        },
        category: {
          _id: '56ca941148e719f108539f98',
          name: 'Pull Ups',
          description: 'Number of pull ups completed',
          valueType: 'number',
          goalType: 'more'
        },
        valueNumber: 0,
        notes: '',
        itemDateTime: '2012-08-17T05:00:00.000Z'
      },
      {
        index: 11,
        _id: '56ca941148e719f108539f9f',
        user: {
          _id: '56ca941148e719f108539f9b',
          email: 'b@trackmytries.com'
        },
        category: {
          _id: '56ca941148e719f108539f98',
          name: 'Pull Ups',
          description: 'Number of pull ups completed',
          valueType: 'number',
          goalType: 'more'
        },
        valueNumber: 0,
        notes: '',
        itemDateTime: '2012-08-06T05:00:00.000Z'
      },
      {
        index: 12,
        _id: '56ca941148e719f108539fdb',
        user: {
          _id: '56ca941148e719f108539f9b',
          email: 'b@trackmytries.com'
        },
        category: {
          _id: '56ca941148e719f108539f99',
          name: '1.5 Mile Run',
          description: 'Time in minutes and seconds (MM:SS) to run 1.5 miles',
          valueType: 'duration',
          goalType: 'less'
        },
        valueNumber: 728,
        itemDateTime: '2015-05-13T05:00:00.000Z'
      },
      {
        index: 13,
        _id: '56ca941148e719f108539fda',
        user: {
          _id: '56ca941148e719f108539f9b',
          email: 'b@trackmytries.com'
        },
        category: {
          _id: '56ca941148e719f108539f99',
          name: '1.5 Mile Run',
          description: 'Time in minutes and seconds (MM:SS) to run 1.5 miles',
          valueType: 'duration',
          goalType: 'less'
        },
        valueNumber: 653,
        itemDateTime: '2013-02-04T05:00:00.000Z'
      },
      {
        index: 14,
        _id: '56ca941148e719f108539fd6',
        user: {
          _id: '56ca941148e719f108539f9b',
          email: 'b@trackmytries.com'
        },
        category: {
          _id: '56ca941148e719f108539f99',
          name: '1.5 Mile Run',
          description: 'Time in minutes and seconds (MM:SS) to run 1.5 miles',
          valueType: 'duration',
          goalType: 'less'
        },
        valueNumber: 555,
        itemDateTime: '2012-08-17T05:00:00.000Z'
      },
      {
        index: 15,
        _id: '56ca941148e719f108539fd5',
        user: {
          _id: '56ca941148e719f108539f9b',
          email: 'b@trackmytries.com'
        },
        category: {
          _id: '56ca941148e719f108539f99',
          name: '1.5 Mile Run',
          description: 'Time in minutes and seconds (MM:SS) to run 1.5 miles',
          valueType: 'duration',
          goalType: 'less'
        },
        valueNumber: 1018,
        itemDateTime: '2012-08-06T05:00:00.000Z'
      }
    ]
  }
}

module.exports = ItemTestHelper
