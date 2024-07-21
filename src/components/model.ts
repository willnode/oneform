import { Team, File as FileDB } from "@/db/schema";
import db from "@/lib/db";
import { unflatten } from "flat";
import path from "node:path";
import fsp from "node:fs/promises";
import fs from "node:fs";
import { ulid } from "ulid";
import { extractFormData } from "../components/helper";

export async function handleFormUpload(
  data: FormData,
  formId: string,
  teamId: string,
) {
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
