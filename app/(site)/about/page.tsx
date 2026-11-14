import type { Metadata } from "next";
export const metadata: Metadata = { title: "About" };

export default function About() {
  return (
    <section className="mx-auto max-w-3xl px-4 py-20">
      <h1 className="text-4xl font-semibold sm:text-5xl">Why we're building BrandQuill</h1>
      <div className="mt-8 space-y-5 text-lg text-ink/85">
        <p>BrandQuill is an AI content studio for marketing teams that want to dominate their industry. Markets are won by the teams that publish more, with sharper positioning, faster than everyone else.</p>
        <p>Most teams are stuck between speed and quality. We built BrandQuill to remove that trade-off: set up your positioning, audiences and product facts once, and every draft starts from the context that makes you hard to beat.</p>
        <p>We believe AI should sharpen your strategy, not invent your facts. So gaps stay marked as gaps, and anything that can be measured is measured, not guessed.</p>
      </div>
    </section>
  );
}
