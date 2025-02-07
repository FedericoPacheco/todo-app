const bcrypt = require("bcryptjs");
const HASH_ROUNDS = 10;

const ErrorTypes = require("../constants/ErrorTypes");

module.exports = (User) => {
  return {
    login,
    logout,
    signup,
  };

  async function login(user, pass) {
    let foundUser, matched;
    try {
      foundUser = await User.findOne({ user });
    } catch {
      throw new Error(ErrorTypes.DB_ERROR);
    }
    matched = await bcrypt.compare(pass, foundUser.pass);
    if (!foundUser || !matched) {
      throw new Error(ErrorTypes.INVALID_CREDENTIALS);
    }
    return foundUser;
  }

  async function logout() {
    return;
  }

  async function signup(user, pass) {
    let existingUser, newUser;
    try {
      existingUser = await User.findOne({ user });
    } catch {
      throw new Error(ErrorTypes.DB_ERROR);
    }
    if (existingUser) {
      throw new Error(ErrorTypes.USER_ALREADY_EXISTS);
    }
    const hashedPass = await bcrypt.hash(pass, HASH_ROUNDS);
    try {
      newUser = await User.create({ user, pass: hashedPass }).fetch();
    } catch {
      throw new Error(ErrorTypes.DB_ERROR);
    }
    return newUser;
  }
};
