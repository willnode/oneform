import { Hono } from "hono";
import { logger } from "hono/logger";
import auth from "./auth";
import { ZodError } from "zod";
import { rError, rOK } from "./helper";
import form from "./form";
import view from "./view";
import file from "./file";
import viewComponent from "./view-component";

const app = new Hono()
  .use(logger())
  .route("/api/auth", auth)
  .route("/api/form", form)
  .route("/api/view", view)
  .route("/api/file", file)
  .route("/api/view-component", viewComponent)
  .get("/api/health", async (c) => {
    return rOK(c);
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
