import Link from 'next/link';

export const metadata = { title: 'Projects' };

const projects = [
  {
    number: '01',
    category: 'Computer vision',
    title: 'Campus Lens',
    description: 'A student-built exploration of image classification and visual search for everyday campus objects.',
    stack: ['Python', 'OpenCV', 'FastAPI'],
    surface: 'bg-sot-offwhite',
  },
  {
    number: '02',
    category: 'Scientific computing',
    title: 'Neuron Atlas',
    description: 'An interactive 2D sandbox for exploring network graphs and connectome-inspired simulations.',
    stack: ['TypeScript', 'React', 'Canvas'],
    surface: 'bg-sot-mustard',
  },
  {
    number: '03',
    category: 'Developer tools',
    title: 'Build Log',
    description: 'A lightweight project journal for recording decisions, demos, and lessons from a team build.',
    stack: ['Next.js', 'TypeScript', 'SQLite'],
    surface: 'bg-sot-white',
  },
  {
    number: '04',
    category: 'Community',
    title: 'Team Finder',
    description: 'A concept for helping students discover collaborators by interests, skills, and project goals.',
    stack: ['React', 'Node.js', 'PostgreSQL'],
    surface: 'bg-sot-crimson text-sot-white',
  },
];

export default function ProjectsPage() {
  return (
    <main>
      <section className="border-b-4 border-sot-slate bg-sot-navy text-sot-white">
        <div className="mx-auto max-w-7xl px-5 py-20 md:px-8 md:py-28">
          <p className="mb-6 inline-block border-2 border-sot-slate bg-sot-mustard px-3 py-2 font-mono text-xs font-bold uppercase tracking-widest text-sot-slate shadow-hard-small">
            Project index / 004
          </p>
          <h1 className="max-w-5xl font-display text-[clamp(3.5rem,10vw,8rem)] font-extrabold uppercase leading-[0.84] tracking-[-0.07em]">
            Ideas into <span className="text-sot-crimson">working code.</span>
          </h1>
          <p className="mt-8 max-w-2xl border-l-4 border-sot-mustard pl-5 font-mono text-base leading-7 sm:text-lg">
            A look at the kinds of student-led experiments the club is here to make possible. Have a project to add? Bring it to the community.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-16 md:px-8 md:py-24">
        <div className="mb-10 flex flex-col gap-4 border-b-4 border-sot-slate pb-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-sot-crimson">The workbench</p>
            <h2 className="mt-3 font-display text-4xl font-extrabold uppercase sm:text-6xl">Prototypes & experiments</h2>
          </div>
          <span className="font-mono text-xs font-bold uppercase tracking-widest">PROJECTS / 01—04</span>
        </div>

        <div className="grid gap-7 md:grid-cols-2">
          {projects.map((project) => (
            <article key={project.number} className={`flex min-h-[360px] flex-col border-4 border-sot-slate p-6 shadow-hard sm:p-8 ${project.surface}`}>
              <div className="flex items-start justify-between gap-4 border-b-2 border-sot-slate pb-4">
                <span className="font-mono text-sm font-bold">{project.number} / {project.category}</span>
                <span className="border-2 border-sot-slate bg-sot-white px-2 py-1 font-mono text-[10px] font-bold uppercase text-sot-slate shadow-hard-small">Student build</span>
              </div>
              <h3 className="mt-10 font-display text-4xl font-extrabold uppercase leading-none sm:text-5xl">{project.title}</h3>
              <p className="mt-4 max-w-lg font-mono text-sm leading-6">{project.description}</p>
              <div className="mt-auto flex flex-wrap gap-2 pt-8" aria-label={`${project.title} technology stack`}>
                {project.stack.map((technology) => (
                  <span key={technology} className="border-2 border-sot-slate bg-sot-white px-2 py-1 font-mono text-xs font-bold text-sot-slate shadow-hard-small">
                    {technology}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="border-y-4 border-sot-slate bg-sot-mustard">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-5 py-12 md:flex-row md:items-center md:justify-between md:px-8">
          <div>
            <p className="font-mono text-xs font-bold uppercase tracking-[0.2em]">Got a half-built idea?</p>
            <h2 className="mt-2 font-display text-3xl font-extrabold uppercase sm:text-5xl">That is a great place to start.</h2>
          </div>
          <Link href="/community#join" className="inline-flex min-h-14 items-center justify-center gap-3 border-4 border-sot-slate bg-sot-crimson px-6 font-display font-extrabold uppercase text-sot-white no-underline shadow-hard transition-transform hover:translate-x-1 hover:translate-y-1 hover:shadow-none">
            Find collaborators <span aria-hidden="true">↗</span>
          </Link>
        </div>
      </section>
    </main>
  );
}
