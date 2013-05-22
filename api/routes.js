module.exports = function(app, nano, _) {
  var params = {
    app: app,
    _: _
  },
  config     = require('./config');
  
  // Set up the controllers
  var accountController = require('./controllers/AccountController')(params);
  var authController = require('./controllers/AuthController')(params);
  var avatarController = require('./controllers/AvatarController')(params);
  var indexController = require('./controllers/IndexController')(params);
  var adminController = require('./controllers/admin/IndexController')(params);
  var articlesController = require('./controllers/ArticlesController')(params);
  var artController = require('./controllers/ArtController')(params);
  var notifierController = require('./controllers/NotifierController');
  
  var notifier = new notifierController(params);

  // Routes set up like so:
  app.get('/', indexController.index);
  app.post('/', indexController.index);
  
  app.post( '/login', authController.login);
  app.get(  '/register', authController.getRegistrationCode);
  app.post( '/register', authController.registerUser);
  app.post( '/auth/facebook', authController.loginFacebook);
  app.post( '/forgot-password', authController.forgotPassword);
  app.post( '/reset-password', authController.resetPassword);

  app.get(  '/account/:authenticationKey', requiresAuth, accountController.getAccount);
  app.post( '/account/update', requiresAuth, accountController.updateAccount);
  app.post( '/account/set_avatar', requiresAuth, avatarController.setAvatar);
  app.get(  '/avatar/:email', avatarController.getAvatar);
  
  app.get(  '/notifications/:authenticationKey', requiresAuth, notifier.getUnreadMessage);
  app.post( '/notifications/set_read', requiresAuth, notifier.setMessageRead);
  
  app.post( '/articles', articlesController.getArticles);
  app.post( '/post/article', requiresAuth, articlesController.postArticle);
  app.post( '/delete/article', requiresAuth, articlesController.deleteArticle);
  
  app.post( '/artists', artController.getArtists);
  app.post( '/admin/artists', requiresAuth, artController.getAdminArtists);
  app.post( '/post/artist', requiresAuth, artController.postArtist);
  app.post( '/delete/artist', requiresAuth, artController.deleteArtist);
  
  function requiresAuth(req, res, next) {
    return isAuthenticated(req, res, next);
  }
  
  function isAuthenticated(req, res, next) {
    var check = require('validator').check;
    var users = nano.use('users');
    
    try {
      check(req.params.authenticationKey).notNull().notEmpty();
    } catch(e) {
      console.log("Bad code: " + req.params.authenticationKey + " " + e.message);
      res.send(401, 'Authorization Required');
      return false;
    }
    

    users.view('users', 'by_authenticationKey', {key: req.params.authenticationKey}, function(err, body) {
      if(err) {
        console.log(err);
        res.send(401, 'Authorization Required');
        return;
      }
      if(body.rows.length <= 0) {
        res.send(401, 'Authorization Required');
        return;
      }
      
      req.user = body.rows[0];
      return next();
    });
  }
  
  function requiresAdmin(req, res, next) {
    var UserModel = require('./models/UserModel');
    var user = new UserModel(req.user.value);
    
    if(user.role === 'admin') {
      return next();
    }
      
    console.log("Someone tried to access admin: " + user.email);
    res.send(401, 'Authorization Required');
    return false;    
  }
    
  console.log('routes loaded');
}
