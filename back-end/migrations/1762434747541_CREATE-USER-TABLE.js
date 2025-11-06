module.exports.shorthands = undefined;

module.exports.up = (pgm) => {
  pgm.createTable(
    "user",
    {
      id: { type: "serial", notNull: true, primaryKey: true },
      user: { type: "text", notNull: true, unique: true },
      pass: { type: "text", notNull: true },
      createdAt: {
        type: "bigint",
        notNull: true,
      },
      updatedAt: {
        type: "bigint",
        notNull: true,
      },
    },
    { ifNotExists: true },
  );
};

module.exports.down = (pgm) => {
  pgm.dropTable("user", { ifExists: true });
};
