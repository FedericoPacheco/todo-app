const chaiAsPromised = require("chai-as-promised");
const chai = require("chai").use(chaiAsPromised);
const sinon = require("sinon");
const { test, suite, setup, teardown } = require("mocha");

/*
Run: 
  * Normally: npm test (see package.json for details)
  * Debugging: 
    1) Set breakpoints by writing "debugger;" in the code. 
    2) npm run unit-test:debug 
    3) When "Debugger listening on ..." appears in the console, attach debugger
      (VS Code: "Run and Debug" in the left sidebar > "back-end" (see .vscode/launch.json 
      for details)).
    4) Hit the "Continue" button in the debugger until reaching the breakpoint.
    Tip: when hovering the cursor over a function, if it doesn't say "proxy(...)"
    then it isn't being mocked correctly. 

Implementation details:
  * Requiring the model doesn't include the functions to interact with the database,
    as they are "injected" by Waterline on runtime. As these are unit tests,
    a Sails instance shouldn't be lifted to test the service. This creates the need
    to mock those functions as it's done in the setup. Later, when requiring the 
    service, the mocked model must be passed as a parameter.

Relevant documentation:
  * https://sailsjs.com/documentation/reference/waterline-orm/models
  * https://mochajs.org/#table-of-contents
  * https://sinonjs.org/releases/v19/stubs/
  * https://www.chaijs.com/api/assert/
  * https://www.npmjs.com/package/chai-as-promised
*/

