import { createServerFn } from '@tanstack/react-start'
import { desc } from 'drizzle-orm'

import { db } from '#/db/index'
import { bookProjects } from '#/db/schema'

export const listProjects = createServerFn({ method: 'GET' }).handler(async () => {
  return db.query.bookProjects.findMany({
    orderBy: [desc(bookProjects.updatedAt)],
  })
})

export const createProject = createServerFn({ method: 'POST' })
  .inputValidator((data: { name: string }) => {
    if (!data.name.trim()) {
      throw new Error('Project name is required')
    }

    return { name: data.name.trim() }
  })
  .handler(async ({ data }) => {
    const id = crypto.randomUUID()
    const now = new Date()

    await db.insert(bookProjects).values({
      id,
      name: data.name,
      createdAt: now,
      updatedAt: now,
    })

    return { id }
  })
