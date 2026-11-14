import Link from "next/link";
import { BookOpenText, Users, Library, ShieldCheck, PenLine, Gauge } from "lucide-react";
import { TEMPLATES } from "@/lib/templates";

const pillars = [
  { icon: BookOpenText, title: "Brand voice", text: "Define the voice that sets you apart: tone, rules, words to avoid and a writing sample. Every draft is written to match, so your market hears one confident, recognisable team." },
  { icon: Users, title: "Audiences", text: "Save the buyers you need to win, with their pain points and priorities, so your copy speaks to the person making the decision instead of a crowd." },
  { icon: Library, title: "Knowledge", text: "Keep product facts, proof points and positioning in one place. Drafts draw on what is true about you, and on how you beat the alternatives." },
  { icon: PenLine, title: "Studio", text: "Pick a template, add the brief and get campaign-ready copy saved to your library. Ship a full launch in the time it used to take to write one asset." },
];

const wins = [
  ["Out-publish your competitors", "Market leaders win on consistent volume. BrandQuill gives a small team the output of a much larger one, across blogs, ads, email, social, PR and landing pages."],
  ["Stay sharper than the category", "Every draft starts from your positioning and audience, not a blank page, so each piece reinforces why buyers should choose you."],
  ["Move from idea to launch faster", "Turn a campaign brief into channel-ready content in minutes, then iterate while competitors are still in their first review."],
];

export default function Home() {
  return (
    <>
      <section className="bg-sky">
        <div className="mx-auto max-w-4xl px-4 py-20 text-center sm:py-28">
          <p className="mx-auto mb-6 inline-block border border-ink/20 bg-white px-3 py-1 text-xs">New · Brand-check scoring on every draft</p>
          <h1 className="text-4xl font-semibold leading-tight sm:text-6xl">The AI content studio for teams that want to dominate their industry</h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-ink/80">BrandQuill turns your positioning, audiences and product facts into blogs, ads, emails and campaign briefs, so your team can publish more, move faster and win more of your market.</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/signup" className="btn-primary">Start 7-day free trial</Link>
            <Link href="/pricing" className="btn-outline">See pricing</Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-20">
        <h2 className="max-w-2xl text-3xl font-semibold sm:text-4xl">One shared context behind every move you make</h2>
        <p className="mt-4 max-w-3xl text-mute">Teams that lead their category do not start from scratch each time. They work from a clear position, a defined buyer and a bank of facts. BrandQuill holds all three, and puts them behind every piece of content you create.</p>
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

      <section className="border-y border-line">
        <div className="mx-auto max-w-6xl px-4 py-20">
          <h2 className="max-w-2xl text-3xl font-semibold sm:text-4xl">How BrandQuill helps you win your market</h2>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {wins.map(([t, d]) => <div key={t}><h3 className="text-xl font-semibold">{t}</h3><p className="mt-2 text-sm text-mute">{d}</p></div>)}
          </div>
        </div>
      </section>

      <section className="bg-paper">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-20 md:grid-cols-2">
          <div>
            <h2 className="text-3xl font-semibold sm:text-4xl">Drafts you can trust, checks you can see</h2>
            <p className="mt-4 text-mute">Leading a market means never publishing something that undercuts you. Every draft gets a brand check computed from your own rules, not guessed by a model: banned words found, sentence length against your sample, and an overall score. You see exactly why a draft is ready to ship or needs another pass.</p>
            <ul className="mt-6 space-y-3 text-sm">
              <li className="flex gap-3"><ShieldCheck className="h-5 w-5 shrink-0 text-coral" aria-hidden /> Facts come only from your brief and knowledge. Gaps are marked as placeholders, so a made-up claim never reaches your audience.</li>
              <li className="flex gap-3"><Gauge className="h-5 w-5 shrink-0 text-coral" aria-hidden /> Plan limits and usage are tracked per workspace and visible on your dashboard, so you always know your capacity to publish.</li>
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
        <h2 className="text-3xl font-semibold sm:text-4xl">Templates for the work that moves a market</h2>
        <p className="mt-4 max-w-3xl text-mute">From the campaign brief that sets direction to the ad that captures demand, each template is built for a job your team repeats every week.</p>
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
          <h2 className="text-3xl font-semibold sm:text-4xl">Build the content engine that leads your industry</h2>
          <p className="mt-4 text-white/75">Start a 7-day trial and see how fast your team can ship.</p>
          <Link href="/signup" className="btn-coral mt-8">Start free trial</Link>
        </div>
      </section>
    </>
  );
}
