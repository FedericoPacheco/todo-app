import js from "@eslint/js";
import globals from "globals";
import pluginJs from "@eslint/js";
import pluginReact from "eslint-plugin-react";

// The commands listed in ./package.json work by themselves but not when commiting changes for some reason. I haven't managed to fix it.
// I don't know if it's some sort of bug or is related to the monorepo structure. To enable de commit checking, see the ./.husky/pre-commit file

// https://github.com/eslint/eslint/discussions/18452
// https://github.com/lint-staged/lint-staged#how-to-use-lint-staged-in-a-multi-package-monorepo
// https://medium.com/full-stack-architecture/knowing-your-workflow-tools-streamlining-json-linting-with-eslint-flat-config-and-vs-code-65f7173e9cc8
// https://github.com/eslint/eslint/issues/16701
// https://github.com/eslint/eslint/issues/17400
// https://github.com/eslint/eslint/discussions/18958

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
