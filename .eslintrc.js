module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
    jest: true,
  },
  globals: {
    page: true,
    browser: true,
    context: true,
    jestPuppeteer: true,
  },
  extends: ["airbnb-base", "plugin:prettier/recommended"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 12,
    sourceType: "module",
  },
  plugins: ["@typescript-eslint", "eslint-plugin-tsdoc"],
  rules: {
    "tsdoc/syntax": 2,
    // "require-jsdoc": 1,
    "@typescript-eslint/explicit-member-accessibility": 1,
    "no-console": [0],
    "eol-last": 0,
    "no-use-before-define": [0],
    "@typescript-eslint/no-use-before-define": [1],
    "no-shadow": [0],
    "no-multi-assign": [0],
    "import/extensions": [0],
    "import/prefer-default-export": [0],
    "max-classes-per-file": [0],
    "no-unused-vars": [0],
    "no-unused-expressions": [0],
    "import/no-extraneous-dependencies": [0],
    "no-restricted-imports": [
      "error",
      {
        name: "three",
        message: "Please import THREE from './src/three.ts'",
      },
    ],
    "max-len": [
      "error",
      {
        code: 155,
      },
    ],
    "prettier/prettier": [
      "error",
      {
        printWidth: 155,
      },
    ],
  },
  settings: {
    "import/resolver": {
      node: {
        extensions: [".js", ".jsx", ".ts", ".tsx", ".d.ts"],
      },
    },
  },
};
