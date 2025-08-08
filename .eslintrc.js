module.exports = {
    extends: ["eslint:recommended", "prettier"],
    parser: "@babel/eslint-parser",
    parserOptions: {
        ecmaVersion: "latest",
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
};