suite("ToDoService", function () {
  let ToDoModelStub, ToDoService, ErrorTypes, toDoStub;

  setup(function () {
    ToDoModelStub = {
      ...require("../../../api/models/ToDo"),
      create: sinon.stub(),
      updateOne: sinon.stub().returns({ set: sinon.stub() }),
      destroyOne: sinon.stub(),
      find: sinon.stub(),
      findOne: sinon.stub(),
    };
    ToDoService = require("../../../api/services/ToDoService")(ToDoModelStub);
    ErrorTypes = require("../../../api/constants/ErrorTypes");

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

    test("Successfully", async function () {
      ToDoModelStub.create
        .withArgs({
          text: toDoStub.text,
          state: toDoStub.state,
          owner: toDoStub.owner,
        })
        .returns({
          fetch: sinon.stub().resolves(toDoStub),
        });
      const createdToDo = await ToDoService.create(
        toDoStub.text,
        toDoStub.state,
        toDoStub.owner,
      );
      chai.assert.deepStrictEqual(toDoStub, createdToDo);
    });

    test("With DB error", async function () {
      ToDoModelStub.create.returns({
        fetch: sinon.stub().rejects(new Error("AdapterError")),
      });
      await chai.assert.isRejected(
        ToDoService.create(toDoStub.text, toDoStub.state, toDoStub.owner),
        ErrorTypes.DB_ERROR,
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

    test("Successfully", async function () {
      ToDoModelStub.destroyOne.withArgs({ id: toDoStub.id }).resolves(toDoStub);
      const deletedToDo = await ToDoService.deleteById(
        toDoStub.id,
        toDoStub.owner,
      );
      chai.assert.deepStrictEqual(toDoStub, deletedToDo);
    });

    test("With DB error", async function () {
      ToDoModelStub.destroyOne.rejects(new Error("AdapterError"));
      await chai.assert.isRejected(
        ToDoService.deleteById(toDoStub.id, toDoStub.owner),
        ErrorTypes.DB_ERROR,
      );
    });
  });

  suite("findAll", function () {
    teardown(function () {
      sinon.restore();
    });

    test("Successfully", async function () {
      const toDos = [toDoStub];
      ToDoModelStub.find.withArgs({ owner: toDoStub.owner }).resolves(toDos);
      const allToDos = await ToDoService.findAll(toDoStub.owner);
      chai.assert.deepStrictEqual(toDos, allToDos);
    });

    test("With DB error", async function () {
      ToDoModelStub.find.rejects(new Error("AdapterError"));
      await chai.assert.isRejected(
        ToDoService.findAll(toDoStub.owner),
        ErrorTypes.DB_ERROR,
      );
    });

    test("Not found", async function () {
      ToDoModelStub.find.resolves([]);
      const allToDos = await ToDoService.findAll(toDoStub.owner);
      chai.assert.deepStrictEqual([], allToDos);
    });
  });

  suite("findById", function () {
    teardown(function () {
      sinon.restore();
    });

    test("Successfully", async function () {
      ToDoModelStub.findOne.withArgs({ id: toDoStub.id }).resolves(toDoStub);
      const foundToDo = await ToDoService.findById(toDoStub.id, toDoStub.owner);
      chai.assert.deepStrictEqual(toDoStub, foundToDo);
    });

    test("Not found", async function () {
      ToDoModelStub.findOne.resolves(undefined);
      await chai.assert.isRejected(
        ToDoService.findById(toDoStub.id, toDoStub.owner),
        ErrorTypes.ENTITY_NOT_FOUND,
      );
    });

    test("With different owner", async function () {
      const toDoWithDifferentOwner = { ...toDoStub, owner: toDoStub.owner + 1 };
      ToDoModelStub.findOne.resolves(toDoWithDifferentOwner);
      await chai.assert.isRejected(
        ToDoService.findById(toDoStub.id, toDoStub.owner),
        ErrorTypes.INVALID_INPUT,
      );
    });

    test("With DB error", async function () {
      ToDoModelStub.findOne.rejects(new Error("AdapterError"));
      await chai.assert.isRejected(
        ToDoService.findById(toDoStub.id, toDoStub.owner),
        ErrorTypes.DB_ERROR,
      );
    });
  });

  suite("update", function () {
    teardown(function () {
      sinon.restore();
    });

    test("State successfully", async function () {
      sinon
        .stub(ToDoService, "findById")
        .withArgs(toDoStub.id, toDoStub.owner)
        .resolves(toDoStub);

      await ToDoService.update(toDoStub.id, toDoStub.owner, {
        state: "COMPLETED",
      });

      chai.assert.isTrue(
        ToDoModelStub.updateOne.getCall(0).returnValue.set.calledOnceWith({
          state: "COMPLETED",
        }),
      );
    });

    test("With incorrect state", async function () {
      sinon
        .stub(ToDoService, "findById")
        .withArgs(toDoStub.id, toDoStub.owner)
        .resolves(toDoStub);
      await chai.assert.isRejected(
        ToDoService.update(toDoStub.id, toDoStub.owner, { state: "INVALID" }),
        ErrorTypes.INVALID_INPUT,
      );
    });

    test("State with DB error", async function () {
      sinon
        .stub(ToDoService, "findById")
        .withArgs(toDoStub.id, toDoStub.owner)
        .resolves(toDoStub);
      ToDoModelStub.updateOne.rejects(new Error("AdapterError"));

      await chai.assert.isRejected(
        ToDoService.update(toDoStub.id, toDoStub.owner, { state: "COMPLETED" }),
        ErrorTypes.DB_ERROR,
      );
    });

    test("Text successfully", async function () {
      sinon.stub(ToDoService, "findById").resolves(toDoStub);

      await ToDoService.update(toDoStub.id, toDoStub.owner, {
        text: "New text",
      });

      chai.assert.isTrue(
        ToDoModelStub.updateOne.getCall(0).returnValue.set.calledOnceWith({
          text: "New text",
        }),
      );
    });

    test("With empty text", async function () {
      sinon
        .stub(ToDoService, "findById")
        .withArgs(toDoStub.id, toDoStub.owner)
        .resolves(toDoStub);

      await chai.assert.isRejected(
        ToDoService.update(toDoStub.id, toDoStub.owner, { text: "" }),
        ErrorTypes.INVALID_INPUT,
      );

      chai.assert.deepEqual(ToDoModelStub.updateOne.callCount, 0);
    });

    test("With empty attributes", async function () {
      sinon
        .stub(ToDoService, "findById")
        .withArgs(toDoStub.id, toDoStub.owner)
        .resolves(toDoStub);

      await chai.assert.isRejected(
        ToDoService.update(toDoStub.id, toDoStub.owner, {}),
        ErrorTypes.INVALID_INPUT,
      );

      chai.assert.deepEqual(ToDoModelStub.updateOne.callCount, 0);
    });
  });
});
