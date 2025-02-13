const chai = require("chai");
const { test, suite, setup, suiteSetup, suiteTeardown } = require("mocha");
const {
  createAuthenticatedUserAgent,
  logout,
  setCsrfToken,
} = require("./utils");

/*
Notes:
  * Lift the sails instance with docker compose up before running. 
  Otherwise, the tests will fail.
  * Attach the debugger as you would normally do to the running 
  instance to look for errors. 

Relevant links:
  * https://www.youtube.com/watch?v=i4aYlf292aE
  * https://sailsjs.com/documentation/concepts/testing
  * https://testrigor.com/sails-js-testing/#mocha
*/

suite("ToDoIntegration", function () {
  let agent;
  let toDo;

  suiteSetup(async function () {
    agent = await createAuthenticatedUserAgent();
    toDo = {
      text: "Test ToDo",
      state: "PENDING",
    };
  });

  suiteTeardown(async function () {
    await logout(agent);
  });

  suite("POST todo", function () {
    setup(async function () {
      await setCsrfToken(agent);
    });

    test("successfully", async function () {
      await agent
        .post("todo")
        .send(toDo)
        .expect(200)
        .expect((res) => {
          chai.assert.propertyVal(res.body, "text", toDo.text);
          chai.assert.propertyVal(res.body, "state", toDo.state);
        });
    });

    test("Missing body", async function () {
      await agent.post("todo").send({}).expect(400);
    });
  });

  suite("GET todo", function () {
    setup(async function () {
      await setCsrfToken(agent);
    });

    test("successfully", async function () {
      const anotherToDo = (await agent.post("todo").send({ ...toDo })).body;

      await agent
        .get("todo")
        .expect(200)
        .expect((res) => {
          chai.assert.isArray(res.body);
          chai.assert.exists(res.body.find((t) => t.id === anotherToDo.id));
        });
    });
  });

  suite("GET todo/:id", function () {
    setup(async function () {
      await setCsrfToken(agent);
    });

    test("successfully", async function () {
      const anotherToDo = (await agent.post("todo").send({ ...toDo })).body;
      await agent
        .get(`todo/${anotherToDo.id}`)
        .expect(200)
        .expect((res) => {
          chai.assert.propertyVal(res.body, "id", anotherToDo.id);
        });
    });

    test("not found", async function () {
      await agent.get(`todo/${-1}`).expect(404);
    });
  });

  suite("PATCH todo/:id", function () {
    let anotherToDo;

    setup(async function () {
      await setCsrfToken(agent);
      anotherToDo = (await agent.post("todo").send({ ...toDo })).body;
    });

    test("successfully", async function () {
      await agent
        .patch(`todo/${anotherToDo.id}`)
        .send({ state: "COMPLETED" })
        .expect(200)
        .expect((res) => {
          chai.assert.propertyVal(res.body, "id", anotherToDo.id);
          chai.assert.propertyVal(res.body, "state", "COMPLETED");
        });
    });

    test("Missing body", async function () {
      await agent.patch(`todo/${anotherToDo.id}`).send({}).expect(400);
    });

    test("Invalid state", async function () {
      await agent
        .patch(`todo/${anotherToDo.id}`)
        .send({ state: "INVALID" })
        .expect(400);
    });

    test("not found", async function () {
      await agent.patch(`todo/${-1}`).send({ state: "COMPLETED" }).expect(404);
    });
  });

  suite("DELETE todo/:id", function () {
    setup(async function () {
      await setCsrfToken(agent);
    });

    test("successfully", async function () {
      const anotherToDo = (await agent.post("todo").send({ ...toDo })).body;
      const allTodosBefore = (await agent.get("todo")).body;

      await agent
        .delete(`todo/${anotherToDo.id}`)
        .expect(200)
        .expect((res) => {
          chai.assert.propertyVal(res.body, "id", anotherToDo.id);
        });

      const allTodosAfter = (await agent.get("todo")).body;

      chai.assert.isBelow(allTodosAfter.length, allTodosBefore.length);
    });

    test("not found", async function () {
      await agent.delete(`todo/${-1}`).expect(404);
    });
  });
});
