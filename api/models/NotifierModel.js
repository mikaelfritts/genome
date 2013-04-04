var BaseModel     = require('./index');

function NotifierModel() {
  this.event        = '';
  this.description  = '';
  this.time         = new Date().getTime();
  this.read         = false;
  this.to           = '';
  this.from         = '';
  this.data         = {};
  
  if(arguments[0]) {
    this.update(arguments[0]);
  }
}

NotifierModel.prototype = new BaseModel();
NotifierModel.prototype.use('notifications');

NotifierModel.prototype.setTo = function(t) {
  this.to = t;
  
  return this;
}

NotifierModel.prototype.setFrom = function(f) {
  this.from = f;
  
  return this;
}

NotifierModel.prototype.setEvent = function(c) {
  this.event = c;
  
  return this;
}

NotifierModel.prototype.setDescription = function(d) {
  this.description = d;
  
  return this;
}

NotifierModel.prototype.setData = function(d) {
  this.data = d;
  
  return this;
}

NotifierModel.prototype.setRead = function() {
  this.read = true;
  
  return this;
}

NotifierModel.prototype.setUnread = function() {
  this.read = false;
  
  return this;
}

NotifierModel.prototype.setTime = function(t) {
  this.time = t;
  
  return this;
}

NotifierModel.prototype.output = function() {
  return JSON.stringify({
    event        : this.event,
    description  : this.description,
    time         : this.time,
    read         : this.read,
    data         : this.data
  }) + "\r\n";
}

NotifierModel.prototype._output = function() {
  return {
    id           : this._id,
    event        : this.event,
    description  : this.description,
    time         : this.time,
    read         : this.read,
    data         : this.data
  };
}

module.exports = NotifierModel;