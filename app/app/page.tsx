import Link from "next/link";
import { getContext } from "@/lib/workspace";
import { getTemplate } from "@/lib/templates";

export const metadata = { title: "Dashboard" };

export default async function Dashboard() {
  const { supabase, workspaceId, plan, limits, used, subscription } = await getContext();
  const [{ data: recent }, voices, auds, know] = await Promise.all([
    supabase.from("generations").select("id,title,template,created_at,brand_check").eq("workspace_id", workspaceId).order("created_at", { ascending: false }).limit(5),
    supabase.from("brand_voices").select("id", { count: "exact", head: true }),
    supabase.from("audiences").select("id", { count: "exact", head: true }),
    supabase.from("knowledge_items").select("id", { count: "exact", head: true }),
  ]);
  const cap = limits.monthlyGenerations;
  const pct = cap === Infinity ? 0 : cap === 0 ? 100 : Math.min(100, Math.round((used / cap) * 100));
  const setup = [
    { done: (voices.count ?? 0) > 0, label: "Create a brand voice", href: "/app/brand-voices" },
    { done: (auds.count ?? 0) > 0, label: "Add an audience", href: "/app/audiences" },
    { done: (know.count ?? 0) > 0, label: "Add product knowledge", href: "/app/knowledge" },
    { done: (recent?.length ?? 0) > 0, label: "Generate your first draft", href: "/app/studio" },
  ];
  return (
    <div className="space-y-8">
      <div><h1 className="text-3xl font-semibold">Dashboard</h1></div>
      {plan === "none" && <div className="border border-coral bg-coral/10 p-4 text-sm">Your trial or subscription is not active. <Link className="underline" href="/app/billing">Upgrade to keep generating.</Link></div>}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="card"><p className="text-xs uppercase text-mute">Plan</p><p className="mt-1 font-display text-2xl">{limits.name}</p>
          {subscription?.status === "trialing" && subscription.trial_ends_at && <p className="text-xs text-mute">Trial ends {new Date(subscription.trial_ends_at).toLocaleDateString()}</p>}</div>
        <div className="card sm:col-span-2"><p className="text-xs uppercase text-mute">Generations this month</p>
          <p className="mt-1 font-display text-2xl">{used} <span className="text-base text-mute">/ {cap === Infinity ? "unlimited" : cap}</span></p>
          <div className="mt-3 h-2 bg-line" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} aria-label="Usage"><div className="h-2 bg-coral" style={{ width: `${pct}%` }} /></div></div>
      </div>
      <section>
        <h2 className="text-xl font-semibold">Get set up</h2>
        <ul className="mt-3 divide-y divide-line border border-line">
          {setup.map((s) => <li key={s.label} className="flex items-center justify-between p-3 text-sm"><span className={s.done ? "text-mute line-through" : ""}>{s.label}</span>{s.done ? <span className="text-xs text-mute">Done</span> : <Link className="btn-outline !py-1" href={s.href}>Start</Link>}</li>)}
        </ul>
      </section>
      <section>
        <div className="flex items-center justify-between"><h2 className="text-xl font-semibold">Recent drafts</h2><Link href="/app/library" className="text-sm underline">View all</Link></div>
        {recent?.length ? (
          <ul className="mt-3 divide-y divide-line border border-line">
            {recent.map((g) => <li key={g.id}><Link href={`/app/library/${g.id}`} className="flex justify-between p-3 text-sm hover:bg-sky-soft"><span>{g.title}<span className="ml-2 text-xs text-mute">{getTemplate(g.template)?.name}</span></span><span className="text-xs text-mute">{new Date(g.created_at).toLocaleDateString()}</span></Link></li>)}
          </ul>
        ) : <p className="mt-3 border border-dashed border-line p-6 text-sm text-mute">No drafts yet. Open the <Link className="underline" href="/app/studio">Studio</Link> to write your first one.</p>}
      </section>
    </div>
  );
}
