import js from "@eslint/js";
import globals from "globals";
import pluginJs from "@eslint/js";
import pluginReact from "eslint-plugin-react";

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    files: ["front-end/src/**/*.{js,mjs,jsx}"],
    ...js.configs.recommended,
  },
  {
    ignores: ["front-end/dist/**/*", "back-end/**/*"],
  },
  { languageOptions: { globals: globals.browser } },
  pluginJs.configs.recommended,
  pluginReact.configs.flat.recommended,
  {
    rules: { "react/react-in-jsx-scope": "off" },
    settings: {
      react: {
        version: "detect",
      },
    },
  },
];
