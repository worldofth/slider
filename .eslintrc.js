module.exports = {
    extends: ["eslint:recommended", "plugin:prettier/recommended"],
    parser: "@babel/eslint-parser",
    parserOptions: {
        ecmaVersion: 10,
        sourceType: "module",
    },
    env: {
        browser: true,
        es6: true,
        node: true,
    },
    rules: {
        indent: ["error", 4, { SwitchCase: 1 }],
    },
    globals: {
        loadjs: "readonly",
    },
};
