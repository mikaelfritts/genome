module.exports = {
  name: 'TypeFoo API',
  use_ssl: true,
  ssl_key: 'keys/server.key',
  ssl_crt: 'keys/server.crt',
  avatars: {
    'normal': {
      size: '180x180',
      process: 'crop'
    },
    'thumbnail': {
      size: '90x90',
      process: 'crop'
    }
  },
  env: {
  
    // Development
    development: {
      hostname: 'http://0.0.0.0:3458', // Used for redirects
      port: 3458,
      notifier_port: 3459,
      use_smtp: false,
      smtp_service: 'Gmail',
      smtp_username: '',
      smtp_password: '',
      email_from: 'Example Person <example@example.com>',
      // Database, CouchDB
      database: {
        authentication: false,
        protocol: 'http://',
        host: '127.0.0.1',
        port: 5984,
        user: '',
        pass: '',
        db: ''
      }
    },
    
    // Production
    production: {
      hostname: 'http://0.0.0.0:3458', // Used for redirects
      port: 3458,
      notifier_port: 3459,
      use_smtp: false,
      smtp_service: 'Gmail',
      smtp_username: '',
      smtp_password: '',
      email_from: 'Example Person <example@example.com>',
      // Database, CouchDB
      database: {
        authentication: false,
        protocol: 'http://',
        host: '127.0.0.1',
        port: 5984,
        user: '',
        pass: '',
        db: ''
      }
    }
    
  }
}