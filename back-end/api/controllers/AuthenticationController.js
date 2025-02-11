const UserModel = typeof User !== "undefined" ? User : {};
const AuthenticationService = require("../services/AuthenticationService")(
  UserModel,
);

const { mapErrorToStatus } = require("./errorUtils");

module.exports = {
  login: async function (req, res) {
    const { user, pass } = req.body;

    if (!user || !pass) {
      return res.badRequest("User and password are required");
    }

    try {
      const foundUser = await AuthenticationService.login(user, pass);
      req.session.userId = foundUser.id;
      return res.json({ message: `User ${foundUser.user} logged in` });
    } catch (error) {
      mapErrorToStatus(error, res);
    }
  },

  logout: function (req, res) {
    try {
      AuthenticationService.logout();
      req.session.destroy();
      return res.json({ message: "Logged out" });
    } catch (error) {
      mapErrorToStatus(error, res);
    }
  },

  signup: async function (req, res) {
    const { user, pass } = req.body;

    if (!user || !pass) {
      return res.badRequest("User and password are required");
    }

    try {
      const newUser = await AuthenticationService.signup(user, pass);
      req.session.userId = newUser.id;
      return res.json({ message: `User ${newUser.user} signed up` });
    } catch (error) {
      mapErrorToStatus(error, res);
    }
  },

  status: function (req, res) {
    if (req.session.userId) {
      return res.json({ isAuthenticated: true });
    } else {
      return res.json({ isAuthenticated: false });
    }
  },
  csrfToken: function (req, res) {
    return res.json({ csrfToken: req.csrfToken() });
  },
};
