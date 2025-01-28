const chaiAsPromised = require("chai-as-promised");
const chai = require("chai").use(chaiAsPromised);
const sinon = require("sinon");
const { test, suite, setup, teardown } = require("mocha");

/*
Run: 
  * Normally: npm test (see package.json for details)
  * Debugging: 
    1) Set breakpoints by writing "debugger" in the code 
    2) npm run test:debug 
    3) When "Debugger listening on ..." appears in the console, attach debugger
      ("Run and Debug" in the left sidebar > "back-end" (see .vscode/launch.json 
      for details))
    4) Hit the "Continue" button in the debugger until reaching the breakpoint

Implementation details:
  * Requiring the model doesn't include the functions to interact with the database,
    as they are "injected" by Waterline on runtime. As these are unit tests,
    a Sails instance shouldn't be lifted to test the service. This creates the need
    to mock those functions as it's done in the setup. Later, when requering the 
    service, the mocked model must be passed as a parameter.

Relevant documentation:
  * https://sailsjs.com/documentation/reference/waterline-orm/models
  * https://mochajs.org/#table-of-contents
  * https://sinonjs.org/releases/v19/
  * https://www.chaijs.com/api/assert/
  * https://www.npmjs.com/package/chai-as-promised

*/

suite("ToDoService", function () {
  let ToDoModelStub, ToDoService, ErrorTypes, toDoStub;

  setup(function () {
    ToDoModelStub = {
      ...require("../../../api/models/ToDo"),
      create: sinon.stub(),
      updateOne: sinon.stub(),
      destroyOne: sinon.stub(),
      find: sinon.stub(),
      findOne: sinon.stub(),
    };
    ToDoService = require("../../../api/services/ToDoService")(ToDoModelStub);
    ErrorTypes = require("../../../api/services/ErrorTypes");

    toDoStub = {
      id: 1,
      text: "Test ToDo",
      state: "PENDING",
      owner: 1,
    };
  });

  teardown(function () {
    sinon.restore();
  });

  suite("create", function () {
    teardown(function () {
      sinon.restore();
    });

    test("successfully", async function () {
      ToDoModelStub.create.returns({
        fetch: sinon.stub().resolves(toDoStub),
      });
      const createdToDo = await ToDoService.create(
        toDoStub.text,
        toDoStub.state,
        toDoStub.owner
      );
      chai.assert.deepStrictEqual(toDoStub, createdToDo);
    });

    test("with DB error", async function () {
      ToDoModelStub.create.returns({
        fetch: sinon.stub().rejects(new Error("AdapterError")),
      });
      chai.assert.isRejected(
        ToDoService.create(toDoStub.text, toDoStub.state, toDoStub.owner),
        ErrorTypes.DB_ERROR
      );
    });
  });

  suite("delete", function () {
    setup(function () {
      ToDoService.findById = sinon
        .stub()
        .withArgs(toDoStub.id, toDoStub.owner)
        .resolves(toDoStub);
    });

    teardown(function () {
      sinon.restore();
    });

    test("successfully", async function () {
      ToDoModelStub.destroyOne.resolves(toDoStub);
      const deletedToDo = await ToDoService.deleteById(
        toDoStub.id,
        toDoStub.owner
      );
      chai.assert.deepStrictEqual(toDoStub, deletedToDo);
    });

    test("with DB error", async function () {
      ToDoModelStub.destroyOne.rejects(new Error("AdapterError"));
      chai.assert.isRejected(
        ToDoService.deleteById(toDoStub.id, toDoStub.owner),
        ErrorTypes.DB_ERROR
      );
    });
  });

  suite("findAll", function () {
    teardown(function () {
      sinon.restore();
    });

    test("successfully", async function () {
      const toDos = [toDoStub];
      ToDoModelStub.find.resolves(toDos);
      const allToDos = await ToDoService.findAll(toDoStub.owner);
      chai.assert.deepStrictEqual(toDos, allToDos);
    });

    test("with DB error", async function () {
      ToDoModelStub.find.rejects(new Error("AdapterError"));
      chai.assert.isRejected(
        ToDoService.findAll(toDoStub.owner),
        ErrorTypes.DB_ERROR
      );
    });

    test("not found", async function () {
      ToDoModelStub.find.resolves([]);
      const allToDos = await ToDoService.findAll(toDoStub.owner);
      chai.assert.deepStrictEqual([], allToDos);
    });
  });

  suite("findById", function () {
    teardown(function () {
      sinon.restore();
    });

    test("successfully", async function () {
      ToDoModelStub.findOne.resolves(toDoStub);
      const foundToDo = await ToDoService.findById(toDoStub.id, toDoStub.owner);
      chai.assert.deepStrictEqual(toDoStub, foundToDo);
    });

    test("not found", async function () {
      ToDoModelStub.findOne.resolves(undefined);
      chai.assert.isRejected(
        ToDoService.findById(toDoStub.id, toDoStub.owner),
        ErrorTypes.ENTITY_NOT_FOUND
      );
    });

    test("with different owner", async function () {
      const toDoWithDifferentOwner = { ...toDoStub, owner: toDoStub.owner + 1 };
      ToDoModelStub.findOne.resolves(toDoWithDifferentOwner);
      chai.assert.isRejected(
        ToDoService.findById(toDoStub.id, toDoStub.owner),
        ErrorTypes.INVALID_INPUT
      );
    });

    test("with DB error", async function () {
      ToDoModelStub.findOne.rejects(new Error("AdapterError"));
      chai.assert.isRejected(
        ToDoService.findById(toDoStub.id, toDoStub.owner),
        ErrorTypes.DB_ERROR
      );
    });
  });

  suite("changeState", function () {
    setup(function () {
      ToDoService.findById = sinon
        .stub()
        .withArgs(toDoStub.id, toDoStub.owner)
        .resolves(toDoStub);
    });

    teardown(function () {
      sinon.restore();
    });

    test("successfully", async function () {
      const toDoWithChangedState = { ...toDoStub, state: "COMPLETED" };
      ToDoModelStub.updateOne.returns({
        set: sinon.stub().resolves(toDoWithChangedState),
      });

      const updatedToDo = await ToDoService.changeState(
        toDoStub.id,
        toDoStub.owner,
        "COMPLETED"
      );
      chai.assert.deepStrictEqual(toDoWithChangedState, updatedToDo);
    });

    test("with incorrect state", async function () {
      chai.assert.isRejected(
        ToDoService.changeState(toDoStub.id, toDoStub.owner, "INVALID"),
        ErrorTypes.INVALID_INPUT
      );
    });

    test("not found", async function () {
      ToDoModelStub.updateOne.returns({
        set: sinon.stub().resolves(undefined),
      });
      chai.assert.isRejected(
        ToDoService.changeState(toDoStub.id, toDoStub.owner, "COMPLETED"),
        ErrorTypes.ENTITY_NOT_FOUND
      );
    });

    test("with DB error", async function () {
      ToDoModelStub.updateOne.returns({
        set: sinon.stub().rejects(new Error("AdapterError")),
      });
      chai.assert.isRejected(
        ToDoService.changeState(toDoStub.id, "COMPLETED"),
        ErrorTypes.DB_ERROR
      );
    });
  });
});
