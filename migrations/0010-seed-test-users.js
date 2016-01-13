exports.up = function(db, next){
  var users = db.collection('users'),
      seedData = [
        {
          email: 'b@trackmytries.com',
          password: '$2a$10$h3qc8RFhsEg67p88Ehb.8eNMETbxeSxMdYtUS8.z7iSXglJLyStoG',
          roles: ['admin','user']
        },
        { email: 'r@trackmytries.com',
          password: '$2a$10$h3qc8RFhsEg67p88Ehb.8eNMETbxeSxMdYtUS8.z7iSXglJLyStoG',
          roles: ['user']
        }
      ];

  users.insert( seedData, function(err, result) {
    if (err) {
      return next(err);
    }
    next();
  });
};

exports.down = function(db, next){
  var users = db.collection('users');
  users.remove({}, function (err, result) {
    next();
  });
};
