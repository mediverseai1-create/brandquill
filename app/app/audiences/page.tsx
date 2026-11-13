import { getContext } from "@/lib/workspace";
import { createAudience } from "../actions";
import { DeleteForm, LimitNotice } from "@/components/ResourceList";

export const metadata = { title: "Audiences" };

export default async function Audiences({ searchParams }: { searchParams: { error?: string } }) {
  const { supabase, workspaceId, limits } = await getContext();
  const { data } = await supabase.from("audiences").select("*").eq("workspace_id", workspaceId).order("created_at");
  return (
    <div>
      <h1 className="text-3xl font-semibold">Audiences</h1>
      <p className="mt-1 text-sm text-mute">{data?.length ?? 0} of {limits.audiences === Infinity ? "unlimited" : limits.audiences} used.</p>
      <div className="mt-6"><LimitNotice error={searchParams.error} /></div>
      {data?.length ? <ul className="mb-8 space-y-3">{data.map((a) => (
        <li key={a.id} className="card flex items-start justify-between gap-4"><div><p className="font-medium">{a.name}</p><p className="text-sm text-mute">{a.description}</p>{a.pain_points && <p className="mt-1 text-xs text-mute">Pain points: {a.pain_points}</p>}</div><DeleteForm table="audiences" id={a.id} /></li>))}</ul>
        : <p className="mb-8 border border-dashed border-line p-6 text-sm text-mute">No audiences yet. Add the people you write for.</p>}
      <form action={createAudience} className="card space-y-4"><h2 className="text-xl font-semibold">New audience</h2>
        <div><label className="label" htmlFor="name">Name</label><input id="name" name="name" required maxLength={80} className="input" placeholder="e.g. Heads of marketing at SaaS companies" /></div>
        <div><label className="label" htmlFor="description">Who they are</label><textarea id="description" name="description" rows={3} maxLength={1000} className="input" /></div>
        <div><label className="label" htmlFor="pains">Pain points</label><textarea id="pains" name="pains" rows={3} maxLength={1500} className="input" /></div>
        <button className="btn-primary">Save audience</button></form>
    </div>
  );
}
