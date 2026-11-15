import Link from "next/link";
import { Check } from "lucide-react";
import type { Metadata } from "next";
import { PLANS, PRICES, PAYMENT_LINKS } from "@/lib/plans";

export const metadata: Metadata = { title: "Pricing" };

const faqs = [
  ["What happens after the trial?", "You move to the Free plan automatically. Your library stays, and you can upgrade to Pro or Business any time."],
  ["How is usage counted?", "Each saved draft counts as one generation. Limits reset on the first of each month (UTC)."],
  ["How do I pay?", "Plans check out through a secure hosted payment page. Your plan activates once the payment is confirmed."],
  ["When should I choose Business?", "Choose Business when your team needs unlimited generations, brand voices, audiences and knowledge to publish at market-leading volume."],
];

export default function Pricing() {
  const pro = PLANS.pro;
  const free = PLANS.free;
  return (
    <>
      <section className="bg-sky"><div className="mx-auto max-w-3xl px-4 py-16 text-center">
        <h1 className="text-4xl font-semibold sm:text-5xl">Simple pricing for teams built to win</h1>
        <p className="mt-4 text-ink/80">Start free, with a 7-day boost on signup. Upgrade when you're ready to dominate your industry.</p>
      </div></section>
      <section className="mx-auto grid max-w-6xl gap-6 px-4 py-16 md:grid-cols-3">
        <div className="card flex flex-col">
          <h2 className="text-2xl font-semibold">Free</h2>
          <p className="mt-3 font-display text-5xl font-semibold">$0<span className="text-base text-mute"> /month</span></p>
          <p className="text-sm text-mute">Free forever, no card needed</p>
          <ul className="mt-6 flex-1 space-y-2 text-sm">
            {[`${free.monthlyGenerations} generations per month`, `${free.brandVoices} brand voice`, `${free.audiences} audience`, `${free.knowledgeItems} knowledge item`, "All 8 templates and saved library", "Brand-check scoring"].map((f) => (
              <li key={f} className="flex gap-2"><Check className="h-4 w-4 shrink-0 text-coral" aria-hidden />{f}</li>
            ))}
          </ul>
          <Link href="/signup" className="btn-outline mt-8">Get started free</Link>
          <p className="mt-2 text-xs text-mute">New accounts also get 25 generations during a 7-day trial.</p>
        </div>
        <div className="card flex flex-col">
          <h2 className="text-2xl font-semibold">Pro</h2>
          <p className="mt-3 font-display text-5xl font-semibold">${PRICES.pro}<span className="text-base text-mute"> /month</span></p>
          <p className="text-sm text-mute">Billed monthly</p>
          <ul className="mt-6 flex-1 space-y-2 text-sm">
            {[`${pro.monthlyGenerations} generations per month`, `${pro.brandVoices} brand voices`, `${pro.audiences} audiences`, `${pro.knowledgeItems} knowledge items`, "All 8 templates and saved library", "Brand-check scoring"].map((f) => (
              <li key={f} className="flex gap-2"><Check className="h-4 w-4 shrink-0 text-coral" aria-hidden />{f}</li>
            ))}
          </ul>
          <a href={PAYMENT_LINKS.pro} className="btn-primary mt-8">Start Pro plan</a>
          <p className="mt-2 text-xs text-mute">Use the same email as your BrandQuill account so your plan activates automatically.</p>
        </div>
        <div className="card flex flex-col">
          <h2 className="text-2xl font-semibold">Business</h2>
          <p className="mt-3 font-display text-5xl font-semibold">${PRICES.business}<span className="text-base text-mute"> /month</span></p>
          <p className="text-sm text-mute">Billed monthly</p>
          <ul className="mt-6 flex-1 space-y-2 text-sm">
            {["Unlimited generations", "Unlimited voices, audiences and knowledge", "Everything in Pro", "Built for teams publishing at scale"].map((f) => (
              <li key={f} className="flex gap-2"><Check className="h-4 w-4 shrink-0 text-coral" aria-hidden />{f}</li>
            ))}
          </ul>
          <a href={PAYMENT_LINKS.business} className="btn-primary mt-8">Start Business plan</a>
          <p className="mt-2 text-xs text-mute">Use the same email as your BrandQuill account so your plan activates automatically.</p>
        </div>
      </section>
      <section className="mx-auto max-w-3xl px-4 pb-20">
        <h2 className="text-3xl font-semibold">Questions</h2>
        <div className="mt-6 divide-y divide-line border-y border-line">
          {faqs.map(([q, a]) => <details key={q} className="py-4"><summary className="cursor-pointer font-medium">{q}</summary><p className="mt-2 text-sm text-mute">{a}</p></details>)}
        </div>
      </section>
    </>
  );
}
