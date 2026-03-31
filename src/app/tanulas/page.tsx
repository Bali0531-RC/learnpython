import Link from "next/link";

import { listLearningPhases } from "@/lib/content-store";

export const dynamic = "force-dynamic";

export default async function LearningPage() {
  const lessonPhases = await listLearningPhases();

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-6 pb-24 pt-10 sm:px-10 lg:px-12">
      <section className="section-card p-8 sm:p-10">
        <p className="eyebrow">Lecketérkép v1</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">
          Logikus tanulási ív 0 tudásról vizsgakész megoldási rutinokig.
        </h1>
        <p className="mt-5 max-w-3xl text-lg leading-8 text-[var(--muted)]">
          A közös alapozás után a rendszer csak ott válik két ágra, ahol a közép
          és emelt valóban más gondolkodási mintát igényel. A cél nem a feladatok
          bemagolása, hanem a típusfeladatok biztos felismerése és megoldása. A főbb
          leckék alján már közvetlen belépési pontok vannak a kapcsolódó interaktív
          gyakorló- és archív workspace-ekhez.
        </p>
      </section>

      <section className="space-y-6">
        {lessonPhases.map((phase) => (
          <article key={phase.slug} className="section-card p-6 sm:p-8">
            <div className="flex flex-col gap-4 border-b border-[var(--line)] pb-5 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="eyebrow">{phase.audience}</p>
                <h2 className="mt-3 text-3xl font-semibold tracking-tight">
                  {phase.title}
                </h2>
              </div>
              <p className="max-w-2xl text-sm leading-6 text-[var(--muted)]">
                {phase.description}
              </p>
            </div>

            <div className="mt-6 grid gap-4 lg:grid-cols-2">
              {phase.lessons.map((lesson) => {
                const relatedLinks = lesson.resourceLinks;

                return (
                  <div
                    key={lesson.id}
                    id={lesson.id}
                    className="surface-soft scroll-mt-28 rounded-3xl border border-[var(--line)] p-5"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <span className="chip">{lesson.id}</span>
                      <span className="text-sm text-[var(--muted)]">{phase.title}</span>
                    </div>
                    <h3 className="mt-4 text-xl font-semibold tracking-tight">
                      {lesson.title}
                    </h3>
                    <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
                      {lesson.summary}
                    </p>
                    <p className="background-soft mt-4 rounded-2xl px-4 py-3 text-sm leading-6 text-[var(--foreground)]">
                      <span className="font-semibold">Vizsgaérték:</span> {lesson.examValue}
                    </p>

                    {relatedLinks.length ? (
                      <div className="mt-5 border-t border-[var(--line)] pt-5">
                        <p className="eyebrow">Kapcsolódó workspace-ek</p>
                        <div className="mt-4 grid gap-3">
                          {relatedLinks.map((link) => (
                            <Link
                              key={`${lesson.id}-${link.href}`}
                              className="group rounded-[1.4rem] border border-[var(--line)] bg-[var(--surface)] p-4 transition-colors hover:bg-[var(--surface-soft)]"
                              href={link.href}
                            >
                              <div className="flex flex-wrap items-center justify-between gap-3">
                                <span className="rounded-full border border-[var(--line)] px-3 py-1 text-xs uppercase tracking-[0.22em] text-[var(--muted)]">
                                  {link.badge}
                                </span>
                                <span className="text-xs uppercase tracking-[0.22em] text-[var(--accent-alt)]">
                                  Megnyitás
                                </span>
                              </div>
                              <h4 className="mt-3 text-lg font-semibold tracking-tight group-hover:text-[var(--accent-alt)]">
                                {link.title}
                              </h4>
                              <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
                                {link.reason}
                              </p>
                              <p className="mt-3 text-xs uppercase tracking-[0.22em] text-[var(--muted)]">
                                {link.meta}
                              </p>
                            </Link>
                          ))}
                        </div>
                      </div>
                    ) : null}
                  </div>
                );
              })}
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}