exports.up = function (db, next) {
  var loader = require('../sample_data/seedDataLoader')
  loader.loadData(['b@trackmytries.com', 'r@trackmytries.com'], './sample_data/items-test-data.json', db, next)
}

exports.down = function (db, next) {
  var loader = require('../sample_data/seedDataLoader')
  loader.removeData(['b@trackmytries.com', 'r@trackmytries.com'], db, next)
}
