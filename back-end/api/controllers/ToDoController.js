/**
 * ToDoController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  create: async function (req, res) {
    try {
      const { text, state } = req.body;
      const { userId } = req.session;
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
      const updatedToDo = await ToDo.updateOne({ id: id }).set({
        text: text,
        state: state,
        owner: userId,
      });
      return res.json(updatedToDo);
    } catch (error) {
      return res.serverError(error);
    }
  },
  delete: async function (req, res) {
    try {
      const { id } = req.params;
      const deletedToDo = await ToDo.destroyOne({ id: id });
      return res.json(deletedToDo);
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
      return res.json(toDo);
    } catch (error) {
      return res.serverError(error);
    }
  },
  changeState: async function (req, res) {
    try {
      const { id } = req.params;
      const { state } = req.body;
      const updatedToDo = await ToDo.updateOne({ id: id }).set({
        state: state,
      });
      return res.json(updatedToDo);
    } catch (error) {
      return res.serverError(error);
    }
  },
};
