import Link from 'next/link';
import CommunityFeed from '@/components/CommunityFeed';
import { posts } from '@/lib/data';

export const metadata = { title: 'Community' };

const cloneCommands = [
  { label: 'REPLACE WITH A PROJECT URL', command: 'git clone <repository-url>' },
];

export default function CommunityPage() {
  const sortedPosts = [...posts].sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  return (
    <main>
      <section className="border-b-4 border-sot-slate bg-sot-navy text-sot-white">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 py-16 md:grid-cols-[1fr_0.8fr] md:px-8 md:py-24">
          <div>
            <p className="mb-6 inline-block border-2 border-sot-slate bg-sot-mustard px-3 py-2 font-mono text-xs font-bold uppercase tracking-widest text-sot-slate shadow-hard-small">
              Community / Open door
            </p>
            <h1 className="max-w-3xl font-display text-[clamp(3.5rem,9vw,7rem)] font-extrabold uppercase leading-[0.86] tracking-[-0.07em]">
              Better builds start <span className="text-sot-crimson">together.</span>
            </h1>
            <p className="mt-8 max-w-xl border-l-4 border-sot-mustard pl-5 font-mono text-base leading-7">
              Ask for help, show what you are making, and find people who want to make something with you.
            </p>
          </div>

          <aside id="join" className="scroll-mt-28 border-4 border-sot-slate bg-sot-offwhite p-5 text-sot-slate shadow-hard sm:p-7">
            <div className="flex items-center justify-between gap-4 border-b-4 border-sot-slate pb-4">
              <p className="font-mono text-xs font-bold uppercase tracking-widest">Terminal / get started</p>
              <span className="bg-sot-mustard px-2 py-1 font-mono text-[10px] font-bold uppercase">Join us</span>
            </div>
            <p className="mt-5 font-mono text-sm leading-6">Have a repository you want to work on? Clone it, explore the issues, and introduce yourself in the club. Replace the placeholder with your team&apos;s repository URL.</p>
            <div className="mt-5 space-y-4">
              {cloneCommands.map(({ label, command }) => (
                <div key={label} className="border-2 border-sot-slate bg-sot-white p-3 shadow-hard-small">
                  <p className="mb-2 font-mono text-[10px] font-bold uppercase tracking-widest text-sot-crimson">{label}</p>
                  <code className="block break-all font-mono text-xs leading-5 text-sot-slate">
                    <span className="font-bold text-sot-crimson">$ </span>{command}
                  </code>
                </div>
              ))}
            </div>
            <Link href="/projects" className="mt-6 inline-flex min-h-12 items-center justify-center gap-2 border-4 border-sot-slate bg-sot-crimson px-4 font-display text-sm font-extrabold uppercase text-sot-white no-underline shadow-hard-small transition-transform hover:translate-x-1 hover:translate-y-1 hover:shadow-none">
              Browse the project index <span aria-hidden="true">↗</span>
            </Link>
          </aside>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-16 md:px-8 md:py-24">
        <div className="mb-9 flex flex-col gap-4 border-b-4 border-sot-slate pb-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-sot-crimson">The conversation</p>
            <h2 className="mt-3 font-display text-4xl font-extrabold uppercase sm:text-6xl">Build in the open.</h2>
          </div>
          <p className="max-w-sm font-mono text-xs leading-5">Share progress, ask focused questions, and leave the next person a little more context.</p>
        </div>
        <CommunityFeed initialPosts={sortedPosts} now={Date.now()} />
      </section>
    </main>
  );
}
