import Link from "next/link";
import { Check } from "lucide-react";
import type { Metadata } from "next";
import { PLANS, PRICES } from "@/lib/plans";

export const metadata: Metadata = { title: "Pricing" };

const faqs = [
  ["What happens after the trial?", "Your library stays, but generating pauses until you subscribe to Pro or Business."],
  ["How is usage counted?", "Each saved draft counts as one generation. Limits reset on the first of each month (UTC)."],
  ["How do I pay?", "Plans check out through a secure hosted payment page. Your plan activates once the payment is confirmed."],
  ["When should I choose Business?", "Choose Business when your team needs unlimited generations, brand voices, audiences and knowledge to publish at market-leading volume."],
];

export default function Pricing() {
  const business = process.env.NEXT_PUBLIC_PAYMENT_LINK_BUSINESS;
  const pro = PLANS.pro;
  return (
    <>
      <section className="bg-sky"><div className="mx-auto max-w-3xl px-4 py-16 text-center">
        <h1 className="text-4xl font-semibold sm:text-5xl">Simple pricing for teams built to win</h1>
        <p className="mt-4 text-ink/80">Start free for 7 days. Upgrade when you're ready to dominate your industry.</p>
      </div></section>
      <section className="mx-auto grid max-w-4xl gap-6 px-4 py-16 md:grid-cols-2">
        <div className="card flex flex-col">
          <h2 className="text-2xl font-semibold">Pro</h2>
          <p className="mt-3 font-display text-5xl font-semibold">${PRICES.proMonthly}<span className="text-base text-mute"> /month</span></p>
          <p className="text-sm text-mute">or ${PRICES.proYearly}/month billed yearly</p>
          <ul className="mt-6 flex-1 space-y-2 text-sm">
            {[`${pro.monthlyGenerations} generations per month`, `${pro.brandVoices} brand voices`, `${pro.audiences} audiences`, `${pro.knowledgeItems} knowledge items`, "All 8 templates and saved library", "Brand-check scoring"].map((f) => (
              <li key={f} className="flex gap-2"><Check className="h-4 w-4 shrink-0 text-coral" aria-hidden />{f}</li>
            ))}
          </ul>
          <Link href="/signup" className="btn-primary mt-8">Start 7-day free trial</Link>
          <p className="mt-2 text-xs text-mute">Already have an account? Subscribe from Billing inside the app.</p>
        </div>
        <div className="card flex flex-col">
          <h2 className="text-2xl font-semibold">Business</h2>
          <p className="mt-3 font-display text-5xl font-semibold">{PRICES.business ? <>${PRICES.business}<span className="text-base text-mute"> /month</span></> : "—"}</p>
          <p className="text-sm text-mute">{PRICES.business ? "Billed monthly" : "Price not set yet"}</p>
          <ul className="mt-6 flex-1 space-y-2 text-sm">
            {["Unlimited generations", "Unlimited voices, audiences and knowledge", "Everything in Pro", "Built for teams publishing at scale"].map((f) => (
              <li key={f} className="flex gap-2"><Check className="h-4 w-4 shrink-0 text-coral" aria-hidden />{f}</li>
            ))}
          </ul>
          {business
            ? <a href={business} className="btn-primary mt-8">Start Business plan</a>
            : <span className="btn-primary mt-8 opacity-50" aria-disabled="true">Start Business plan</span>}
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
