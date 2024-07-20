import { mysqlTable, varchar, text, timestamp, index, uniqueIndex, int, json } from "drizzle-orm/mysql-core";

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
  identifier: varchar("identifier", { length: 255 }).notNull(),
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
  title: text("title"),
  schema: json("schema"),
  config: json("config"),
  created: timestamp("created").defaultNow(),
  modified: timestamp("modified").defaultNow(),
  privilenge: text("privilenge"),
});

export const Format = mysqlTable("format", {
  id: varchar("id", { length: 26 }).primaryKey(),
  formId: varchar("form_id", { length: 26 }).references(() => Form.id).notNull(),
  title: text("title"),
  teamId: varchar("team_id", { length: 26 }).references(() => Team.id).notNull(),
  type: text("type"),
  schema: json("schema"),
  privilenge: text("privilenge"),
  created: timestamp("created").defaultNow(),
  modified: timestamp("modified").defaultNow(),
});
export const Hook = mysqlTable("hook", {
  id: varchar("id", { length: 26 }).primaryKey(),
  formId: varchar("form_id", { length: 26 }).references(() => Form.id).notNull(),
  teamId: varchar("team_id", { length: 26 }).references(() => Team.id).notNull(),
  formatId: varchar("format_id", { length: 26 }).references(() => Format.id).notNull(),
  title: text("title"),
  type: text("type"),
  status: text("status"),
  created: timestamp("created").defaultNow(),
  modified: timestamp("modified").defaultNow(),
});

export const File = mysqlTable("file", {
  id: varchar("id", { length: 26 }).primaryKey(),
  formId: varchar("form_id", { length: 26 }).references(() => Form.id).notNull(),
  authorId: varchar("author_id", { length: 26 }).references(() => User.id).notNull(),
  teamId: varchar("team_id", { length: 26 }).references(() => Team.id).notNull(),
  size: int("size"),
  type: text("type"),
  name: text("name"),
  path: text("path"),
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
export const EntryHook = mysqlTable("entry_hook", {
  id: varchar("id", { length: 26 }).primaryKey(),
  entryId: varchar("entry_id", { length: 26 }).references(() => Entry.id).notNull(),
  hookId: varchar("hook_id", { length: 26 }).references(() => Hook.id).notNull(),
  status: text("status"),
  created: timestamp("created").defaultNow(),
  modified: timestamp("modified").defaultNow(),
});
