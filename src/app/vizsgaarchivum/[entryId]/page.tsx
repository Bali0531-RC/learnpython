import Link from "next/link";
import { notFound } from "next/navigation";

import { TaskWorkspace } from "@/components/task-workspace";
import {
  getArchiveEntryContent,
  getArchiveWorkspaceTaskContent,
} from "@/lib/content-store";
import { archiveEntries } from "@/lib/site-data";

export const dynamic = "force-dynamic";

export function generateStaticParams() {
  return archiveEntries.map((entry) => ({ entryId: entry.id }));
}

export default async function ArchiveEntryPage({
  params,
}: {
  params: Promise<{ entryId: string }>;
}) {
  const { entryId } = await params;
  const entry = await getArchiveEntryContent(entryId);

  if (!entry) {
    notFound();
  }

  const archiveTask = entry.workspaceTaskId
    ? await getArchiveWorkspaceTaskContent(entry.workspaceTaskId)
    : undefined;

  return (
    <main className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-6 pb-24 pt-10 sm:px-10 lg:px-12">
      <section className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="eyebrow">Vizsgaarchívum</p>
          <h1 className="mt-2 text-4xl font-semibold tracking-tight sm:text-5xl">
            {entry.title}
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-[var(--muted)]">
            {entry.year} {entry.season} · {entry.level} · {entry.family}
          </p>
        </div>
        <Link className="secondary-link" href="/vizsgaarchivum">
          Vissza az archívumhoz
        </Link>
      </section>

      <section className="section-card p-7 sm:p-8">
        <div className="flex flex-wrap items-center gap-3">
          <span className="chip">{entry.level}</span>
          <span className="chip">{entry.year} {entry.season}</span>
          <span className="chip">{archiveTask ? "On-site feladatlap" : "Archív kivonat"}</span>
        </div>

        <p className="mt-6 max-w-4xl text-base leading-7 text-[var(--muted)]">
          {entry.note}
        </p>

        {entry.fileHighlights?.length ? (
          <ul className="mt-6 space-y-2 rounded-3xl border border-[var(--line)] bg-[var(--surface-soft)] p-5 text-sm leading-6 text-[var(--muted)]">
            {entry.fileHighlights.map((item) => (
              <li key={item} className="flex gap-3">
                <span className="mt-1 h-2 w-2 rounded-full bg-[var(--accent)]" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        ) : null}

        <div className="mt-6 flex flex-wrap gap-3">
          {entry.assets?.map((asset) => (
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
          <a
            className="inline-flex items-center text-sm font-semibold text-[var(--foreground)] underline underline-offset-4"
            href={entry.source}
            rel="noreferrer"
            target="_blank"
          >
            Forrásoldal megnyitása
          </a>
        </div>
      </section>

      {archiveTask ? (
        <>
          <section className="section-card p-7 sm:p-8">
            <p className="eyebrow">Archivált, de interaktív</p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight">
              Hivatalos feladatlap a közös workspace-felületen
            </h2>
            <p className="mt-4 max-w-4xl text-sm leading-6 text-[var(--muted)]">
              Ez a slice már helyben megjeleníti a hivatalos feladatszöveget és a valódi ut.txt állományt is.
              A futtatás jelenleg egy publikus mintateszttel működik, a teljes rejtett tesztelés és részpontozás a következő kör része.
            </p>
          </section>

          <TaskWorkspace task={archiveTask} />
        </>
      ) : (
        <section className="section-card p-7 sm:p-8">
          <p className="eyebrow">Következő lépés</p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight">
            Ehhez az archív feladathoz még csak a forrás- és mintainfók érhetők el.
          </h2>
          <p className="mt-4 max-w-4xl text-sm leading-6 text-[var(--muted)]">
            A következő archívum-körökben ide is felkerül a strukturált feladatlap, a helyi assetek és az interaktív workspace.
            Addig a forrásoldal és a kapcsolódó gyakorló feladatok maradnak a fő tanulási útvonalak.
          </p>
        </section>
      )}
    </main>
  );
}