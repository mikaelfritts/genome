/*

Developed by:
   ____                      __   _ __    
  / __/__  __ _____________ / /  (_) /____
 _\ \/ _ \/ // / __/ __/ -_) _ \/ / __(_-<
/___/\___/\_,_/_/  \__/\__/_.__/_/\__/___/

*/

var argv = require('optimist')
  .usage('Usage: $0 [-e [string]] [-d reset]')
  .default('e', 'development')
  .default('d', 'nothing')
  .argv;
  
var _ = require('./utils');
  
var NODE_ENV = argv.e;
process.env.NODE_ENV = NODE_ENV;

var config = require('./config');

if(!config.env[NODE_ENV]) {
  console.log('Error: invalid environment');
  return;
}

var restify = require('restify');
var fs = require('fs');
var static = require('node-static');

var nano = require('./db');
if(argv.d === 'reset') {
  var schema = require('./schema')({nano: nano}, true);
  return;
} else {
  var schema = require('./schema')({nano: nano});
}

var options = {
  name: config.name
};

if(config.use_ssl) {
  options.key = fs.readFileSync(config.ssl_key);
  options.certificate = fs.readFileSync(config.ssl_crt);
}

var app = restify.createServer(options);
app.use(restify.bodyParser());

app.listen(config.env[NODE_ENV].port, function() {
  console.log('%s listening at %s in %s mode', app.name, app.url, NODE_ENV);
});

var fileServer = new static.Server('./uploads');

require('http').createServer(function (request, response) {
    request.addListener('end', function () {
        fileServer.serve(request, response).addListener('error', function (err) {
          var pathParts = request.url.split('/');
          if(err && err.status === 404 && pathParts[1] === 'avatars') {
            fileServer.serveFile('/avatars/default-normal.jpg', 200, {}, request, response);
          } else {
            response.end();
          }
        });
    });
}).listen(config.env[process.env.NODE_ENV].static_port);

var routes = require('./routes')(app, nano, _);