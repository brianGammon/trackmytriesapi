exports.up = function (db, next) {
  var users = db.collection('users')
  var seedData = [
    {
      name: 'Brian Tester',
      email: 'b@trackmytries.com',
      password: '$2a$10$h3qc8RFhsEg67p88Ehb.8eNMETbxeSxMdYtUS8.z7iSXglJLyStoG',
      loginType: 'local',
      roles: ['admin', 'user']
    },
    {
      name: 'Rob Tester',
      email: 'r@trackmytries.com',
      password: '$2a$10$h3qc8RFhsEg67p88Ehb.8eNMETbxeSxMdYtUS8.z7iSXglJLyStoG',
      loginType: 'local',
      roles: ['user']
    },
    {
      name: 'Thomas Palmer',
      email: 't@trackmytries.com',
      loginType: 'fb',
      externalId: '913586432081857',
      roles: ['user']
    }
  ]

  users.insert(seedData, function (err) {
    if (err) {
      return next(err)
    }
    next()
  })
}

exports.down = function (db, next) {
  var users = db.collection('users')
  users.remove({}, function (err) {
    if (err) {
      return next(err)
    }
    next()
  })
}
