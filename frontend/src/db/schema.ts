import { relations, sql } from 'drizzle-orm'
import { index, integer, real, sqliteTable, text } from 'drizzle-orm/sqlite-core'

export const chapterStates = [
  'draft',
  'analyzed',
  'approved',
  'generating',
  'complete',
  'stale',
] as const

export type ChapterState = (typeof chapterStates)[number]

export const voiceStates = [
  'draft',
  'ready_to_trim',
  'processing',
  'ready',
  'failed',
] as const

export type VoiceState = (typeof voiceStates)[number]

export const jobTypes = [
  'fetch_voice_source',
  'extract_reference_clip',
  'analyze_chapter',
  'synthesize_segment',
  'export_chapter',
] as const

export type JobType = (typeof jobTypes)[number]

export const jobStatuses = [
  'pending',
  'running',
  'completed',
  'failed',
] as const

export type JobStatus = (typeof jobStatuses)[number]

export const segmentSpeakerTypes = ['narrator', 'character'] as const
export type SegmentSpeakerType = (typeof segmentSpeakerTypes)[number]

export const segmentStatuses = [
  'pending_review',
  'approved',
  'generated',
] as const

export type SegmentStatus = (typeof segmentStatuses)[number]

export const bookProjects = sqliteTable('book_projects', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  createdAt: integer('created_at', { mode: 'timestamp_ms' })
    .notNull()
    .default(sql`(unixepoch() * 1000)`),
  updatedAt: integer('updated_at', { mode: 'timestamp_ms' })
    .notNull()
    .default(sql`(unixepoch() * 1000)`),
})

export const characters = sqliteTable(
  'characters',
  {
    id: text('id').primaryKey(),
    projectId: text('project_id')
      .notNull()
      .references(() => bookProjects.id, { onDelete: 'cascade' }),
    name: text('name').notNull(),
    description: text('description'),
    createdAt: integer('created_at', { mode: 'timestamp_ms' })
      .notNull()
      .default(sql`(unixepoch() * 1000)`),
  },
  (table) => [index('characters_project_id_idx').on(table.projectId)],
)

export const voices = sqliteTable('voices', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description'),
  status: text('status', { enum: voiceStates }).notNull().default('draft'),
  sourceUrl: text('source_url'),
  sourceAudioPath: text('source_audio_path'),
  sourceTrimStartMs: integer('source_trim_start_ms'),
  sourceTrimEndMs: integer('source_trim_end_ms'),
  referenceAudioPath: text('reference_audio_path'),
  generationParamsJson: text('generation_params_json')
    .notNull()
    .default('{}'),
  createdAt: integer('created_at', { mode: 'timestamp_ms' })
    .notNull()
    .default(sql`(unixepoch() * 1000)`),
  updatedAt: integer('updated_at', { mode: 'timestamp_ms' })
    .notNull()
    .default(sql`(unixepoch() * 1000)`),
})

export const voiceAssignments = sqliteTable(
  'voice_assignments',
  {
    id: text('id').primaryKey(),
    projectId: text('project_id')
      .notNull()
      .references(() => bookProjects.id, { onDelete: 'cascade' }),
    characterId: text('character_id')
      .notNull()
      .references(() => characters.id, { onDelete: 'cascade' }),
    voiceId: text('voice_id')
      .notNull()
      .references(() => voices.id, { onDelete: 'restrict' }),
    createdAt: integer('created_at', { mode: 'timestamp_ms' })
      .notNull()
      .default(sql`(unixepoch() * 1000)`),
  },
  (table) => [
    index('voice_assignments_project_id_idx').on(table.projectId),
    index('voice_assignments_character_id_idx').on(table.characterId),
  ],
)

