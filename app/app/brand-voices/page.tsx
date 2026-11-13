import { getContext } from "@/lib/workspace";
import { createVoice } from "../actions";
import { DeleteForm, LimitNotice } from "@/components/ResourceList";

export const metadata = { title: "Brand voices" };

export default async function Voices({ searchParams }: { searchParams: { error?: string } }) {
  const { supabase, workspaceId, limits } = await getContext();
  const { data } = await supabase.from("brand_voices").select("*").eq("workspace_id", workspaceId).order("created_at");
  return (
    <div>
      <h1 className="text-3xl font-semibold">Brand voices</h1>
      <p className="mt-1 text-sm text-mute">{data?.length ?? 0} of {limits.brandVoices === Infinity ? "unlimited" : limits.brandVoices} used. Drafts follow the voice you select and are checked against its rules.</p>
      <div className="mt-6"><LimitNotice error={searchParams.error} /></div>
      {data?.length ? <ul className="mb-8 space-y-3">{data.map((v) => (
        <li key={v.id} className="card flex items-start justify-between gap-4"><div><p className="font-medium">{v.name}</p><p className="text-sm text-mute">{v.description}</p>
          <p className="mt-1 text-xs text-mute">{v.tone_traits.join(" · ")}{v.avoid_words.length ? ` — avoids: ${v.avoid_words.join(", ")}` : ""}</p></div><DeleteForm table="brand_voices" id={v.id} /></li>))}</ul>
        : <p className="mb-8 border border-dashed border-line p-6 text-sm text-mute">No voices yet. Describe how your brand sounds below.</p>}
      <form action={createVoice} className="card space-y-4"><h2 className="text-xl font-semibold">New voice</h2>
        <div><label className="label" htmlFor="name">Name</label><input id="name" name="name" required maxLength={80} className="input" placeholder="e.g. Company voice" /></div>
        <div><label className="label" htmlFor="description">Description</label><textarea id="description" name="description" rows={2} maxLength={1000} className="input" placeholder="Who are we when we write?" /></div>
        <div><label className="label" htmlFor="tone">Tone traits (comma separated)</label><input id="tone" name="tone" className="input" placeholder="warm, direct, curious" /></div>
        <div><label className="label" htmlFor="rules">Writing rules</label><textarea id="rules" name="rules" rows={3} maxLength={1500} className="input" placeholder="Short sentences. Lead with the benefit. Use active voice." /></div>
        <div><label className="label" htmlFor="avoid">Words to avoid (comma separated)</label><input id="avoid" name="avoid" className="input" placeholder="synergy, leverage, game-changing" /></div>
        <div><label className="label" htmlFor="sample">Writing sample</label><textarea id="sample" name="sample" rows={5} maxLength={6000} className="input" placeholder="Paste a paragraph or two you consider perfectly on-brand." /></div>
        <button className="btn-primary">Save voice</button></form>
    </div>
  );
}
