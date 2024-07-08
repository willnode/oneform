import { Hono } from "hono";
import { logger } from "hono/logger";

const app = new Hono();
app.use(logger());

const routes = app.get("/api/health", async (c) => {
  return c.json({ status: "OK" });
});

export type AppType = typeof routes;
export default app;
