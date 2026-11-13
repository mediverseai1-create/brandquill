import Link from "next/link";
import { getContext } from "@/lib/workspace";
import { getTemplate } from "@/lib/templates";

export const metadata = { title: "Library" };

export default async function Library() {
  const { supabase, workspaceId } = await getContext();
  const { data } = await supabase.from("generations").select("id,title,template,created_at,brand_check").eq("workspace_id", workspaceId).order("created_at", { ascending: false }).limit(100);
  return (
    <div>
      <h1 className="text-3xl font-semibold">Library</h1>
      {data?.length ? (
        <ul className="mt-6 divide-y divide-line border border-line">
          {data.map((g) => (
            <li key={g.id}><Link href={`/app/library/${g.id}`} className="flex items-center justify-between gap-4 p-4 hover:bg-sky-soft">
              <span><span className="font-medium">{g.title}</span><span className="block text-xs text-mute">{getTemplate(g.template)?.name} · {new Date(g.created_at).toLocaleDateString()}</span></span>
              {g.brand_check && <span className="text-sm text-mute">Score {(g.brand_check as { score: number }).score}</span>}
            </Link></li>
          ))}
        </ul>
      ) : <p className="mt-6 border border-dashed border-line p-8 text-sm text-mute">Nothing saved yet. Drafts you generate in the <Link className="underline" href="/app/studio">Studio</Link> appear here.</p>}
    </div>
  );
}
