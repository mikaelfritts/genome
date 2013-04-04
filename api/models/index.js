var config = require('../config');
var _ = require('../utils');

if(!config.env[process.env.NODE_ENV]) {
  console.log('Error: invalid environment');
  return;
}

var nano = require('nano')(_.dbInitOptions(config.env[process.env.NODE_ENV].database));

function BaseModel() {
  this.database = '';
  this.indexName = '_id';
  this._id = undefined;
  this._rev = undefined;
}

BaseModel.prototype.use = function(db) {
  this.database = nano.use(db);
}

BaseModel.prototype.setIndex = function(i) {
  this.indexName = i;
}

BaseModel.prototype.index = function(i) {
  this._id = i;
}

BaseModel.prototype.revision = function(rev) {
  this._rev = rev;
}

BaseModel.prototype.update = function(params) {
  for(var i in params) {
    if(typeof this[i] === 'undefined')
      continue;
    if(typeof this[i] === 'function')
      continue;
    if(typeof this[i] === 'object') {
      var isJSON = true;
      for(var j in this[i]) {
        if(typeof this[i][j] === 'function') {
          isJSON = false;
          break;
        }
      }
      
      if(!isJSON) continue;
    }
      
    this[i] = params[i];
  }
  
  if(typeof params._rev === 'string' && params._rev.length > 0)
    this._rev = params._rev;
  if(typeof params._id === 'string' && params._id.length > 0)
    this._id = params._id;
}

BaseModel.prototype.save = function(cb) {
  var data = {};
  
  var $scope = this;
  
  for(var i in this) {
    if(typeof this[i] === 'undefined')
      continue;
    if(typeof this[i] === 'function')
      continue;
    if(typeof this[i] === 'object') {
      var isJSON = true;
      for(var j in this[i]) {
        if(typeof this[i][j] === 'function') {
          isJSON = false;
          break;
        }
      }
      
      if(!isJSON) continue;
    }
      
    data[i] = this[i];
  }
  
  data._rev = this._rev;

  this.database.insert(data, this._id, function(err, body) {
    if(err && err.error == 'conflict') {
      return $scope._update(data, $scope._id, cb);
    } else if(err) {
      if(cb)
        cb(err, body);
        
      return;
    }
    
    $scope._rev = body.rev;
    $scope._id = body.id;
    if(cb)
      cb(err, body);
  });
}

BaseModel.prototype._update = function(data, id, callback) {
  var $scope = this;
  $scope.database.get(id, function (error, existing) { 
    if(!error) data._rev = existing._rev;
    $scope.database.insert(data, id, callback);
  });
}

BaseModel.prototype.getById = function(id, cb) {
  this.database.get(id, cb);
}

module.exports = BaseModel;