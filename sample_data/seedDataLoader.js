'use strict'

let seedDataLoader = (() => {
  let loadData = (emails, file, db, next) => {
    let fs = require('fs')
    let items = db.collection('items')
    let categories = db.collection('categories')
    let users = db.collection('users')
    let seedData = JSON.parse(fs.readFileSync(file, 'utf8'))

    users.find({email: {$in: emails}}).toArray((err, usersResult) => {
      if (err || !usersResult || usersResult.length < emails.length) {
        console.log('ERROR: Did not find the seeded user data.')
        return next()
      }

      categories.find().toArray((err, categoriesResult) => {
        if (err || !categoriesResult || categoriesResult.length < 4) {
          console.log('ERROR: Did not find all the categories.')
          return next()
        }

        seedData.forEach((item) => {
          let userFound = usersResult.filter((singleUser) => {
            if (singleUser.email === item.user) {
              return singleUser
            }
          })

          let categoryIdFinder = categoriesResult.filter((singleCategory) => {
            if (singleCategory.name === item.category) {
              return singleCategory
            }
          })

          if (categoryIdFinder[0].valueType === 'duration') {
            item.valueNumber = parseInt(item.valueTime.slice(0, 2), 10) * 60 +
              parseInt(item.valueTime.slice(-2), 10)
            delete item.valueTime
          }

          item.user = userFound[0]._id
          item.category = categoryIdFinder[0]._id
          item.itemDateTime = new Date(item.itemDateTime)
        })

        // console.log(seedData)
        // next()
        items.insert(seedData, next)
      })
    })
  }

  let removeData = (emails, db, next) => {
    let items = db.collection('items')
    let users = db.collection('users')
    let userIds = []

    users.find({email: {$in: emails}}).toArray((err, usersResult) => {
      if (err || !usersResult || usersResult.length !== emails.length) {
        console.log('ERROR: Did not find the seeded user data.')
        return next()
      }

      usersResult.forEach((currentUser) => {
        userIds.push(currentUser._id)
      })

      items.remove({user: {$in: userIds}}, next)
    })
  }

  return {
    loadData: loadData,
    removeData: removeData
  }
})()

module.exports = seedDataLoader
