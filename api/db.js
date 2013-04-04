var _       = require('./utils');
var config  = require('./config');
if(!config.env[process.env.NODE_ENV]) {
  console.log('Error: invalid environment');
  return;
}
module.exports = require('nano')(_.dbInitOptions(config.env[process.env.NODE_ENV].database));