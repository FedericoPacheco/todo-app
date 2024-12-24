import globals from "globals";
import pluginJs from "@eslint/js";

/** @type {import('eslint').Linter.Config[]} */
export default [
  { files: ["**/*.js"], languageOptions: { sourceType: "commonjs" } },
  //{languageOptions: { globals: globals.browser }},
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
