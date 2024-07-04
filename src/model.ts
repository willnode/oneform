import { Team, File as FileDB, db, eq } from "astro:db";
import { unflatten } from "flat";
import path from "node:path";
import fsp from "node:fs/promises";
import fs from "node:fs";
import { ulid } from "ulid";
import jwt from "jsonwebtoken";
import { extractFormData } from "./helper";

function getSession(req: Request): any | null {
  let token = Object.fromEntries(req.headers)
    .cookie?.split(";")
    .find((x) => x.trim().startsWith("jwt="));
  if (token) {
    token = token.split("=", 2)[1].trimEnd();
    let j = jwt.verify(token, "secret");
    if (j) {
      return j;
    }
  }
  return null;
}
export async function getTeam(req: Request) {
  try {
    const session = getSession(req);
    if (!session?.user) {
      return null;
    }
    let q = await db.select().from(Team).where(eq(Team.userId, session.user));
    if (q.length == 0) {
      return null;
    }
    return q[0].id;
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
      var dir = '.astro/uploads/';
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
