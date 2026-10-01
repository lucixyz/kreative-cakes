import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";

export default tseslint.config(
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    languageOptions: { globals: { ...globals.node, ...globals.browser } },
    rules: {
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/consistent-type-imports": ["error", { prefer: "type-imports" }],
      "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_", varsIgnorePattern: "^_" }],
      "max-lines": ["warn", { max: 300, skipBlankLines: true, skipComments: true }],
      eqeqeq: ["error", "always"],
    },
  },
  {
    files: ["**/*.test.ts", "**/*.test.tsx"],
    rules: { "max-lines": "off" },
  },
  {
    files: ["**/*.config.js", "**/*.config.cjs"],
    languageOptions: { sourceType: "commonjs" },
    rules: { "@typescript-eslint/no-require-imports": "off" },
  },
  {
    files: ["**/seed/**"],
    rules: { "max-lines": "off" },
  },
);
