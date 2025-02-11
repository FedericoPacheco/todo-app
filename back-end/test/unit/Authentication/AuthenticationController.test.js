const chaiAsPromised = require("chai-as-promised");
const chai = require("chai").use(chaiAsPromised);
const sinon = require("sinon");
const { suite, test, setup, teardown } = require("mocha");
const { assert } = chai;
const proxyquire = require("proxyquire").noPreserveCache();

suite("AuthenticationController", function () {
  let id,
    user,
    pass,
    req,
    res,
    csrfToken,
    AuthenticationServiceStub,
    AuthenticationController,
    ErrorTypes;

  setup(function () {
    id = 1;
    user = "testUser";
    pass = "testPass";
    req = {
      body: {},
      session: { destroy: sinon.stub() },
      csrfToken: sinon.stub(),
    };
    res = {
      badRequest: sinon.stub(),
      serverError: sinon.stub(),
      unauthorized: sinon.stub(),
      notFound: sinon.stub(),
      json: sinon.stub(),
    };
    csrfToken = "fakeToken";

    AuthenticationServiceStub = {
      login: sinon.stub(),
      logout: sinon.stub(),
      signup: sinon.stub(),
    };
    AuthenticationController = proxyquire(
      "../../../api/controllers/AuthenticationController",
      {
        // eslint-disable-next-line no-unused-vars
        "../services/AuthenticationService": (User) =>
          AuthenticationServiceStub,
      },
    );
    ErrorTypes = require("../../../api/constants/ErrorTypes");
  });

  teardown(function () {
    sinon.restore();
  });

  suite("login", function () {
    teardown(function () {
      sinon.restore();
    });

    test("should return 400 if 'user' or 'pass' is missing", async function () {
      req.body = { user: undefined, pass: undefined };

      await AuthenticationController.login(req, res);

      assert(res.badRequest.calledOnce);
      assert.isUndefined(req.session.userId);
    });

    test("should handle DB_ERROR from service", async function () {
      req.body = { user, pass };
      AuthenticationServiceStub.login.rejects(new Error(ErrorTypes.DB_ERROR));

      await AuthenticationController.login(req, res);

      assert(res.serverError.calledOnce);
      assert.isUndefined(req.session.userId);
    });

    test("should handle INVALID_CREDENTIALS from service", async function () {
      req.body = { user: `invalid_${user}`, pass: `invalid_${pass}` };
      AuthenticationServiceStub.login.rejects(
        new Error(ErrorTypes.INVALID_CREDENTIALS),
      );

      await AuthenticationController.login(req, res);

      assert(res.unauthorized.calledOnce);
      assert.isUndefined(req.session.userId);
    });

    test("should set session.userId and return json on successful login", async function () {
      req.body = { user, pass };
      AuthenticationServiceStub.login.resolves({ id, user, pass });

      await AuthenticationController.login(req, res);

      assert(res.json.calledOnce);
      assert.equal(req.session.userId, id);
    });
  });

  suite("logout", function () {
    teardown(function () {
      sinon.restore();
    });

    test("should destroy session and return json on successful logout", function () {
      AuthenticationController.logout(req, res);

      assert(req.session.destroy.calledOnce);
      assert(res.json.calledOnce);
    });
  });

  suite("signup", function () {
    teardown(function () {
      sinon.restore();
    });

    test("should return 400 if 'user' or 'pass' is missing", async function () {
      await AuthenticationController.signup(req, res);

      assert(res.badRequest.calledOnce);
      assert.isUndefined(req.session.userId);
    });

    test("should handle DB_ERROR when checking existing user or creating a new one", async function () {
      req.body = { user, pass };
      AuthenticationServiceStub.signup.rejects(new Error(ErrorTypes.DB_ERROR));

      await AuthenticationController.signup(req, res);

      assert(res.serverError.calledOnce);
      assert.isUndefined(req.session.userId);
    });

    test("should handle USER_ALREADY_EXISTS", async function () {
      req.body = { user, pass };
      AuthenticationServiceStub.signup.rejects(
        new Error(ErrorTypes.USER_ALREADY_EXISTS),
      );

      await AuthenticationController.signup(req, res);

      assert(res.badRequest.calledOnce);
      assert.isUndefined(req.session.userId);
    });

    test("should set session.userId and return json on successful signup", async function () {
      req.body = { user, pass };

      AuthenticationServiceStub.signup.resolves({ id: id + 1, user });

      await AuthenticationController.signup(req, res);
      assert.equal(req.session.userId, id + 1);
      assert(res.json.calledOnce);
    });
  });

  suite("status", function () {
    teardown(function () {
      sinon.restore();
    });

    test("should return isAuthenticated: true if session.userId is set", function () {
      req.session.userId = id;

      AuthenticationController.status(req, res);

      const arg = res.json.firstCall.args[0];
      assert.propertyVal(arg, "isAuthenticated", true);
    });

    test("should return isAuthenticated: false if session.userId is not set", function () {
      AuthenticationController.status(req, res);

      const arg = res.json.firstCall.args[0];
      assert.propertyVal(arg, "isAuthenticated", false);
    });
  });

  suite("csrfToken", function () {
    teardown(function () {
      sinon.restore();
    });

    test("should return the csrf token in json", function () {
      req.csrfToken.returns(csrfToken);

      AuthenticationController.csrfToken(req, res);

      assert(res.json.calledOnce);
      const arg = res.json.firstCall.args[0];
      assert.propertyVal(arg, "csrfToken", csrfToken);
    });
  });
});
