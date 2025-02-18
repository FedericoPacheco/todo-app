import js from "@eslint/js";
import globals from "globals";
import pluginJs from "@eslint/js";

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    files: ["back-end/**/*.js"],
    ...js.configs.recommended,
  },
  {
    ignores: ["back-end/test/reports/**/*", "front-end/**/*"],
  },
  { languageOptions: { sourceType: "module" } },
  // { languageOptions: { sourceType: "commonjs" } },
  // { languageOptions: { globals: globals.browser } },
  {
    languageOptions: {
      globals: {
        ...globals.node,
        User: "readonly",
        ToDo: "readonly",
        process: "readonly",
      },
    },
  },
  pluginJs.configs.recommended,
];
