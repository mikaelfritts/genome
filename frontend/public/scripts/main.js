var authKey;

function main() {
  authKey = $.cookie('authenticationKey');
  if(!authKey) {
    doLogin();
  } else {
    var req = new Request();
    var userInfoCall  = req.get('/account/' + authKey);
    userInfoCall.success(function(data, status, xhr) {
      console.log("Profile data:");
      console.log(data);
      doLoggedIn();
    });
    userInfoCall.fail(function(xhr) {
      // not logged in.
      $.removeCookie('authenticationKey');
      doLogin();
    });  
  }
}

function doLogin() {
  // Use a modal window to collect email & password.
  $('.loginModal').modal('show');
  $('.action-login').on('click', function(e) {
    e.preventDefault();
    var req = new Request();
    var payload = {
      email: $('.loginModal .email').val(), 
      password: $('.loginModal .password').val()
    };
    var loginCall = req.post('/login', payload);
    loginCall.success(function(data, status, xhr) {
      $('.loginModal').modal('hide');
      console.log("Login success");
      console.log(data);
      $.cookie('authenticationKey', data.pkg.data.authenticationKey);
      doLoggedIn();
    });
    loginCall.error(function(xhr) {
      console.log(xhr);
      $('.loginModal .alert-block').show().alert();
    });
  });
}

function doLoggedIn() {
  var req = new Request();
}

$(function() {
  main();
})
