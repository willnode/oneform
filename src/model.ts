import { Team, File as FileDB, db, eq } from "astro:db";
import { getSession } from "auth-astro/server";
import { unflatten } from "flat";
import path from "node:path";
import fsp from "node:fs/promises";
import fs from "node:fs";
import { ulid } from "ulid";

export async function getTeam(req: Request) {
    try {
        const session = await getSession(req);
        if (!session?.user?.id) {
            return null;
        }
        let q = await db.select().from(Team).where(eq(Team.userId, session.user.id));
        if (q.length == 0) {
            return null;
        }
        return q[0].id;
    } catch (error) {
        return null;
    }
}

export async function handleFormUpload(request: Request, formId: string, teamId: string) {
    const data = await request.formData();
    const entries = Object.fromEntries(data);
    for (const entry of Object.keys(entries)) {
        let v = entries[entry];
        if (v instanceof File) {
            var dir = '.astro/uploads/';
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir);
            }

            var id = ulid();
            var p = path.join(dir, id);
            const destination = fs.createWriteStream("thumb.png")
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
            })
            entries[entry] = id;
        }
    }
    return unflatten(entries);
}

