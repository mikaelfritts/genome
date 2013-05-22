function ArticlesController(params) {
  var app            = params.app,
    nano             = require('../db'),
    UserModel        = require('../models/UserModel'),
    ArticleModel      = require('../models/ArticleModel'),
    ResponseModel    = require('../models/ResponseModel');
  
  this.index = function(req, res, next) {
    var resp = new ResponseModel();
    console.log(req.params);
    res.send(resp.responseCode, resp.output());
  }
  
  this.getArticles = function(req, res, next) {
    var start_key = '';
    var featured = false;
    var id = '';
    var resp = new ResponseModel();
    var db = nano.use('articles');
  
    if(req.params.start_key) {
      start_key = req.params.start_key;
    }
    if(req.params.featured) {
      featured = true;
    }
    if(req.params.id) {
      id = req.params.id;
    }
    
    if(id !== '') {
      db.get(id, function(err, body) {
        if(err) {
          resp.setCode(400);
          resp.errorMessage('Article does not exist');
          return;
        }
        
        var article = new ArticleModel(body);
        resp.data(article.output());
        res.send(resp.responseCode, resp.output());
      });
      return;
    }
    if(featured === true) {
      db.view('articles', 'featured_articles', function(err, body) {
        var articles = [];
        for(i in body.rows) {
          var a = new ArticleModel(body.rows[i].value);
          articles.push(a.output());
        }
        
        resp.data(articles);
        res.send(resp.responseCode, resp.output());
      });
      
      return;
    }
    
    var p = {};
    p.limit = 10;
    if(start_key !== '')
      p.startkey_docid = start_key;
    
    db.list(p, function(err, body) {
      if(err) {
        resp.setCode(400);
        resp.errorMessage(err.error + ': ' + err.reason);
        res.send(resp.responseCode, resp.output());
        return;
      }
      
      var articles = [];
      for(i in body.rows) {
        var a = new ArticleModel(body.rows[i].value);
        articles.push(a.output());
      }
      
      resp.data(articles);
      res.send(resp.responseCode, resp.output());
    });
  }
  
  this.postArticle = function(req, res, next) {
    var resp = new ResponseModel();
    var user = new UserModel(req.user.value);
    user.hasPermission('articles', function(access) {
      if(!access) {
        resp.setCode(403);
        resp.errorMessage("Unauthorized");
        res.send(resp.responseCode, resp.output());
        return;
      }
      
      var article = new ArticleModel({
        title: req.params.title,
        author: user.id,
        short_description: req.params.short_description,
        content: req.params.content,
        tags: req.params.tags.join(','),
        featured: req.params.featured
      });
      
      if(req.params._id) {
        article._id = req.params._id;
        article._rev = req.params._rev;
      }
      
      article.save();
      
      resp.data(article.output());
      res.send(resp.responseCode, resp.output());
    });
  }
  
  this.deleteArticle = function(req, res, next) {
    var resp = new ResponseModel();
    var user = new UserModel(req.user.value);
    user.hasPermission('articles', function(access) {
      if(!access) {
        resp.setCode(403);
        resp.errorMessage("Unauthorized");
        res.send(resp.responseCode, resp.output());
        return;
      }
      
      var db = nano.use('articles');
      db.get(req.params._id, {revs_info: true}, function(err, body) {
        if(err) {
          resp.setCode(400);
          resp.errorMessage('Article does not exist');
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
  
  return this;
}

module.exports = ArticlesController;