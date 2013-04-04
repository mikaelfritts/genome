var BaseModel = require('./index');

function RoleModel() {
  this.name          = '';
  this.permissions   = [];
  
  if(arguments[0]) {
    this.update(arguments[0]);
  }
}

RoleModel.prototype = new BaseModel();
RoleModel.prototype.use('roles');

RoleModel.prototype.addPermission = function(name) {
  this.permissions.push(name);
}

RoleModel.prototype.hasPermission = function(name) {
  if(this.permissions.indexOf(name) !== -1) {
    return true;
  }
  
  return false;
}

RoleModel.prototype.output = function() {
  return {
    id: this._id,
    name: this.name,
    permissions: this.permissions
  };
}

module.exports = RoleModel;