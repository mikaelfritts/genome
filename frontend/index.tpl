<!DOCTYPE html>

<html lang="en">
<head>
  <meta charset="UTF-8">

  <title>Genome Gallery</title>
  {{CSS}}
  {{JS}}
  <meta name="viewport" content="width=device-width, height=device-height, initial-scale=1.0, user-scalable=0, minimum-scale=1.0, maximum-scale=1.0">
</head>

<body class="no-touch">
  <div class="loginModal modal hide">
    <div class="modal-header">
      <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
      <h3>Please Login</h3>
    </div>
    <div class="modal-body">
      <div class="alert alert-block alert-error fade in hide">
        <button type="button" class="close" data-dismiss="alert">&times;</button>
        <h4 class="alert-heading">An error occurred</h4>
        <p>Your username or password may be incorrect.</p>
      </div>
      <p><label>Email</label><input type="text" class="input email" name="email"></p>
      <p><label>Password</label><input type="password" class="input password" name="password"></p>
    </div>
    <div class="modal-footer">
      <a href="#" class="btn action-close" data-dismiss="modal">Close</a>
      <a href="#" class="btn btn-primary action-login">Login</a>
    </div>
  </div>
  <div class="site">
    <div class="header">
      
    </div>
    <div class="content">
      <!-- Populate content dynamically -->
    </div>
  </div>
  <div class="footer">
    
  </div>
</body>
</html>
