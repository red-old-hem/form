import { Form as RouterForm } from 'react-router'
import type { Route } from './+types/index'
import { Form } from '~/models/.server/form'
import { Submission } from '~/models/.server/submission'

export async function loader({ params }: Route.LoaderArgs) {
  let form = await Form.findByID(params.id)
  return { form }
}

export async function action({ request, params }: Route.ActionArgs) {
  let form = await Form.findByID(params.id)
  let fields = form.fields as Array<{ label: string; type: string }>
  let formData = await request.formData()
  let submissionData: Record<string, string> = {}
  for (let field of fields) {
    submissionData[field.label] = (formData.get(field.label) as string) ?? ''
  }
  await Submission.create({ form_id: form.id, data: submissionData })
  return { submitted: true }
}

export default function PublicFormPage({
  loaderData,
  actionData,
}: Route.ComponentProps) {
  let { form } = loaderData
  let fields = form.fields as Array<{ label: string; type: string }>
  let submitted = actionData?.submitted

  if (submitted) {
    return (
      <main className="mx-auto max-w-xl px-6 py-16 text-center">
        <h1 className="mb-4 text-3xl font-bold">Thank you!</h1>
        <p className="text-base-content/70">Your response has been submitted.</p>
      </main>
    )
  }

  return (
    <main className="mx-auto max-w-xl px-6 py-16">
      <h1 className="mb-8 text-3xl font-bold">{form.title}</h1>
      <RouterForm method="post" className="space-y-5">
        {fields.map((field, i) => (
          <div key={i} className="form-control">
            <label className="label">
              <span className="label-text font-medium">{field.label}</span>
            </label>
            {field.type === 'textarea' ? (
              <textarea
                name={field.label}
                className="textarea textarea-bordered w-full"
                rows={4}
              />
            ) : (
              <input
                name={field.label}
                type={field.type}
                className="input input-bordered w-full"
              />
            )}
          </div>
        ))}
        <button type="submit" className="btn btn-primary w-full">
          Submit
        </button>
      </RouterForm>
    </main>
  )
}
