import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { config } from 'dotenv'
import { defineConfig } from 'drizzle-kit'

config({ path: ['.env.local', '.env'] })

const repoRoot = path.resolve(fileURLToPath(new URL('..', import.meta.url)))
const databasePath =
  process.env.DATABASE_PATH ?? path.join(repoRoot, 'data', 'app.db')

export default defineConfig({
  out: './drizzle',
  schema: './src/db/schema.ts',
  dialect: 'sqlite',
  dbCredentials: {
    url: databasePath,
  },
})
