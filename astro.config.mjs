// @ts-check
import { defineConfig, envField } from "astro/config";

import react from "@astrojs/react";
import vercel from "@astrojs/vercel";

// https://astro.build/config
export default defineConfig({
  output: "server",
  adapter: vercel(),
  integrations: [react()],
  env: {
    schema: {
      DOCUMENT_ID: envField.string({ context: "server", access: "secret" }),
      YEAR: envField.number({
        context: "server",
        access: "public",
        default: new Date().getFullYear(),
      }),
    },
    validateSecrets: true,
  },
});
