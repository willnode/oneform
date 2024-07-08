import { Hono } from "hono";
import { logger } from "hono/logger";
import auth from "./auth";

const app = new Hono();
app.use(logger());

app.route("/api/auth", auth);

app.get("/api/health", async (c) => {
  return c.json({ status: "OK" });
});


export type AppType = typeof app;
export default app;
