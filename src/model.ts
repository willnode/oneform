import { Team, db, eq } from "astro:db";
import { getSession } from "auth-astro/server";

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
