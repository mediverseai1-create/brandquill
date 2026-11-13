import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { verifyStripeSignature } from "@/lib/stripe-signature";

export const runtime = "nodejs";

/**
 * Verified payment confirmation. Subscription state changes ONLY here (service role).
 * Payment Links must pass client_reference_id = workspace id (the Billing page appends it).
 * Events handled: checkout.session.completed, customer.subscription.updated/deleted.
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

  if (event.type === "checkout.session.completed" && obj.client_reference_id && obj.payment_status !== "unpaid") {
    await db.from("subscriptions").update({
      plan: "pro", status: "active", customer_ref: obj.customer ?? null, subscription_ref: obj.subscription ?? null,
      updated_at: new Date().toISOString(),
    }).eq("workspace_id", obj.client_reference_id);
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
