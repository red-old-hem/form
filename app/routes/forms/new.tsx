import { useState } from 'react'
import { Form as RouterForm, redirect } from 'react-router'
import type { Route } from './+types/new'
import { insertFormSchema } from '~/.server/db/schema'
import { Form } from '~/models/.server/form'
import { validate } from '~/lib/data/validate'

export async function action({ request }: Route.ActionArgs) {
  let formData = await request.formData()
  let result = validate(formData, insertFormSchema)
  if (!result.ok) return { errors: result.errors }
  let form = await Form.create(result.data as any)
  return redirect(`/forms/${form.id}/results/${form.token}`)
}

type FieldType = 'text' | 'email' | 'textarea'
type Field = { label: string; type: FieldType }

export default function NewFormPage({ actionData }: Route.ComponentProps) {
  let errors = actionData?.errors ?? {}
  let [fields, setFields] = useState<Field[]>([{ label: '', type: 'text' }])

  function addField() {
    setFields((prev) => [...prev, { label: '', type: 'text' }])
  }

  function removeField(i: number) {
    setFields((prev) => prev.filter((_, idx) => idx !== i))
  }

  return (
    <main className="mx-auto max-w-2xl px-6 py-16">
      <h1 className="mb-8 text-3xl font-bold">New Form</h1>
      <RouterForm method="post" className="space-y-6">
        <div className="form-control">
          <label className="label">
            <span className="label-text font-medium">Title</span>
          </label>
          <input
            name="title"
            type="text"
            placeholder="Form title"
            className="input input-bordered w-full"
          />
          {errors.title && (
            <p className="mt-1 text-sm text-error">{errors.title[0]}</p>
          )}
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Fields</h2>
            <button
              type="button"
              onClick={addField}
              className="btn btn-outline btn-sm"
            >
              + Add Field
            </button>
          </div>

          {fields.map((field, i) => (
            <div
              key={i}
              className="rounded-box space-y-3 border border-base-300 p-4"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-base-content/60">
                  Field {i + 1}
                </span>
                {fields.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeField(i)}
                    className="btn btn-ghost btn-xs text-error"
                  >
                    Remove
                  </button>
                )}
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text text-sm">Label</span>
                  </label>
                  <input
                    name={`fields[${i}][label]`}
                    type="text"
                    placeholder="Field label"
                    className="input input-bordered input-sm w-full"
                    defaultValue={field.label}
                  />
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text text-sm">Type</span>
                  </label>
                  <select
                    name={`fields[${i}][type]`}
                    className="select select-bordered select-sm w-full"
                    defaultValue={field.type}
                  >
                    <option value="text">Text</option>
                    <option value="email">Email</option>
                    <option value="textarea">Textarea</option>
                  </select>
                </div>
              </div>
            </div>
          ))}

          {errors.fields && (
            <p className="text-sm text-error">{(errors.fields as string[])[0]}</p>
          )}
        </div>

        <button type="submit" className="btn btn-primary w-full">
          Save Form
        </button>
      </RouterForm>
    </main>
  )
}
