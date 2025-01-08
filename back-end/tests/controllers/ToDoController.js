const chai = require("chai");
const sinon = require("sinon");
const {
  test,
  suite,
  setup,
  teardown,
  suiteSetup,
  suiteTeardown,
} = require("mocha");
const ToDo = require("../../api/models/ToDo");
const supertest = require("supertest");
const app = require("../../app");

suite("ToDoController", function () {
  setup(function () {
    sinon.stub(ToDo, "create");
    sinon.stub(ToDo, "updateOne");
    sinon.stub(ToDo, "destroyOne");
    sinon.stub(ToDo, "find");
    sinon.stub(ToDo, "findOne");
  });

  suiteTeardown(function () {
    sinon.restore();
  });

  suite("create", function () {
    const toDo = {
      id: 1,
      text: "Test ToDo",
      state: "PENDING",
      owner: 1,
    };

    test("Successfully", async function () {
      ToDo.create.returns({
        fetch: sinon.stub.resolves(toDo),
      });

      await supertest(app)
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

    test("No body", async function () {
      await supertest(app).post("/todo").send({}).expect(500);
    });

    test("DB error", async function () {
      ToDo.create.returns({
        fetch: sinon.stub.rejects(new Error("Test error")),
      });

      await supertest(app).post("/todo").send(toDo).expect(500);
    });

    suiteTeardown(function () {
      sinon.restore();
    });
  });

  suite("delete", function () {
    test("Successfully", async function () {});

    test("No params", async function () {});

    test("DB error", async function () {});
  });

  suite("findAll", function () {
    test("Successfully", async function () {});

    test("DB error", async function () {});
  });

  suite("findOne", function () {
    test("Successfully", async function () {});

    test("No params", async function () {});

    test("DB error", async function () {});
  });

  suite("changeState", function () {
    test("Successfully", async function () {});

    test("No params", async function () {});

    test("DB error", async function () {});
  });
});
