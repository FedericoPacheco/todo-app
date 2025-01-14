/**
 * ToDoController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

const isValidState = (state) => state === "PENDING" || state === "COMPLETED";

module.exports = {
  create: async function (req, res) {
    try {
      const { text, state } = req.body;
      const { userId } = req.session;

      if (!text || !state) return res.badRequest("Missing data");

      const newToDo = await ToDo.create({
        text: text,
        state: state,
        owner: userId,
      }).fetch();
      return res.json(newToDo);
    } catch (error) {
      return res.serverError(error);
    }
  },
  update: async function (req, res) {
    try {
      const { id } = req.params;
      const { text, state } = req.body;
      const { userId } = req.session;

      if (!id) return res.badRequest("Id is required");
      if (!text || !state) return res.badRequest("Missing data");

      const updatedToDo = await ToDo.updateOne({ id: id }).set({
        text: text,
        state: state,
        owner: userId,
      });
      if (updatedToDo) return res.json(updatedToDo);
      else return res.notFound();
    } catch (error) {
      return res.serverError(error);
    }
  },
  delete: async function (req, res) {
    try {
      const { id } = req.params;
      if (!id) return res.badRequest("Id is required");
      const deletedToDo = await ToDo.destroyOne({ id: id });
      if (deletedToDo) return res.json(deletedToDo);
      else return res.notFound();
    } catch (error) {
      return res.serverError(error);
    }
  },
  findAll: async function (req, res) {
    try {
      const { userId } = req.session;
      const allToDos = await ToDo.find({ owner: userId });
      return res.json(allToDos);
    } catch (error) {
      return res.serverError(error);
    }
  },
  findOne: async function (req, res) {
    try {
      const { id } = req.params;
      const toDo = await ToDo.findOne({ id: id });
      if (toDo) return res.json(toDo);
      else return res.notFound();
    } catch (error) {
      return res.serverError(error);
    }
  },
  changeState: async function (req, res) {
    try {
      const { id } = req.params;
      const { state } = req.body;

      if (!id) return res.badRequest("Id is required");
      if (!state) return res.badRequest("New state is required");

      if (!isValidState(state)) return res.badRequest("Invalid state");

      const updatedToDo = await ToDo.updateOne({ id: id }).set({
        state: state,
      });

      if (updatedToDo) return res.json(updatedToDo);
      else return res.notFound();
    } catch (error) {
      return res.serverError(error);
    }
  },
};
