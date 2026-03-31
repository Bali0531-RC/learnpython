import Link from "next/link";

import {
  implementationMilestones,
  lessonPhases,
  practiceBlueprint,
  siteMetrics,
} from "@/lib/site-data";

export default function Home() {
  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-16 px-6 pb-24 pt-10 sm:px-10 lg:px-12">
      <section className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="section-card grid-lines overflow-hidden p-8 sm:p-10">
          <div className="flex flex-wrap gap-3">
            <span className="chip">Python</span>
            <span className="chip">Közép szint</span>
            <span className="chip">Emelt szint</span>
            <span className="chip">Docker-kompatibilis</span>
          </div>
          <div className="mt-8 max-w-3xl space-y-6">
            <p className="eyebrow">Digitális kultúra érettségi felkészítő</p>
            <h1 className="text-4xl font-semibold tracking-tight text-[var(--foreground)] sm:text-5xl lg:text-6xl">
              0-ról vizsgakész Python tudás, kifejezetten az érettségi
              programozási részére szabva.
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-[var(--muted)] sm:text-xl">
              Az oldal magyar nyelven vezeti végig a diákokat az alapoktól a
              teljes közép- vagy emelt szintű megoldási rutinokig. A tartalom
              saját, vizsgahű gyakorlóbankra épül, és előkészíti a későbbi
              AI-alapú kódvisszajelzést is.
            </p>
          </div>
          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <Link className="primary-link" href="/tanulas">
              Lecketérkép megnyitása
            </Link>
            <Link className="secondary-link" href="/gyakorlas">
              Gyakorlóbank-struktúra
            </Link>
          </div>
        </div>

        <aside className="section-card flex flex-col gap-5 p-6 sm:p-8">
          <p className="eyebrow">Mit építünk az első iterációban</p>
          <h2 className="text-2xl font-semibold tracking-tight">
            Első működő alap: tartalom, judge, későbbi AI-központú bővítés.
          </h2>
          <div className="space-y-4">
            {implementationMilestones.slice(0, 4).map((milestone) => (
              <div key={milestone.title} className="surface-soft rounded-3xl border border-[var(--line)] p-4">
                <div className="flex items-center justify-between gap-4">
                  <h3 className="font-semibold">{milestone.title}</h3>
                  <span className="text-xs uppercase tracking-[0.24em] text-[var(--muted)]">
                    {milestone.stage}
                  </span>
                </div>
                <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
                  {milestone.description}
                </p>
              </div>
            ))}
          </div>
        </aside>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {siteMetrics.map((metric) => (
          <article key={metric.label} className="section-card p-6">
            <p className="text-sm uppercase tracking-[0.22em] text-[var(--muted)]">
              {metric.label}
            </p>
            <p className="mt-4 text-4xl font-semibold tracking-tight text-[var(--accent)]">
              {metric.value}
            </p>
            <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
              {metric.description}
            </p>
          </article>
        ))}
      </section>

      <section className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="eyebrow">Tanulási ív</p>
            <h2 className="text-3xl font-semibold tracking-tight">
              A curriculum közös alapozásból indul, és csak utána válik szét
              közép és emelt irányba.
            </h2>
          </div>
          <Link className="secondary-link" href="/tanulas">
            Részletes lecketérkép
          </Link>
        </div>

        <div className="grid gap-5 lg:grid-cols-2 xl:grid-cols-3">
          {lessonPhases.map((phase) => (
            <article key={phase.slug} className="section-card p-6">
              <div className="flex items-center justify-between gap-4">
                <p className="eyebrow">{phase.audience}</p>
                <span className="text-sm text-[var(--muted)]">
                  {phase.lessons.length} lecke
                </span>
              </div>
              <h3 className="mt-3 text-2xl font-semibold tracking-tight">
                {phase.title}
              </h3>
              <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
                {phase.description}
              </p>
              <ul className="mt-5 space-y-3 text-sm leading-6 text-[var(--foreground)]">
                {phase.lessons.slice(0, 3).map((lesson) => (
                  <li key={lesson.id} className="border-t border-[var(--line)] pt-3 first:border-t-0 first:pt-0">
                    <span className="font-semibold">{lesson.title}</span>
                    <span className="block text-[var(--muted)]">
                      {lesson.summary}
                    </span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <article className="section-card p-8">
          <p className="eyebrow">Feladatbank-logika</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight">
            Vizsgahű, de nem másolt gyakorlóbanki rendszer.
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-7 text-[var(--muted)]">
            Az előző évek feladatait mintaként és taxonómiaként használjuk.
            A platform saját feladatai új történetet, más adatstruktúrát és
            friss inputformátumot kapnak, miközben ugyanazokat a gondolkodási
            mintákat gyakoroltatják.
          </p>
          <div className="mt-6 grid gap-4">
            {practiceBlueprint.map((item) => (
              <div key={item.title} className="surface-soft rounded-3xl border border-[var(--line)] p-4">
                <div className="flex items-center justify-between gap-4">
                  <h3 className="font-semibold">{item.title}</h3>
                  <span className="text-sm text-[var(--accent-alt)]">
                    {item.target}
                  </span>
                </div>
                <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </article>

        <article className="section-card p-8">
          <p className="eyebrow">Mit kapsz a későbbi verziókban</p>
          <div className="mt-4 space-y-5">
            {implementationMilestones.map((milestone) => (
              <div key={milestone.title} className="border-l-2 border-[var(--accent)]/40 pl-5">
                <div className="flex items-center justify-between gap-4">
                  <h3 className="font-semibold">{milestone.title}</h3>
                  <span className="text-xs uppercase tracking-[0.24em] text-[var(--muted)]">
                    {milestone.stage}
                  </span>
                </div>
                <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
                  {milestone.description}
                </p>
              </div>
            ))}
          </div>
        </article>
      </section>
    </main>
  );
}
