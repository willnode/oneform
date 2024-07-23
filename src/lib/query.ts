import { User, UserAuth, Team, Form, Entry, View, ViewComponent, File } from "@/db/schema";
import db from "@/lib/db";
import { and, eq } from "drizzle-orm";

const query = {
  async getUserByEmail(email: string) {
    let qa = await db.select().from(User).where(eq(User.email, email)).limit(1);
    if (qa.length > 0) {
      return qa[0];
    }
    return null;
  },
  async getUserAuthByType(userId: string, type: string) {
    let qa = await db
      .select()
      .from(UserAuth)
      .where(and(eq(UserAuth.type, "email"), eq(UserAuth.userId, userId)))
      .limit(1);
    if (qa.length > 0) {
      return qa[0];
    }
    return null;
  },
  async getTeamByUser(userId: string) {
    let qa = await db
      .select()
      .from(Team)
      .where(eq(Team.userId, userId))
      .limit(1);
    if (qa.length > 0) {
      return qa[0];
    }
    return null;
  },
  async getFormById(formId: string) {
    let qa = await db
      .select()
      .from(Form)
      .where(and(eq(Form.id, formId)))
      .limit(1);
    if (qa.length > 0) {
      return qa[0];
    }
    return null;
  },
  async getFormListByTeamId(teamId: string) {
    return await db
      .select()
      .from(Form)
      .where(and(eq(Form.teamId, teamId)));
  },
  async getViewListByTeamId(teamId: string) {
    return await db
      .select()
      .from(View)
      .where(and(eq(View.teamId, teamId)));
  },
  async getViewComponentListByTeamId(teamId: string) {
    return await db
      .select()
      .from(ViewComponent)
      .where(and(eq(ViewComponent.teamId, teamId)));
  },
  async getFileListByTeamId(teamId: string) {
    return await db
      .select()
      .from(File)
      .where(and(eq(File.teamId, teamId)));
  },
  async getFileById(id: string) {
    let qa = await db
      .select()
      .from(File)
      .where(and(eq(File.id, id)));
    if (qa.length > 0) {
      return qa[0];
    }
    return null;
  },
  async getViewById(viewId: string) {
    let qa = await db
      .select()
      .from(View)
      .where(and(eq(View.id, viewId)))
      .limit(1);
    if (qa.length > 0) {
      return qa[0];
    }
    return null;
  },
  async getViewComponentById(viewComponentId: string) {
    let qa = await db
      .select()
      .from(ViewComponent)
      .where(and(eq(ViewComponent.id, viewComponentId)))
      .limit(1);
    if (qa.length > 0) {
      return qa[0];
    }
    return null;
  },
  async getEntryById(entryId: string) {
    let qa = await db
      .select()
      .from(Entry)
      .where(eq(Entry.id, entryId))
      .limit(1);
    if (qa.length > 0) {
      return qa[0];
    }
    return null;
  },
  async getEntryListByFormId(formId: string) {
    return await db
      .select()
      .from(Entry)
      .where(eq(Entry.formId, formId));
  },
  async getViewByRoute(route: string) {
    let qa = await db
      .select()
      .from(View)
      .where(eq(View.route, route))
      .limit(1);

    if (qa.length > 0) {
      return qa[0];
    }
    return null;
  },
};

export default query;
