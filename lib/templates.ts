export interface TemplateField {
  name: string;
  label: string;
  placeholder?: string;
  type?: "text" | "textarea" | "select";
  options?: string[];
  required?: boolean;
}

export interface Template {
  id: string;
  name: string;
  category: "Content" | "Ads" | "Email" | "Social" | "PR" | "Strategy";
  description: string;
  fields: TemplateField[];
  format: string; // output instructions
}

const topic: TemplateField = { name: "topic", label: "Topic or product", placeholder: "What is this about?", required: true };
const details: TemplateField = { name: "details", label: "Key points and facts", type: "textarea", placeholder: "Facts, offers, proof points, constraints" };

export const TEMPLATES: Template[] = [
  { id: "blog-post", name: "Blog post", category: "Content", description: "A structured article with headline, intro, sections and a close.",
    fields: [topic, { name: "keyword", label: "Target keyword", placeholder: "optional" }, { name: "length", label: "Length", type: "select", options: ["Short (~500 words)", "Medium (~900 words)", "Long (~1500 words)"] }, details],
    format: "Markdown. One H1 title, a short intro, H2 sections, and a closing call to action. Respect the requested length." },
  { id: "linkedin-post", name: "LinkedIn post", category: "Social", description: "A scroll-stopping post with a hook and a single clear point.",
    fields: [topic, details],
    format: "Plain text, 120-220 words, strong first line, short paragraphs, at most 3 hashtags at the end." },
  { id: "search-ad", name: "Search ad set", category: "Ads", description: "Headlines and descriptions that fit Google Ads limits.",
    fields: [topic, { name: "offer", label: "Offer or hook", placeholder: "e.g. 20% off first year" }, details],
    format: "Markdown with: 8 headlines (max 30 characters each) and 4 descriptions (max 90 characters each). Number each item and show its character count." },
  { id: "email-sequence", name: "Email sequence", category: "Email", description: "A short nurture or launch sequence with subject lines.",
    fields: [topic, { name: "emails", label: "Number of emails", type: "select", options: ["3", "4", "5"] }, { name: "goal", label: "Goal", placeholder: "e.g. book a demo" }, details],
    format: "Markdown. For each email: Subject, Preview text, Body, and CTA. Label them Email 1, Email 2, etc." },
  { id: "product-description", name: "Product description", category: "Content", description: "Benefit-led copy for a product or feature page.",
    fields: [topic, details],
    format: "Markdown: a one-line headline, a 60-100 word description, and 4 benefit bullets." },
  { id: "press-release", name: "Press release", category: "PR", description: "Newsroom-style announcement with boilerplate.",
    fields: [topic, { name: "quote_from", label: "Quote attributed to", placeholder: "Name, title" }, details],
    format: "Markdown: headline, subhead, dateline paragraph, body, one quote, About section placeholder, media contact placeholder. Use only supplied facts." },
  { id: "landing-page", name: "Landing page copy", category: "Content", description: "Hero, benefits, proof and CTA sections.",
    fields: [topic, { name: "cta", label: "Primary call to action", placeholder: "e.g. Start free trial" }, details],
    format: "Markdown with sections: Hero (headline, subhead, CTA), 3 benefit blocks, social-proof placeholder, FAQ (3 questions), final CTA." },
  { id: "campaign-brief", name: "Campaign brief", category: "Strategy", description: "Objectives, audience, messages and channel plan.",
    fields: [topic, { name: "goal", label: "Business goal", placeholder: "e.g. 200 qualified leads" }, { name: "budget", label: "Budget / timeline", placeholder: "optional" }, details],
    format: "Markdown with: Objective, Audience insight, Core message, 3 supporting messages, Channel plan, Content list, Success metrics. Do not invent statistics." },
];

export const getTemplate = (id: string) => TEMPLATES.find((t) => t.id === id);
