var BaseModel     = require('./index'),
  nano            = require('../db');

function ArtistPieceModel() {
  this.name                   = '';
  this.artist_id              = '';
  this.artist_name            = '';
  this.dimensions             = '';
  this.medium                 = '';
  this.price                  = '';
  this.description            = '';
  this.tags                   = '';
  this.photos                 = [];
  this.featured               = false;
  this.create_time            = new Date().getTime();
  this.active                 = true;
  this.type                   = 'piece';
    
  if(arguments[0]) {
    this.update(arguments[0]);
  }
}

ArtistPieceModel.prototype = new BaseModel();
ArtistPieceModel.prototype.use('artists');

ArtistPieceModel.prototype.output = function() {
  return {
    name: this.name,
    artist_name: this.artist_name,
    dimensions: this.dimensions,
    medium: this.medium,
    price: this.price,
    description: this.description,
    tags: this.tags,
    featured: this.featured,
    active: this.active
  }
}

module.exports = ArtistPieceModel;
