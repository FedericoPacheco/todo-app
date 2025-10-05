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

const lusca = require("lusca");

if (process.env.NODE_ENV !== "test") {
  const fs = require("fs");
  const path = require("path");

  module.exports.ssl = {
    key: fs.readFileSync(path.resolve(__dirname, "ssl/localhost-key.pem")),
    cert: fs.readFileSync(path.resolve(__dirname, "ssl/localhost.pem")),
  };
}

module.exports.http = {
  protocol: process.env.NODE_ENV !== "test" ? "https" : "http",
  port: process.env.API_PORT,

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
      "cookieParser",
      "session",
      "bodyParser",
      "compress",
      "poweredBy",
      "redirectToHTTPS",
      "xframe",
      "csp",
      "strictTransportSecurity",
      "router",
      "www",
      "favicon",
    ],

    redirectToHTTPS: function (req, res, next) {
      if (process.env.NODE_ENV === "test") return next();
      // If running behind a proxy or browser connects via http redirect:
      const proto =
        req.headers["x-forwarded-proto"] ||
        (req.connection && req.connection.encrypted ? "https" : "http");
      if (proto !== "https") {
        return res.redirect(301, "https://" + req.headers.host + req.url);
      }
      return next();
    },

    // https://sailsjs.com/documentation/concepts/security/clickjacking
    xframe: lusca.xframe("SAMEORIGIN"),

    // https://sailsjs.com/documentation/concepts/security/content-security-policy
    csp: lusca.csp({
      policy: {
        "default-src": "self",
        "script-src": "self",
        "style-src": "self",
        "img-src": "self",
        "connect-src": "self",
        "font-src": "self",
        "object-src": "self",
        "media-src": "self",
        "frame-src": "self",
      },
    }),

    // https://sailsjs.com/documentation/concepts/security/strict-transport-security
    strictTransportSecurity: lusca.hsts({
      maxAge: 31536000,
      includeSubDomains: true,
      preload: true,
    }),
  },
};
