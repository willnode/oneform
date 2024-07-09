import { Hono } from "hono";
import { logger } from "hono/logger";
import auth from "./auth";
import { ZodError } from "zod";
import { rError } from "./helper";

const app = new Hono()
  .use(logger())
  .route("/api/auth", auth)
  .get("/api/health", async (c) => {
    return c.json({ status: "OK" });
  })
  .onError((err, c) => {
    if (err instanceof ZodError) {
      return rError(c, err.errors.map((x) => x.message).join(", "));
    }
    return rError(c, "unknown error");
    //...
  });

export type AppType = typeof app;
export default app;
