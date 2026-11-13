import { getContext } from "@/lib/workspace";
import { StudioForm } from "@/components/StudioForm";

export const metadata = { title: "Studio" };

export default async function Studio() {
  const { supabase, workspaceId } = await getContext();
  const [voices, auds, know] = await Promise.all([
    supabase.from("brand_voices").select("id,name").eq("workspace_id", workspaceId).order("created_at"),
    supabase.from("audiences").select("id,name").eq("workspace_id", workspaceId).order("created_at"),
    supabase.from("knowledge_items").select("id,title").eq("workspace_id", workspaceId).order("created_at"),
  ]);
  return (
    <div>
      <h1 className="text-3xl font-semibold">Studio</h1>
      <p className="mt-1 text-sm text-mute">Choose a template, add your brief and generate a draft.</p>
      <StudioForm voices={voices.data ?? []} audiences={auds.data ?? []} knowledge={know.data ?? []} />
    </div>
  );
}
