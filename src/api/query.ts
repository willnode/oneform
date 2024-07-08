import { db, User, and, UserAuth, eq } from "astro:db";

export async function getUserByEmail(email: string) {
  let qa = await db.select().from(User).where(eq(User.email, email)).limit(1);
  if (qa.length > 0) {
    return qa[0];
  }
  return null;
}

export async function getUserAuthByType(userId: string, type: string) {
  let qa = await db
    .select()
    .from(UserAuth)
    .where(and(eq(UserAuth.type, "email"), eq(UserAuth.userId, userId)))
    .limit(1);
  if (qa.length > 0) {
    return qa[0];
  }
  return null;
}
