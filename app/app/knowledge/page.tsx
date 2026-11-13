import { getContext } from "@/lib/workspace";
import { createKnowledge } from "../actions";
import { DeleteForm, LimitNotice } from "@/components/ResourceList";
import { KnowledgeFile } from "@/components/KnowledgeFile";

export const metadata = { title: "Knowledge" };

export default async function Knowledge({ searchParams }: { searchParams: { error?: string } }) {
  const { supabase, workspaceId, limits } = await getContext();
  const { data } = await supabase.from("knowledge_items").select("id,title,content").eq("workspace_id", workspaceId).order("created_at");
  return (
    <div>
      <h1 className="text-3xl font-semibold">Knowledge</h1>
      <p className="mt-1 text-sm text-mute">{data?.length ?? 0} of {limits.knowledgeItems === Infinity ? "unlimited" : limits.knowledgeItems} used. Facts here can be selected as sources in the Studio.</p>
      <div className="mt-6"><LimitNotice error={searchParams.error} /></div>
      {data?.length ? <ul className="mb-8 space-y-3">{data.map((k) => (
        <li key={k.id} className="card flex items-start justify-between gap-4"><div><p className="font-medium">{k.title}</p><p className="line-clamp-2 text-sm text-mute">{k.content}</p></div><DeleteForm table="knowledge_items" id={k.id} /></li>))}</ul>
        : <p className="mb-8 border border-dashed border-line p-6 text-sm text-mute">No knowledge yet. Add product facts, positioning or FAQs.</p>}
      <form action={createKnowledge} className="card space-y-4"><h2 className="text-xl font-semibold">Add knowledge</h2>
        <div><label className="label" htmlFor="title">Title</label><input id="title" name="title" required maxLength={120} className="input" /></div>
        <KnowledgeFile />
        <button className="btn-primary">Save</button></form>
    </div>
  );
}
