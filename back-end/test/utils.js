const supertest = require("supertest");
// const crypto = require("crypto");
const faker = require("faker");

module.exports = {
  createAuthenticatedUserAgent,
  setCsrfToken,
  logout,
};

// TODO: verify that the sessionid and csrf token are saved in the useragent
// TODO: try using: https://www.npmjs.com/package/supertest-session

/* Creates a fake user inside the system to perform tests. 
Using random strings for the session id and csrf token doesn't work.
Disabling the isAuthenticated policy for NODE_ENV === "test" isn't preferred.
*/
async function createAuthenticatedUserAgent() {
  const userAgent = createUserAgent();
  const credentials = await signup(userAgent);
  await login(userAgent, credentials);
  console.log(userAgent);
  return userAgent;
}

function createUserAgent() {
  const url = `http://localhost:${process.env.API_PORT || 1340}/`;
  // return supertest.agent(sails.hooks.http.app); // Doesn't work: sails.hooks returns undefined
  return supertest.agent(url);
}

async function signup(userAgent) {
  const user = faker.internet.userName();
  const pass = faker.internet.password();
  setCsrfToken(userAgent);
  await userAgent.post("/signup").send({ user, pass });
  console.log(`User: ${user}, pass: ${pass}`);
  return { user, pass };
}

async function login(userAgent, credentials) {
  setCsrfToken(userAgent);
  await userAgent
    .post("/login")
    .send({ user: credentials.user, pass: credentials.pass });
}

async function setCsrfToken(userAgent) {
  const csrfToken = await userAgent.get("/csrfToken");
  userAgent.set("X-Csrf-Token", csrfToken);
}

async function logout(userAgent) {
  await userAgent.get("/logout");
}
