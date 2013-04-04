var BaseModel     = require('./index'),
  nano            = require('../db');

function ArtistModel() {
  this.name                   = '';
  this.email                  = '';
  this.phone                  = '';
  this.short_description      = '';
  this.bio                    = '';
  this.tags                   = '';
  this.featured               = false;
  this.create_time            = new Date().getTime();
  this.active                 = true;
  this.type                   = 'artist';
    
  if(arguments[0]) {
    this.update(arguments[0]);
  }
}

ArtistModel.prototype = new BaseModel();
ArtistModel.prototype.use('artists');

ArtistModel.prototype.output = function() {
  return {
    name: this.name,
    short_description: this.short_description,
    bio: this.bio,
    tags: this.tags,
    featured: this.featured,
    active: this.active
  }
}

module.exports = ArtistModel;
