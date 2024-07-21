import { Hono } from "hono";
import { logger } from "hono/logger";
import auth from "./auth";
import { ZodError } from "zod";
import { rError } from "./helper";
import form from "./form";
import view from "./view";

const app = new Hono()
  .use(logger())
  .route("/api/auth", auth)
  .route("/api/form", form)
  .route("/api/view", view)
  .get("/api/health", async (c) => {
    return c.json({ status: "OK" });
  })
  .onError((err, c) => {
    if (err instanceof ZodError) {
      return rError(c, err.errors.map((x) => x.message).join(", "));
    }
    console.error(err);
    return rError(c, "unknown error");
    //...
  });

export type AppType = typeof app;
export default app;
