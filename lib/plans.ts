export type PlanId = "trial" | "pro" | "business";

export interface PlanLimits {
  name: string;
  monthlyGenerations: number; // Infinity = unlimited
  brandVoices: number;
  knowledgeItems: number;
  audiences: number;
}

export const PLANS: Record<PlanId, PlanLimits> = {
  trial: { name: "Free trial", monthlyGenerations: 25, brandVoices: 1, knowledgeItems: 3, audiences: 2 },
  pro: { name: "Pro", monthlyGenerations: 600, brandVoices: 3, knowledgeItems: 10, audiences: 5 },
  business: { name: "Business", monthlyGenerations: Infinity, brandVoices: Infinity, knowledgeItems: Infinity, audiences: Infinity },
};

const businessPrice = Number(process.env.NEXT_PUBLIC_BUSINESS_PRICE);
export const PRICES = { proMonthly: 59, proYearly: 49, business: Number.isFinite(businessPrice) && businessPrice > 0 ? businessPrice : null as number | null };

export interface SubscriptionRow {
  plan: PlanId;
  status: "trialing" | "active" | "past_due" | "canceled" | "expired";
  trial_ends_at: string | null;
  current_period_end: string | null;
  billing_interval: "month" | "year" | null;
}

/** Plan that actually applies right now (expired trials / canceled subs fall back to no access). */
export function effectivePlan(sub: SubscriptionRow | null, now = new Date()): PlanId | "none" {
  if (!sub) return "none";
  if (sub.status === "trialing") {
    return sub.trial_ends_at && new Date(sub.trial_ends_at) > now ? "trial" : "none";
  }
  if (sub.status === "active" || sub.status === "past_due") {
    if (sub.current_period_end && new Date(sub.current_period_end) < now && sub.status !== "active") return "none";
    return sub.plan;
  }
  return "none";
}

export function limitsFor(plan: PlanId | "none"): PlanLimits {
  return plan === "none"
    ? { name: "No active plan", monthlyGenerations: 0, brandVoices: 0, knowledgeItems: 0, audiences: 0 }
    : PLANS[plan];
}

export function startOfMonthUTC(now = new Date()): string {
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1)).toISOString();
}
