module.exports = function(params, clear) {
  var nano = params.nano;
  var UserModel = require('./models/UserModel');
  var dbs = [];
  var dbs_cleared = [];
  var clear = clear;
  
  createDB('users', function() {
    if(arguments[1] && arguments[1].ok === true) {
      // create admin user.
      var defs = require('./definitions');
      var AuthController = require('./controllers/AuthController')(params);
      AuthController.createUser({
        email: defs.default_admin,
        password: defs.default_password,
        username: 'admin',
        first_name: 'Genome',
        last_name: 'Admin',
        role: 'admin'
      }, null, function(err, newUser) {
        if(err) {
          console.log("Error creating admin user");
        }
        console.log("Admin user created.");
      });
    }
    
    var userView = {"views": {
      "all_users": {
        "map": function(doc) {
          if(doc.email)
            emit(doc.id, 1);
        },
        "reduce": "_count"
      },
      "by_authenticationKey": {
        "map": function(doc) {
          if(doc.authenticationKey)
            emit(doc.authenticationKey, doc);
        }
      },
      "by_username": {
        "map": function(doc) {
          if(doc.username_lc)
            emit(doc.username_lc, doc);
        }
      },
      "by_username_or_email": {
        "map": function(doc) {
          if(doc.username_lc)
            emit(doc.username_lc, doc);
          if(doc.email)
            emit(doc.email, doc);
        }
      },
      "by_username_and_password": {
        "map": function(doc) {
          if(doc.username_lc)
            emit([doc.username_lc, doc.password], doc);
        }
      },
      "by_lat_lng": {
        "map": function(doc) {
          if(doc.location.lat && doc.location.lng) {
            emit([doc.location.lat, doc.location.lng], doc);
          }
        }
      },
      "by_email_and_password": {
        "map": function(doc) {
          if(doc.email)
            emit([doc.email, doc.password], doc);
        }
      },
      "by_facebook_access_token": {
        "map": function(doc) {
          if(doc.facebook_access_token)
            emit(doc.facebook_access_token, doc);
        }
      },
      "by_passwordCode": {
        "map": function(doc) {
          if(doc.passwordCode)
            emit(doc.passwordCode, doc);
        }
      },
      "by_role" : {
        "map": function(doc) {
          emit(doc.role, doc);
        }
      }
    }};
    
    setViews('users', userView);
  });
  createDB('user_avatars');
  createDB('roles', function() {
    var defs = require('./definitions');
    var RoleModel = require('./models/RoleModel');
    var roles = nano.use('roles');
    roles.list(function(err, body) {
      if(err)
        return;
        
      var existing_roles = [];
      for(var i in body.rows) {
        existing_roles.push(body.rows[i].name);
      }
        
      for(var i in defs.default_roles) {
        if(existing_roles.indexOf(i) > 0) continue;
        
        var r = new RoleModel({
          _id: i,
          name: i,
          permissions: defs.default_roles[i]
        }).save(function(err, body){});
      }
    });
  });
  createDB('notifications', function() {
    var notificationsView = {"views": {
      "my_notifications": {
        "map": function(doc) {
          emit(doc.to, doc);
        }
      },
      "my_unread_notifications": {
        "map": function(doc) {
          if(doc.read == false) {
            emit(doc.to, doc);
          }
        }
      }
    }};
    
    setViews('notifications', notificationsView);
  });
  createDB('artists', function() {
    var artistsView = {"views": {
      "by_name": {
        "map": function(doc) {
          if(doc.type === 'artist')
            emit(doc.name, doc);
        }
      },
      "featured_artists": {
        "map": function(doc) {
          if(doc.type === 'artist') {
            emit(doc.featured, doc);
          }
        }
      },
      "artist_pieces": {
        "map": function(doc) {
          if(doc.type === 'piece') {
            emit(doc.artist_id, doc);
          }
        }
      },
      "featured_pieces": {
        "map": function(doc) {
          if(doc.type === 'piece') {
            emit(doc.featured, doc);
          }
        }
      },
      "pieces_by_tag": {
        "map": function(doc) {
          if(doc.type === 'piece') {
            var tags = doc.tags.split(',');
            for(var tag in tags) {
              emit(tags[tag], doc);
            }
          }
        }
      }
    }};
    
    setViews('artists', artistsView);
  });
  createDB('articles', function() {
    var articlesView = {"views": {
      "featured_articles": {
        "map": function(doc) {
          if(doc.type === 'article') {
            emit(doc.featured, doc);
          }
        }
      }
    }};
    
    setViews('articles', articlesView);
  });
  
  function createDB(name, cb) {
    dbs.push(name);
    if(clear === true && dbs_cleared.indexOf(name) === -1) {
      console.log("Clearing " + name);
      clearDB(name, function() {
        dbs_cleared.push(name);
        createDB(name, cb);
      });
      
      return;
    }
    var db = nano.use(name);
    db.get('test', function(err, body) {
      if(err && err.code === 'ECONNREFUSED') {
        console.log("Could not connect. Make sure CouchDB is running, and your configuration is correct.");
        return;
      }
      
      if(err && err.message === 'no_db_file') {
        nano.db.create(name, cb);

        console.log(name + ' DB created');
        return;
      }

      if(typeof cb === 'function') {
        cb(false);
      }
    });
  }
  
  function clearDB(name, cb) {
    nano.db.destroy(name, function() {
      if(typeof cb === 'function') {
        cb();
      }
    });
  }
  
  function listDB(name) {
    var db = nano.use(name);
    db.list(function(err, body) {
      if(err) return;
      body.rows.forEach(function(doc) {
        console.log(doc);
      });
    });
  }
  
  function setViews(name, view) {
    var db = nano.use(name);
    
    db.insert(view, "_design/" + name, function(err, body) {
      if(err && err.error == 'conflict') {
        db.get('_design/' + name, function(err, body) {
          view._rev = body._rev;
          db.insert(view, "_design/" + name, function(err, body) {
            if(err) return console.log(err);
            
            console.log("Updated " + name + " Views");
          });
        });
      } else {
        console.log("Updated " + name + " Views");
      }
    });
  }
  
  this.clearDBs = function() {
    for(var i in dbs) {
      console.log(dbs[i]);
      clearDB(dbs[i]);
    }
  }
}