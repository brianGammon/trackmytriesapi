'use strict'

exports.up = (db, next) => {
  let categories = db.collection('categories')
  let seedData = [
    {
      name: 'Sit Ups',
      description: 'Number of sit ups completed in 2 minutes',
      valueType: 'number',
      goalType: 'more'
    },
    {
      name: 'Push Ups',
      description: 'Number of push ups completed in 2 minutes',
      valueType: 'number',
      goalType: 'more'
    },
    {
      name: 'Pull Ups',
      description: 'Number of pull ups completed',
      valueType: 'number',
      goalType: 'more'
    },
    {
      name: '1.5 Mile Run',
      description: 'Time in minutes and seconds (MM:SS) to run 1.5 miles',
      valueType: 'duration',
      goalType: 'less'
    }
  ]
  categories.insert(seedData, next)
}

exports.down = (db, next) => {
  let categories = db.collection('categories')
  categories.remove({}, next)
}
