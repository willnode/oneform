import { Hono, type Context } from "hono";
import { z, ZodError } from "zod";
import { Team, User, UserAuth, and, db, eq } from "astro:db";
import * as query from "./query";
import { rError, rOK } from "./helper";
import * as cookie from "hono/cookie";
import { ulid } from "ulid";
import bcrypt from "bcryptjs";

const authSecret: string = process.env.AUTH_SECRET || "secret";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

const registerSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string(),
});

const auth = new Hono()
.get("/id")
  .post("/login", async (c) => {
    let body = loginSchema.parse(await c.req.json());
    let u = await query.getUserByEmail(body.email);
    if (!u) {
      return rError(c, "Login failed, try again");
    }
    let ua = await query.getUserAuthByType(u.id, "email");
    if (!ua) {
      return rError(c, "Login failed, try again");
    }
    if (!(await bcrypt.compare(body.password, ua.identifier))) {
      return rError(c, "Login failed, try again");
    }
    await cookie.setSignedCookie(c, "uid", u.id, authSecret, {
      expires: new Date(Date.now() + 604800),
    });
    return rOK(c);
  })
  .post("/register", async (c) => {
    let body = registerSchema.parse(await c.req.json());
    const uid = ulid();
    await db.insert(User).values({
      id: uid,
      name: body.name,
      email: body.email,
    });
    const salt = await bcrypt.genSalt(10);
    const identifier = await bcrypt.hash(body.password, salt);
    await db.insert(UserAuth).values({
      id: ulid(),
      identifier,
      type: "email",
      userId: uid,
    });
    await db.insert(Team).values({
      id: ulid(),
      userId: uid,
    });
    return rOK(c);
  })
  .post("/logout", async (c) => {
    cookie.deleteCookie(c, "uid");
    return rOK(c);
  })
  .onError((err, c) => {
    if (err instanceof ZodError) {
      // Get the custom response
      return rError(c, err.errors.map((x) => x.message).join(", "));
    }
    return rError(c, "unknown error");
    //...
  });

export default auth;
