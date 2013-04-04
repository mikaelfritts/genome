function ResponseModel() {
  this.responseCode = 200;
  this.pkg = {
    error: false,
    statusMessage: '',
    data: {}  
  };
  
  this.setCode = function(r) {
    this.responseCode = r;
    
    return this;
  }
  
  this.errorMessage = function(e) {
    this.pkg.error = true;
    this.pkg.statusMessage = e;
    
    return this;
  }
  
  this.statusMessage = function(s) {
    this.pkg.statusMessage = s;
    
    return this;
  }
  
  this.data = function(d) {
    this.pkg.data = d;
    
    return this;
  }
  
  this.output = function() {
    return {
      responseCode: this.responseCode,
      pkg: this.pkg
    };
  }
}

module.exports = ResponseModel;