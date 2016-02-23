'use strict'

let categoryController = (Category) => {
  let insert = (req, res, next) => {
    let category = new Category(req.body)

    category.save((err) => {
      if (err) {
        return next(err)
      }
      res.send(201, category)
    })
  }

  let getAll = (req, res, next) => {
    Category.find((err, categories) => {
      if (err) {
        return next(err)
      }
      res.send(200, categories)
    })
  }

  let getById = (req, res, next) => {
    Category.findById(req.params.categoryId, (err, category) => {
      if (err) {
        return next(err)
      }

      if (!category) {
        return res.send(404, 'Category not found')
      }

      req.category = category
      next()
    })
  }

  var update = (req, res, next) => {
    req.category.name = req.body.name
    req.category.description = req.body.description
    req.category.valueType = req.body.valueType
    req.category.goalType = req.body.goalType
    req.category.save((err) => {
      if (err) {
        return next(err)
      }
      res.send(200, req.category)
    })
  }

  var deleteCategory = (req, res, next) => {
    console.log('Calling remove')
    req.category.remove((err) => {
      console.log('Calling res.send')
      if (err) {
        return next(err)
      }

      res.send(204, 'Category removed')
    })
  }

  return {
    insert,
    getAll,
    getById,
    update,
    delete: deleteCategory
  }
}

module.exports = categoryController
