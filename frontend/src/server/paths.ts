import path from 'node:path'
import { fileURLToPath } from 'node:url'

export function repoRoot() {
  return path.resolve(fileURLToPath(new URL('../../..', import.meta.url)))
}

export function dataDir() {
  return path.join(repoRoot(), 'data')
}

export function workerDir() {
  return process.env.WORKER_DIR
    ? path.resolve(process.env.WORKER_DIR)
    : path.join(repoRoot(), 'worker')
}
