import Credentials from "@auth/core/providers/credentials"
import { User, UserAuth, and, db, eq } from "astro:db";
import { defineConfig } from 'auth-astro';
import { compare } from 'bcrypt';

export default defineConfig({
  providers: [
    Credentials({
      credentials: {
        email: { type: 'text' },
        password: {},
      },
      async authorize(c: any) {
        let q = await db.select().from(User).where(eq(User.email, c.email));
        if (q.length == 0) return null;
        let qa = await db.select().from(UserAuth).where(and(...[
          eq(UserAuth.type, 'email'), eq(UserAuth.userId, q[0].id)
        ]));
        if (qa.length == 0) return null;
        console.log(qa);
        if (!await compare(c.password, qa[0].identifier)) return null;
        return {
          id: q[0].id,
        }
      },
    }),
  ],
  callbacks: {
    session({ session, token }) {
      if (session.user && token?.sub) {
        session.user.id = token.sub;
      }
      return session;
    }
  }
})
