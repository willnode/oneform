import { Team, File as FileDB, db, eq } from "astro:db";
import { unflatten } from "flat";
import path from "node:path";
import fsp from "node:fs/promises";
import fs from "node:fs";
import { ulid } from "ulid";
import { getSignedCookie } from "hono/cookie";
import { extractFormData } from "../components/helper";
import type { Context } from "hono";
import * as query from "@/api/query";

const authSecret: string = process.env.AUTH_SECRET || "secret";

async function getSession(req: Request): Promise<string | null> {
  let c = { req: { raw: req } } as Context;
  return (await getSignedCookie(c, authSecret, "uid")) || null;
}
export async function getTeam(req: Request) {
  try {
    const session = await getSession(req);
    if (!session) {
      return null;
    }
    let q = await query.getTeamByUser(session);
    return q?.id || null;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function handleFormUpload(
  request: Request,
  formId: string,
  teamId: string,
) {
  const data = await request.formData();
  const entries = extractFormData(data);
  for (const entry of Object.keys(entries)) {
    let v = entries[entry];
    if (v instanceof File) {
      var dir = ".astro/uploads/";
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
      }

      var id = ulid();
      var p = path.join(dir, id);
      const r = await v.stream().getReader().read();
      if (!r.value) {
        continue;
      }
      await fsp.writeFile(p, Buffer.from(r.value));

      await db.insert(FileDB).values({
        formId,
        path: p,
        size: v.size,
        teamId,
        type: v.type,
        name: v.name,
        id,
      });
      entries[entry] = id;
    }
  }
  return unflatten(entries);
}
