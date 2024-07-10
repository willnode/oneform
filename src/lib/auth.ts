import type { Context } from "hono";
import * as cookie from "hono/cookie";
import query from "./query";

const authSecret: string = process.env.AUTH_SECRET || "secret";
const authCookieName: string = "uid";

// get session under SSR
export async function getSession(req: Request): Promise<string | null> {
  let c = { req: { raw: req } } as Context;
  return await getApiSession(c);
}

export async function getApiSession(c: Context): Promise<string | null> {
  return (await cookie.getSignedCookie(c, authSecret, authCookieName)) || null;
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

export async function setSession(c: Context, id: string) {
  await cookie.setSignedCookie(c, authCookieName, id, authSecret, {
    expires: new Date(Date.now() + 604800 * 1000),
  });
}

export function resetSession(c: Context) {
  cookie.deleteCookie(c, authCookieName);
}
