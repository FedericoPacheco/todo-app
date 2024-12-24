/**
 * AuthenticationController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

const bcrypt = require("bcryptjs");
const HASH_ROUNDS = 10;

module.exports = {
  login: async function (req, res) {
    const { user, pass } = req.body;
    const foundUser = await User.findOne({ user });
    const matched = await bcrypt.compare(pass, foundUser?.pass);
    if (!foundUser || !matched) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    req.session.userId = foundUser.id;
    return res.json({ message: `User ${foundUser.user} logged in` });
  },

  logout: function (req, res) {
    req.session.destroy();
    return res.json({ message: "Logged out" });
  },

  signup: async function (req, res) {
    const { user, pass } = req.body;
    const existingUser = await User.findOne({ user });
    if (existingUser) {
      return res
        .status(409)
        .json({ error: `User ${existingUser.user} already exists` });
    }
    const hashedPass = await bcrypt.hash(pass, HASH_ROUNDS);
    const newUser = await User.create({ user, pass: hashedPass }).fetch();
    req.session.userId = newUser.id;
    return res.json({ message: `User ${user} signed up` });
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
