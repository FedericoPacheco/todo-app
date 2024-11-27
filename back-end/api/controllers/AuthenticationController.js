/**
 * AuthenticationController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

const bcrypt = require('bcryptjs');
const HASH_ROUNDS = 10;

module.exports = {
    login: async function (req, res) {

        sails.log.info('AuthenticationController: login()');
        sails.log.info(req);
        const { user, pass } = req.body;

        const foundUser = await User.findOne({ user });
        if (!foundUser) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const matched = await bcrypt.compare(pass, foundUser.pass);
        if (!matched) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        req.session.userId = foundUser.id;
        return res.json(foundUser);
    },

    logout: function (req, res) {

        sails.log.info('AuthenticationController: logout()');
        req.session.destroy();
        return res.json({ message: 'Logged out' });
    },

    signup: async function (req, res) {

        sails.log.info('AuthenticationController: signup()');
        const { user, pass } = req.body;
        
        const existingUser = await User.findOne({ user });
        if (existingUser) {
            return res.status(409).json({ error: 'User already exists' });
        }

        const hashedPass = await bcrypt.hash(pass, HASH_ROUNDS);
        const newUser = await User.create({ user, pass: hashedPass }).fetch();

        req.session.userId = newUser.id;
        return res.json(newUser);
    }
};

