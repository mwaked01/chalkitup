import "dotenv/config";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  datasource: {
    // The CLI now reads the URL from here
    url: env("DATABASE_URL"),
  },
});