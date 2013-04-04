function AccountController(params) {
  var app             = params.app,
    nano              = require('../db'),
    _                 = params._,
    ResponseModel     = require('../models/ResponseModel'),
    UserModel         = require('../models/UserModel'),
    check             = require('validator').check;
    
  this.getAccount = function(req, res, next) {
    var resp = new ResponseModel();
    var user = new UserModel(req.user.value);
    resp.data(user.account());

    res.send(200, resp.output());
  }
  
  this.updateAccount = function(req, res, next) {
    var resp = new ResponseModel();
    var user = new UserModel(req.user.value);
    
    if(typeof req.params.password === 'string') {
      try {
        check(req.params.password, "Password must be at least 6 characters in length").notNull().len(6);
        check(req.params.password, "Passwords do not match").equals(req.params.confirm_password);
      } catch(e) {
        resp.setCode(400);
        resp.errorMessage(e.message);
        res.send(resp.responseCode, resp.output());
        return;
      }
      
      user.password = req.params.password;
      _.encodePassword(user);
      resp.statusMessage("Password updated.");
    }
    
    var updateParams = {};
    for(var i in req.params) {
      if(i === 'authenticationKey' || i === 'password' || i === 'confirm_password')
        continue;
        
      try {
        check(req.params[i], i + " is invalid.").notNull();
      } catch(e) {
        resp.setCode(400);
        resp.errorMessage(e.message);
        res.send(resp.responseCode, resp.output());
        return;
      }
      
      updateParams[i] = req.params[i];
    }
    
    user.update(updateParams);

    user.save(function(err, body) {
      if(err) {
        resp.setCode(500);
        resp.errorMessage("An error occurred");
        res.send(resp.responseCode, resp.output());
        return;
      }
      
      resp.data(user.account());
      res.send(resp.responseCode, resp.output());
    });
  }
      
  return this;
}

module.exports = AccountController;