/**
 * ToDoController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

/* 
    While performing unit tests, the model (global variable) doesn't exist.
    An empty object is used as placeholder, but fakes, stubs or mocks 
    are needed. These can be injected through proxyquire. 
    Note: a helper function can't be extracted since passing an undefined 
    model raises a ReferenceError before calling the helper.
  */
const ToDoModel = typeof ToDo !== "undefined" ? ToDo : {};
const ToDoService = require("../services/ToDoService")(ToDoModel);

const { mapErrorToRes } = require("./errorUtils");

module.exports = {
  create: async function (req, res) {
    try {
      const { text, state } = req.body;
      const { userId } = req.session;

      if (!text || !state) return res.badRequest("Text and state are required");

      const newToDo = await ToDoService.create(text, state, userId);
      return res.json(newToDo);
    } catch (error) {
      mapErrorToRes(error, res);
    }
  },

  delete: async function (req, res) {
    const { id } = req.params;
    const { userId } = req.session;

    if (!id) return res.badRequest("Id is required");

    try {
      const deletedToDo = await ToDoService.deleteById(id, userId);
      return res.json(deletedToDo);
    } catch (error) {
      mapErrorToRes(error, res);
    }
  },

  findAll: async function (req, res) {
    const { userId } = req.session;

    try {
      const allToDos = await ToDoService.findAll(userId);
      return res.json(allToDos);
    } catch (error) {
      mapErrorToRes(error, res);
    }
  },

  findOne: async function (req, res) {
    const { id } = req.params;
    const { userId } = req.session;

    try {
      const toDo = await ToDoService.findById(id, userId);
      return res.json(toDo);
    } catch (error) {
      mapErrorToRes(error, res);
    }
  },

  update: async function (req, res) {
    const { id } = req.params;
    const { state } = req.body;
    const { userId } = req.session;

    if (!id) return res.badRequest("Id is required");
    if (!state) return res.badRequest("New state is required");

    try {
      const updatedToDo = await ToDoService.update(id, userId, state);
      return res.json(updatedToDo);
    } catch (error) {
      mapErrorToRes(error, res);
    }
  },
};
