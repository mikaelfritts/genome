var BaseModel     = require('./index'),
  nano            = require('../db');

function ArtistModel() {
  this.name                   = '';
  this.location               = '';
  this.email                  = '';
  this.phone                  = '';
  this.description            = '';
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

ArtistModel.prototype.output = function(admin) {
  if(admin === true) {
    return {
      id: this._id,
      rev: this._rev,
      name: this.name,
      email: this.email,
      phone: this.phone,
      website: this.website,
      location: this.location,
      description: this.description,
      bio: this.bio,
      tags: this.tags,
      featured: this.featured,
      active: this.active
    };
  }
  return {
    id: this._id,
    name: this.name,
    location: this.location,
    description: this.description,
    bio: this.bio,
    tags: this.tags,
    featured: this.featured,
    active: this.active
  };
}

module.exports = ArtistModel;
