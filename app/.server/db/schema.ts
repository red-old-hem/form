import { createInsertSchema } from 'drizzle-zod'
import { sqliteTable, text } from 'drizzle-orm/sqlite-core'
import { z } from 'zod'
import { defaultHex, defaultNow, foreign, id } from './helpers'

export const forms = sqliteTable('forms', {
  id: id(),
  title: text().notNull(),
  fields: text({ mode: 'json' }).notNull(),
  token: defaultHex(24),
  created_at: defaultNow(),
})

export const submissions = sqliteTable('submissions', {
  id: id(),
  form_id: foreign(() => forms).notNull(),
  data: text({ mode: 'json' }).notNull(),
  created_at: defaultNow(),
})

export const insertFormSchema = createInsertSchema(forms, {
  title: z.string().min(3),
})

export const insertSubmissionSchema = createInsertSchema(submissions)
