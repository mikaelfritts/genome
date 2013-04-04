var NotifierModel     = require('../models/NotifierModel'),
    ResponseModel     = require('../models/ResponseModel'),
		UserModel         = require('../models/UserModel');

function NotifierController(params) {
  var app             = params.app,
    nano              = require('../db'),
    _                 = params._,
    check             = require('validator').check,
    NotifierModel     = require('../models/NotifierModel'),
    sockets           = require('net'),
    $scope            = this;
    
  this.connections    = {};
  // need to store user, socket, and game/notification data inside the connections objects
  this.channels       = [];
  // channels are for future use.
  this.events         = {};
    
  this.start = function(port) {
    sockets.createServer(function(socket) {
      // Write a list of commands here that can be used.
      
      socket.on('data', function(buffer) {
        try {
          var json = JSON.parse(buffer);
        } catch(e) {
          // go to error handler
          return $scope.err(socket, 'bad data, not JSON');
        }
        
        if(typeof json.event !== 'object') {
          // bad data, go to error handler
          return $scope.err(socket, 'bad data');
        }
        
        if(typeof json.data !== 'undefined' && typeof json.data !== 'object') {
          return $scope.err(socket, 'bad data');
        }
        
        if(typeof $scope.events[json.event.name] === 'undefined') {
          return $scope.err(socket, 'invalid event, closing connection');
        }
        
        if(typeof json.data === 'undefined') {
          json.data = {};
        }
        
        json.data.channel = $scope.events[json.event.name].channel;
        $scope.events[json.event.name].cb(json.data, socket);
      });
      
      socket.on('end', function() {
        $scope.removeConnectionBySocket(this);
      });
      socket.on('close', function() {
        $scope.removeConnectionBySocket(this);
      });
    }).listen(port);
    
    return sockets;
  }
  
  return this;
}

NotifierController.prototype.err = function(socket, status) {
  socket.write(status + '\r\n');
  socket.end();
}

NotifierController.prototype.msg = function(event, channel, cb) {
  if(arguments.length < 3) {
    cb = arguments[1];
    channel = undefined;
  }
    
  this.events[event] = {
    name: event,
    channel: channel,
    cb: cb
  }
}

NotifierController.prototype.isConnected = function(username) {
  if(this.connections[username]) return true;
  
  return false;
}

NotifierController.prototype.getConnection = function(username) {
  if(this.connections[username]) return this.connections[username];
  
  return undefined; 
}

NotifierController.prototype.removeConnection = function(username) {
  if(typeof this.connections[username] !== 'undefined') {
    this.connections[username] = null;
    delete this.connections[username];
  }
}

NotifierController.prototype.removeConnectionBySocket = function(socket) {
  var user = undefined;
  for(var i in this.connections) {
    if(this.connections[i].socket === socket) {
      user = this.connections[i].user;
      delete this.connections[i];
    }
  }
  
  // example, needs  to be removed.
  // need a call to update any players who were playing a game with this user.
  if(user !== undefined) {
    for(var i in this.connections) {
      var resp = new NotifierModel();
      resp.setEvent('disconnect').setDescription('User Disconnected').setData({
        user: user.username
      });
      this.connections[i].socket.write(resp.output());
    }
  }
}

NotifierController.prototype.sendMessage = function(to_username, from_username, event, description, data) {
  var nano = require('../db');
  var to_users = [];
  
  if(typeof to_username == 'string') {
    to_users.push(to_username);
  } else {
    to_users = to_username;
  }
  
  for(var i in to_users) {
    var to = to_users[i].toLowerCase();
    var conn = this.getConnection(to);
    from_username = from_username.toLowerCase();
    
  	if(conn === undefined) {
  		// user may not be logged in, we need to set it in message queue: TODO
  		var notifications = nano.use('notifications');
  		var note = new NotifierModel();
      note.setEvent(event).setDescription(description).setData(data).setTo(to).setFrom(from_username);
      note.save(function(err, body) {
        if(err) {
          console.log('An error occured saving the notification');
        }
      });
  	} else {
  	  var note = new NotifierModel();
      note.setEvent(event).setDescription(description).setData(data).setTo(to).setFrom(from_username).setRead();
      (function(conn) {
		note.save(function(err, body) {
		  if(err) {
			console.log('An error occured saving the notification');
		  }
		  
		  conn.socket.write(note.output());
		});
      })(conn);
  	}
  }
}

NotifierController.prototype.sendDelayedMessage = function(to_username, from_username, event, description, data, delay) {
  var $scope = this;
  setTimeout(function() {
    $scope.sendMessage(to_username, from_username, event, description, data);
  }, delay);
}

NotifierController.prototype.getUnreadMessage = function(req, res, next) {
  var user = new UserModel(req.user.value);
  var resp = new ResponseModel();
  var nano = require('../db');
  var notifications = nano.use('notifications');
  
  notifications.view('notifications', 'my_unread_notifications', {key: user.username_lc}, function(err, body) {
    if(err) {
      resp.setCode(500);
			resp.errorMessage('Error getting notifications');
			res.send(resp.responseCode, resp.output());
			return;
    }
    
    var notes = [];
    for(var i in body.rows) {
      var n = new NotifierModel(body.rows[i].value);
      
      notes.push(n._output());
    }
    
    resp.data(notes);
    res.send(resp.responseCode, resp.output());
  });
}

NotifierController.prototype.setMessageRead = function(req, res, next) {
  var user = new UserModel(req.user.value);
  var resp = new ResponseModel();
  var nano = require('../db');
  var notifications = nano.use('notifications');
  
  notifications.get(req.params.id, function(err, body) {
    if(err) {
      resp.setCode(400);
      resp.errorMessage('Invalid notification ID.');
      res.send(resp.responseCode, resp.output());
      return;
    }
    
    var note = new NotifierModel(body);
    note.read = true;
    note.save(function(err, body) {
      if(err) {
        resp.setCode(500);
        resp.errorMessage('An error occured saving the notification');
        res.send(resp.responseCode, resp.output());
        return;
      }
      resp.data({ok: true});
      res.send(resp.responseCode, resp.output());
    });
  });
}

NotifierController.prototype.setMessageUnread = function(req, res, next) {
  
}

module.exports = NotifierController;
