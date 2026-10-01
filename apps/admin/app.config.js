// The admin app is served under /admin in production (shared domain, separate bundle).
// Expo Router only applies baseUrl to production builds; set ADMIN_BASE_URL=none to build without
// it (used by the browser E2E, which serves each app on its own origin).
module.exports = ({ config }) => ({
  ...config,
  experiments: {
    ...config.experiments,
    ...(process.env.ADMIN_BASE_URL === "none" ? {} : { baseUrl: process.env.ADMIN_BASE_URL ?? "/admin" }),
  },
});
