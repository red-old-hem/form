import { Link } from 'react-router'
import type { Route } from './+types/$token'
import { Form } from '~/models/.server/form'
import { Submission } from '~/models/.server/submission'
import { DataTable } from '~/ui/data-table'

export async function loader({ request, params }: Route.LoaderArgs) {
  let form = await Form.findBy({ id: Number(params.id), token: params.token })
  if (!form) return { form: null, submissions: [], formUrl: null }
  let submissions = await Submission.findAllBy({ form_id: form.id })
  let origin = new URL(request.url).origin
  let formUrl = `${origin}/forms/${form.id}`
  return { form, submissions, formUrl }
}

export async function action({ request }: Route.ActionArgs) {
  let formData = await request.formData()
  let verb = formData.get('verb')
  if (verb === 'delete') {
    let id = Number(formData.get('id'))
    await Submission.delete(id)
  }
  return null
}

export default function ResultsPage({ loaderData }: Route.ComponentProps) {
  let { form, submissions, formUrl } = loaderData

  if (!form) {
    return (
      <main className="mx-auto max-w-xl px-6 py-16 text-center">
        <h1 className="mb-4 text-3xl font-bold text-error">Invalid token</h1>
        <p className="text-base-content/70">
          The link you followed is not valid.
        </p>
      </main>
    )
  }

  let fields = form.fields as unknown as Array<{ label: string; type: string }>

  let columns = Object.fromEntries([
    ...fields.map((f) => [f.label, f.label]),
    ['created_at', 'Submitted'],
  ])

  let rows = (submissions as Array<{ id: number; data: unknown; created_at: unknown }>).map((sub) => ({
    id: sub.id,
    ...(sub.data as Record<string, string>),
    created_at: sub.created_at,
  }))

  return (
    <main className="mx-auto max-w-3xl space-y-8 px-6 py-16">
      <header>
        <h1 className="text-3xl font-bold">{form.title}</h1>
        <p className="mt-2 text-sm">
          Public form link:{' '}
          <Link to={`/forms/${form.id}`} className="link link-primary">
            {formUrl}
          </Link>
        </p>
      </header>

      <section>
        <h2 className="mb-4 text-lg font-semibold">
          {submissions.length}{' '}
          {submissions.length === 1 ? 'Submission' : 'Submissions'}
        </h2>
        {submissions.length === 0 ? (
          <p className="text-base-content/70">No submissions yet.</p>
        ) : (
          <DataTable columns={columns} rows={rows} deletable={true} />
        )}
      </section>
    </main>
  )
}
