import { Hono } from "hono";
import { rOK } from "./helper";

const form = new Hono()
  .post("/new", async (c) => {
    return rOK(c, await c.req.json());
  })
  .post("/edit", async (c) => {
    return rOK(c, await c.req.json());
  })
  .post("/view", async (c) => {
    return rOK(c, await c.req.json());
  });

export default form;
