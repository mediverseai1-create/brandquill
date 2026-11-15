import { getContext } from "@/lib/workspace";
import { PRICES, PAYMENT_LINKS } from "@/lib/plans";

export const metadata = { title: "Billing" };

export default async function Billing() {
  const { subscription, plan, limits, used, user } = await getContext();
  return (
    <div>
      <h1 className="text-3xl font-semibold">Billing</h1>
      <div className="card mt-6">
        <p className="text-xs uppercase text-mute">Current plan</p>
        <p className="font-display text-3xl">{limits.name}</p>
        <p className="mt-1 text-sm text-mute">Status: {subscription?.status ?? "none"}{subscription?.status === "trialing" && subscription.trial_ends_at ? ` · ends ${new Date(subscription.trial_ends_at).toLocaleDateString()}` : ""}{subscription?.current_period_end ? ` · renews ${new Date(subscription.current_period_end).toLocaleDateString()}` : ""}</p>
        <p className="mt-3 text-sm">Usage this month: {used} / {limits.monthlyGenerations === Infinity ? "unlimited" : limits.monthlyGenerations}</p>
      </div>
      {plan !== "pro" && plan !== "business" && (
        <div className="card mt-6"><h2 className="text-xl font-semibold">Pro</h2>
          <p className="mt-1 text-sm text-mute">${PRICES.pro}/month. Your plan activates after payment is confirmed.</p>
          <a className="btn-primary mt-4" href={PAYMENT_LINKS.pro}>Start Pro plan</a>
        </div>
      )}
      {plan !== "business" && (
        <div className="card mt-6"><h2 className="text-xl font-semibold">Business</h2>
          <p className="mt-1 text-sm text-mute">${PRICES.business}/month. Unlimited generations, voices, audiences and knowledge.</p>
          <a className="btn-primary mt-4" href={PAYMENT_LINKS.business}>Start Business plan</a>
        </div>
      )}
      <p className="mt-6 text-sm text-mute">At checkout, use the email you signed up with ({user.email}) so your payment can be matched to this account.</p>
    </div>
  );
}
