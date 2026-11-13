import Link from "next/link";
import { Check } from "lucide-react";
import type { Metadata } from "next";
import { PLANS, PRICES } from "@/lib/plans";

export const metadata: Metadata = { title: "Pricing" };

const faqs = [
  ["What happens after the trial?", "Your library stays, but generating pauses until you subscribe to Pro."],
  ["How is usage counted?", "Each saved draft counts as one generation. Limits reset on the first of each month (UTC)."],
  ["How do I pay?", "Pro checks out through a secure hosted payment page. Your plan activates once the payment is confirmed."],
  ["Need more seats or unlimited usage?", "Business is custom. Contact us and we'll scope it with you."],
];

export default function Pricing() {
  const monthly = process.env.NEXT_PUBLIC_PAYMENT_LINK_PRO_MONTHLY;
  const yearly = process.env.NEXT_PUBLIC_PAYMENT_LINK_PRO_YEARLY;
  const pro = PLANS.pro;
  return (
    <>
      <section className="bg-sky"><div className="mx-auto max-w-3xl px-4 py-16 text-center">
        <h1 className="text-4xl font-semibold sm:text-5xl">Simple pricing for teams that write</h1>
        <p className="mt-4 text-ink/80">Start free for 7 days. Upgrade when it earns its place.</p>
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
          <div className="mt-8 flex flex-col gap-2">
            <Link href="/signup" className="btn-primary">Start 7-day free trial</Link>
            {(monthly || yearly) && <p className="text-xs text-mute">Already have an account? Subscribe from Billing inside the app.</p>}
          </div>
        </div>
        <div className="card flex flex-col">
          <h2 className="text-2xl font-semibold">Business</h2>
          <p className="mt-3 font-display text-5xl font-semibold">Custom</p>
          <p className="text-sm text-mute">Annual agreement</p>
          <ul className="mt-6 flex-1 space-y-2 text-sm">
            {["Unlimited generations", "Unlimited voices, audiences and knowledge", "Priority support", "Onboarding with our team"].map((f) => (
              <li key={f} className="flex gap-2"><Check className="h-4 w-4 shrink-0 text-coral" aria-hidden />{f}</li>
            ))}
          </ul>
          <Link href="/contact" className="btn-outline mt-8">Contact sales</Link>
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
