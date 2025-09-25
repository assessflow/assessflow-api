module.exports = {
    root: true,
    parser: "@typescript-eslint/parser",
    parserOptions: {
        project: ["./tsconfig.eslint.json"],
        tsconfigRootDir: __dirname,
        sourceType: "module",
    },
    plugins: ["@typescript-eslint", "prettier"],
    extends: ["eslint:recommended", "plugin:@typescript-eslint/recommended", "plugin:prettier/recommended", "prettier"],
    rules: {
        "@typescript-eslint/no-explicit-any": "off",
    },
    ignorePatterns: ["dist", "node_modules", "openapi.json", "scripts/*"],
};

/* eslint-env node */
module.exports = {
    root: true,
    env: {
        node: true,
        jest: true,
        es2022: true,
    },
    plugins: ["@typescript-eslint", "prettier"],
    extends: ["eslint:recommended", "plugin:@typescript-eslint/recommended", "plugin:prettier/recommended"],
    rules: {
        "prettier/prettier": [
            "error",
            {
                endOfLine: "auto",
                useTabs: false,
                tabWidth: 4,
                printWidth: 200,
            },
        ],
        "@typescript-eslint/explicit-function-return-type": "off",
        "@typescript-eslint/no-misused-promises": "off",
    },
    overrides: [
        {
            files: ["**/*.ts", "**/*.tsx"],
            parser: "@typescript-eslint/parser",
            parserOptions: {
                project: ["./tsconfig.eslint.json"],
                tsconfigRootDir: __dirname,
                sourceType: "module",
            },
        },
    ],
    ignorePatterns: ["dist", "node_modules", ".eslintrc.cjs", "jest.config.ts", "tests/**/*.js"],
};
