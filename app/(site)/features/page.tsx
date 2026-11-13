import Link from "next/link";
import type { Metadata } from "next";
import { TEMPLATES } from "@/lib/templates";

export const metadata: Metadata = { title: "Platform" };

const modules = [
  ["Brand voices", "Define tone traits, rules, banned words and a writing sample. Drafts follow them and are checked against them."],
  ["Audiences", "Capture who you write for and what they struggle with. Pick one per draft."],
  ["Knowledge base", "Store product facts, positioning and proof points. Choose which sources a draft may draw on."],
  ["Content studio", "Eight templates covering blogs, ads, email, social, PR, landing pages and campaign briefs."],
  ["Library", "Every draft is saved with its brief, voice and brand-check result. Search, copy or delete."],
  ["Usage and billing", "Monthly generation limits per plan, with usage shown on your dashboard and billing page."],
];

export default function Features() {
  return (
    <>
      <section className="bg-sky"><div className="mx-auto max-w-4xl px-4 py-16 text-center">
        <h1 className="text-4xl font-semibold sm:text-5xl">The BrandQuill platform</h1>
        <p className="mx-auto mt-4 max-w-2xl text-ink/80">Context first, content second. Set up your brand once and every draft starts from it.</p>
      </div></section>
      <section className="mx-auto grid max-w-6xl gap-4 px-4 py-16 sm:grid-cols-2 lg:grid-cols-3">
        {modules.map(([t, d]) => <div key={t} className="card"><h2 className="text-xl font-semibold">{t}</h2><p className="mt-2 text-sm text-mute">{d}</p></div>)}
      </section>
      <section className="bg-paper"><div className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="text-3xl font-semibold">Templates</h2>
        <ul className="mt-6 grid gap-3 sm:grid-cols-2">
          {TEMPLATES.map((t) => <li key={t.id} className="border border-line bg-white p-4"><span className="font-medium">{t.name}</span> <span className="text-xs text-coral">· {t.category}</span><p className="mt-1 text-sm text-mute">{t.description}</p></li>)}
        </ul>
        <Link href="/signup" className="btn-primary mt-8">Start free trial</Link>
      </div></section>
    </>
  );
}
