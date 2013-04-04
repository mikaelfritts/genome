function MailerController() {
  var path         = require('path'),
    templatesDir   = path.resolve(__dirname, '..', 'email_templates'),
    emailTemplates = require('email-templates'),
    nodemailer     = require('nodemailer'),
    config         = require('../config'),
    mailOptions    = {
      agent: 'Sendmail',
      service: '',
      auth: {},
      from: 'example@example.com'
    };
    
  this.init = function() {
    if(config.env[process.env.NODE_ENV].use_smtp === true) {
      mailOptions.agent = 'SMTP';
      mailOptions.service = config.env[process.env.NODE_ENV].smtp_service,
      mailOptions.auth = {
        user: config.env[process.env.NODE_ENV].smtp_username,
        pass: config.env[process.env.NODE_ENV].smtp_password
      }
      
      mailOptions.from = config.env[process.env.NODE_ENV].email_from;
    } else {
      mailOptions.from = config.env[process.env.NODE_ENV].email_from;
    }
  }
    
  this.options = function(opts) {
    if(typeof opts === ' undefined')
      return;
      
    mailOptions = opts;
  }
  
  this.single = function(email_template, user, subject, cb) {
    emailTemplates(templatesDir, function(err, template) {
      if(err) {
        return cb(err, null);
      }
      
      if(mailOptions.agent === "SMTP") {
        var transport = nodemailer.createTransport(mailOptions.agent, {
          service: mailOptions.service,
          auth: mailOptions.auth
        });
      } else if(mailOptions.agent === "Sendmail") {
        var transport = nodemailer.createTransport(mailOptions.agent);
      }
      
      template(email_template, user, function(err, html, text) {
        if (err) {
          return cb(err, null);
        } else {
          transport.sendMail({
            from: mailOptions.from,
            to: user.email,
            subject: subject,
            html: html,
            // generateTextFromHTML: true,
            text: text
          }, function(err, responseStatus) {
            if (err) {
              return cb(err, null);
            } else {
              return cb(null, responseStatus.message);
            }
          });
        }
      });
    });
  }

  this.multi = function() {
    
  }
  
  this.init();
}

module.exports = MailerController;