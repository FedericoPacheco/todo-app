import globals from "globals";
import pluginJs from "@eslint/js";
import pluginReact from "eslint-plugin-react";

// https://github.com/eslint/eslint/discussions/18452
// https://github.com/lint-staged/lint-staged#how-to-use-lint-staged-in-a-multi-package-monorepo
/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    files: ["src/**/*.{js,mjs,jsx}"],
    ignores: ["dist/**"],
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
