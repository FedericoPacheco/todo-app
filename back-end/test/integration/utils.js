const supertest = require("supertest");
const faker = require("faker");

module.exports = {
  createAuthenticatedUserAgent,
  setCsrfToken,
  logout,
};

/* 
Creates a fake user inside the system to perform tests. 
Disabling the isAuthenticated policy for NODE_ENV === "test" 
isn't preferred.
*/
async function createAuthenticatedUserAgent() {
  const userAgent = createUserAgent();
  const credentials = await signup(userAgent);
  await login(userAgent, credentials);
  return userAgent;
}

function createUserAgent() {
  const host = process.env?.API_HOST || "localhost";
  const port = process.env?.API_PORT || 1340;
  const url = `http://${host}:${port}/`;
  // return supertest.agent(sails.hooks.http.app); // Doesn't work: sails.hooks returns undefined
  return supertest.agent(url);
}

async function signup(userAgent) {
  const user = faker.internet.userName();
  const pass = faker.internet.password();
  await setCsrfToken(userAgent);
  await userAgent.post("auth/signup").send({ user, pass });
  return { user, pass };
}

async function login(userAgent, credentials) {
  await setCsrfToken(userAgent);
  await userAgent
    .post("auth/login")
    .send({ user: credentials.user, pass: credentials.pass });
}

async function setCsrfToken(userAgent) {
  const csrfToken = (await userAgent.get("auth/csrf")).body.csrfToken;
  userAgent.set("X-Csrf-Token", csrfToken);
}

async function logout(userAgent) {
  await userAgent.post("logout");
}
