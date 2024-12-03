/**
 * User.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
  attributes: {
    id: {
      type: 'number',
      autoIncrement: true,
      unique: true,
    },
    user: {  
        type: 'string', 
        required: true,
        unique: true, 
      },
    pass: { 
      type: 'string', 
      required: true 
    },
  },
};

