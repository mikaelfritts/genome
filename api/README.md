#Generic Backend API Solution

###Installation

Requires nodejs 0.8.6 or higher and CouchDB installed and running. For working with images it requires ImageMagick (`brew install imagemagick`).

> npm install
> 
> cp config.js.sample config.js
> cp definitions.js.sample definitions.js

Edit your config.js & defintions.js to suit your needs.

> node server.js [-e development|production|...]

###SSL Certificate Generation

http://flourishlib.com/docs/ObtainingaSecureCertificateKeyPair

###Testing

[GET]
> curl -k https://127.0.0.1:3458/

[POST]
> curl -k -d "username=test@test.com&password=mypassword" https://127.0.0.1:3458/login

###Developing

> config.js

Set configuration options for the app.

> definitions.js

Set definitions for the app, and also specify `default login information`

> schema.js

Contains couchdb setup functions, also ways to test data with clearDB() and listDB()

This file also shows an example of using couchDB views.

> routes.js

Contains routes for post/get/put/delete commands. Use the `requiresAuth` method for functions that require users to be logged in.

*Planned Update* Add a requiresPermission or requiresRole method, this will create better user restrictions.
