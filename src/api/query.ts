import { db, User, and, UserAuth, eq, Team, Form, Entry } from "astro:db";

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

export async function getTeamByUser(userId: string) {
  let qa = await db.select().from(Team).where(eq(Team.userId, userId)).limit(1);
  if (qa.length > 0) {
    return qa[0];
  }
  return null;
}

export async function getFormById(formId: string) {
  let qa = await db
    .select()
    .from(Form)
    .where(and(eq(Form.id, formId)))
    .limit(1);
  if (qa.length > 0) {
    return qa[0];
  }
  return null;
}

export async function getFormListByTeamId(teamId: string) {
  return await db
    .select()
    .from(Form)
    .where(and(eq(Form.teamId, teamId)));
}

export async function getEntryById(entryId: string) {
  let qa = await db.select().from(Entry).where(eq(Entry.id, entryId)).limit(1);
  if (qa.length > 0) {
    return qa[0];
  }
  return null;
}
