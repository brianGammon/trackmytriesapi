'use strict'

let nconf = require('nconf')

// Load up our config settings
// argv & server ENV override the file
// env.json goes in the root of the project where package.json is
// Defaults are the fallback
nconf.argv().env().file({ file: 'env.json' })
  .defaults({
    'NAME': 'trackmytriesapi',
    'PORT': 8080,
    'JWT_SECRET': 'nconf.default.thisShouldBeSetInServerEnv',
    'MONGO_HOST': 'localhost',
    'MONGO_DBNAME': 'trackmytries-dev',
    'MONGO_PORT': 'ignoredIfLocalhost',
    'MONGO_USER': 'ignoredIfLocalhost',
    'MONGO_PWD': 'ignoredIfLocalhost',
    'FB_API': 'https://graph.facebook.com/me?access_token=%s&fields=email,name'
  })

let host = nconf.get('MONGO_HOST')
let dbname = nconf.get('MONGO_DBNAME')
let port = nconf.get('MONGO_PORT')
let username = nconf.get('MONGO_USER')
let password = nconf.get('MONGO_PWD')

let connectionString = `mongodb://localhost/${dbname}`
if (host !== 'localhost') {
  connectionString = `mongodb://${username}:${password}@${host}:${port}/${dbname}`
}

module.exports = {
  appName: nconf.get('NAME'),
  serverPort: nconf.get('PORT'),
  secretKey: nconf.get('JWT_SECRET'),
  fbApi: nconf.get('FB_API'),
  connectionString
}
