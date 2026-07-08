import { createFileRoute, useRouter } from '@tanstack/react-router'

import { createProject, listProjects } from '#/server/projects'

export const Route = createFileRoute('/')({
  component: HomePage,
  loader: async () => ({
    projects: await listProjects(),
  }),
})

function HomePage() {
  const router = useRouter()
  const { projects } = Route.useLoaderData()

  const handleCreateProject = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const name = formData.get('name')

    if (typeof name !== 'string' || !name.trim()) {
      return
    }

    await createProject({ data: { name } })
    event.currentTarget.reset()
    await router.invalidate()
  }

  return (
    <main className="page-wrap px-4 pb-8 pt-14">
      <section className="island-shell rise-in relative overflow-hidden rounded-[2rem] px-6 py-10 sm:px-10 sm:py-14">
        <p className="island-kicker mb-3">Local audiobook studio</p>
        <h1 className="display-title mb-5 max-w-3xl text-4xl leading-[1.02] font-bold tracking-tight text-[var(--sea-ink)] sm:text-6xl">
          Audiobooker
        </h1>
        <p className="mb-8 max-w-2xl text-base text-[var(--sea-ink-soft)] sm:text-lg">
          Turn book chapters into multi-voice audiobooks with local analysis,
          voice cloning, and segment-level editing.
        </p>
      </section>

      <section className="island-shell mt-8 rounded-2xl p-6">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="island-kicker mb-2">Book Projects</p>
            <h2 className="text-xl font-semibold text-[var(--sea-ink)]">
              Your library
            </h2>
          </div>
        </div>

        <form
          onSubmit={handleCreateProject}
          className="mb-6 flex flex-col gap-2 sm:flex-row"
        >
          <input
            type="text"
            name="name"
            placeholder="New book project name"
            className="demo-input min-w-0 flex-1"
          />
          <button type="submit" className="demo-button whitespace-nowrap">
            Create project
          </button>
        </form>

        {projects.length === 0 ? (
          <p className="demo-muted m-0 text-sm">
            No book projects yet. Create one to get started.
          </p>
        ) : (
          <ul className="space-y-3">
            {projects.map((project) => (
              <li key={project.id} className="demo-list-item">
                <div className="flex items-center justify-between gap-4">
                  <span className="font-medium">{project.name}</span>
                  <span className="demo-muted text-xs">{project.id}</span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          ['Analyze', 'Extract characters and speaking segments from a chapter.'],
          ['Cast voices', 'Clone voices from YouTube clips and assign them.'],
          ['Generate', 'Synthesize each segment with Chatterbox TTS.'],
          ['Play & tweak', 'Review the timeline and regenerate any section.'],
        ].map(([title, desc], index) => (
          <article
            key={title}
            className="island-shell feature-card rise-in rounded-2xl p-5"
            style={{ animationDelay: `${index * 90 + 80}ms` }}
          >
            <h3 className="mb-2 text-base font-semibold text-[var(--sea-ink)]">
              {title}
            </h3>
            <p className="m-0 text-sm text-[var(--sea-ink-soft)]">{desc}</p>
          </article>
        ))}
      </section>
    </main>
  )
}
