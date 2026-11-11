import Link from 'next/link';

const focusAreas = [
  { index: '01', title: 'Build things', detail: 'Turn class notes, wild ideas, and weekend experiments into working software.', color: 'bg-sot-crimson text-sot-white' },
  { index: '02', title: 'Learn together', detail: 'Share what you know, ask better questions, and make room for beginners.', color: 'bg-sot-mustard text-sot-slate' },
  { index: '03', title: 'Ship in public', detail: 'Show the process, get useful feedback, and make your work easier to discover.', color: 'bg-sot-offwhite text-sot-slate' },
];

export default function HomePage() {
  return (
    <main>
      <section className="relative isolate overflow-hidden border-b-4 border-sot-slate bg-sot-navy text-sot-white">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 opacity-25"
          style={{
            backgroundImage: 'linear-gradient(#1F1F1F 1px, transparent 1px), linear-gradient(90deg, #1F1F1F 1px, transparent 1px)',
            backgroundSize: '32px 32px',
          }}
        />
        <div className="mx-auto grid min-h-[680px] max-w-7xl items-center gap-12 px-5 py-20 md:grid-cols-[1.3fr_0.7fr] md:px-8 md:py-28">
          <div>
            <p className="mb-7 inline-flex items-center gap-3 border-2 border-sot-slate bg-sot-mustard px-3 py-2 font-mono text-xs font-bold uppercase tracking-[0.15em] text-sot-slate shadow-hard-small">
              <span className="size-2 bg-sot-crimson" />
              upGrad School of Technology · Dev Club
            </p>
            <h1 className="max-w-4xl font-display text-[clamp(4rem,11vw,9rem)] font-extrabold uppercase leading-[0.82] tracking-[-0.075em]">
              Make
              <br />
              things.
              <br />
              <span className="text-sot-crimson">Make</span> them
              <br />
              matter.
            </h1>
            <p className="mt-9 max-w-xl border-l-4 border-sot-mustard pl-5 font-mono text-base leading-7 text-sot-white sm:text-lg">
              A student-led community for curious minds who learn out loud, build with intent, and make technology better together.
            </p>
            <div className="mt-9 flex flex-wrap gap-4">
              <Link
                href="/community#join"
                className="inline-flex min-h-14 items-center gap-3 border-4 border-sot-slate bg-sot-crimson px-6 font-display text-base font-extrabold uppercase text-sot-white no-underline shadow-hard transition-transform hover:translate-x-1 hover:translate-y-1 hover:shadow-none"
              >
                Find your people <span aria-hidden="true">↗</span>
              </Link>
              <Link
                href="/projects"
                className="inline-flex min-h-14 items-center gap-3 border-4 border-sot-slate bg-sot-white px-6 font-display text-base font-extrabold uppercase text-sot-slate no-underline shadow-hard transition-transform hover:translate-x-1 hover:translate-y-1 hover:shadow-none"
              >
                Explore projects <span aria-hidden="true">↓</span>
              </Link>
            </div>
          </div>

          <aside className="relative mx-auto w-full max-w-md border-4 border-sot-slate bg-sot-offwhite p-5 text-sot-slate shadow-hard md:rotate-2">
            <div className="flex items-center justify-between border-b-4 border-sot-slate pb-3 font-mono text-xs font-bold uppercase tracking-widest">
              <span>club_manifesto.txt</span>
              <span className="bg-sot-mustard px-2 py-1">v.01</span>
            </div>
            <p className="mt-7 font-display text-4xl font-extrabold uppercase leading-[0.95] sm:text-5xl">
              Curiosity is a team sport.
            </p>
            <div className="mt-8 grid grid-cols-2 border-l-2 border-t-2 border-sot-slate">
              <div className="border-b-2 border-r-2 border-sot-slate p-4">
                <p className="font-mono text-xs uppercase">We do</p>
                <p className="mt-2 font-display text-xl font-extrabold uppercase">Experiments</p>
              </div>
              <div className="border-b-2 border-r-2 border-sot-slate p-4">
                <p className="font-mono text-xs uppercase">We value</p>
                <p className="mt-2 font-display text-xl font-extrabold uppercase">Open source</p>
              </div>
              <div className="border-r-2 border-sot-slate p-4">
                <p className="font-mono text-xs uppercase">We share</p>
                <p className="mt-2 font-display text-xl font-extrabold uppercase">Knowledge</p>
              </div>
              <div className="border-r-2 border-sot-slate p-4">
                <p className="font-mono text-xs uppercase">We make</p>
                <p className="mt-2 font-display text-xl font-extrabold uppercase">Progress</p>
              </div>
            </div>
            <div className="absolute -bottom-5 -right-4 -z-10 size-16 border-4 border-sot-slate bg-sot-crimson" />
          </aside>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-20 md:px-8 md:py-28">
        <div className="mb-10 flex flex-col gap-5 border-b-4 border-sot-slate pb-7 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-sot-crimson">Our operating system</p>
            <h2 className="mt-3 max-w-3xl font-display text-4xl font-extrabold uppercase leading-none tracking-tight sm:text-6xl">
              Learn by making.
              <br />
              Grow by sharing.
            </h2>
          </div>
          <Link href="/about" className="font-mono text-sm font-bold uppercase text-sot-slate underline decoration-sot-mustard decoration-4 underline-offset-4 hover:text-sot-crimson">
            More about the club ↗
          </Link>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {focusAreas.map((area) => (
            <article key={area.index} className={`min-h-64 border-4 border-sot-slate p-6 shadow-hard ${area.color}`}>
              <p className="font-mono text-sm font-bold">{area.index} / FIELD NOTE</p>
              <h3 className="mt-10 font-display text-3xl font-extrabold uppercase">{area.title}</h3>
              <p className="mt-3 max-w-sm font-mono text-sm leading-6">{area.detail}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="border-y-4 border-sot-slate bg-sot-mustard text-sot-slate">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-5 py-12 md:flex-row md:items-center md:justify-between md:px-8">
          <div>
            <p className="font-mono text-xs font-bold uppercase tracking-[0.2em]">One good idea is enough</p>
            <h2 className="mt-2 font-display text-3xl font-extrabold uppercase sm:text-5xl">Bring yours to the table.</h2>
          </div>
          <Link href="/community#join" className="inline-flex min-h-14 items-center justify-center gap-3 border-4 border-sot-slate bg-sot-crimson px-6 font-display font-extrabold uppercase text-sot-white no-underline shadow-hard transition-transform hover:translate-x-1 hover:translate-y-1 hover:shadow-none">
            Join the community <span aria-hidden="true">↗</span>
          </Link>
        </div>
      </section>
    </main>
  );
}
