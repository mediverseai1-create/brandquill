import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { effectivePlan, limitsFor, startOfMonthUTC, type SubscriptionRow } from "@/lib/plans";

/** Loads the signed-in user, their workspace, plan and monthly usage. Redirects to /login if unauthenticated. */
export async function getContext() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  const { data: member } = await supabase
    .from("workspace_members").select("workspace_id, workspaces(name)").eq("user_id", user.id).limit(1).maybeSingle();
  if (!member) redirect("/login?error=no-workspace");
  const workspaceId = member.workspace_id as string;
  const wsRel = member.workspaces as unknown as { name: string } | { name: string }[] | null;
  const workspaceName = (Array.isArray(wsRel) ? wsRel[0]?.name : wsRel?.name) ?? "Workspace";
  const { data: sub } = await supabase.from("subscriptions").select("*").eq("workspace_id", workspaceId).maybeSingle();
  const subscription = (sub as SubscriptionRow | null) ?? null;
  const plan = effectivePlan(subscription);
  const limits = limitsFor(plan);
  const { count } = await supabase.from("usage_events").select("id", { count: "exact", head: true })
    .eq("workspace_id", workspaceId).gte("created_at", startOfMonthUTC());
  return { supabase, user, workspaceId, workspaceName, subscription, plan, limits, used: count ?? 0 };
}
