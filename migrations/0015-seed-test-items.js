'use strict'

exports.up = (db, next) => {
  let loader = require('../sample_data/seedDataLoader')
  loader.loadData(['b@trackmytries.com', 'r@trackmytries.com'], './sample_data/items-test-data.json', db, next)
}

exports.down = (db, next) => {
  let loader = require('../sample_data/seedDataLoader')
  loader.removeData(['b@trackmytries.com', 'r@trackmytries.com'], db, next)
}
