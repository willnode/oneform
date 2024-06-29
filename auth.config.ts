import { CredentialsSignin } from "@auth/core/errors";
import Credentials from "@auth/core/providers/credentials"
import { defineConfig } from 'auth-astro'


export default defineConfig({
  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {},
      },
      authorize(c) {
        if (c.password !== "password")  throw new CredentialsSignin('invalid');
        return {
          id: "test",
          name: "Test User",
          email: "test@example.com",
        }
      },
    }),
  ],
})
