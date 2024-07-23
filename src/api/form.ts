import { Hono } from "hono";
import { rError, rOK } from "./helper";
import { unflatten } from "flat";
import { Entry, Form } from "@/db/schema";
import db from "@/lib/db";
import { eq } from "drizzle-orm";
import { validator } from "hono/validator";
import { ulid } from "ulid";
import query from "../lib/query";
import { getSession, getTeam } from "@/lib/auth";
import { handleFormUpload } from "@/components/model";

const form = new Hono()
  .post(
    "/new",
    validator("form", (v) => v),
    async (c) => {
      const values: any = unflatten(Object.fromEntries(await c.req.formData()));
      const id = ulid();
      const team = await getTeam(c.req.raw);
      let r = await db.insert(Form).values({
        ...values,
        config: {},
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
        .update(Form)
        .set({
          ...values,
        })
        .where(eq(Form.id, id));
      if (r[0].affectedRows == 0) {
        return rError(c, "Emm no shit");
      }
      return rOK(c);
    },
  )
  .post(
    "/view/:id",
    validator("form", (v) => v),
    async (c) => {
      let formId = c.req.param("id");

      const form = await query.getFormById(formId);
      if (!form) {
        return rError(c, "not found");
      }

      const data: any = await handleFormUpload(c, formId, form.teamId);
      const id = ulid();
      await db.insert(Entry).values({
        formId,
        data,
        id,
      });

      return rOK(c);
    },
  );

export default form;
