import { mysqlTable, varchar, text, timestamp, uniqueIndex, int, json } from "drizzle-orm/mysql-core";

export const User = mysqlTable("user", {
  id: varchar("id", { length: 26 }).primaryKey(),
  email: varchar("email", { length: 45 }).notNull().unique(),
  name: text("name").notNull(),
  created: timestamp("created", {
    mode: 'string'
  }).defaultNow(),
  modified: timestamp("modified", {
    mode: 'string'
  }).defaultNow(),
});

export const UserAuth = mysqlTable("user_auth", {
  id: varchar("id", { length: 26 }).primaryKey(),
  userId: varchar("user_id", { length: 26 }).references(() => User.id).notNull(),
  type: varchar("type", { length: 255 }).notNull(),
  identifier: varchar("identifier", { length: 256 }).notNull(),
},
  (table) => {
    return {
      identiferIdx: uniqueIndex("type_indefier_idx").on(
        table.type,
        table.identifier
      ),
      userTypeIdx: uniqueIndex("user_type_idx").on(table.userId, table.type),
    };
  });

export const Team = mysqlTable("team", {
  id: varchar("id", { length: 26 }).primaryKey(),
  userId: varchar("user_id", { length: 26 }).references(() => User.id).unique(),
  storageSize: int("storage_size").default(0),
});

export const Form = mysqlTable("form", {
  id: varchar("id", { length: 26 }).primaryKey(),
  teamId: varchar("team_id", { length: 26 }).references(() => Team.id).notNull(),
  title: text("title").notNull(),
  schema: json("schema"),
  config: json("config"),
  privilenge: text("privilenge").notNull(),
  created: timestamp("created").defaultNow(),
  modified: timestamp("modified").defaultNow(),
});

export const View = mysqlTable("view", {
  id: varchar("id", { length: 26 }).primaryKey(),
  teamId: varchar("team_id", { length: 26 }).references(() => Team.id).notNull(),
  route: varchar("route", { length: 256 }).notNull().unique(),
  title: text("title").notNull(),
  schema: json("schema"),
  config: json("config"),
  privilenge: text("privilenge").notNull(),
  created: timestamp("created").defaultNow(),
  modified: timestamp("modified").defaultNow(),
});

export const ViewCache = mysqlTable("view_cache", {
  id: varchar("id", { length: 26 }).primaryKey(),
  viewId: varchar("view_id", { length: 26 }).references(() => View.id).notNull(),
  title: text("title").notNull(),
  route: varchar("route", { length: 256 }).notNull().unique(),
  content: text("content").notNull(),
  etag: varchar("etag", { length: 27 }).notNull(),
  created: timestamp("created").defaultNow(),
  modified: timestamp("modified").defaultNow(),
});

export const ViewComponent = mysqlTable("view_component", {
  id: varchar("id", { length: 26 }).primaryKey(),
  teamId: varchar("team_id", { length: 26 }).references(() => Team.id).notNull(),
  identifier: varchar("identifier", { length: 256 }).notNull().unique(),
  title: text("title").notNull(),
  schema: text("schema"),
  config: text("config"),
  created: timestamp("created").defaultNow(),
  modified: timestamp("modified").defaultNow(),
});

export const File = mysqlTable("file", {
  id: varchar("id", { length: 26 }).primaryKey(),
  formId: varchar("form_id", { length: 26 }).references(() => Form.id),
  authorId: varchar("author_id", { length: 26 }).references(() => User.id),
  teamId: varchar("team_id", { length: 26 }).references(() => Team.id).notNull(),
  etag: varchar("etag", { length: 27 }).notNull(),
  size: int("size").notNull(),
  type: text("type").notNull(),
  name: text("name").notNull(),
  path: text("path").notNull(),
  created: timestamp("created").defaultNow(),
  modified: timestamp("modified").defaultNow(),
});

export const Entry = mysqlTable("entry", {
  id: varchar("id", { length: 26 }).primaryKey(),
  formId: varchar("form_id", { length: 26 }).references(() => Form.id).notNull(),
  authorId: varchar("author_id", { length: 26 }).references(() => User.id),
  data: json("data"),
  created: timestamp("created").defaultNow(),
  modified: timestamp("modified").defaultNow(),
});
