import { defineDb, defineTable, column, NOW } from 'astro:db';

const User = defineTable({
  columns: {
    id: column.text({
      primaryKey: true,
    }),
    email: column.text(),
    name: column.text(),
    created: column.date({
      default: NOW,
    }),
    modified: column.date({
      default: NOW,
    })
  }
})

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
  }
})

// https://astro.build/db/config
export default defineDb({
  tables: { User, UserAuth },
})
