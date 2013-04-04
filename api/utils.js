module.exports = {
  // function to clone an object
  clone: function(obj) {
    var newobj = {};
    for(var keys = Object.keys(obj), l = keys.length; l; --l) {
       newobj[keys[l-1]] = obj[keys[l-1]];
    }
    
    return newobj;
  },
  
//
//  Init scripts
//

  dbInitOptions: function(opts) {
    var ret = '';
    
    if(opts.protocol) {
      ret += opts.protocol;
    }
    
    if(opts.authentication) {
      ret += opts.user + ':' + opts.pass;
    }
    
    if(opts.host) {
      ret += opts.host;
    }
    
    if(opts.port &&  opts.port > 0 || opts.port.length > 0) {
      ret += ':' + opts.port;
    }
    
    return ret;
  }
}