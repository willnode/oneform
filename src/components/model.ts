import { File as FileDB, View, ViewCache } from "@/db/schema";
import db from "@/lib/db";
import { unflatten } from "flat";
import path from "node:path";
import fsp from "node:fs/promises";
import fs from "node:fs";
import { ulid } from "ulid";
import { computeEtag, extractFormData } from "../components/helper";
import { getApiSession } from "@/lib/auth";
import type { Context } from "hono";



async function uploadFile(file: File, formId: string | null, teamId: string, authorId: string | null): Promise<string | null> {
  var dir = ".astro/uploads/";
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }
  var id = ulid();
  var p = path.join(dir, id);
  if (file.size > 1024 * 1024 * 1024) {
    return null; // TODO: configurable max size
  }
  const r = await file.stream().getReader().read();
  if (!r.value) {
    return null;
  }
  await fsp.writeFile(p, r.value);
  const etag = await computeEtag(r.value);

  await db.insert(FileDB).values({
    formId,
    authorId,
    path: p,
    teamId,
    size: file.size,
    type: file.type,
    name: file.name,
    id,
    etag,
  });

  return id;
}

export async function handleFormUpload(
  c: Context,
  formId: string | null,
  teamId: string,
) {
  const entries = extractFormData(await c.req.formData());
  const authorId = await getApiSession(c)
  for (const entry of Object.keys(entries)) {
    let v = entries[entry];
    if (v instanceof File) {
      let id = await uploadFile(v, formId, teamId, authorId);
      if (id) {
        entries[entry] = id;
      } else {
        delete entries[entry];
      }
    } else if (Array.isArray(v) && v.some(x => x instanceof File)) {
      let files = [];
      for (const file of v) {
        if (file instanceof File) {
          let id = await uploadFile(file, formId, teamId, authorId);
          if (id) {
            files.push(id);
          }
        }
      }
      if (files.length > 0) {
        entries[entry] = files;
      } else {
        delete entries[entry];
      }
    }
  }
  return unflatten(entries);
}

export async function insertViewCache(content: string, viewId: string, route: string) {
  const etag = await computeEtag(new TextEncoder().encode(content));

  return await db.insert(ViewCache).values({
    id: ulid(),
    content,
    route,
    viewId,
    etag
  });

}