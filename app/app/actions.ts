"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { getContext } from "@/lib/workspace";
import { limitsFor, effectivePlan } from "@/lib/plans";

const csv = (s: string) => s.split(",").map((x) => x.trim()).filter(Boolean).slice(0, 50);

async function guard(table: "brand_voices" | "audiences" | "knowledge_items", limitKey: "brandVoices" | "audiences" | "knowledgeItems") {
  const ctx = await getContext();
  const limits = limitsFor(effectivePlan(ctx.subscription));
  const { count } = await ctx.supabase.from(table).select("id", { count: "exact", head: true }).eq("workspace_id", ctx.workspaceId);
  if ((count ?? 0) >= limits[limitKey]) redirect(`/app/${table === "brand_voices" ? "brand-voices" : table === "knowledge_items" ? "knowledge" : "audiences"}?error=limit`);
  return ctx;
}

const Voice = z.object({ name: z.string().trim().min(1).max(80), description: z.string().max(1000), tone: z.string().max(300), rules: z.string().max(1500), avoid: z.string().max(500), sample: z.string().max(6000) });
export async function createVoice(formData: FormData) {
  const p = Voice.safeParse(Object.fromEntries(formData));
  if (!p.success) redirect("/app/brand-voices?error=invalid");
  const ctx = await guard("brand_voices", "brandVoices");
  await ctx.supabase.from("brand_voices").insert({ workspace_id: ctx.workspaceId, name: p.data.name, description: p.data.description, tone_traits: csv(p.data.tone), do_rules: p.data.rules, avoid_words: csv(p.data.avoid), sample_text: p.data.sample });
  revalidatePath("/app/brand-voices"); redirect("/app/brand-voices");
}

const Aud = z.object({ name: z.string().trim().min(1).max(80), description: z.string().max(1000), pains: z.string().max(1500) });
export async function createAudience(formData: FormData) {
  const p = Aud.safeParse(Object.fromEntries(formData));
  if (!p.success) redirect("/app/audiences?error=invalid");
  const ctx = await guard("audiences", "audiences");
  await ctx.supabase.from("audiences").insert({ workspace_id: ctx.workspaceId, name: p.data.name, description: p.data.description, pain_points: p.data.pains });
  revalidatePath("/app/audiences"); redirect("/app/audiences");
}

const Know = z.object({ title: z.string().trim().min(1).max(120), content: z.string().trim().min(1).max(20000) });
export async function createKnowledge(formData: FormData) {
  const p = Know.safeParse(Object.fromEntries(formData));
  if (!p.success) redirect("/app/knowledge?error=invalid");
  const ctx = await guard("knowledge_items", "knowledgeItems");
  await ctx.supabase.from("knowledge_items").insert({ workspace_id: ctx.workspaceId, ...p.data });
  revalidatePath("/app/knowledge"); redirect("/app/knowledge");
}

export async function deleteRow(formData: FormData) {
  const table = z.enum(["brand_voices", "audiences", "knowledge_items", "generations"]).parse(formData.get("table"));
  const id = z.string().uuid().parse(formData.get("id"));
  const supabase = createClient();
  await supabase.from(table).delete().eq("id", id); // RLS restricts to own workspace
  const back = { brand_voices: "/app/brand-voices", audiences: "/app/audiences", knowledge_items: "/app/knowledge", generations: "/app/library" }[table];
  revalidatePath(back); redirect(back);
}

export async function updateProfile(formData: FormData) {
  const name = z.string().trim().min(1).max(80).safeParse(formData.get("full_name"));
  const ws = z.string().trim().min(1).max(80).safeParse(formData.get("workspace"));
  if (!name.success || !ws.success) redirect("/app/settings?error=invalid");
  const ctx = await getContext();
  await ctx.supabase.from("profiles").update({ full_name: name.data }).eq("id", ctx.user.id);
  await ctx.supabase.from("workspaces").update({ name: ws.data }).eq("id", ctx.workspaceId);
  revalidatePath("/app", "layout"); redirect("/app/settings?saved=1");
}

export async function signOut() {
  await createClient().auth.signOut();
  redirect("/");
}
