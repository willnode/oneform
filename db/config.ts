import { defineDb, defineTable, column, NOW } from "astro:db";

const User = defineTable({
  columns: {
    id: column.text({
      primaryKey: true,
    }),
    email: column.text({
      unique: true,
    }),
    name: column.text(),
    created: column.date({
      default: NOW,
    }),
    modified: column.date({
      default: NOW,
    }),
  },
});

const UserAuth = defineTable({
  columns: {
    id: column.text({
      primaryKey: true,
    }),
    userId: column.text({
      references: () => User.columns.id,
    }),
    type: column.text(),
    identifier: column.text(),
  },
  indexes: [
    {
      on: ["userId", "type"],
      unique: true,
    },
  ],
});

const Team = defineTable({
  columns: {
    id: column.text({
      primaryKey: true,
    }),
    userId: column.text({
      references: () => User.columns.id,
      unique: true,
    }),
    storageSize: column.number({
      default: 0,
    }),
  },
});

const Form = defineTable({
  columns: {
    id: column.text({
      primaryKey: true,
    }),
    teamId: column.text({
      references: () => Team.columns.id,
    }),
    title: column.text(),
    schema: column.json(),
    created: column.date({
      default: NOW,
    }),
    modified: column.date({
      default: NOW,
    }),
    privilenge: column.text(),
  },
});

const File = defineTable({
  columns: {
    id: column.text({
      primaryKey: true,
    }),
    formId: column.text({
      references: () => Form.columns.id,
    }),
    authorId: column.text({
      references: () => User.columns.id,
      optional: true,
    }),
    teamId: column.text({
      references: () => Team.columns.id,
    }),
    size: column.number(),
    type: column.text(),
    name: column.text(),
    path: column.text(),
    created: column.date({
      default: NOW,
    }),
    modified: column.date({
      default: NOW,
    }),
  },
});

const Entry = defineTable({
  columns: {
    id: column.text({
      primaryKey: true,
    }),
    formId: column.text({
      references: () => Form.columns.id,
    }),
    authorId: column.text({
      references: () => User.columns.id,
      optional: true,
    }),
    data: column.json({
      references: () => User.columns.id,
      optional: true,
    }),
    created: column.date({
      default: NOW,
    }),
    modified: column.date({
      default: NOW,
    }),
  },
});

// https://astro.build/db/config
export default defineDb({
  tables: { User, UserAuth, Team, Form, File, Entry },
});
