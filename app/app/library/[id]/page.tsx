import { notFound } from "next/navigation";
import Link from "next/link";
import { getContext } from "@/lib/workspace";
import { getTemplate } from "@/lib/templates";
import { deleteRow } from "../../actions";
import { CopyButton } from "@/components/CopyButton";

export default async function Draft({ params }: { params: { id: string } }) {
  const { supabase, workspaceId } = await getContext();
  if (!/^[0-9a-f-]{36}$/i.test(params.id)) notFound();
  const { data: g } = await supabase.from("generations").select("*").eq("id", params.id).eq("workspace_id", workspaceId).maybeSingle();
  if (!g) notFound();
  const bc = g.brand_check as { score: number; bannedHits: { word: string; count: number }[] } | null;
  return (
    <div>
      <Link href="/app/library" className="text-sm underline">← Library</Link>
      <h1 className="mt-3 text-3xl font-semibold">{g.title}</h1>
      <p className="text-sm text-mute">{getTemplate(g.template)?.name} · {new Date(g.created_at).toLocaleString()}{bc ? ` · Brand score ${bc.score}` : ""}</p>
      {bc?.bannedHits?.length ? <p className="mt-2 text-sm text-coral-dark">Avoided words used: {bc.bannedHits.map((h) => `${h.word} ×${h.count}`).join(", ")}</p> : null}
      <pre className="mt-6 whitespace-pre-wrap border border-line p-5 font-sans text-sm leading-relaxed">{g.content}</pre>
      <div className="mt-4 flex gap-2">
        <CopyButton text={g.content} />
        <form action={deleteRow}><input type="hidden" name="table" value="generations" /><input type="hidden" name="id" value={g.id} /><button className="btn-outline">Delete</button></form>
      </div>
    </div>
  );
}
