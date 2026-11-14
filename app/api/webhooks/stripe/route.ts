import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { verifyStripeSignature } from "@/lib/stripe-signature";

export const runtime = "nodejs";

/**
 * Verified payment confirmation. Subscription state changes ONLY here (service role).
 * Workspace is matched by client_reference_id (added by the in-app Billing page), or,
 * for links opened from the public pricing page, by the buyer's checkout email.
 * Business is recognised by STRIPE_BUSINESS_PAYMENT_LINK_ID; anything else paid is Pro.
 */
export async function POST(req: Request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret || !process.env.SUPABASE_SERVICE_ROLE_KEY) return NextResponse.json({ error: "Webhook not configured" }, { status: 503 });
  const raw = await req.text();
  if (!verifyStripeSignature(raw, req.headers.get("stripe-signature"), secret)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }
  const event = JSON.parse(raw);
  const obj = event.data?.object ?? {};
  const db = createServiceClient();

  if (event.type === "checkout.session.completed" && obj.payment_status !== "unpaid") {
    let workspaceId: string | null = obj.client_reference_id ?? null;
    if (!workspaceId) {
      const email = (obj.customer_details?.email ?? obj.customer_email ?? "").toLowerCase();
      if (email) {
        const { data: profile } = await db.from("profiles").select("id").ilike("email", email).maybeSingle();
        if (profile) {
          const { data: m } = await db.from("workspace_members").select("workspace_id").eq("user_id", profile.id).eq("role", "owner").limit(1).maybeSingle();
          workspaceId = m?.workspace_id ?? null;
        }
      }
    }
    if (workspaceId) {
      const isBusiness = Boolean(process.env.STRIPE_BUSINESS_PAYMENT_LINK_ID) && obj.payment_link === process.env.STRIPE_BUSINESS_PAYMENT_LINK_ID;
      await db.from("subscriptions").update({
        plan: isBusiness ? "business" : "pro", status: "active", customer_ref: obj.customer ?? null, subscription_ref: obj.subscription ?? null,
        updated_at: new Date().toISOString(),
      }).eq("workspace_id", workspaceId);
    }
  } else if (event.type === "customer.subscription.updated" || event.type === "customer.subscription.deleted") {
    const active = event.type === "customer.subscription.updated" && ["active", "trialing"].includes(obj.status);
    const status = active ? "active" : obj.status === "past_due" ? "past_due" : "canceled";
    const interval = obj.items?.data?.[0]?.plan?.interval === "year" ? "year" : "month";
    await db.from("subscriptions").update({
      status, billing_interval: interval,
      current_period_end: obj.current_period_end ? new Date(obj.current_period_end * 1000).toISOString() : null,
      updated_at: new Date().toISOString(),
    }).eq("subscription_ref", obj.id);
  }
  return NextResponse.json({ received: true });
}
