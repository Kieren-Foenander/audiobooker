import { spawn } from 'node:child_process'

import { eq } from 'drizzle-orm'

import { db } from '#/db/index'
import { jobs, type JobType } from '#/db/schema'
import { workerDir } from '#/server/paths'

export async function createJob(type: JobType, payload: Record<string, unknown>) {
  const id = crypto.randomUUID()

  await db.insert(jobs).values({
    id,
    type,
    payloadJson: JSON.stringify(payload),
  })

  spawnWorkerJob(id)

  return id
}

export function spawnWorkerJob(jobId: string) {
  const child = spawn(
    'uv',
    ['run', 'python', '-m', 'worker', 'run', '--job-id', jobId],
    {
      cwd: workerDir(),
      detached: true,
      stdio: 'ignore',
    },
  )

  child.unref()
}

export async function getJob(jobId: string) {
  return db.query.jobs.findFirst({
    where: eq(jobs.id, jobId),
  })
}
