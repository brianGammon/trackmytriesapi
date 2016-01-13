var itemController = function(Item, Category){

  var getItems = function(req, res, next){
    var query = {category: req.query.categoryId, user: req.user._id};
    Item.find(query)
      .populate('category')
      .populate('user','email')
      .sort('-itemDateTime')
      .exec(function(err,items){
        if (err) {
          return next(err);
        }
        res.send(items);
    });
  }

  var getItemById = function (req, res, next) {
    Item.findById(req.params.itemId)
      .populate('category')
      .populate('user','email')
      .exec(function (err,item) {
        if(err){
          return next(err);
        }

        if (!item) {
          return res.send(404, "Item not found");
        }

        req.item = item;
        next();
      });
  }

  var addItem = function(req, res, next){
    var item = new Item(req.body);
    item.save(function(err, newItem){
      if (err) {
        return next(err);
      }
      res.send(201, newItem);
    });
  }

  var updateItem= function (req, res, next) {
    //maps the fields
    req.item.user = req.body.user;
    req.item.category = req.body.category;
    req.item.itemDateTime = req.body.itemDateTime;
    req.item.valueNumber = req.body.valueNumber;
    req.item.valueTime = req.body.valueTime;
    req.item.notes = req.body.notes;
    req.item.save(function(err,item){
      if (err) {
        return next(err);
      }
      res.send(item);
    });
  }

  var deleteItem = function (req, res, next) {
    req.item.remove(function(err){
      if(err) {
        return next(err);
      }
      res.send(204, 'Item removed');
    });
  }

  var getPersonalRecords = function (req, res, next) {
    var query = {};
    if (req.query.categoryId) {
      query._id = req.query.categoryId;
    }
    Category.find(query,function(err, categories) {
      if (err) {
        return next(err);
      }
      if (!categories || categories.length === 0) {
        return next(new Error('Invalid category or no categories found'));
      }

      // Loop over the category or categories and query Item for the best
      var loopCounter = 0;
      var prs = [];
      categories.forEach(function(category) {
        loopCounter++;
        var sortDirection = -1,
            query = Item.findOne({category: category._id,user: req.user._id});

        // set the sort direction based on the goalType
        if (category.goalType === 'least') {
          sortDirection = 1;
        }

        // set the sort column based on the category dataType
        if (category.dataType === 'time'){
          query.sort({valueTime: sortDirection, itemDateTime: 1});
        } else {
          query.sort({valueNumber: sortDirection, itemDateTime: 1});
        }

        // Query for best entry in this category
        query.populate('category').exec(function (err, bestItem) {
          loopCounter--;
          if (err) {
            return next(err);
          }

          if (bestItem) {
            prs.push(bestItem);
          }

          if (loopCounter === 0) {
            if (prs.length === 0) {
              prs = null;
            } else if (prs.length === 1 && req.query.categoryId) {
              prs = prs[0];
            }
            res.send(prs);
          }
        });
      })
    });
  }

  var requireAuthorization = function(req, res, next){
    // TODO: Not sure why I need to toString on the item.user._id
    if (req.user._id !== req.item.user._id.toString()) {
      return res.send(403, "Not authorized for that Item");
    }
    next();
  }

  return {
    addItem: addItem,
    getItems: getItems,
    getItemById: getItemById,
    getPersonalRecords: getPersonalRecords,
    updateItem: updateItem,
    deleteItem: deleteItem,
    requireAuthorization: requireAuthorization
  }
}

module.exports = itemController;
