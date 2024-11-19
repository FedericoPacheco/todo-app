/**
 * ToDo.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    id : {
      type: 'number',
      autoIncrement: true,
      unique: true,
    },
    text: {
      type: 'string',
      required: true,
    },
    state: {
      type: 'string',
      isIn: ['PENDING', 'COMPLETED'],
      required: true,
    }
  },
};

