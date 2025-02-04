/**
 * ToDoController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

let ToDoModel;
try {
  ToDoModel = ToDo;
} catch {
  ToDoModel = {};
}
const ToDoService = require("../services/ToDoService")(ToDoModel);
const ErrorTypes = require("../services/ErrorTypes");

module.exports = {
  create: async function (req, res) {
    try {
      const { text, state } = req.body;
      const { userId } = req.session;

      if (!text || !state) return res.badRequest("Text and state are required");

      const newToDo = await ToDoService.create(text, state, userId);
      return res.json(newToDo);
    } catch (error) {
      return res.serverError(error);
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
      handleErrors(error, res);
    }
  },

  findAll: async function (req, res) {
    const { userId } = req.session;

    try {
      const allToDos = await ToDoService.findAll(userId);
      return res.json(allToDos);
    } catch (error) {
      handleErrors(error, res);
    }
  },

  findOne: async function (req, res) {
    const { id } = req.params;
    const { userId } = req.session;

    try {
      const toDo = await ToDoService.findById(id, userId);
      return res.json(toDo);
    } catch (error) {
      handleErrors(error, res);
    }
  },

  changeState: async function (req, res) {
    const { id } = req.params;
    const { state } = req.body;
    const { userId } = req.session;

    if (!id) return res.badRequest("Id is required");
    if (!state) return res.badRequest("New state is required");

    try {
      const updatedToDo = await ToDoService.changeState(id, userId, state);
      return res.json(updatedToDo);
    } catch (error) {
      handleErrors(error, res);
    }
  },
};

const handleErrors = (error, res) => {
  switch (error.message) {
    case ErrorTypes.DB_ERROR:
      return res.serverError(error);
    case ErrorTypes.INVALID_INPUT:
      return res.badRequest(error);
    case ErrorTypes.ENTITY_NOT_FOUND:
      return res.notFound(error);
    default:
      return res.serverError(error);
  }
};
