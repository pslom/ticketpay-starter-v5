/* eslint-env node */
module.exports = {
  root: true,
  extends: ["next/core-web-vitals", "plugin:@typescript-eslint/recommended"],
  ignorePatterns: ["node_modules/", ".next/", "dist/", ".vercel/", "coverage/", "public/"],
  overrides: [
    // Allow require() in Node scripts
    {
      files: ["scripts/**/*.js", "*.js", "check-env.js", "test-db.js"],
      env: { node: true },
      rules: {
        "@typescript-eslint/no-require-imports": "off",
        "@typescript-eslint/no-var-requires": "off",
      },
    },
    // Loosen rules for .d.ts
    {
      files: ["**/*.d.ts"],
      rules: {
        "@typescript-eslint/no-explicit-any": "off",
        "@typescript-eslint/no-empty-object-type": "off",
        "@typescript-eslint/no-unsafe-function-type": "off",
      },
    },
    // Ignore leading-underscore unused vars
    {
      files: ["**/*.{ts,tsx,js,jsx}"],
      rules: {
        "@typescript-eslint/no-unused-vars": [
          "warn",
          { argsIgnorePattern: "^_", varsIgnorePattern: "^_", caughtErrorsIgnorePattern: "^_" },
        ],
      },
    },
  ],
};