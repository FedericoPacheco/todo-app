const ErrorTypes = require("../constants/ErrorTypes");

/*
Rationale:
  Holds the business logic for the ToDo model to achieve better separation of concerns and testability.
  Note that in this case said business logic is fairly trivial, as it only involves CRUD operations and 
  some validations.

Implementation details: 
  * Receives the model as a parameter so that it can be mocked in the tests. Otherwise it will just
    hold a reference to the actual model.
  * Functions from the same service must be called with `this` so that the can be mocked.  
  * Exports can be placed on top as functions are hoisted.

Other references (Service in MVC pattern): 
  * https://softwareengineering.stackexchange.com/a/230312
  * https://stackoverflow.com/a/2763071/27971560
  * https://www.coreycleary.me/why-should-you-separate-controllers-from-services-in-node-rest-apis
*/

module.exports = (ToDo) => {
  return {
    create,
    deleteById,
    findAll,
    findById,
    update,
    isValidToDoState,
  };

  async function create(text, state, userId) {
    try {
      return await ToDo.create({ text, state, owner: userId }).fetch();
    } catch {
      throw new Error(ErrorTypes.DB_ERROR);
    }
  }

  async function deleteById(id, userId) {
    const foundToDo = await this.findById(id, userId);
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

    if (!foundToDo) {
      throw new Error(ErrorTypes.ENTITY_NOT_FOUND);
    }

    if (foundToDo.owner !== userId) {
      throw new Error(ErrorTypes.INVALID_INPUT);
    }
    return foundToDo;
  }

  async function update(id, userId, attributes) {
    const foundToDo = await this.findById(id, userId);
    if (!this.isValidToDoState(attributes.state)) {
      throw new Error(ErrorTypes.INVALID_INPUT);
    }
    try {
      return await ToDo.updateOne({ id: foundToDo.id }).set({
        state: attributes.state,
      });
    } catch {
      throw new Error(ErrorTypes.DB_ERROR);
    }
  }

  function isValidToDoState(state) {
    return state === "PENDING" || state === "COMPLETED";
  }
};
