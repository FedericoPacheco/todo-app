const ErrorTypes = require("./ErrorTypes");

// const ToDo =
//   process.env.NODE_ENV === "test"
//     ? {
//         create: () => {},
//         update: () => {},
//         destroyOne: () => {},
//         find: () => {},
//         findOne: () => {},
//       }
//     : // eslint-disable-next-line no-undef
//       sails.models.ToDo;

module.exports = (ToDo) => {
  return {
    create,
    update,
    deleteById,
    findAll,
    findById,
    changeState,
    isValidToDoState,
  };

  async function create(text, state, userId) {
    try {
      return await ToDo.create({ text, state, owner: userId }).fetch();
    } catch {
      throw new Error(ErrorTypes.DB_ERROR);
    }
  }

  async function update(id, text, state, userId) {
    const toDoToUpdate = await findById(id, userId);
    if (toDoToUpdate) {
      if (isValidToDoState(state))
        try {
          await ToDo.updateOne({ id }).set({ text, state, owner: userId });
        } catch {
          return new Error(ErrorTypes.DB_ERROR);
        }
      else throw new Error(ErrorTypes.INVALID_INPUT);
    }
  }

  async function deleteById(id, userId) {
    debugger;
    const foundToDo = await findById(id, userId);
    try {
      return await ToDo.destroyOne({ id: foundToDo.id });
    } catch {
      throw new Error(ErrorTypes.DB_ERROR);
    }
  }

  async function findAll(userId) {
    try {
      return await ToDo.find({ owner: userId });
    } catch {
      throw new Error(ErrorTypes.DB_ERROR);
    }
  }

  async function findById(id, userId) {
    let foundToDo;
    try {
      foundToDo = await ToDo.findOne({ id });
    } catch {
      throw new Error(ErrorTypes.DB_ERROR);
    }

    if (foundToDo?.owner !== userId) {
      throw new Error(ErrorTypes.INVALID_INPUT);
    }
    return foundToDo;
  }

  async function changeState(id, userId, state) {
    const foundToDo = await findById(id, userId);
    if (!isValidToDoState(state)) {
      throw new Error(ErrorTypes.INVALID_INPUT);
    }
    try {
      return await ToDo.updateOne({ id: foundToDo.id }).set({ state });
    } catch {
      throw new Error(ErrorTypes.DB_ERROR);
    }
  }

  function isValidToDoState(state) {
    return state === "PENDING" || state === "COMPLETED";
  }
};
