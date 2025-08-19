import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";
import js from "@eslint/js";
import ts from "typescript-eslint";
import nextPlugin from "eslint-plugin-next";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  // Ignore generated and non-source files
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "dist/**",
      ".vercel/**",
      "coverage/**",
      "public/**",
      "scripts/**",
      "check-env.js",
      "test-db.js",
    ],
  },

  // JS rules (base)
  js.configs.recommended,

  // TypeScript rules
  ...ts.configs.recommended,

  // Next.js Core Web Vitals
  {
    plugins: { "@next/next": nextPlugin },
    rules: {
      ...nextPlugin.configs["core-web-vitals"].rules,
    },
  },

  // d.ts files can use 'any'
  {
    files: ["**/*.d.ts"],
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-empty-object-type": "off",
      "@typescript-eslint/no-unsafe-function-type": "off",
    },
  },

  // Relax unused-var warnings for leading underscore
  {
    files: ["**/*.{ts,tsx,js,jsx}"],
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_", caughtErrorsIgnorePattern: "^_" },
      ],
    },
  },
];

export default eslintConfig;
