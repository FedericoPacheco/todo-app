const chai = require("chai");
const sinon = require("sinon");
const { test, suite, setup, teardown } = require("mocha");

const ToDoController = require("../../../api/controllers/ToDoController");
const ToDoService = require("../../../api/services/ToDoService")(); // No model is passed
const ErrorTypes = require("../../../api/services/ErrorTypes");

suite("ToDoController", function () {
  let toDoStub, ToDoServiceStub, req, res;

  setup(async function () {
    toDoStub = {
      id: 1,
      text: "Test ToDo",
      state: "PENDING",
      owner: 1,
    };

    ToDoServiceStub = {
      create: sinon.stub(ToDoService, "create"),
      deleteById: sinon.stub(ToDoService, "deleteById"),
      findAll: sinon.stub(ToDoService, "findAll"),
      findById: sinon.stub(ToDoService, "findById"),
      changeState: sinon.stub(ToDoService, "changeState"),
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
  });

  teardown(async function () {
    sinon.restore();
  });

  suite("create", function () {
    teardown(function () {
      sinon.restore();
    });

    test("successfully", async function () {
      ToDoServiceStub.create.resolves(toDoStub);
      req.body = { text: toDoStub.text, state: toDoStub.state };

      // debugger;
      await ToDoController.create(req, res);

      // chai.assert.isFulfilled(ToDoController.create(req, res));
      chai.assert(res.json.calledWith(toDoStub));
    });

    test("incomplete body", async function () {
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

    test("successfully", async function () {
      ToDoServiceStub.deleteById.resolves(toDoStub);
      req.params.id = toDoStub.id;

      await ToDoController.delete(req, res);

      chai.assert(res.json.calledWith(toDoStub));
    });

    test("missing param", async function () {
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

    test("successfully", async function () {
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

    test("successfully", async function () {
      ToDoServiceStub.findById.resolves(toDoStub);
      req.params.id = toDoStub.id;

      await ToDoController.findOne(req, res);

      chai.assert(res.json.calledWith(toDoStub));
    });

    test("entity not found", async function () {
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

    test("invalid input", async function () {
      ToDoServiceStub.findById.throws(new Error(ErrorTypes.INVALID_INPUT));
      req.params.id = toDoStub.id;

      await ToDoController.findOne(req, res);

      chai.assert(res.badRequest.calledOnce);
    });
  });

  suite("changeState", function () {
    teardown(function () {
      sinon.restore();
    });

    test("successfully", async function () {
      const completedToDoStub = { ...toDoStub, state: "COMPLETED" };
      ToDoServiceStub.changeState.resolves(completedToDoStub);
      req.body.state = "COMPLETED";
      req.params.id = toDoStub.id;

      await ToDoController.changeState(req, res);

      chai.assert(res.json.calledWith(completedToDoStub));
    });

    test("Missing body", async function () {
      req.params.id = toDoStub.id;

      await ToDoController.changeState(req, res);

      chai.assert(res.badRequest.calledOnce);
    });

    test("Missing param", async function () {
      req.body.state = "COMPLETED";

      await ToDoController.changeState(req, res);

      chai.assert(res.badRequest.calledOnce);
    });

    test("ToDoService's error", async function () {
      ToDoServiceStub.changeState.rejects(new Error(ErrorTypes.DB_ERROR));
      req.body.state = "COMPLETED";
      req.params.id = toDoStub.id;

      await ToDoController.changeState(req, res);

      chai.assert(res.serverError.calledOnce);
    });
  });
});
