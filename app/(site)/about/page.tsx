import type { Metadata } from "next";
export const metadata: Metadata = { title: "About" };

export default function About() {
  return (
    <section className="mx-auto max-w-3xl px-4 py-20">
      <h1 className="text-4xl font-semibold sm:text-5xl">Why we're building BrandQuill</h1>
      <div className="mt-8 space-y-5 text-lg text-ink/85">
        <p>Marketing teams publish more than ever, and the first thing to slip is voice. Drafts that are fast but generic cost more to fix than they save.</p>
        <p>BrandQuill starts with your brand context: how you sound, who you write for and what is true about your product. Then it drafts, and shows its work with checks you can verify.</p>
        <p>We believe AI should interpret your brief, not invent your facts. So gaps stay marked as gaps, and anything that can be measured is measured, not guessed.</p>
      </div>
    </section>
  );
}
