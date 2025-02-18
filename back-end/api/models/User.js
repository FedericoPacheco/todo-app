module.exports = {
  attributes: {
    id: {
      type: "number",
      autoIncrement: true,
      unique: true,
    },
    user: {
      type: "string",
      required: true,
      unique: true,
    },
    pass: {
      type: "string",
      required: true,
    },
  },
};
