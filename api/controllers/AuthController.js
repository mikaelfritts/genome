function AuthController(params) {
  var app             = params.app,
    nano              = require('../db'),
    _                 = params._,
    ResponseModel     = require('../models/ResponseModel'),
    check             = require('validator').check,
    UserModel         = require('../models/UserModel'),
    AvatarModel       = require('../models/AvatarModel'),
    MailerController  = require('./MailerController'),
    config            = require('../config'),
    defs              = require('../definitions');
  
  this.login = function(req, res, next) {
    var resp = new ResponseModel();
    var users = nano.use('users');
    
    try {
      check(req.params.password).notNull();
    } catch(e) {
      // User does not exist.
      resp.setCode(400);
      resp.errorMessage('Invalid username or password.');
      res.send(resp.responseCode, resp.output());
      return;
    }
    
    req.params.email = req.params.email.toLowerCase();
    
    users.get(req.params.email, function(err, body) {
      if(err) {
        // User does not exist.
        resp.setCode(400);
        resp.errorMessage('Invalid username or password.');
        res.send(resp.responseCode, resp.output());
        return;
      }
      
      // User exists, check password
      saltPassword(body.secret, req.params.password, function(encodedPassword) {
        if(body.password !== encodedPassword) {
          // Wrong password.
          resp.setCode(400);
          resp.errorMessage('Invalid username or password.');
          res.send(resp.responseCode, resp.output());
          return;
        }
        
        var user = new UserModel(body);
        loginUser(user, function(err, user) {
          if(err) {
            resp.setCode(500);
            resp.errorMessage(err);
            res.send(resp.responseCode, resp.output());
            return;
          }
          
          resp.data(user.account());
          res.send(resp.responseCode, resp.output());
        });
      });
    });
  }
  
  // This function will look for a user account with [facebook_access_token] as the parameters
  // The facebook_access_token parameter acts as a password in this case.
  // First, check if the access token is legit, then see if the user is in the system.
  // In the event that the user is not found, they will be registered.
  //
  // You can get an access token here:
  // https://www.facebook.com/dialog/oauth?
  //        client_id=YOUR_APP_ID
  //       &redirect_uri=YOUR_REDIRECT
  //       &scope=email
  //       &response_type=token
  this.loginFacebook = function(req, res, next) {
    var resp = new ResponseModel();
    var users = nano.use('users');
    
    var fbtoken = req.params.facebook_access_token;
    try {
      check(fbtoken, 'Invalid parameters').notNull().notEmpty();
    } catch(e) {
      resp.setCode(417);
      resp.errorMessage(e.message);
      res.send(resp.responseCode, resp.output());
      return;
    }
    
    // Check if the Facebook token is valid or not, 
    // then create account if so.
    var restify = require('restify');
    var client = restify.createClient({
      url: 'https://graph.facebook.com'
    });
    
    client.get('/me?access_token=' + fbtoken, function(err2, req2) {
      if(err2) {
        resp.setCode(500);
        resp.errorMessage("Problem accessing Facebook");
        res.send(resp.responseCode, resp.output());
        return;
      }
      
      req2.on('result', function(err3, res3) {
        if(err3) {
          // bad access token, send error.
          resp.setCode(400);
          resp.errorMessage("Invalid Facebook token");
          res.send(resp.responseCode, resp.output());
          return;
        }
    
        res3.body = '';
        res3.setEncoding('utf8');
        res3.on('data', function(chunk) {
          res3.body += chunk;
        });
    
        res3.on('end', function() {
          // get the email (and other info) from here.
          var details = JSON.parse(res3.body);
          if(typeof details.email === 'undefined') {
            resp.setCode(400);
            resp.errorMessage('The Facebook App does not have email credentials. Be sure when requesting access to include email in the scope parameter.');
            res.send(resp.responseCode, resp.output());
            return;
          }
          
          // Check if the facebook user already has an account with us
          users.view('users', 'by_facebook_id', {key: details.id}, function(err, body) {
            if(body.rows.length <= 0) {
              // If there are no users with the facebook id,
              // Create a new user
              createUser({
                email: details.email,
                username: details.username,
                facebook_id: details.id,
                first_name: details.first_name,
                last_name: details.last_name,
                registrationCode: fbtoken,
                role: defs.default_role
              }, null, function(err, newUser) {
                if(err) {
                  resp.setCode(400);
                  resp.errorMessage(err);
                  res.send(resp.responseCode, resp.output());
                  return;
                }
                resp.data(newUser.account());
                res.send(resp.responseCode, resp.output());
              });
              return;
            }
            
            // User exists in the database.
            var user = new UserModel(body.rows[0].value);
            loginUser(user, function(err, user) {
              if(err) {
                resp.setCode(500);
                resp.errorMessage(err);
                res.send(resp.responseCode, resp.output());
                return;
              }
              resp.data(user.account());
              res.send(resp.responseCode, resp.output());
            });
          });
        });
      });
    });
  }
  
  function checkPendingRequests(fbuid, curr_username) {
    var friends = nano.use('friends');
    friends.view("friends", "pending_requests_by_fbuid", {key : fbuid}, function (err, body) {
      if (err) {
        console.log("Error occured in retrieving pending requests for the user.");
      } else {
        // Found requests pending for the user
        for (var k in body.rows) {
          // Each user who requested
          var reqUser = new FriendsModel(body.rows[k].value);
          // Create a notification (offline)
          notifier.sendMessage(
            curr_username,
            reqUser.username,
            'friend_request',
            reqUser.username + ' wants to add you as a friend!',
            {requested_user:reqUser.username, fbuid:fbuid}
          );
        }
      }
    });
  }
  
  // I was thinking this function could be used as a "captcha" sequence.
  // Some kind of question could be returned to the app which would be randomly selected and
  // then the user would be required to answer correctly before registering successfully. Eliminate bots!
  this.getRegistrationCode = function(req, res, next) {
    var users = nano.use('users');
    var timestamp = new Date().getTime();
    var rand = (Math.floor(Math.random() * 1000000000)).toString(36);
    console.log(rand);
    var crypto = require('crypto');
    var registrationCode = crypto.createHash('md5').update(timestamp + rand).digest("hex");
    
    // insert the timestamped registrationCode to db
    users.insert({registration: true, timestamp: timestamp}, registrationCode, function(err, body) {
      var resp = new ResponseModel();
      if(err) {
        resp.setCode(417);
        resp.errorMessage('An error occurred');
      } else {
        resp.data({
          registrationCode: registrationCode
        });
      }
      
      res.send(resp.responseCode, resp.output());
      return;
    });
  }
  
  // Update doc with params.registrationCode name
  this.registerUser = function(req, res, next) {
    var resp = new ResponseModel();
    var users = nano.use('users');
    
    
    // Check valid Reg code
    
    try {
      check(req.params.email, "Enter a valid email address").isEmail();
      check(req.params.username, "Enter a valid username").len(3);
      check(req.params.password, 'Enter a valid password').len(6).isAlphanumeric();
      check(req.params.password, 'Passwords do not match').equals(req.params.confirm_password);
      check(req.params.registrationCode, 'Enter a valid registration code').notNull().notEmpty();
    } catch(e) {
      resp.setCode(417);
      resp.errorMessage(e.message);
      res.send(resp.responseCode, resp.output());
      return;
    }

    req.params.email = req.params.email.toLowerCase();
    req.params.username_lc = req.params.username.toLowerCase();
    req.params.first_name = req.params.first_name ? req.params.first_name : '';
    req.params.last_name = req.params.last_name ? req.params.last_name : '';
    req.params.birthday = req.params.birthday ? req.params.birthday : '01/01/1979';
    
    users.get(req.params.registrationCode, function(err, body) {
      if(err) {
        resp.setCode(417);
        resp.errorMessage('Registration Code not found');
        res.send(resp.responseCode, resp.output());
        return;
      }
      var rev = body._rev;
      try {
        check(req.params.email).isEmail();
      } catch(e) {
        resp.setCode(417);
        resp.errorMessage(e.message);
        res.send(resp.responseCode, resp.output());
        return;
      }
      
      users.view("users", "by_username_or_email", 
      {keys: [req.params.username_lc, req.params.email]}, 
      function(err, body) {
        if(err) {
          console.log(err);
          resp.setCode(417);
          resp.errorMessage('A problem occurred with your registration: ' + err.code);
          res.send(resp.responseCode, resp.output());
          return;
        }
        if(body.rows.length > 0) {
          resp.setCode(417);
          resp.errorMessage('Email or username is already registered.');
          res.send(resp.responseCode, resp.output());
          return;
        }
        
        users.view("users", "all_users", function(err, body) {
          var role = defs.default_roles;
          if(body.rows && body.rows.length === 0) {
            role = 'admin';
          }
          createUser({
            email: req.params.email,
            username: req.params.username,
            password: req.params.password,
            first_name: req.params.first_name,
            last_name: req.params.last_name,
            birthday: req.params.birthday,
            registrationCode: req.params.registrationCode,
            role: role
          }, rev, function(err, newUser) {
            resp.data(newUser.account());
            res.send(resp.responseCode, resp.output());
          });
        });
      });
    });
  }
  
  var encodePassword = function(user) {
    var crypto = require('crypto');

    if(!user.secret || user.secret.length == 0) {
      var buf = crypto.randomBytes(32);
      user.secret = buf.toString('hex');
    }
    crypto.pbkdf2(user.password, user.secret, 1000, 512, function(err, encodedPassword) {
      if (err) throw err;
      user.password = new Buffer(encodedPassword, 'base64').toString('hex');
      user.save(function(err, body) {
        if(err) {
          console.log(err);
        } else {
        
        }
      });
    });
  }
  
  var saltPassword = function(salt, plaintext, callback) {
    var crypto = require('crypto');
    crypto.pbkdf2(plaintext, salt, 1000, 512, function(err, encodedPassword) {
      callback(new Buffer(encodedPassword, 'base64').toString('hex'));
    });
  }
  
  this.forgotPassword = function(req, res, next) {
    var crypto = require('crypto');
    var resp = new ResponseModel();
    var users = nano.use('users');
    
    try {
      check(req.params.email).isEmail();
    } catch(e) {
      resp.setCode(417);
      resp.errorMessage(e.message);
      res.send(resp.responseCode, resp.output());
      return;
    }
    
    var email = req.params.email.toLowerCase();
    users.get(email, function(err, body) {
      if(err) {
        resp.setCode(404);
        resp.errorMessage('Email address not found');
        res.send(resp.responseCode, resp.output());
        return;
      }
      
      var user = new UserModel(body);
      
      var buf = crypto.randomBytes(32);
      var passwordCode = buf.toString('hex') + user.secret;
      user.passwordCode = passwordCode;
      user.save(function(err, body) {
        if(err) {
          resp.setCode(500);
          resp.errorMessage('Something went wrong.');
          res.send(resp.responseCode, resp.output());
          return;
        }
        
        // Now we have the password reset code, lets mail it to the user.
        var details = {
          email: email,
          passwordCode: passwordCode
        };
        
        var mail = new MailerController();
        
        mail.single('forgot_password', details, "Reset your password", function(err, responseCode) {
          if(err) {
            resp.setCode(500);
            console.log(err);
            resp.errorMessage('Something went wrong.');
            res.send(resp.responseCode, resp.output());
            return;
          }
          
          resp.statusMessage('An email was sent to you with instructions to reset your password.');
          res.send(resp.responseCode, resp.output());
          return;
        });

      });      
    });
    
    return next();
  }
  
  this.resetPassword = function(req, res, next) {
    var crypto = require('crypto');
    var resp = new ResponseModel();
    var users = nano.use('users');
    
    try {
      check(req.params.password_code, "No Password Reset Code").notNull();
      check(req.params.password, "Password not long enough").len(6);
      check(req.params.password, "Passwords do not match").equals(req.params.confirm_password);
    } catch(e) {
      resp.setCode(417);
      resp.errorMessage(e.message);
      res.send(resp.responseCode, resp.output());
      return;
    }
    
    users.view('users', 'by_passwordCode', {key: req.params.password_code}, function(err, body) {
      if(err) {
        console.log(err);
        resp.setCode(500);
        resp.errorMessage("Something went wrong");
        res.send(resp.responseCode, resp.output());
        return;
      }
      if(body.rows.length <= 0) {
        resp.setCode(400);
        resp.errorMessage("Bad Password Code");
        res.send(resp.responseCode, resp.output());
        return;
      }
      
      var user = new UserModel(body.rows[0].value);
      var buf = crypto.randomBytes(32);
      var passwordCode = buf.toString('hex') + user.secret;
      user.passwordCode = passwordCode;
      user.save(function(err, body) {
        if(err) {
          console.log(err);
          resp.setCode(500);
          resp.errorMessage("Something went wrong");
          res.send(resp.responseCode, resp.output());
          return;
        }
        
        user._rev = body.rev;
        user.password = req.params.password;
        encodePassword(user);
        resp.statusMessage("Password updated.");
        res.send(resp.responseCode, resp.output());
        return;
      });
    });
    
    return next();
  }
  
  function createUser(details, rev, cb) {
    var crypto = require('crypto');
    var users = nano.use('users');
    
    details.email = details.email.toLowerCase();
    details.username_lc = details.username.toLowerCase();
    details._id = details.email;
    
    var buf = crypto.randomBytes(32);
    details.secret = buf.toString('hex');
    
    details.create_time = new Date().getTime();

    details.authenticationKey = generateAuthenticationKey(details.email, details.secret);
    var newUser = new UserModel(details);
      
    newUser.save(function(err, body) {
      if(err) {
        return cb('Account already exists', null);
      }
  
      if(details.facebook_id)
        checkPendingRequests(details.facebook_id, newUser.username);
        
      if(details.password)
        encodePassword(newUser);
        
      if(rev) {
        users.destroy(newUser.registrationCode, rev);
      }
      
      return cb(null, newUser);
    });
  }
  this.createUser = createUser;
  
  function loginUser(user, cb) {
    var login_time = new Date().getTime();
    var crypto = require('crypto');
    
    if(user.facebook_id.length > 0)
      checkPendingRequests(user.facebook_id, user.username);

    user.last_login = login_time;
    user.authenticationKey = generateAuthenticationKey(user.email, user.secret);
    user.save(function(err, body) {
      if(err) {
        return cb("Error saving user", null);
      }

      return cb(null, user);
    });
  }
  
  function generateAuthenticationKey(email, secret) {
    var crypto = require('crypto');
    var time = new Date().getTime();
    return crypto.createHash('md5').update(email + time + secret).digest("hex");
  }
  
  return this;
}

module.exports = AuthController;

