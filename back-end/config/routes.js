/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes tell Sails what to do each time it receives a request.
 *
 * For more information on configuring custom routes, check out:
 * https://sailsjs.com/anatomy/config/routes-js
 */

module.exports.routes = {
  /***************************************************************************
   *                                                                          *
   * Make the view located at `views/homepage.ejs` your home page.            *
   *                                                                          *
   * (Alternatively, remove this and add an `index.html` file in your         *
   * `assets` directory)                                                      *
   *                                                                          *
   ***************************************************************************/

  "/": { view: "pages/homepage" },

  /***************************************************************************
   *                                                                          *
   * More custom routes here...                                               *
   * (See https://sailsjs.com/config/routes for examples.)                    *
   *                                                                          *
   * If a request to a URL doesn't match any of the routes in this file, it   *
   * is matched against "shadow routes" (e.g. blueprint routes).  If it does  *
   * not match any of those, it is matched against static assets.             *
   *                                                                          *
   ***************************************************************************/

  "GET /api/todo": "ToDoController.findAll",
  "GET /api/todo/:id": "ToDoController.findOne",
  "POST /api/todo": "ToDoController.create",
  "DELETE /api/todo/:id": "ToDoController.delete",
  "PATCH /api/todo/:id": "ToDoController.changeState",

  "POST /api/auth/signup": "AuthenticationController.signup",
  "POST /api/auth/logout": "AuthenticationController.logout",
  "POST /api/auth/login": "AuthenticationController.login",
  "GET /api/auth/status": "AuthenticationController.status",
  "GET /api/auth/csrf": "AuthenticationController.csrfToken",

  "GET /api/health": "HealthController.isHealthy",
};
