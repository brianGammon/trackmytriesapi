'use strict'

let itemController = (Item, Category) => {
  let getItems = (req, res, next) => {
    let query = {category: req.query.categoryId, user: req.user._id}
    Item.find(query)
      .populate('category')
      .populate('user', 'email')
      .sort('-itemDateTime')
      .exec((err, items) => {
        if (err) {
          return next(err)
        }
        res.send(200, items)
        next()
      })
  }

  let getItemById = (req, res, next) => {
    Item.findById(req.params.itemId)
      .populate('category')
      .populate('user', 'email')
      .exec((err, item) => {
        if (err) {
          return next(err)
        }

        if (!item) {
          return res.send(404, 'Item not found')
        }

        req.item = item
        next()
      })
  }

  let addItem = (req, res, next) => {
    let item = new Item(req.body)
    item.save((err, newItem) => {
      if (err) {
        return next(err)
      }
      res.send(201, newItem)
      next()
    })
  }

  let updateItem = (req, res, next) => {
    // maps the fields
    req.item.user = req.body.user
    req.item.category = req.body.category
    req.item.itemDateTime = req.body.itemDateTime
    req.item.valueNumber = req.body.valueNumber
    req.item.notes = req.body.notes
    req.item.save((err) => {
      if (err) {
        return next(err)
      }
      res.send(200, req.item)
      next()
    })
  }

  let deleteItem = (req, res, next) => {
    req.item.remove((err) => {
      if (err) {
        return next(err)
      }
      res.send(204, 'Item removed')
    })
  }

  let getStats = (req, res, next) => {
    let query = {}
    if (req.query.categoryId) {
      query._id = req.query.categoryId
    }
    Category.find(query).lean().exec((err, categories) => {
      if (err) {
        return next(err)
      }

      if (!categories || categories.length === 0) {
        return next(new Error('Invalid category or no categories found'))
      }

      // Loop over the category or categories and query Item for the best
      let loopCounter = categories.length
      categories.forEach((category) => {
        // Pull all items from category, ordered by itemDateTime
        Item.find({category: category._id, user: req.user._id})
          .lean()
          .sort({itemDateTime: -1})
          // .populate('category')
          .exec((err, allItems) => {
            if (err) {
              return next(err)
            }

            if (allItems.length > 0) {
              category.stats = {}
              category.stats.first = allItems[allItems.length - 1]
              category.stats.latest = allItems[0]

              // Resort the items to find the pr
              let sortDirection = -1
              let prQuery = Item.findOne({category: category._id, user: req.user._id})

              // set the sort direction based on the goalType
              if (category.goalType === 'less') {
                sortDirection = 1
              }

              prQuery.sort({valueNumber: sortDirection, itemDateTime: 1})

              // Query for best entry in this category
              prQuery.exec((err, bestItem) => {
                if (err) {
                  return next(err)
                }

                category.stats.best = bestItem

                // All the loops are done, so return
                // Need to swap this out with async.js
                loopCounter--
                if (loopCounter === 0) {
                  if (req.query.categoryId) {
                    res.send(200, categories[0])
                    return next()
                  }
                  res.send(200, categories)
                  return next()
                }
              })
            } else {
              // No items in this category
              // If all the loops are done, return
              // Need to swap this out with async.js
              loopCounter--
              if (loopCounter === 0) {
                if (req.query.categoryId) {
                  res.send(200, categories[0])
                  return next()
                }
                res.send(200, categories)
                next()
              }
            }
          })
      })
    })
  }

  let requireAuthorization = (req, res, next) => {
    // TODO: Not sure why I need to toString on the item.user._id
    if (req.user._id !== req.item.user._id.toString()) {
      return res.send(403, 'Not authorized for that Item')
    }
    next()
  }

  return {
    addItem,
    getItems,
    getItemById,
    getStats,
    updateItem,
    deleteItem,
    requireAuthorization
  }
}

module.exports = itemController
