import { createModel } from './base'
import { forms } from '~/.server/db/schema'

const base = createModel(forms)

export const Form = {
  ...base,
}
