function AvatarController(params) {
  var app         = params.app,
    nano          = require('../db'),
    check         = require('validator').check,
    ResponseModel = require('../models/ResponseModel'),
    UserModel     = require('../models/UserModel'),
    AvatarModel   = require('../models/AvatarModel'),
    config        = require('../config'),
    papercut      = require('papercut');

  papercut.configure(function() {
    papercut.set('storage', 'file');
    papercut.set('directory', './uploads/avatars');
    papercut.set('url', '/uploads/avatars');
  });
  
  var avatarUploader = papercut.Schema(function(schema) {
    for(var i in config.avatars) {
      schema.version({
        name: i,
        size: config.avatars[i].size,
        process: config.avatars[i].process
      });
    }
  });
  
  var uploader = new avatarUploader();
    
  this.setAvatar = function(req, res, next) {
    var resp = new ResponseModel();
    var users = nano.use('users');
    var user = new UserModel(req.user.value);

    if(!req.params.files || !req.params.files.avatarUpload) {
      resp.setCode(417);
      resp.errorMessage(" 'req.params.files' or 'req.params.avatarUpload' not specified");
      res.send(resp.responseCode, resp.output());
      return;
    }
    
    uploader.process(user.username_lc, req.params.files.avatarUpload.path, function(err, images){
      if(err) {
        resp.setCode(500);
        resp.errorMessage("Something went wrong");
        res.send(resp.responseCode, resp.output());
        return;
      }
      // create new AvatarModel, save it.
      
      var avatar = new AvatarModel();
      avatar.getById(user.username_lc, function(err, body) {
        if(err && err.error !== 'not_found') {
          console.log(err);
          resp.setCode(500);
          resp.errorMessage("Something went wrong");
          res.send(resp.responseCode, resp.output());
          return;
        }
        
        console.log(body);
        avatar.username = user.username_lc;
        avatar._id = user.username_lc;
        if(body && body._rev) {
          avatar._rev = body._rev;
        }
        for(var i in config.avatars) {
          avatar.images.push(images[i]);
        }
        
        avatar.save(function(err, body) {
          if(err) {
            resp.setCode(500);
            resp.errorMessage("Something went wrong");
            res.send(resp.responseCode, resp.output());
            return;
          }
          resp.statusMessage("Avatar uploaded.");
          resp.data(avatar.images);
          res.send(resp.responseCode, resp.output());
          return;
        });
      });
    });
  }
  
  this.getAvatar = function(req, res, next) {
    var resp = new ResponseModel();
    var username = req.params.username;
    var avatar = new AvatarModel();
    
    avatar.getById(username, function(err, body) {
      if(err) {
        var default_images = ['/uploads/avatars/default-normal.jpg', '/uploads/avatars/default-thumbnail.jpg'];
        resp.data(default_images);
      } else {
        resp.data(body.images);   
      }
      
     
      res.send(resp.responseCode, resp.output());
      return;
    });
  }
  
  this.getImage = function(req, res, next) {
    var resp = new ResponseModel();
    var path = decodeURIComponent(req.path.replace(/\+/g," "));
    fs.readFile('.' + path, function(err, file) {
      if (err) {
        resp.errorMessage("Image url not found");
        res.send(resp.responseCode, resp.output());
        return;
      } else {
        res.write(file);
        res.end();
        return;
      }
    });
  };

  return this;
}

module.exports = AvatarController;
