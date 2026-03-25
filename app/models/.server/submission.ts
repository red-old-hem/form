import { createModel } from './base'
import { submissions } from '~/.server/db/schema'

const base = createModel(submissions)

export const Submission = {
  ...base,
}
