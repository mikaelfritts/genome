module.exports = {
  default_roles: {
    user: [
      'get_account'
    ],
    editors: [
      'get_account',
      'access_admin',
      'articles'
    ],
    admin: [
      'get_account',
      'access_admin',
      'articles',
      'full_access'
    ]
  },
  default_role: 'user',
  default_admin: 'email@website',
  default_password: 'password',
  reserved_usernames: [
    'default',
    'admin',
    'administrator',
    'moderator',
    'root',
    'system'
  ]
}