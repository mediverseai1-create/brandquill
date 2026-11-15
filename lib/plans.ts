export type PlanId = "trial" | "free" | "pro" | "business";
/** Plan values stored in the database; "free" is derived when a trial ends or a subscription lapses. */
export type StoredPlan = Exclude<PlanId, "free">;

export interface PlanLimits {
  name: string;
  monthlyGenerations: number; // Infinity = unlimited
  brandVoices: number;
  knowledgeItems: number;
  audiences: number;
}

export const PLANS: Record<PlanId, PlanLimits> = {
  free: { name: "Free", monthlyGenerations: 5, brandVoices: 1, knowledgeItems: 1, audiences: 1 },
  trial: { name: "Free trial", monthlyGenerations: 25, brandVoices: 1, knowledgeItems: 3, audiences: 2 },
  pro: { name: "Pro", monthlyGenerations: 600, brandVoices: 3, knowledgeItems: 10, audiences: 5 },
  business: { name: "Business", monthlyGenerations: Infinity, brandVoices: Infinity, knowledgeItems: Infinity, audiences: Infinity },
};

export const PRICES = { pro: 57, business: 97 };

/** Hosted Selar checkout pages. Override via env if the links change. */
export const PAYMENT_LINKS = {
  pro: process.env.NEXT_PUBLIC_PAYMENT_LINK_PRO || "https://selar.com/57plan?currency=USD",
  business: process.env.NEXT_PUBLIC_PAYMENT_LINK_BUSINESS || "https://selar.com/97plan?currency=USD",
};

export interface SubscriptionRow {
  plan: StoredPlan;
  status: "trialing" | "active" | "past_due" | "canceled" | "expired";
  trial_ends_at: string | null;
  current_period_end: string | null;
  billing_interval: "month" | "year" | null;
}

/** Plan that applies right now. Expired trials and lapsed or canceled subscriptions fall back to Free. */
export function effectivePlan(sub: SubscriptionRow | null, now = new Date()): PlanId {
  if (!sub) return "free";
  if (sub.status === "trialing") {
    return sub.trial_ends_at && new Date(sub.trial_ends_at) > now ? "trial" : "free";
  }
  if (sub.status === "active") return sub.plan === "trial" ? "free" : sub.plan;
  if (sub.status === "past_due") {
    return sub.current_period_end && new Date(sub.current_period_end) < now ? "free" : sub.plan === "trial" ? "free" : sub.plan;
  }
  return "free";
}

export function limitsFor(plan: PlanId): PlanLimits {
  return PLANS[plan];
}

export function startOfMonthUTC(now = new Date()): string {
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1)).toISOString();
}
