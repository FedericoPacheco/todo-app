module.exports = {
  attributes: {
    id: {
      type: "number",
      autoIncrement: true,
      unique: true,
    },
    text: {
      type: "string",
      required: true,
    },
    state: {
      type: "string",
      isIn: ["PENDING", "COMPLETED"],
      required: true,
    },
    owner: {
      model: "user",
    },
  },
  sayHi: function () {
    console.log("Hi there! I'm a ToDo model.");
  },
};
