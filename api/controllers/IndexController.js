function IndexController(params) {
  var app         = params.app,
    ResponseModel = require('../models/ResponseModel');
  
  this.index = function(req, res, next) {
    var resp = new ResponseModel();
    console.log(req.params);
    res.send(resp.responseCode, resp.output());
  }
  
  return this;
}

module.exports = IndexController;