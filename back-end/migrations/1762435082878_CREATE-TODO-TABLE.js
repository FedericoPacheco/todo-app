module.exports.shorthands = undefined;

module.exports.up = (pgm) => {
  pgm.createTable(
    "todo",
    {
      id: { type: "serial", notNull: true, primaryKey: true },
      text: { type: "text" },
      state: { type: "text", check: "state IN ('PENDING', 'COMPLETED')" },
      owner: {
        type: "integer",
        references: '"user"(id)',
        onDelete: "CASCADE",
        onUpdate: "NO ACTION",
      },
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
  pgm.dropTable("todo", { ifExists: true });
};
