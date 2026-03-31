import Link from "next/link";

import { listArchiveEntriesContent } from "@/lib/content-store";

export const dynamic = "force-dynamic";

export default async function ArchivePage() {
  const archiveEntries = await listArchiveEntriesContent();

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-6 pb-24 pt-10 sm:px-10 lg:px-12">
      <section className="section-card p-8 sm:p-10">
        <p className="eyebrow">Vizsgaarchívum</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">
          Korábbi évek mintái, de nem korábbi évek másolata.
        </h1>
        <p className="mt-5 max-w-3xl text-lg leading-8 text-[var(--muted)]">
          Az archívumot feladattípusok, nehézségi minták és skill-családok miatt
          építi be a platform. A saját gyakorlóbank külön marad, hogy a diák ne a
          régi szövegeket, hanem a mögöttes logikát tanulja meg.
        </p>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        {archiveEntries.map((entry) => (
          <article key={entry.id} className="section-card p-6">
            <div className="flex items-center justify-between gap-4">
              <span className="chip">{entry.level}</span>
              <span className="text-sm text-[var(--muted)]">
                {entry.year} {entry.season}
              </span>
            </div>
            <h2 className="mt-4 text-2xl font-semibold tracking-tight">
              {entry.title}
            </h2>
            <p className="mt-2 text-sm uppercase tracking-[0.18em] text-[var(--accent-alt)]">
              {entry.family}
            </p>
            <p className="mt-4 text-sm leading-6 text-[var(--muted)]">
              {entry.note}
            </p>
            {entry.fileHighlights?.length ? (
              <ul className="mt-4 space-y-2 rounded-3xl border border-[var(--line)] bg-[var(--surface-soft)] p-4 text-sm leading-6 text-[var(--muted)]">
                {entry.fileHighlights.map((item) => (
                  <li key={item} className="flex gap-3">
                    <span className="mt-1 h-2 w-2 rounded-full bg-[var(--accent)]" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            ) : null}
            {entry.assets?.length ? (
              <div className="mt-4 flex flex-wrap gap-3">
                {entry.assets.map((asset) => (
                  <a
                    key={asset.href}
                    className="secondary-link text-sm"
                    download={asset.href.startsWith("/archive/") ? true : undefined}
                    href={asset.href}
                    rel={asset.href.startsWith("http") ? "noreferrer" : undefined}
                    target={asset.href.startsWith("http") ? "_blank" : undefined}
                  >
                    {asset.label}
                  </a>
                ))}
              </div>
            ) : null}
            <div className="mt-5 flex flex-wrap gap-3">
              <Link className="secondary-link text-sm" href={`/vizsgaarchivum/${entry.id}`}>
                {entry.workspaceTaskId ? "Feladatlap megnyitása" : "Archív részletek"}
              </Link>
              <a
                className="inline-flex items-center text-sm font-semibold text-[var(--foreground)] underline underline-offset-4"
                href={entry.source}
                rel="noreferrer"
                target="_blank"
              >
                Forrásoldal megnyitása
              </a>
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}