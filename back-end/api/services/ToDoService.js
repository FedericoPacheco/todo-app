const ErrorTypes = require("./ErrorTypes");

module.exports = {
  create: async function (text, state, userId) {
    try {
      return await ToDo.create({ text, state, owner: userId }).fetch();
    } catch {
      throw new Error(ErrorTypes.DB_ERROR);
    }
  },

  update: async function (id, text, state, userId) {
    const toDoToUpdate = await this.findById(id, userId);
    if (toDoToUpdate) {
      if (this.isValidToDoState(state))
        try {
          await ToDo.updateOne({ id }).set({ text, state, owner: userId });
        } catch {
          return new Error(ErrorTypes.DB_ERROR);
        }
      else throw new Error(ErrorTypes.INVALID_INPUT);
    }
  },

  delete: async function (id, userId) {
    const foundToDo = await this.findById(id, userId);
    try {
      return await ToDo.destroyOne({ id: foundToDo.id });
    } catch {
      throw new Error(ErrorTypes.DB_ERROR);
    }
  },

  findAll: async function (userId) {
    try {
      return await ToDo.find({ owner: userId });
    } catch {
      throw new Error(ErrorTypes.DB_ERROR);
    }
  },

  findById: async function (id, userId) {
    let foundToDo;
    try {
      foundToDo = await ToDo.findOne({ id });
    } catch {
      throw new Error(ErrorTypes.DB_ERROR);
    }

    if (foundToDo?.userId !== userId) {
      throw new Error(ErrorTypes.INVALID_INPUT);
    }
    return foundToDo;
  },

  changeState: async function (id, state) {
    if (!this.isValidState(state)) {
      throw new Error(ErrorTypes.INVALID_INPUT);
    }
    try {
      return await ToDo.updateOne({ id }).set({ state });
    } catch {
      throw new Error(ErrorTypes.DB_ERROR);
    }
  },

  isValidToDoState: function (state) {
    state === "PENDING" || state === "COMPLETED";
  },
};
