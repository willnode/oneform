import { Hono } from "hono";

const auth = new Hono();

auth.post("/login", (c) => {
  return c.json({ status: "ok" });
});

auth.post("/register", (c) => {
  return c.json({ status: "ok" });
});

export default auth;
