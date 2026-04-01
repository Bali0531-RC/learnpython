import Link from "next/link";
import { notFound } from "next/navigation";

import { getPracticeTaskContent } from "@/lib/content-store";
import { getMockExamPackById, mockExamPacks } from "@/lib/mock-exams";

export const dynamic = "force-dynamic";

export function generateStaticParams() {
  return mockExamPacks.map((pack) => ({ mockId: pack.id }));
}

export default async function MockExamDetailPage({
  params,
}: {
  params: Promise<{ mockId: string }>;
}) {
  const { mockId } = await params;
  const pack = getMockExamPackById(mockId);

  if (!pack) {
    notFound();
  }

  const tasks = await Promise.all(
    pack.taskSlots.map(async (slot) => {
      const task = await getPracticeTaskContent(slot.taskId);

      if (!task) {
        return null;
      }

      return { slot, task };
    }),
  );

  if (tasks.some((entry) => entry === null)) {
    notFound();
  }

  const resolvedTasks = tasks.filter(
    (entry): entry is NonNullable<(typeof tasks)[number]> => Boolean(entry),
  );

  return (
    <main className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-6 pb-24 pt-10 sm:px-10 lg:px-12">
      <section className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="eyebrow">Próbaérettségi</p>
          <h1 className="mt-2 text-4xl font-semibold tracking-tight sm:text-5xl">
            {pack.title}
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-[var(--muted)]">
            {pack.level} · {pack.duration} · {pack.theme}
          </p>
        </div>
        <Link className="secondary-link" href="/probaerettsegi">
          Vissza a mock csomagokhoz
        </Link>
      </section>

      <section className="section-card p-8 sm:p-10">
        <div className="flex flex-wrap gap-3">
          <span className="chip">{pack.level}</span>
          <span className="chip">{pack.duration}</span>
          <span className="chip">{pack.taskSlots.length} feladat</span>
        </div>

        <h2 className="mt-6 text-3xl font-semibold tracking-tight">Vizsgahelyzet-szimuláció</h2>
        <p className="mt-4 max-w-4xl text-base leading-7 text-[var(--muted)]">
          {pack.summary}
        </p>

        <div className="mt-6 flex flex-wrap gap-2">
          {pack.focus.map((item) => (
            <span
              key={item}
              className="rounded-full border border-[var(--line)] px-4 py-2 text-sm text-[var(--muted)]"
            >
              {item}
            </span>
          ))}
        </div>

        <div className="mt-8 grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
          <article className="surface-soft rounded-[1.8rem] border border-[var(--line)] p-6">
            <p className="eyebrow">Mock menetrend</p>
            <ol className="mt-5 grid gap-4">
              {resolvedTasks.map(({ slot, task }, index) => (
                <li
                  key={task.id}
                  className="rounded-[1.4rem] border border-[var(--line)] bg-[var(--surface)] p-5"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-xs uppercase tracking-[0.22em] text-[var(--muted)]">
                        {index + 1}. feladat · {slot.timebox}
                      </p>
                      <h3 className="mt-2 text-xl font-semibold tracking-tight">{task.title}</h3>
                    </div>
                    <span className="chip">{task.family}</span>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-[var(--muted)]">{slot.reason}</p>
                  <p className="mt-3 text-sm leading-6 text-[var(--foreground)]">{task.summary}</p>
                  <div className="mt-4 flex flex-wrap gap-3">
                    <Link className="secondary-link text-sm" href={`/gyakorlas/${task.id}`}>
                      Feladat megnyitása
                    </Link>
                  </div>
                </li>
              ))}
            </ol>
          </article>

          <div className="grid gap-5">
            <article className="surface-soft rounded-[1.8rem] border border-[var(--line)] p-6">
              <p className="eyebrow">Vizsgastratégia</p>
              <ul className="mt-5 space-y-3 text-sm leading-6 text-[var(--muted)]">
                {pack.instructions.map((item) => (
                  <li key={item} className="flex gap-3">
                    <span className="mt-1 h-2 w-2 rounded-full bg-[var(--accent)]" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </article>

            <article className="surface-soft rounded-[1.8rem] border border-[var(--line)] p-6">
              <p className="eyebrow">Lefedett készségek</p>
              <div className="mt-4 grid gap-4">
                {resolvedTasks.map(({ task }) => (
                  <section
                    key={`skills-${task.id}`}
                    className="rounded-[1.3rem] border border-[var(--line)] bg-[var(--surface)] p-4"
                  >
                    <h3 className="text-base font-semibold tracking-tight">{task.title}</h3>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {task.skillFocus.map((item) => (
                        <span
                          key={`${task.id}-${item}`}
                          className="rounded-full border border-[var(--line)] px-3 py-1 text-xs text-[var(--muted)]"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </section>
                ))}
              </div>
            </article>
          </div>
        </div>
      </section>
    </main>
  );
}