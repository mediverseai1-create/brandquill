import Link from "next/link";
import { Logo } from "@/components/Logo";

const nav = [
  { href: "/features", label: "Platform" },
  { href: "/pricing", label: "Pricing" },
  { href: "/about", label: "Company" },
];

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <header className="sticky top-0 z-20 border-b border-line bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
          <Logo />
          <nav className="hidden gap-7 text-sm md:flex" aria-label="Main">
            {nav.map((n) => <Link key={n.href} href={n.href} className="hover:text-coral">{n.label}</Link>)}
          </nav>
          <div className="flex items-center gap-2">
            <Link href="/login" className="px-3 py-2 text-sm hover:text-coral">Log in</Link>
            <Link href="/signup" className="btn-primary">Start free trial</Link>
          </div>
        </div>
        <nav className="flex justify-center gap-6 border-t border-line py-2 text-sm md:hidden" aria-label="Main mobile">
          {nav.map((n) => <Link key={n.href} href={n.href}>{n.label}</Link>)}
        </nav>
      </header>
      <main>{children}</main>
      <footer className="border-t border-line bg-paper">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:grid-cols-3">
          <div>
            <Logo />
            <p className="mt-3 max-w-xs text-sm text-mute">An AI content studio for marketing teams that want to dominate their industry.</p>
          </div>
          <div className="text-sm">
            <p className="mb-2 font-medium">Product</p>
            <ul className="space-y-1 text-mute"><li><Link href="/features">Platform</Link></li><li><Link href="/pricing">Pricing</Link></li><li><Link href="/signup">Start free trial</Link></li></ul>
          </div>
          <div className="text-sm">
            <p className="mb-2 font-medium">Company</p>
            <ul className="space-y-1 text-mute"><li><Link href="/about">About</Link></li><li><Link href="/login">Log in</Link></li></ul>
          </div>
        </div>
        <p className="border-t border-line py-4 text-center text-xs text-mute">© {new Date().getFullYear()} BrandQuill. Not affiliated with any other marketing AI vendor.</p>
      </footer>
    </>
  );
}
