function ArtController(params) {
  var app            = params.app,
    nano             = require('../db'),
    UserModel        = require('../models/UserModel'),
    ArtistModel      = require('../models/ArtistModel'),
    ArtistPieceModel = require('../models/ArtistPieceModel'),
    ResponseModel    = require('../models/ResponseModel'),
    config           = require('../config'),
    papercutArt      = require('papercut'),
    papercutArtist   = require('papercut');

  papercutArt.configure(function() {
    papercut.set('storage', 'file');
    papercut.set('directory', './uploads/pieces');
    papercut.set('url', '/uploads/pieces');
  });
  
  papercutArtist.configure(function() {
    papercut.set('storage', 'file');
    papercut.set('directory', './uploads/artists');
    papercut.set('url', '/uploads/artists');
  });
  
  var imageUploader = papercutArt.Schema(function(schema) {
    for(var i in config.pieces) {
      schema.version({
        name: i,
        size: config.pieces[i].size,
        process: config.pieces[i].process
      });
    }
  });
  
  var avatarUploader = papercutArtist.Schema(function(schema) {
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
    var start_key = '';
    var featured = false;
    var limit = 10;
    var id = '';
    var resp = new ResponseModel();
    var db = nano.use('artists');
    var is_admin = req.admin;
  
    if(req.params.start_key) {
      start_key = req.params.start_key;
    }
    if(req.params.featured) {
      featured = true;
    }
    if(req.params.id) {
      id = req.params.id;
    }
    if(req.params.limit) {
      limit = parseInt(req.params.limit, 10);
    }
    
    if(id !== '') {
      db.get(id, function(err, body) {
        if(err) {
          resp.setCode(400);
          resp.errorMessage('Artist does not exist');
          return;
        }
        
        var artist = new ArtistModel(body);
        resp.data(artist.output(is_admin));
        res.send(resp.responseCode, resp.output());
      });
      return;
    }
    if(featured === true) {
      db.view('artists', 'featured_artists', function(err, body) {
        var artists = [];
        for(i in body.rows) {
          var a = new ArtistModel(body.rows[i].value);
          artists.push(a.output(is_admin));
        }
        
        resp.data(artists);
        res.send(resp.responseCode, resp.output());
      });
      
      return;
    }
    
    var p = {};
    p.limit = limit;
    if(start_key !== '')
      p.startkey_docid = start_key;
    
    db.view('artists', 'only_artists', p, function(err, body) {
      if(err) {
        console.log(err);
        resp.setCode(400);
        resp.errorMessage(err.error + ': ' + err.reason);
        res.send(resp.responseCode, resp.output());
        return;
      }
      
      var artists = [];
      for(i in body.rows) {
        var a = new ArtistModel(body.rows[i].value);
        artists.push(a.output(is_admin));
      }
      
      resp.data(artists);
      res.send(resp.responseCode, resp.output());
    });
  }
  
  this.getAdminArtists = function(req, res, next) {
    var user = new UserModel(req.user.value);
    user.hasPermission('artists', function(access) {
      if(!access) {
        resp.setCode(403);
        resp.errorMessage("Unauthorized");
        res.send(resp.responseCode, resp.output());
        return;
      }
      req.admin = true;
      this.getArtists(req, res, next);
    });
  }
  
  this.postArtist = function(req, res, next) {
    var resp = new ResponseModel();
    var user = new UserModel(req.user.value);
    user.hasPermission('artists', function(access) {
      if(!access) {
        resp.setCode(403);
        resp.errorMessage("Unauthorized");
        res.send(resp.responseCode, resp.output());
        return;
      }
      
      tags = [];
      if(req.params.tags && req.params.tags.length > 0) {
        tags = req.params.tags.split(',');
      }
      
      var artist = new ArtistModel({
        name: req.params.name,
        location: req.params.location,
        description: req.params.description,
        email: req.params.email,
        phone: req.params.phone,
        website: req.params.website,
        tags: tags,
        featured: req.params.featured,
        active: req.params.active
      });
      
      if(req.params.id) {
        artist._id = req.params.id;
        artist._rev = req.params.rev;
      }
      
      artist.save();
      
      resp.data(artist.output(true));
      res.send(resp.responseCode, resp.output());
    });
  }
  
  this.deleteArtist = function(req, res, next) {
    var resp = new ResponseModel();
    var user = new UserModel(req.user.value);
    user.hasPermission('artists', function(access) {
      if(!access) {
        resp.setCode(403);
        resp.errorMessage("Unauthorized");
        res.send(resp.responseCode, resp.output());
        return;
      }
      
      var db = nano.use('artists');
      db.get(req.params._id, {revs_info: true}, function(err, body) {
        if(err) {
          resp.setCode(400);
          resp.errorMessage('Artist does not exist');
          return;
        }
        
        for(var i in body._revs_info) {
          db.destroy(req.params._id, body._revs_info[i].rev, function(err, body) {

          });
        }
        
        resp.data({ok: true});
        res.send(resp.responseCode, resp.output());
      });
    });
  }
  
  this.getArtistPieces = function(req, res, next) {
    
  }
  
  this.postArtistPiece = function(req, res, next) {
    
  }
  
  return this;
}

module.exports = ArtController;