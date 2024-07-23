import { Hono } from "hono";
import { rError, rOK } from "./helper";
import { unflatten } from "flat";
import { Entry, File, Form } from "@/db/schema";
import db from "@/lib/db";
import { eq } from "drizzle-orm";
import { validator } from "hono/validator";
import { ulid } from "ulid";
import query from "../lib/query";
import { getSession, getTeam } from "@/lib/auth";
import { handleFormUpload } from "@/components/model";

const form = new Hono()
  .get(
    "/get",
    async (c) => {
      const team = await getTeam(c.req.raw);
      if (!team) {
        return rError(c, "Unauthenticated");
      }
      const r = await query.getViewComponentListByTeamId(team);
      return rOK(c, r);
    },
  )
  .post(
    "/upload",
    validator("form", (v) => v),
    async (c) => {

      const team = await getTeam(c.req.raw);
      if (!team) {
        return rError(c, "Unauthenticated");
      }
      const values = await handleFormUpload(c, null, team) as any;
      let id = values.file;
      if (typeof id !== 'string') {
        return rError(c, "Emm no shit");
      }
      return rOK(c, id);
    },
  )
  .post(
    "/delete/:id",
    async (c) => {
      let id = c.req.param("id");
      let r = await db
        .delete(File)
        .where(eq(File.id, id));
      if (r[0].affectedRows == 0) {
        return rError(c, "Emm no shit");
      }
      return rOK(c);
    },
  )

export default form;
