const chai = require("chai");
const sinon = require("sinon");
const { test, suite, suiteSetup, teardown } = require("mocha");
const ToDoService = require("../../../api/services/ToDoService");

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
const ToDo = {
  ...require("../../../api/models/ToDo"),
  create: () => {},
  find: () => {},
  findOne: () => {},
  destroyOne: () => {},
  updateOne: () => {},
};

// Documentation:
// https://sailsjs.com/documentation/reference/waterline-orm/models
// https://sinonjs.org/releases/v19/stubs/

suite("ToDoService", function () {
  let toDoStub;

  console.log("Model:", ToDo);
  console.log("Service:", ToDoService);

  suiteSetup(async function () {
    toDoStub = {
      id: 1,
      text: "Test ToDo",
      state: "PENDING",
      owner: 1,
    };
  });

  suite("create", function () {
    const createStub = sinon.stub(ToDo, "create");

    teardown(function () {
      sinon.restore();
    });

    test("successfully", async function () {
      createStub.returns({
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
      createStub.returns({
        fetch: sinon.stub().rejects(new Error("AdpaterError")),
      });
      const createdToDo = await ToDoService.create();
      chai.assert.isUndefined(createdToDo);
    });
  });

  suite("delete", function () {
    const findByIdStub = sinon.stub(ToDoService, "findById");
    const deleteStub = sinon.stub(ToDo, "destroyOne");

    teardown(function () {
      sinon.restore();
    });

    test("successfully", async function () {
      findByIdStub.resolves(toDoStub);
      deleteStub.resolves(toDoStub);
      const deletedToDo = await ToDoService.delete(toDoStub.id, toDoStub.owner);
      chai.assert.deepStrictEqual(toDoStub, deletedToDo);
    });

    test("with DB error", async function () {
      deleteStub.rejects(new Error("AdapterError"));
      const deletedToDo = await ToDoService.delete(toDoStub.id, toDoStub.owner);
      chai.assert.isUndefined(deletedToDo);
    });
  });

  suite("findAll", function () {
    const findStub = sinon.stub(ToDo, "find");

    teardown(function () {
      sinon.restore();
    });

    test("successfully", async function () {
      const toDos = [toDoStub];
      findStub.resolves(toDos);
      const allToDos = await ToDoService.findAll(toDoStub.owner);
      chai.assert.deepStrictEqual(toDos, allToDos);
    });

    test("with DB error", async function () {
      findStub.rejects(new Error("AdapterError"));
      const allToDos = await ToDoService.findAll(toDoStub.owner);
      chai.assert.isUndefined(allToDos);
    });

    test("not found", async function () {
      findStub.resolves([]);
      const allToDos = await ToDoService.findAll(toDoStub.owner);
      chai.assert.deepStrictEqual([], allToDos);
    });
  });

  suite("findById", function () {
    const findOneStub = sinon.stub(ToDo, "findOne");

    teardown(function () {
      sinon.restore();
    });

    test("successfully", async function () {
      findOneStub.resolves(toDoStub);
      const foundToDo = await ToDoService.findById(toDoStub.id, toDoStub.owner);
      chai.assert.deepStrictEqual(toDoStub, foundToDo);
    });

    test("not found", async function () {
      findOneStub.resolves(undefined);
      const foundToDo = await ToDoService.findById(toDoStub.id, toDoStub.owner);
      chai.assert.isUndefined(foundToDo);
    });

    test("with different owner", async function () {
      const toDoWithDifferentOwner = { ...toDoStub, owner: toDoStub.owner + 1 };
      findOneStub.resolves(toDoWithDifferentOwner);
      const foundToDo = await ToDoService.findById(
        toDoStub.id,
        toDoWithDifferentOwner.owner
      );
      chai.assert.isUndefined(foundToDo);
    });

    test("with DB error", async function () {
      findOneStub.rejects(new Error("AdapterError"));
      const foundToDo = await ToDoService.findById(toDoStub.id, toDoStub.owner);
      chai.assert.isUndefined(foundToDo);
    });
  });

  suite("changeState", function () {
    const updateOneStub = sinon.stub(ToDo, "updateOne");

    teardown(function () {
      sinon.restore();
    });

    test("successfully", async function () {
      const toDoWithChangedState = { ...toDoStub, state: "COMPLETED" };
      updateOneStub.resolves(toDoWithChangedState);
      const updatedToDo = await ToDoService.changeState(
        toDoStub.id,
        "COMPLETED"
      );
      chai.assert.deepStrictEqual(toDoWithChangedState, updatedToDo);
    });

    test("with incorrect state", async function () {
      const updatedToDo = await ToDoService.changeState(toDoStub.id, "INVALID");
      chai.assert.isUndefined(updatedToDo);
    });

    test("not found", async function () {
      updateOneStub.resolves(undefined);
      const updatedToDo = await ToDoService.changeState(
        toDoStub.id,
        "COMPLETED"
      );
      chai.assert.isUndefined(updatedToDo);
    });

    test("with DB error", async function () {
      updateOneStub.rejects(new Error("AdapterError"));
      const updatedToDo = await ToDoService.changeState(
        toDoStub.id,
        "COMPLETED"
      );
      chai.assert.isUndefined(updatedToDo);
    });
  });
});
