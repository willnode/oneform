import { defineConfig } from 'astro/config';
import auth from "auth-astro";
import node from "@astrojs/node";

import db from "@astrojs/db";

// https://astro.build/config
export default defineConfig({
  integrations: [auth(), db()],
  output: "server",
  adapter: node({
    mode: "standalone"
  })
});