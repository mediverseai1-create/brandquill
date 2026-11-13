import Link from "next/link";
import { BookOpenText, Users, Library, ShieldCheck, PenLine, Gauge } from "lucide-react";
import { TEMPLATES } from "@/lib/templates";

const pillars = [
  { icon: BookOpenText, title: "Brand voice", text: "Describe your tone, set banned words and paste a writing sample. Every draft is written to match it." },
  { icon: Users, title: "Audiences", text: "Save the people you write for, with their pain points, so copy speaks to a reader instead of a crowd." },
  { icon: Library, title: "Knowledge", text: "Keep product facts and messaging in one place. Drafts draw on them instead of guessing." },
  { icon: PenLine, title: "Studio", text: "Pick a template, add the brief and get publish-ready copy saved to your library." },
];

export default function Home() {
  return (
    <>
      <section className="bg-sky">
        <div className="mx-auto max-w-4xl px-4 py-20 text-center sm:py-28">
          <p className="mx-auto mb-6 inline-block border border-ink/20 bg-white px-3 py-1 text-xs">New · Brand-check scoring on every draft</p>
          <h1 className="text-4xl font-semibold leading-tight sm:text-6xl">Marketing content that sounds like you wrote it</h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-ink/80">BrandQuill learns your voice, your audiences and your facts, then drafts blogs, ads, emails and campaign briefs your team can ship.</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/signup" className="btn-primary">Start 7-day free trial</Link>
            <Link href="/pricing" className="btn-outline">See pricing</Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-20">
        <h2 className="max-w-2xl text-3xl font-semibold sm:text-4xl">One shared context behind every piece of copy</h2>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {pillars.map((p) => (
            <div key={p.title} className="card">
              <p.icon className="h-6 w-6 text-coral" aria-hidden />
              <h3 className="mt-4 text-xl font-semibold">{p.title}</h3>
              <p className="mt-2 text-sm text-mute">{p.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-paper">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-20 md:grid-cols-2">
          <div>
            <h2 className="text-3xl font-semibold sm:text-4xl">Drafts you can trust, checks you can see</h2>
            <p className="mt-4 text-mute">Every draft gets a brand check computed from your rules, not guessed by a model: banned words found, sentence length against your sample, and an overall score. You see exactly why a draft passes or needs another pass.</p>
            <ul className="mt-6 space-y-3 text-sm">
              <li className="flex gap-3"><ShieldCheck className="h-5 w-5 shrink-0 text-coral" aria-hidden /> Facts come only from your brief and knowledge. Gaps are marked as placeholders, not invented.</li>
              <li className="flex gap-3"><Gauge className="h-5 w-5 shrink-0 text-coral" aria-hidden /> Plan limits and usage are tracked per workspace and visible on your dashboard.</li>
            </ul>
          </div>
          <div className="card self-start">
            <p className="text-xs uppercase tracking-wide text-mute">Brand check</p>
            <p className="mt-2 font-display text-5xl font-semibold">92<span className="text-lg text-mute"> / 100</span></p>
            <dl className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between border-t border-line pt-2"><dt>Banned words found</dt><dd>0</dd></div>
              <div className="flex justify-between border-t border-line pt-2"><dt>Avg sentence length</dt><dd>14.2 vs 15.1 sample</dd></div>
            </dl>
            <p className="mt-4 text-xs text-mute">Illustrative example of the check shown after each draft.</p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-20">
        <h2 className="text-3xl font-semibold sm:text-4xl">Templates for the work marketers repeat</h2>
        <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {TEMPLATES.map((t) => (
            <div key={t.id} className="border border-line p-4">
              <p className="text-xs text-coral">{t.category}</p>
              <p className="mt-1 font-medium">{t.name}</p>
              <p className="mt-1 text-sm text-mute">{t.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-ink text-white">
        <div className="mx-auto max-w-3xl px-4 py-20 text-center">
          <h2 className="text-3xl font-semibold sm:text-4xl">Give your brand a writing partner</h2>
          <p className="mt-4 text-white/75">Start a 7-day trial. No card needed to look around.</p>
          <Link href="/signup" className="btn-coral mt-8">Start free trial</Link>
        </div>
      </section>
    </>
  );
}