export const chapters = sqliteTable(
  'chapters',
  {
    id: text('id').primaryKey(),
    projectId: text('project_id')
      .notNull()
      .references(() => bookProjects.id, { onDelete: 'cascade' }),
    title: text('title').notNull(),
    sourceText: text('source_text').notNull().default(''),
    state: text('state', { enum: chapterStates }).notNull().default('draft'),
    narratorVoiceId: text('narrator_voice_id').references(() => voices.id, {
      onDelete: 'set null',
    }),
    gapMs: integer('gap_ms').notNull().default(200),
    orderIndex: integer('order_index').notNull().default(0),
    createdAt: integer('created_at', { mode: 'timestamp_ms' })
      .notNull()
      .default(sql`(unixepoch() * 1000)`),
    updatedAt: integer('updated_at', { mode: 'timestamp_ms' })
      .notNull()
      .default(sql`(unixepoch() * 1000)`),
  },
  (table) => [index('chapters_project_id_idx').on(table.projectId)],
)

export const segments = sqliteTable(
  'segments',
  {
    id: text('id').primaryKey(),
    chapterId: text('chapter_id')
      .notNull()
      .references(() => chapters.id, { onDelete: 'cascade' }),
    orderIndex: integer('order_index').notNull(),
    speakerType: text('speaker_type', { enum: segmentSpeakerTypes }).notNull(),
    characterId: text('character_id').references(() => characters.id, {
      onDelete: 'set null',
    }),
    text: text('text').notNull(),
    confidence: real('confidence').notNull().default(1),
    status: text('status', { enum: segmentStatuses })
      .notNull()
      .default('pending_review'),
    audioPath: text('audio_path'),
    audioDurationMs: integer('audio_duration_ms'),
    createdAt: integer('created_at', { mode: 'timestamp_ms' })
      .notNull()
      .default(sql`(unixepoch() * 1000)`),
    updatedAt: integer('updated_at', { mode: 'timestamp_ms' })
      .notNull()
      .default(sql`(unixepoch() * 1000)`),
  },
  (table) => [index('segments_chapter_id_idx').on(table.chapterId)],
)

export const jobs = sqliteTable(
  'jobs',
  {
    id: text('id').primaryKey(),
    type: text('type', { enum: jobTypes }).notNull(),
    status: text('status', { enum: jobStatuses }).notNull().default('pending'),
    payloadJson: text('payload_json').notNull().default('{}'),
    resultJson: text('result_json'),
    error: text('error'),
    createdAt: integer('created_at', { mode: 'timestamp_ms' })
      .notNull()
      .default(sql`(unixepoch() * 1000)`),
    startedAt: integer('started_at', { mode: 'timestamp_ms' }),
    completedAt: integer('completed_at', { mode: 'timestamp_ms' }),
  },
  (table) => [
    index('jobs_status_idx').on(table.status),
    index('jobs_type_idx').on(table.type),
  ],
)

export const bookProjectsRelations = relations(bookProjects, ({ many }) => ({
  characters: many(characters),
  chapters: many(chapters),
  voiceAssignments: many(voiceAssignments),
}))

export const charactersRelations = relations(characters, ({ one, many }) => ({
  project: one(bookProjects, {
    fields: [characters.projectId],
    references: [bookProjects.id],
  }),
  voiceAssignment: many(voiceAssignments),
  segments: many(segments),
}))

export const voicesRelations = relations(voices, ({ many }) => ({
  voiceAssignments: many(voiceAssignments),
  chaptersAsNarrator: many(chapters),
}))

export const voiceAssignmentsRelations = relations(
  voiceAssignments,
  ({ one }) => ({
    project: one(bookProjects, {
      fields: [voiceAssignments.projectId],
      references: [bookProjects.id],
    }),
    character: one(characters, {
      fields: [voiceAssignments.characterId],
      references: [characters.id],
    }),
    voice: one(voices, {
      fields: [voiceAssignments.voiceId],
      references: [voices.id],
    }),
  }),
)

export const chaptersRelations = relations(chapters, ({ one, many }) => ({
  project: one(bookProjects, {
    fields: [chapters.projectId],
    references: [bookProjects.id],
  }),
  narratorVoice: one(voices, {
    fields: [chapters.narratorVoiceId],
    references: [voices.id],
  }),
  segments: many(segments),
}))

export const segmentsRelations = relations(segments, ({ one }) => ({
  chapter: one(chapters, {
    fields: [segments.chapterId],
    references: [chapters.id],
  }),
  character: one(characters, {
    fields: [segments.characterId],
    references: [characters.id],
  }),
}))
