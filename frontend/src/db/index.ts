import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import Database from 'better-sqlite3'
import { drizzle } from 'drizzle-orm/better-sqlite3'

import * as schema from './schema.ts'

function repoRootFromHere(importMetaUrl: string) {
  return path.resolve(fileURLToPath(new URL('../../..', importMetaUrl)))
}

export function getDatabasePath() {
  if (process.env.DATABASE_PATH) {
    return process.env.DATABASE_PATH
  }

  return path.join(repoRootFromHere(import.meta.url), 'data', 'app.db')
}

function createDb() {
  const databasePath = getDatabasePath()
  fs.mkdirSync(path.dirname(databasePath), { recursive: true })

  const sqlite = new Database(databasePath)
  sqlite.pragma('journal_mode = WAL')
  sqlite.pragma('foreign_keys = ON')

  return drizzle(sqlite, { schema })
}

export const db = createDb()
