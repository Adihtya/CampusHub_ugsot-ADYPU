import Link from 'next/link';

export const metadata = { title: 'About' };

const principles = [
  { number: '01', title: 'Curiosity over credentials', text: 'You do not need to be an expert to join in. Bring a question, a half-built idea, or the willingness to try.' },
  { number: '02', title: 'Build in the open', text: 'Share drafts early, invite feedback, and make your learning useful to the people around you.' },
  { number: '03', title: 'Make room at the table', text: 'Good teams are generous with context, patient with beginners, and stronger because of different perspectives.' },
];

export default function AboutPage() {
  return (
    <main>
      <section className="border-b-4 border-sot-slate bg-sot-navy text-sot-white">
        <div className="mx-auto max-w-7xl px-5 py-20 md:px-8 md:py-28">
          <p className="mb-6 inline-block border-2 border-sot-slate bg-sot-mustard px-3 py-2 font-mono text-xs font-bold uppercase tracking-widest text-sot-slate shadow-hard-small">
            About / 001
          </p>
          <h1 className="max-w-5xl font-display text-[clamp(3.5rem,9vw,7.5rem)] font-extrabold uppercase leading-[0.86] tracking-[-0.07em]">
            A club for people who <span className="text-sot-crimson">make.</span>
          </h1>
          <p className="mt-8 max-w-2xl border-l-4 border-sot-mustard pl-5 font-mono text-base leading-7 sm:text-lg">
            The upGrad School of Technology Dev Club brings students together to explore technology, collaborate on real projects, and share what they learn along the way.
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-12 px-5 py-20 md:grid-cols-[0.8fr_1.2fr] md:px-8 md:py-28">
        <div>
          <p className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-sot-crimson">Why we are here</p>
          <h2 className="mt-4 font-display text-4xl font-extrabold uppercase leading-none sm:text-6xl">Learning gets real when you build.</h2>
        </div>
        <div className="space-y-5 font-mono text-base leading-7">
          <p>We make space for the parts of technology that do not fit neatly into a lecture: the debugging, the experiments, the collaboration, and the satisfaction of seeing an idea work.</p>
          <p>Our club is for students across disciplines and experience levels. Join a project, start a study group, give a short demo, or bring a problem you cannot solve alone.</p>
          <Link href="/projects" className="inline-flex border-b-4 border-sot-mustard pb-1 font-bold uppercase text-sot-slate no-underline hover:text-sot-crimson">
            See what we build <span className="ml-3">↗</span>
          </Link>
        </div>
      </section>

      <section className="border-y-4 border-sot-slate bg-sot-offwhite">
        <div className="mx-auto max-w-7xl px-5 py-20 md:px-8 md:py-24">
          <div className="mb-10">
            <p className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-sot-crimson">How we work</p>
            <h2 className="mt-3 font-display text-4xl font-extrabold uppercase sm:text-6xl">Three ground rules.</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {principles.map((principle) => (
              <article key={principle.number} className="border-4 border-sot-slate bg-sot-white p-6 shadow-hard">
                <p className="font-mono text-sm font-bold text-sot-crimson">{principle.number} / PRINCIPLE</p>
                <h3 className="mt-10 font-display text-2xl font-extrabold uppercase leading-tight">{principle.title}</h3>
                <p className="mt-4 font-mono text-sm leading-6">{principle.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto flex max-w-7xl flex-col gap-6 px-5 py-16 md:flex-row md:items-center md:justify-between md:px-8">
        <h2 className="max-w-2xl font-display text-3xl font-extrabold uppercase sm:text-5xl">Your first step can be a question.</h2>
        <Link href="/community#join" className="inline-flex min-h-14 items-center justify-center gap-3 border-4 border-sot-slate bg-sot-crimson px-6 font-display font-extrabold uppercase text-sot-white no-underline shadow-hard transition-transform hover:translate-x-1 hover:translate-y-1 hover:shadow-none">
          Meet the community <span aria-hidden="true">↗</span>
        </Link>
      </section>
    </main>
  );
}
