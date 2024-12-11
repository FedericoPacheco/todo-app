/**
 * HTTP Server Settings
 * (sails.config.http)
*
 * Configuration for the underlying HTTP server in Sails.
 * (for additional recommended settings, see `config/env/production.js`)
*
 * For more information on configuration, check out:
 * https://sailsjs.com/config/http
 */

const lusca = require('lusca');
const fs = require('fs');
const path = require('path');

module.exports.http = {

  // Generate self-signed certificates:
  // openssl req -nodes -new -x509 -keyout server.key -out server.cert

  // Copy certificate to trusted certificates
  // sudo cp ./ssl/server.cert /usr/local/share/ca-certificates/
  serverOptions: {
    key: fs.readFileSync(path.resolve(__dirname, 'ssl/server.key')),
    cert: fs.readFileSync(path.resolve(__dirname, 'ssl/server.cert')),
  },

  /****************************************************************************
  *                                                                           *
  * Sails/Express middleware to run for every HTTP request.                   *
  * (Only applies to HTTP requests -- not virtual WebSocket requests.)        *
  *                                                                           *
  * https://sailsjs.com/documentation/concepts/middleware                     *
  *                                                                           *
  ****************************************************************************/

  middleware: {

    /***************************************************************************
    *                                                                          *
    * The order in which middleware should be run for HTTP requests.           *
    * (This Sails app's routes are handled by the "router" middleware below.)  *
    *                                                                          *
    ***************************************************************************/

    order: [
      'cookieParser',
      'session',
      'bodyParser',
      'compress',
      'poweredBy',
      'redicrectToHTTPS',
      'xframe',
      'csp',
      'strictTransportSecurity',
      'router',
      'www',
      'favicon',
    ],

    // Middleware to redirect HTTP to HTTPS
    redirectToHTTPS: function (req, res, next) {
      if (req.headers['x-forwarded-proto'] !== 'https') {
        return res.redirect(301, 'https://' + req.headers.host + req.url);
      }
      next();
    },

    // https://sailsjs.com/documentation/concepts/security/clickjacking
    xframe: lusca.xframe('SAMEORIGIN'), 

    // https://sailsjs.com/documentation/concepts/security/content-security-policy
    csp: lusca.csp({
      policy: {
        'default-src': 'self',
        'script-src': 'self',
        'style-src': 'self',
        'img-src': 'self',
        'connect-src': 'self',
        'font-src': 'self',
        'object-src': 'self',
        'media-src': 'self',
        'frame-src': 'self'
      }
    }),

    // https://sailsjs.com/documentation/concepts/security/strict-transport-security
    strictTransportSecurity: lusca.hsts({ maxAge: 31536000, includeSubDomains: true, preload: true }),

    /***************************************************************************
    *                                                                          *
    * The body parser that will handle incoming multipart HTTP requests.       *
    *                                                                          *
    * https://sailsjs.com/config/http#?customizing-the-body-parser             *
    *                                                                          *
    ***************************************************************************/

    // bodyParser: (function _configureBodyParser(){
    //   var skipper = require('skipper');
    //   var middlewareFn = skipper({ strict: true });
    //   return middlewareFn;
    // })(),

  },
};
