import Link from "next/link";

import { navigationItems } from "@/lib/site-data";
import { ThemeToggle } from "@/components/theme-toggle";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 px-4 pt-4 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 rounded-full border border-[var(--line)] bg-[var(--surface-strong)] px-5 py-3 shadow-[0_12px_32px_rgba(62,43,18,0.08)] backdrop-blur">
        <div className="flex items-center gap-4">
          <Link className="text-lg font-semibold tracking-tight" href="/">
            Kódérettségi
          </Link>
          <span className="hidden rounded-full border border-[var(--line)] px-3 py-1 text-xs uppercase tracking-[0.22em] text-[var(--muted)] sm:inline-flex">
            Python + vizsgarutin
          </span>
        </div>

        <div className="flex items-center gap-2">
          <nav className="hidden items-center gap-2 lg:flex">
          {navigationItems.map((item) => (
            <Link
              key={item.href}
              className="rounded-full px-4 py-2 text-sm font-medium text-[var(--muted)] transition-colors hover:bg-[var(--surface-soft)] hover:text-[var(--foreground)]"
              href={item.href}
            >
              {item.label}
            </Link>
          ))}
          </nav>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}