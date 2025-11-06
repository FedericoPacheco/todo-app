export const shorthands = undefined;

export const up = (pgm) => {
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

export const down = (pgm) => {
  pgm.dropTable("user", { ifExists: true });
};
