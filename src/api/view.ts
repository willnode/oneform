import { Hono } from "hono";
import { rError, rOK } from "./helper";
import { unflatten } from "flat";
import { Entry, View, ViewCache } from "@/db/schema";
import db from "@/lib/db";
import { and, eq } from "drizzle-orm";
import { validator } from "hono/validator";
import { ulid } from "ulid";
import { getTeam } from "@/lib/auth";

const view = new Hono()
  .post(
    "/new",
    validator("form", (v) => v),
    async (c) => {
      const values: any = unflatten(Object.fromEntries(await c.req.formData()));
      const id = ulid();
      const team = await getTeam(c.req.raw);
      let r = await db.insert(View).values({
        ...values,
        teamId: team,
        id,
      });
      if (r[0].affectedRows == 0) {
        return rError(c, "Emm no shit");
      }
      return rOK(c, id);
    },
  )
  .post(
    "/edit/:id",
    validator("form", (v) => v),
    async (c) => {
      const values: any = unflatten(Object.fromEntries(await c.req.formData()));
      let id = c.req.param("id");
      delete values.id;
      delete values.teamId;
      let r = await db
        .update(View)
        .set({
          ...values,
        })
        .where(eq(View.id, id));
      if (r[0].affectedRows == 0) {
        return rError(c, "Emm no shit");
      }
      return rOK(c);
    },
  )
  .post(
    "/builder/:id",
    validator("json", (v) => v),
    async (c) => {
      let id = c.req.param("id");
      let r = await db
        .update(View)
        .set({
          schema: await c.req.json(),
        })
        .where(eq(View.id, id));
      if (r[0].affectedRows == 0) {
        return rError(c, "Emm no shit");
      }
      await db
        .delete(ViewCache)
        .where(eq(ViewCache.viewId, id));
      return rOK(c);
    },
  )

export default view;
