import { Hono } from "hono";

export const healthRoutes = new Hono().get("/", (c) =>
  c.json({ status: "ok", service: "kreative-cakes-api", time: new Date().toISOString() }),
);
