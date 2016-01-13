var categoryController = function(Category) {

  var insert = function(req, res, next) {
    var category = new Category(req.body);

    category.save(function (err) {
      if (err){
        return next(err);
      }
      res.send(201, category);
    });

  }

  var getAll = function(req, res, next) {
    Category.find(function(err, categories) {
      if (err) {
        return next(err);
      }
      res.send(200, categories);
    });
  }

  var getById = function(req, res, next) {
    Category.findById(req.params.categoryId,function(err,category){
      if (err) {
        return next(err);
      }

      if (!category) {
        return res.send(404, "Category not found");
      }

      req.category = category;
      next();
    });
  }

  var update = function(req, res, next){
    req.category.name = req.body.name;
    req.category.description = req.body.description;
    req.category.dataType = req.body.dataType;
    req.category.goalType = req.body.goalType;
    req.category.save(function(err){
      if (err) {
        return next(err);
      }
      res.send(200, req.category);
    });
  }

  var deleteCategory = function(req, res, next) {
    console.log('Calling remove');
    req.category.remove(function(err){
      console.log('Calling res.send');
      if (err) {
        return next(err);
      }

      res.send(204, 'Category removed');
    });
  }

  return {
    insert: insert,
    getAll: getAll,
    getById: getById,
    update: update,
    delete: deleteCategory
  }
}

module.exports = categoryController;
