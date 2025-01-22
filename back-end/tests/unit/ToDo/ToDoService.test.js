const chaiAsPromised = require("chai-as-promised");
const chai = require("chai").use(chaiAsPromised);
const sinon = require("sinon");
const { test, suite, suiteSetup, teardown, suiteTeardown } = require("mocha");

// const sails = require("sails");
// Run: npx mocha ./back-end/tests/unit/ToDo/ToDoService.test

/* Hacky solution:
  Requiring the ToDo model doesn't include the following functions,
  which are "injected" by Waterline on runtime. Trying to lift the sails
  instance haven't worked for me sofar as shown here: 
    https://stackoverflow.com/questions/21048543/cannot-unit-test-my-model-in-sailsjs
  and also adding in the suiteSetup():
    ToDo = sails.models.todo;
    ToDoService = sails.services.todoservice;
  Besides that, lifting it shouldn't be necessary for unit tests.
*/
// const ToDo = {
//   ...require("../../../api/models/ToDo"),
//   create: () => {},
//   find: () => {},
//   findOne: () => {},
//   destroyOne: () => {},
//   updateOne: () => {},
// };

// Documentation:
// https://sailsjs.com/documentation/reference/waterline-orm/models
// https://sinonjs.org/releases/v19/stubs/

// https://www.chaijs.com/plugins/chai-promised/
// https://www.npmjs.com/package/chai-as-promised

suite("ToDoService", function () {
  const ToDoModelStub = {
    ...require("../../../api/models/ToDo"),
    create: sinon.stub(),
    updateOne: sinon.stub(),
    destroyOne: sinon.stub(),
    find: sinon.stub(),
    findOne: sinon.stub(),
  };
  const ToDoService = require("../../../api/services/ToDoService")(
    ToDoModelStub
  );
  const ErrorTypes = require("../../../api/services/ErrorTypes");

  const toDoStub = {
    id: 1,
    text: "Test ToDo",
    state: "PENDING",
    owner: 1,
  };

  // console.log("ToDoModelStub:", ToDoModelStub);
  // console.log("ToDoService:", ToDoService);
  // console.log("toDoStub:", toDoStub);

  // suiteSetup(async function () {
  //   console.log("ToDoService suiteSetup()");
  //   // await sails.lift();
  // });

  // suiteTeardown(async function () {
  //   console.log("ToDoService suiteTeardown()");
  //   // await sails.lower();
  // });

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

    test("with db error", async function () {
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
    const findByIdStub = sinon.stub(ToDoService, "findById").resolves(toDoStub);

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
    teardown(function () {
      sinon.restore();
    });

    test("successfully", async function () {
      const toDoWithChangedState = { ...toDoStub, state: "COMPLETED" };
      ToDoModelStub.updateOne.resolves(toDoWithChangedState);
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
      ToDoModelStub.updateOne.resolves(undefined);
      chai.assert.isRejected(
        ToDoService.changeState(toDoStub.id, toDoStub.owner, "COMPLETED"),
        ErrorTypes.ENTITY_NOT_FOUND
      );
    });

    test("with DB error", async function () {
      ToDoModelStub.updateOne.rejects(new Error("AdapterError"));
      chai.assert.isRejected(
        ToDoService.changeState(toDoStub.id, "COMPLETED"),
        ErrorTypes.DB_ERROR
      );
    });
  });
});
