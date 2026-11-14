import Link from "next/link";
import { getContext } from "@/lib/workspace";
import { PRICES } from "@/lib/plans";

export const metadata = { title: "Billing" };

export default async function Billing({ searchParams }: { searchParams: { paid?: string } }) {
  const { workspaceId, subscription, plan, limits, used, user } = await getContext();
  const link = (base?: string) => {
    if (!base) return null;
    const u = new URL(base);
    u.searchParams.set("client_reference_id", workspaceId);
    if (user.email) u.searchParams.set("prefilled_email", user.email);
    return u.toString();
  };
  const monthly = link(process.env.NEXT_PUBLIC_PAYMENT_LINK_PRO_MONTHLY);
  const yearly = link(process.env.NEXT_PUBLIC_PAYMENT_LINK_PRO_YEARLY);
  const business = link(process.env.NEXT_PUBLIC_PAYMENT_LINK_BUSINESS);
  const portal = process.env.NEXT_PUBLIC_BILLING_PORTAL_URL;
  const isPro = plan === "pro" || plan === "business";
  return (
    <div>
      <h1 className="text-3xl font-semibold">Billing</h1>
      {searchParams.paid && <p role="status" className="mt-4 border border-line bg-sky-soft p-3 text-sm">Thanks! Your plan updates as soon as the payment is confirmed. Refresh in a moment if it still shows the old plan.</p>}
      <div className="card mt-6">
        <p className="text-xs uppercase text-mute">Current plan</p>
        <p className="font-display text-3xl">{limits.name}</p>
        <p className="mt-1 text-sm text-mute">Status: {subscription?.status ?? "none"}{subscription?.status === "trialing" && subscription.trial_ends_at ? ` · ends ${new Date(subscription.trial_ends_at).toLocaleDateString()}` : ""}{subscription?.current_period_end ? ` · renews ${new Date(subscription.current_period_end).toLocaleDateString()}` : ""}</p>
        <p className="mt-3 text-sm">Usage this month: {used} / {limits.monthlyGenerations === Infinity ? "unlimited" : limits.monthlyGenerations}</p>
      </div>
      {!isPro && (
        <div className="card mt-6"><h2 className="text-xl font-semibold">Upgrade to Pro</h2>
          <p className="mt-1 text-sm text-mute">${PRICES.proMonthly}/month, or ${PRICES.proYearly}/month billed yearly. Your plan activates after secure payment is confirmed.</p>
          {monthly || yearly ? <div className="mt-4 flex flex-wrap gap-3">
            {monthly && <a className="btn-primary" href={monthly}>Pay monthly</a>}{yearly && <a className="btn-outline" href={yearly}>Pay yearly</a>}</div>
            : <p className="mt-4 border border-line bg-paper p-3 text-sm text-mute">Payment links are not configured yet (NEXT_PUBLIC_PAYMENT_LINK_PRO_MONTHLY / _YEARLY).</p>}
        </div>
      )}
      {isPro && plan === "pro" && portal && <a className="btn-outline mt-6" href={portal}>Manage subscription</a>}
      {plan !== "business" && (
        <div className="card mt-6"><h2 className="text-xl font-semibold">Business plan</h2>
          <p className="mt-1 text-sm text-mute">{PRICES.business ? `$${PRICES.business}/month. ` : ""}Unlimited generations, voices, audiences and knowledge.</p>
          {business ? <a className="btn-primary mt-4" href={business}>Start Business plan</a>
            : <p className="mt-4 border border-line bg-paper p-3 text-sm text-mute">Payment link not configured (NEXT_PUBLIC_PAYMENT_LINK_BUSINESS).</p>}
        </div>
      )}
    </div>
  );
}
