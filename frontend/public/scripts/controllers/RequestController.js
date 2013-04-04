// Change to false when the server's cross-domain policy is correct
var useProxy = false;

$.support.cors = true;

//This class is a generic class to make the basic API calls
function Request() {
  // For using proxy_pass
  
  if(useProxy) {
    this.apiServer = document.location.protocol + '//' + document.location.host + '/';
  } else {
    this.apiServer = 'http://184.73.160.99:3458';
  }
  this.dataType = null;
  this.server = 'api';
  this.async = true;
  this.cache = true;
  this.gHeaders = []; // Global headers, set at start().
  /*
  
    API GET Request
    - command is the GET command with query string included.
  
  */
  this.get = function(command) {
    var headers = [];
    headers = this.gHeaders.concat(headers);

    var showErrors = (arguments.length == 3 && typeof(arguments[2]) === 'boolean') ? arguments[2] : true;

    if(this.server === 'api') {
      url = this.apiServer + command;
    } else if(this.server === 'auth') {
      url = this.authServer + command;
    }else if(this.server === 'data') {
      url = this.dataServer + command;
    }
    
    return $.ajax({
      url: url,
      timeout: 60000,
      cache: this.cache,
      async: this.async
    });
  };
  /*
  
    API POST Request
    - command is the POST command with query string included.
    - d is the data being passed. This needs to be pre-formated to whatever the server
      is expecting: text, key-value pair object, etc
  
  */
  this.post = function(command, d) {
    var headers = [];
    headers = this.gHeaders.concat(headers);

    var dataType = this.dataType;
    if(typeof arguments[2] !== 'undefined') {
      dataType = arguments[2];
    }

    var showErrors = (arguments.length == 3 && typeof(arguments[2]) === 'boolean') ? arguments[2] : true;

    if(this.server === 'api') {
      url = this.apiServer + command;
    } else if(this.server === 'auth') {
      url = this.authServer + command;
    }
    return $.ajax({
      url: url,
      type: 'POST',
      //contentType: 'text/plain',
      timeout: 20000,
      data: d
    });
  };
  /*
  
    API PUT Request (not currently used)
    - command is the PUT command with query string included.
    - d is the data being passed. This needs to be pre-formated to whatever the server
      is expecting: text, key-value pair object, etc
  
  */
  this.put = function(command, d) {
    var headers = [];
    headers = this.gHeaders.concat(headers);

    var showErrors = (arguments.length == 3 && typeof(arguments[2]) === 'boolean') ? arguments[2] : true;

    if(this.server === 'api') {
      url = this.apiServer + command;
    } else if(this.server === 'auth') {
      url = this.authServer + command;
    }

    return $.ajax({
      url: url,
      type: 'PUT',
      timeout: 3000,
      contentType: 'application/json',
      data: JSON.stringify(d),
      dataType: this.dataType,
      success: function(data) {
        return data;
      }
    });
  };
  /*
  
    API DELETE Request (not currently used)
    - command is the DELETE command with query string included.
  
  */
  this.del = function(command) {
    var headers = [];
    headers = this.gHeaders.concat(headers);

    var showErrors = (arguments.length == 3 && typeof(arguments[2]) === 'boolean') ? arguments[2] : true;

    if(this.server === 'api') {
      url = this.apiServer + command;
    } else if(this.server === 'auth') {
      url = this.authServer + command;
    }

    return $.ajax({
      url: url,
      type: 'DELETE',
      contentType: 'application/json',
      dataType: this.dataType,
      cache: false,
      headers: headers
    });
  };
  /*
  
    Function to generate a GUID
  
  */
  this.generateUUID = function() {
    var s = [], itoh = '0123456789ABCDEF';
    for (var i = 0; i <36; i++) s[i] = Math.floor(Math.random()*0x10);

    s[14] = 4;
    s[19] = (s[19] & 0x3) | 0x8;

    for (var i = 0; i <36; i++) s[i] = itoh[s[i]];

    s[8] = s[13] = s[18] = s[23] = '-';

    return s.join('');
  };
}