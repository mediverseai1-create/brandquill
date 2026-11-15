import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient, supabaseConfigured } from "@/lib/supabase/server";
import { effectivePlan, limitsFor, startOfMonthUTC, type SubscriptionRow } from "@/lib/plans";
import { getTemplate } from "@/lib/templates";
import { generateJSON, AIError } from "@/lib/gemini";
import { brandCheck } from "@/lib/brand-check";

export const maxDuration = 60;

const Body = z.object({
  template: z.string(),
  inputs: z.record(z.string().max(4000)),
  voiceId: z.string().uuid().nullable().optional(),
  audienceId: z.string().uuid().nullable().optional(),
  knowledgeIds: z.array(z.string().uuid()).max(10).default([]),
});

export async function POST(req: Request) {
  if (!supabaseConfigured()) return NextResponse.json({ error: "Backend is not configured." }, { status: 503 });
  const parsed = Body.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  const { template: templateId, inputs, voiceId, audienceId, knowledgeIds } = parsed.data;

  const template = getTemplate(templateId);
  if (!template) return NextResponse.json({ error: "Unknown template." }, { status: 400 });
  for (const f of template.fields) {
    if (f.required && !inputs[f.name]?.trim()) return NextResponse.json({ error: `${f.label} is required.` }, { status: 400 });
  }

  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Please sign in." }, { status: 401 });

  const { data: member } = await supabase.from("workspace_members").select("workspace_id").eq("user_id", user.id).limit(1).maybeSingle();
  if (!member) return NextResponse.json({ error: "No workspace found." }, { status: 403 });
  const workspaceId = member.workspace_id as string;

  const { data: sub } = await supabase.from("subscriptions").select("*").eq("workspace_id", workspaceId).maybeSingle();
  const plan = effectivePlan(sub as SubscriptionRow | null);
  const limits = limitsFor(plan);
  const { count } = await supabase.from("usage_events").select("id", { count: "exact", head: true })
    .eq("workspace_id", workspaceId).gte("created_at", startOfMonthUTC());
  if ((count ?? 0) >= limits.monthlyGenerations) {
    return NextResponse.json({ error: "You have used all generations for this month on your plan. Upgrade for more.", code: "limit" }, { status: 402 });
  }

  // RLS guarantees these rows belong to the caller's workspace.
  const [voice, audience, knowledge] = await Promise.all([
    voiceId ? supabase.from("brand_voices").select("*").eq("id", voiceId).eq("workspace_id", workspaceId).maybeSingle() : Promise.resolve({ data: null }),
    audienceId ? supabase.from("audiences").select("*").eq("id", audienceId).eq("workspace_id", workspaceId).maybeSingle() : Promise.resolve({ data: null }),
    knowledgeIds.length ? supabase.from("knowledge_items").select("title, content").in("id", knowledgeIds).eq("workspace_id", workspaceId) : Promise.resolve({ data: [] }),
  ]);

  const system = [
    "You are BrandQuill, a senior marketing copywriter. Write only what is requested.",
    "Use only facts supplied by the user or the knowledge sources. Never invent statistics, customers, quotes or claims; use [placeholder] for missing facts.",
    voice.data && `BRAND VOICE "${voice.data.name}": ${voice.data.description}\nTone: ${(voice.data.tone_traits ?? []).join(", ")}\nRules: ${voice.data.do_rules}\nNever use these words: ${(voice.data.avoid_words ?? []).join(", ") || "none"}\n${voice.data.sample_text ? `Writing sample to match in rhythm and style:\n"""${voice.data.sample_text.slice(0, 3000)}"""` : ""}`,
    audience.data && `AUDIENCE "${audience.data.name}": ${audience.data.description}\nPain points: ${audience.data.pain_points}`,
    knowledge.data?.length ? `KNOWLEDGE SOURCES:\n${knowledge.data.map((k: { title: string; content: string }) => `## ${k.title}\n${k.content.slice(0, 4000)}`).join("\n\n")}` : "",
    `OUTPUT FORMAT: ${template.format}`,
    'Respond as JSON: {"title": short document title, "content": the finished copy}.',
  ].filter(Boolean).join("\n\n");

  const prompt = `Template: ${template.name}\n` + template.fields.map((f) => `${f.label}: ${inputs[f.name]?.trim() || "(not provided)"}`).join("\n");

  try {
    const out = await generateJSON(system, prompt);
    const check = brandCheck(out.content, voice.data?.avoid_words ?? [], voice.data?.sample_text ?? "");
    const { data: saved, error } = await supabase.from("generations").insert({
      workspace_id: workspaceId, user_id: user.id, template: template.id, title: out.title, inputs,
      content: out.content, brand_check: check, voice_id: voice.data?.id ?? null, audience_id: audience.data?.id ?? null,
    }).select("id").single();
    if (error) return NextResponse.json({ error: "Generated, but saving failed. Please retry." }, { status: 500 });
    await supabase.from("usage_events").insert({ workspace_id: workspaceId, user_id: user.id });
    return NextResponse.json({ id: saved.id, title: out.title, content: out.content, brandCheck: check });
  } catch (e) {
    if (e instanceof AIError) return NextResponse.json({ error: e.message }, { status: e.status });
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}
