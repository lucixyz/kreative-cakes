import base from "@cakeshop/config/eslint";

export default [
  { ignores: ["**/node_modules/**", "**/dist/**", "**/.expo/**", "**/.turbo/**", "**/coverage/**"] },
  ...base,
];
