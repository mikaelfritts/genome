var BaseModel     = require('./index'),
  nano            = require('../db');

function ArticleModel() {
  this.title                  = '';
  this.author                 = '';
  this.short_description      = '';
  this.content                = '';
  this.tags                   = '';
  this.featured               = false;
  this.create_time            = new Date().getTime();
  this.edit_time              = new Date().getTime();
  this.active                 = true;
  this.type                   = 'article';
    
  if(arguments[0]) {
    this.update(arguments[0]);
  }
}

ArticleModel.prototype = new BaseModel();
ArticleModel.prototype.use('articles');

ArticleModel.prototype.output = function() {
  return {
    title: this.title,
    author: this.author,
    short_description: this.short_description,
    content: this.content,
    tags: this.tags,
    featured: this.featured,
    create_time: this.create_time,
    edit_time: this.edit_time,
    active: this.active
  }
}

module.exports = ArticleModel;
