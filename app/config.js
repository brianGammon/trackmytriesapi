var nconf = require('nconf'),
    util = require('util'),
    host,
    dbname,
    port,
    username,
    password,
    connectionString;

// Loap up our config settings
// Argv & server ENV override the file
// env.json goes in the root of the project where package.json is
// Defaults are the fallback
nconf.argv().env().file({ file: 'env.json' })
  .defaults({
    "NAME": "trackmytriesapi",
    "PORT": 8080,
    "JWT_SECRET":"nconf.default.thisShouldBeSetInServerEnv",
    "MONGO_HOST": "localhost",
    "MONGO_DBNAME": "trackmytries-dev",
    "MONGO_PORT": "ignoredIfLocalhost",
    "MONGO_USER": "ignoredIfLocalhost",
    "MONGO_PWD": "ignoredIfLocalhost",
    "FB_API": "https://graph.facebook.com/me?access_token=%s&fields=email,name"
  });

host = nconf.get('MONGO_HOST');
dbname = nconf.get('MONGO_DBNAME');
port = nconf.get('MONGO_PORT');
username = nconf.get('MONGO_USER');
password = nconf.get('MONGO_PWD');

connectionString = 'mongodb://localhost/' + dbname;
if (host !== 'localhost') {
  connectionString = util.format(
    'mongodb://%s:%s@%s:%s/%s', username, password, host, port, dbname);
}

module.exports = {
  appName: nconf.get('NAME'),
  serverPort: nconf.get('PORT'),
  secretKey: nconf.get('JWT_SECRET'),
  fbApi: nconf.get('FB_API'),
  connectionString: connectionString
};
