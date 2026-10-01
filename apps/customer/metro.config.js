// Expo SDK 52+ auto-detects pnpm/yarn workspaces: it sets `watchFolders` to the monorepo root
// and `resolver.nodeModulesPaths` to the workspace node_modules. No manual overrides needed.
// Workspace packages ship TypeScript source (package.json "main": "./src/index.ts"), which Metro
// transpiles because they live under watchFolders. Requires `node-linker=hoisted` in .npmrc.
const { getDefaultConfig } = require("expo/metro-config");

module.exports = getDefaultConfig(__dirname);
