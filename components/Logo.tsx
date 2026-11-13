import Link from "next/link";

export function Logo({ href = "/" }: { href?: string }) {
  return (
    <Link href={href} className="font-display text-2xl font-semibold text-coral tracking-tight" aria-label="BrandQuill home">
      brandquill
    </Link>
  );
}
