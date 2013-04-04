var BaseModel = require('./index');

function AvatarModel() {
  this.urls = {};
  this.email = '';
}

AvatarModel.prototype = new BaseModel();
AvatarModel.prototype.use('user_avatars');

module.exports = AvatarModel;