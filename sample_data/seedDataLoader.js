var seedDataLoader = (function(){
  var loadData = function(emails, file, db, next) {
    var fs = require('fs'),
        items = db.collection('items'),
        categories = db.collection('categories'),
        users = db.collection('users'),
        seedData = JSON.parse(fs.readFileSync(file,'utf8'));

    users.find({email: { $in: emails}}).toArray(function(err, usersResult) {
      if (err || !usersResult || usersResult.length < emails.length) {
        console.log("ERROR: Did not find the seeded user data.");
        return next();
      }

      categories.find().toArray(function(err, categoriesResult) {
        if (err || !categoriesResult || categoriesResult.length < 4) {
          console.log("ERROR: Did not find all the categories.");
          return next();
        }

        seedData.forEach(function(item) {
          var userFound = usersResult.filter(function(singleUser) {
            if (singleUser.email === item.user) {
              return singleUser;
            }
          });

          var categoryIdFinder = categoriesResult.filter(function(singleCategory){
            if (singleCategory.name === item.category) {
              return singleCategory;
            }
          });

          if (categoryIdFinder[0].valueType === 'duration') {
            item.valueNumber = parseInt(item.valueTime.slice(0, 2), 10) * 60 +
              parseInt(item.valueTime.slice(-2), 10);
              delete item.valueTime;
          }

          item.user = userFound[0]._id;
          item.category = categoryIdFinder[0]._id;
          item.itemDateTime = new Date(item.itemDateTime);
        });

        // console.log(seedData);
        // next();
        items.insert(seedData, next);
      });
    });
  }

  var removeData = function(emails, db, next) {
    var items = db.collection('items'),
        users = db.collection('users'),
        userIds = [];

    users.find({email: { $in: emails}}).toArray(function(err, usersResult) {
      if (err || !usersResult || usersResult.length !== emails.length) {
        console.log("ERROR: Did not find the seeded user data.");
        return next();
      }

      usersResult.forEach(function(currentUser){
        userIds.push(currentUser._id);
      });

      items.remove({user: { $in: userIds}}, next);
    });
  }

  return {
    loadData: loadData,
    removeData: removeData
  }

})();

module.exports = seedDataLoader;
