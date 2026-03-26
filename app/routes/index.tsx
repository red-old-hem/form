import { Link } from 'react-router'

export default function Page() {
  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col justify-center gap-8 px-6 py-16">
      <header className="space-y-3">
        <p className="badge badge-outline">Gista.js DB Starter</p>
        <h1 className="text-4xl font-bold text-balance">Your app is running.</h1>
        <p className="text-base-content/70">
          This database starter is prewired for SSR with Drizzle and Atlas so
          you can build real features immediately.
        </p>
      </header>

      <Link to="/forms/new" className="btn btn-primary btn-lg w-full">
        Create a new form
      </Link>
    </main>
  )
}
