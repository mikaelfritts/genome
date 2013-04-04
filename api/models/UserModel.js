var BaseModel     = require('./index'),
  nano            = require('../db');

function UserModel() {
  this.authenticationKey      = '';
  this.email                  = '';
  this.username               = '';
  this.username_lc            = '';
  this.secret                 = '';
  this.password               = '';
  this.facebook_id            = '';
  this.twitter_access_code    = '';
  this.first_name             = '';
  this.last_name              = '';
  this.birthday               = '';
  this.create_time            = 0;
  this.last_login             = 0;
  this.registrationCode       = '';
  this.passwordCode           = '';
  this.active                 = false;
  this.role                   = '';
  this.avatar_url             = '';
  this.location		            = '';
    
  if(arguments[0]) {
    this.update(arguments[0]);
  }
}

UserModel.prototype = new BaseModel();
UserModel.prototype.use('users');

UserModel.prototype.account = function() {
  return {
    authenticationKey: this.authenticationKey,
    email: this.email,
    username: this.username,
    first_name: this.first_name,
    last_name: this.last_name,
    birthday: this.birthday,
    create_time: this.create_time,
    last_login: this.last_login,
    role: this.role,
    avatar_url: this.avatar_url,
    location: this.location
  }
}

UserModel.prototype.output = function() {
  return {
    username: this.username,
    first_name: this.first_name,
    last_name: this.last_name,
    birthday: this.birthday,
    role: this.role,
    avatar_url: this.avatar_url,
    location: this.location
  }
}

UserModel.prototype.hasPassword = function() {
  if(this.password.length <= 0) {
    return false;
  }
  
  return true;
}

UserModel.prototype.hasPermission = function(name, cb) {
  var RoleModel = require('./RoleModel');
  
  var role = new RoleModel();
  role.getById(this.role, function(err, body) {
    if(err) {
      cb(false);
    }
    
    role.update(body);
    cb(role.hasPermission(name));
  });
}

UserModel.prototype.getByUsername = function(username, cb) {
  var users = nano.use('users');
  var $scope = this;
  users.view('users', 'by_username', {key: username}, function(err, body) {
    if(err || body.rows.length <= 0) {
      if(cb)
        return cb(err, null);
    }
    $scope.update(body.rows[0].value);
    if(cb)
      return cb(null, $scope);
  });
}

module.exports = UserModel;
