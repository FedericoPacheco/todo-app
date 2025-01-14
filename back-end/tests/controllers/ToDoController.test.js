const chai = require("chai");
const sinon = require("sinon");
const { test, suite, teardown } = require("mocha");
const supertest = require("supertest");
const ToDoController = require("../../api/controllers/ToDoController");

// Documentation:
// https://sailsjs.com/documentation/reference/waterline-orm/models
// https://sinonjs.org/releases/v19/stubs/

suite("ToDoController", function () {
  //const agent = supertest.agent(sails.hooks.http.app); // Doesn't work: sails.hooks returns undefined
  const url = `http://localhost:${process.env.API_PORT || 1340}/`;
  const agent = supertest.agent(url);

  const toDo = {
    id: 1,
    text: "Test ToDo",
    state: "PENDING",
    owner: 1,
  };

  suite("create", function () {
    const createStub = sinon.stub(ToDoController, "create");

    teardown(function () {
      sinon.restore();
    });

    test("successfully", async function () {
      createStub.returns({
        fetch: sinon.stub().resolves(toDo),
      });

      await agent
        .post("/todo")
        .send(toDo)
        .expect(200)
        .expect((res) => {
          chai.assert.propertyVal(res.body, "id", toDo.id);
          chai.assert.propertyVal(res.body, "text", toDo.text);
          chai.assert.propertyVal(res.body, "state", toDo.state);
          chai.assert.propertyVal(res.body, "owner", toDo.owner);
        });
    });

    test("with no body", async function () {
      createStub.returns({
        fetch: sinon.stub().rejects("UsageError"),
      });
      await agent.post("/todo").send({}).expect(400);
    });

    test("produces DB error", async function () {
      createStub.returns({
        fetch: sinon.stub().rejects("AdapterError"),
      });
      await agent.post("/todo").send(toDo).expect(500);
    });
  });

  suite("delete", function () {
    const deleteStub = sinon.stub(ToDoController, "delete");

    teardown(function () {
      sinon.restore();
    });

    test("successfully", async function () {
      deleteStub.resolves({ id: toDo.id });
      await agent
        .delete(`/todo/${toDo.id}`)
        .expect(200)
        .expect((res) => {
          chai.assert.propertyVal(res.body, "id", toDo.id);
        });
    });

    test("not found", async function () {
      deleteStub.resolves(undefined);
      await agent.delete(`/todo/${toDo.id + 1}`).expect(404);
    });

    test("with no params", async function () {
      await agent.delete("/todo").expect(400);
    });

    test("produces DB error", async function () {
      deleteStub.rejects(new Error("AdapterError"));
      await agent.delete(`/todo/${toDo.id}`).expect(500);
    });
  });

  suite("findAll", function () {
    const findAllStub = sinon.stub(ToDoController, "findAll");

    teardown(function () {
      sinon.restore();
    });

    test("successfully", async function () {
      const toDos = [toDo];
      findAllStub.resolves(toDos);
      await agent
        .get("/todo")
        .expect(200)
        .expect((res) => {
          chai.assert.isArray(res.body);
          chai.assert.lengthOf(res.body, toDos.length);
          chai.assert.propertyVal(res.body[0], "id", toDos[0].id);
        });
    });

    test("with DB error", async function () {
      findAllStub.rejects("AdapterError");
      await agent.get("/todo").expect(500);
    });
  });

  suite("findOne", function () {
    const findOneStub = sinon.stub(ToDoController, "findOne");

    teardown(function () {
      sinon.restore();
    });

    test("successfully", async function () {
      findOneStub.resolves(toDo);
      await agent
        .get(`/todo/${toDo.id}`)
        .expect(200)
        .expect((res) => {
          chai.assert.propertyVal(res.body, "id", toDo.id);
        });
    });

    test("not found", async function () {
      findOneStub.resolves(undefined);
      await agent.get(`/todo/${toDo.id + 1}`).expect(404);
    });

    test("with DB error", async function () {
      findOneStub.rejects("AdapterError");
      await agent.get(`/todo/${toDo.id}`).expect(500);
    });
  });

  suite("changeState", function () {
    const changeStateStub = sinon.stub(ToDoController, "changeState");

    teardown(function () {
      sinon.restore();
    });

    test("successfully", async function () {
      const updatedToDo = { id: toDo.id, state: "COMPLETED" };
      changeStateStub.resolves(updatedToDo);
      await agent
        .patch(`/todo/${toDo.id}/state`)
        .send({ state: "COMPLETED" })
        .expect(200)
        .expect((res) => {
          chai.assert.propertyVal(res.body, "id", toDo.id);
          chai.assert.propertyVal(res.body, "state", "COMPLETED");
        });
    });

    test("with no body", async function () {
      await agent.patch(`/todo/${toDo.id}/state`).send({}).expect(400);
    });

    test("with incorrect state", async function () {
      await agent
        .patch(`/todo/${toDo.id}/state`)
        .send({ state: "INVALID" })
        .expect(400);
    });

    test("with no params", async function () {
      await agent.patch("/todo/state").expect(400);
    });

    test("not found", async function () {
      changeStateStub.resolves(undefined);
      await agent
        .patch(`/todo/${toDo.id + 1}/state`)
        .send({ state: "COMPLETED" })
        .expect(404);
    });

    test("with DB error", async function () {
      changeStateStub.rejects(new Error("AdapterError"));
      await agent
        .patch(`/todo/${toDo.id}/state`)
        .send({ state: "COMPLETED" })
        .expect(500);
    });
  });
});
