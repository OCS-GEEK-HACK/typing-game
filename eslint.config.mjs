import globals from "globals";
import pluginJs from "@eslint/js";
import prettierPlugin from "eslint-plugin-prettier";

export default [
  // JavaScriptファイルの設定
  {
    files: ["**/*.js"],
    languageOptions: {
      sourceType: "commonjs",
      globals: globals.node,
    },
    plugins: {
      prettier: prettierPlugin,
    },
    rules: {
      "prettier/prettier": [
        "error",
        {
          singleQuote: false,
          semi: true,
          tabWidth: 2,
          useTabs: false,
        },
      ],
      "consistent-return": "error",
      eqeqeq: ["error", "always"],
      "no-console": "off",
      "no-unused-vars": ["warn", { args: "none" }],
    },
  },
  // ブラウザ環境の設定
  {
    files: ["**/*.js"],
    languageOptions: {
      globals: globals.browser,
    },
  },
  // ESLintの推奨設定
  {
    files: ["**/*.js"],
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: "module",
    },
    rules: pluginJs.configs.recommended.rules,
  },
  // Prettierとの競合を防ぐ設定
  {
    files: ["**/*.js"],
    rules: prettierPlugin.configs.recommended.rules,
  },
];
