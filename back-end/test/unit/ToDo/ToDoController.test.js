const chai = require("chai");
const sinon = require("sinon");
const { test, suite, setup, teardown } = require("mocha");
const proxyquire = require("proxyquire").noPreserveCache();

/*
(see also ToDoService.test.js)

Implementation details:
  * Doing the following:
      const ToDoService = require("../services/ToDoService")({});
      (...)
      sinon.stub(ToDoService, "create");  
    doesn't stub the function correctly, which in turn make the tests fail.
    For this reason, proxyquire is used to mock the ToDoService module.
    Calling noPreserveCache() is necessary to prevent the module being 
    loaded from cache, which could have other mocks injected and thus 
    produce undefined behavior (see: 
    https://dev.to/thekashey/please-stop-playing-with-proxyquire-11j4)

Relevant documentation:
  * https://sinonjs.org/releases/v19/spies/
  * https://www.npmjs.com/package/proxyquire
  * https://sinonjs.org/how-to/link-seams-commonjs/
  * https://sailsjs.com/documentation/reference/response-res
 
Misc:
  * https://tsh.io/blog/dependency-injection-in-node-js/
  * https://stackoverflow.com/questions/37836813/javascript-dependency-injection-dip-in-node-require-vs-constructor-injection
*/

suite("ToDoController", function () {
  let toDoStub, req, res, ToDoServiceStub, ToDoController, ErrorTypes;

  setup(async function () {
    toDoStub = {
      id: 1,
      text: "Test ToDo",
      state: "PENDING",
      owner: 1,
    };

    req = {
      body: {},
      params: {},
      session: { userId: toDoStub.owner },
    };

    res = {
      badRequest: sinon.spy(),
      serverError: sinon.spy(),
      notFound: sinon.spy(),
      json: sinon.spy(),
    };

    ToDoServiceStub = {
      create: sinon.stub(),
      deleteById: sinon.stub(),
      findAll: sinon.stub(),
      findById: sinon.stub(),
      update: sinon.stub(),
    };
    ToDoController = proxyquire("../../../api/controllers/ToDoController", {
      // eslint-disable-next-line no-unused-vars
      "../services/ToDoService": (ToDoModel) => ToDoServiceStub,
    });
    ErrorTypes = require("../../../api/constants/ErrorTypes");
  });

  teardown(async function () {
    sinon.restore();
  });

  suite("create", function () {
    teardown(function () {
      sinon.restore();
    });

    test("Successfully", async function () {
      ToDoServiceStub.create.resolves(toDoStub);
      req.body = { text: toDoStub.text, state: toDoStub.state };

      await ToDoController.create(req, res);

      chai.assert(res.json.calledWith(toDoStub));
    });

    test("Incomplete body", async function () {
      req.body = { text: toDoStub.text };

      await ToDoController.create(req, res);

      chai.assert(res.badRequest.calledOnce);
    });

    test("ToDoService's error", async function () {
      ToDoServiceStub.create.rejects(new Error(ErrorTypes.DB_ERROR));
      req.body = { text: toDoStub.text, state: toDoStub.state };

      await ToDoController.create(req, res);

      chai.assert(res.serverError.calledOnce);
    });
  });

  suite("delete", function () {
    teardown(function () {
      sinon.restore();
    });

    test("Successfully", async function () {
      ToDoServiceStub.deleteById.resolves(toDoStub);
      req.params.id = toDoStub.id;

      await ToDoController.delete(req, res);

      chai.assert(res.json.calledWith(toDoStub));
    });

    test("Missing param", async function () {
      await ToDoController.delete(req, res);

      chai.assert(res.badRequest.calledOnce);
    });

    test("ToDoService's error", async function () {
      ToDoServiceStub.deleteById.rejects(new Error(ErrorTypes.DB_ERROR));
      req.params.id = toDoStub.id;

      await ToDoController.delete(req, res);

      chai.assert(res.serverError.calledOnce);
    });
  });

  suite("findAll", function () {
    teardown(function () {
      sinon.restore();
    });

    test("Successfully", async function () {
      ToDoServiceStub.findAll.resolves([toDoStub]);

      await ToDoController.findAll(req, res);

      chai.assert(res.json.calledWith([toDoStub]));
    });

    test("ToDoService's error", async function () {
      ToDoServiceStub.findAll.rejects(new Error(ErrorTypes.DB_ERROR));

      await ToDoController.findAll(req, res);

      chai.assert(res.serverError.calledOnce);
    });
  });

  suite("findOne", function () {
    teardown(function () {
      sinon.restore();
    });

    test("Successfully", async function () {
      ToDoServiceStub.findById.resolves(toDoStub);
      req.params.id = toDoStub.id;

      await ToDoController.findOne(req, res);

      chai.assert(res.json.calledWith(toDoStub));
    });

    test("Entity not found", async function () {
      ToDoServiceStub.findById.throws(new Error(ErrorTypes.ENTITY_NOT_FOUND));
      req.params.id = toDoStub.id;

      await ToDoController.findOne(req, res);

      chai.assert(res.notFound.calledOnce);
    });

    test("DB error", async function () {
      ToDoServiceStub.findById.rejects(new Error(ErrorTypes.DB_ERROR));
      req.params.id = toDoStub.id;

      await ToDoController.findOne(req, res);

      chai.assert(res.serverError.calledOnce);
    });

    test("Invalid param", async function () {
      ToDoServiceStub.findById.throws(new Error(ErrorTypes.INVALID_INPUT));
      req.params.id = toDoStub.id;

      await ToDoController.findOne(req, res);

      chai.assert(res.badRequest.calledOnce);
    });
  });

  suite("update", function () {
    teardown(function () {
      sinon.restore();
    });

    test("Successfully", async function () {
      const completedToDoStub = { ...toDoStub, state: "COMPLETED" };
      ToDoServiceStub.update.resolves(completedToDoStub);
      req.body.state = "COMPLETED";
      req.params.id = toDoStub.id;

      await ToDoController.update(req, res);

      chai.assert(res.json.calledWith(completedToDoStub));
    });

    test("Missing body", async function () {
      req.params.id = toDoStub.id;

      await ToDoController.update(req, res);

      chai.assert(res.badRequest.calledOnce);
    });

    test("Missing param", async function () {
      req.body.state = "COMPLETED";

      await ToDoController.update(req, res);

      chai.assert(res.badRequest.calledOnce);
    });

    test("ToDoService's error", async function () {
      ToDoServiceStub.update.rejects(new Error(ErrorTypes.DB_ERROR));
      req.body.state = "COMPLETED";
      req.params.id = toDoStub.id;

      await ToDoController.update(req, res);

      chai.assert(res.serverError.calledOnce);
    });
  });
});
