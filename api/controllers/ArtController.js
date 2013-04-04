function ArtController(params) {
  var app            = params.app,
    nano             = require('../db'),
    UserModel        = require('../models/UserModel'),
    ArtistModel      = require('../models/ArtistModel'),
    ArtistPieceModel = require('../models/ArtistPieceModel'),
    ResponseModel    = require('../models/ResponseModel'),
    config           = require('../config'),
    papercut         = require('papercut');

  papercut.configure(function() {
    papercut.set('storage', 'file');
    papercut.set('directory', './uploads/pieces');
    papercut.set('url', '/uploads/pieces');
  });
  
  var imageUploader = papercut.Schema(function(schema) {
    for(var i in config.pieces) {
      schema.version({
        name: i,
        size: config.pieces[i].size,
        process: config.pieces[i].process
      });
    }
  });
  
  this.index = function(req, res, next) {
    var resp = new ResponseModel();
    console.log(req.params);
    res.send(resp.responseCode, resp.output());
  }
  
  this.getArtists = function(req, res, next) {
    
  }
  
  this.postArtist = function(req, res, next) {
    
  }
  
  this.getArtistPieces = function(req, res, next) {
    
  }
  
  this.postArtistPiece = function(req, res, next) {
    
  }
  
  return this;
}

module.exports = ArtController;