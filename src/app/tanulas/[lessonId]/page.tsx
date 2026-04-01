import Link from "next/link";
import { notFound } from "next/navigation";

import { getLearningLessonContent, listLearningLessons } from "@/lib/content-store";
import { getLessonArticle, hasDetailedLessonArticle } from "@/lib/lesson-content";
import { lessonPhases } from "@/lib/site-data";

export const dynamic = "force-dynamic";

export function generateStaticParams() {
  return lessonPhases.flatMap((phase) =>
    phase.lessons.map((lesson) => ({ lessonId: lesson.id })),
  );
}

export default async function LessonDetailPage({
  params,
}: {
  params: Promise<{ lessonId: string }>;
}) {
  const { lessonId } = await params;
  const [lesson, allLessons] = await Promise.all([
    getLearningLessonContent(lessonId),
    listLearningLessons(),
  ]);

  if (!lesson) {
    notFound();
  }

  const article = getLessonArticle({
    id: lesson.id,
    title: lesson.title,
    summary: lesson.summary,
    examValue: lesson.examValue,
    phaseTitle: lesson.phaseTitle,
    phaseAudience: lesson.phaseAudience,
    resourceLinks: lesson.resourceLinks,
  });
  const currentIndex = allLessons.findIndex((entry) => entry.id === lesson.id);
  const previousLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : null;
  const nextLesson =
    currentIndex >= 0 && currentIndex < allLessons.length - 1
      ? allLessons[currentIndex + 1]
      : null;

  return (
    <main className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-6 pb-24 pt-10 sm:px-10 lg:px-12">
      <section className="section-card p-8 sm:p-10">
        <div className="flex flex-wrap items-center gap-3">
          <Link className="secondary-link text-sm" href="/tanulas">
            Vissza a tanulási térképhez
          </Link>
          <span className="chip">{lesson.id}</span>
          <span className="chip">{lesson.phaseTitle}</span>
          <span className="chip">
            {hasDetailedLessonArticle(lesson.id) ? "Kidolgozott lecke" : "Bővülő lecke"}
          </span>
        </div>

        <p className="eyebrow mt-6">{lesson.phaseAudience}</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">
          {lesson.title}
        </h1>
        <p className="mt-5 max-w-4xl text-lg leading-8 text-[var(--muted)]">
          {article.intro}
        </p>

        <div className="mt-6 grid gap-4 lg:grid-cols-[1fr_0.9fr]">
          <div className="surface-soft rounded-[1.8rem] border border-[var(--line)] p-5">
            <p className="eyebrow">Lecke fókusz</p>
            <p className="mt-3 text-base leading-7 text-[var(--foreground)]">
              {lesson.summary}
            </p>
          </div>
          <div className="surface-soft rounded-[1.8rem] border border-[var(--line)] p-5">
            <p className="eyebrow">Vizsgaérték</p>
            <p className="mt-3 text-base leading-7 text-[var(--foreground)]">
              {lesson.examValue}
            </p>
          </div>
        </div>
      </section>

      <div className="grid gap-8 xl:grid-cols-[1.2fr_0.8fr] xl:items-start">
        <div className="space-y-6">
          {article.sections.map((section) => (
            <section key={section.title} className="section-card p-7 sm:p-8">
              <h2 className="text-2xl font-semibold tracking-tight">{section.title}</h2>
              <div className="mt-4 space-y-4 text-base leading-7 text-[var(--muted)]">
                {section.paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>

              {section.bullets?.length ? (
                <ul className="mt-5 space-y-3 rounded-[1.6rem] border border-[var(--line)] bg-[var(--surface-soft)] p-5 text-sm leading-6 text-[var(--foreground)]">
                  {section.bullets.map((bullet) => (
                    <li key={bullet} className="flex gap-3">
                      <span className="mt-2 h-2 w-2 rounded-full bg-[var(--accent)]" />
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              ) : null}

              {section.examples?.length ? (
                <div className="mt-6 space-y-4">
                  {section.examples.map((example) => (
                    <article
                      key={example.title}
                      className="rounded-[1.7rem] border border-[var(--line)] bg-[var(--surface-soft)] p-5"
                    >
                      <p className="eyebrow">{example.title}</p>
                      <pre className="mt-4 overflow-x-auto rounded-[1.3rem] bg-[#111827] p-4 text-sm leading-6 text-[#f8fafc]">
                        <code>{example.code}</code>
                      </pre>

                      {example.output ? (
                        <div className="mt-4 rounded-[1.2rem] border border-[var(--line)] bg-[var(--surface)] p-4">
                          <p className="text-xs uppercase tracking-[0.22em] text-[var(--muted)]">
                            Várható eredmény
                          </p>
                          <pre className="mt-3 overflow-x-auto whitespace-pre-wrap text-sm leading-6 text-[var(--foreground)]">
                            <code>{example.output}</code>
                          </pre>
                        </div>
                      ) : null}

                      <p className="mt-4 text-sm leading-6 text-[var(--muted)]">
                        {example.explanation}
                      </p>
                    </article>
                  ))}
                </div>
              ) : null}
            </section>
          ))}
        </div>

        <aside className="space-y-6 xl:sticky xl:top-24">
          <section className="section-card p-6">
            <p className="eyebrow">Mit vigyél el ebből a leckéből?</p>
            <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
              Ajánlott tempó: {article.estimatedMinutes}. Akkor számít késznek, ha a pontokat saját példán is vissza tudod mondani.
            </p>
            <ul className="mt-5 space-y-3 text-sm leading-6 text-[var(--foreground)]">
              {article.goals.map((goal) => (
                <li key={goal} className="border-t border-[var(--line)] pt-3 first:border-t-0 first:pt-0">
                  {goal}
                </li>
              ))}
            </ul>
          </section>

          <section className="section-card p-6">
            <p className="eyebrow">Tipikus buktatók</p>
            <ul className="mt-4 space-y-3 text-sm leading-6 text-[var(--foreground)]">
              {article.pitfalls.map((pitfall) => (
                <li key={pitfall} className="border-t border-[var(--line)] pt-3 first:border-t-0 first:pt-0">
                  {pitfall}
                </li>
              ))}
            </ul>
          </section>

          <section className="section-card p-6">
            <p className="eyebrow">Önellenőrző kérdések</p>
            <ul className="mt-4 space-y-3 text-sm leading-6 text-[var(--foreground)]">
              {article.quickChecks.map((check) => (
                <li key={check} className="border-t border-[var(--line)] pt-3 first:border-t-0 first:pt-0">
                  {check}
                </li>
              ))}
            </ul>
          </section>

          {lesson.resourceLinks.length ? (
            <section className="section-card p-6">
              <p className="eyebrow">Kapcsolódó workspace-ek</p>
              <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
                {article.practiceHint ?? "A lecke után rögtön fordítsd át a mintát gyakorlásba."}
              </p>

              <div className="mt-5 grid gap-3">
                {lesson.resourceLinks.map((link) => (
                  <Link
                    key={`${lesson.id}-${link.href}`}
                    className="group rounded-[1.4rem] border border-[var(--line)] bg-[var(--surface-soft)] p-4 transition-colors hover:bg-[var(--surface)]"
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
                    <h2 className="mt-3 text-lg font-semibold tracking-tight group-hover:text-[var(--accent-alt)]">
                      {link.title}
                    </h2>
                    <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
                      {link.reason}
                    </p>
                    <p className="mt-3 text-xs uppercase tracking-[0.22em] text-[var(--muted)]">
                      {link.meta}
                    </p>
                  </Link>
                ))}
              </div>
            </section>
          ) : null}
        </aside>
      </div>

      <section className="grid gap-4 md:grid-cols-2">
        {previousLesson ? (
          <Link
            className="section-card block p-6 transition-colors hover:bg-[var(--surface-soft)]"
            href={previousLesson.path}
          >
            <p className="eyebrow">Előző lecke</p>
            <h2 className="mt-3 text-xl font-semibold tracking-tight">
              {previousLesson.title}
            </h2>
            <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
              {previousLesson.summary}
            </p>
          </Link>
        ) : (
          <div className="section-card p-6">
            <p className="eyebrow">Előző lecke</p>
            <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
              Ez a tanulási ív eleje.
            </p>
          </div>
        )}

        {nextLesson ? (
          <Link
            className="section-card block p-6 transition-colors hover:bg-[var(--surface-soft)]"
            href={nextLesson.path}
          >
            <p className="eyebrow">Következő lecke</p>
            <h2 className="mt-3 text-xl font-semibold tracking-tight">
              {nextLesson.title}
            </h2>
            <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
              {nextLesson.summary}
            </p>
          </Link>
        ) : (
          <div className="section-card p-6">
            <p className="eyebrow">Következő lecke</p>
            <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
              Ez a tanulási ív vége.
            </p>
          </div>
        )}
      </section>
    </main>
  );
}