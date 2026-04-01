import Link from "next/link";

import { listPracticeTasksContent } from "@/lib/content-store";
import { practiceBlueprint } from "@/lib/site-data";

export const dynamic = "force-dynamic";

const skillFamilies = [
  "input parsing és típuskasztolás",
  "feltételek és elágazások",
  "ciklusok és range-logika",
  "összegzés, számlálás, szűrőfeltételek",
  "sztringfeldolgozás és kódminták",
  "fájlkezelés és rekordfeldolgozás",
  "állapotkezelés és egyszerű vagy összetett szimuláció",
  "formázott vagy ASCII kimenet",
];

export default async function PracticePage() {
  const practiceTasks = await listPracticeTasksContent();
  const kozepTasks = practiceTasks.filter((task) => task.track === "kozep");
  const emeltTasks = practiceTasks.filter((task) => task.track === "emelt");
  const groupedTasks = [
    {
      id: "kozep",
      title: "Közép gyakorlóbank",
      description:
        "Közép szinten a gyors parsing, a számlálás, a rövid sztringvalidáció, az egyszerű állapotszimuláció és a belépő fájlos rutin a fő hangsúly.",
      tasks: kozepTasks,
    },
    {
      id: "emelt",
      title: "Emelt gyakorlóbank",
      description:
        "Emelten a fájlos feldolgozás, a koordinátás szimuláció, a greedy kiosztás, a naplós állapotkezelés és az ASCII pontosság kap nagyobb szerepet.",
      tasks: emeltTasks,
    },
  ] as const;

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-6 pb-24 pt-10 sm:px-10 lg:px-12">
      <section className="section-card p-8 sm:p-10">
        <p className="eyebrow">Gyakorlóbank</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">
          Eredeti, vizsgahű feladatok ugyanarra a gondolkodási mintára építve.
        </h1>
        <p className="mt-5 max-w-3xl text-lg leading-8 text-[var(--muted)]">
          A cél, hogy a tanuló ne a régebbi feladatok szövegét tanulja meg, hanem
          a tipikus programozási mintákat. Ezért minden saját feladat új kontextust,
          más adatformát és friss sztorit kap.
        </p>
      </section>

      <section className="section-card p-8 sm:p-10">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="eyebrow">100 saját gyakorlótask</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight">
              A teljes bank megnyitható interaktív feladatlappal, kódszerkesztővel és beépített judge-dzsal.
            </h2>
          </div>
          <p className="max-w-xl text-sm leading-6 text-[var(--muted)]">
            A bank most már teljes 50-50 darabos közép-emelt készlettel fut. A legtöbb tasknál a Futtatás publikus mintákkal megy, a Pontozott beküldés külön rejtett csomagot használ, a fájlos feladatoknál pedig a munkafájl automatikusan bekerül a sandboxba.
          </p>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <article className="surface-soft rounded-[1.6rem] border border-[var(--line)] p-5">
            <p className="eyebrow">Közép</p>
            <p className="mt-3 text-3xl font-semibold tracking-tight">{kozepTasks.length}</p>
            <p className="mt-2 text-sm leading-6 text-[var(--muted)]">önálló, interaktív közép gyakorló</p>
          </article>
          <article className="surface-soft rounded-[1.6rem] border border-[var(--line)] p-5">
            <p className="eyebrow">Emelt</p>
            <p className="mt-3 text-3xl font-semibold tracking-tight">{emeltTasks.length}</p>
            <p className="mt-2 text-sm leading-6 text-[var(--muted)]">önálló, interaktív emelt gyakorló</p>
          </article>
        </div>
      </section>

      {groupedTasks.map((group) => (
        <section key={group.id} className="section-card p-8 sm:p-10">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="eyebrow">{group.tasks.length} feladat</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight">{group.title}</h2>
            </div>
            <p className="max-w-2xl text-sm leading-6 text-[var(--muted)]">
              {group.description}
            </p>
          </div>

          <div className="mt-6 grid gap-5 xl:grid-cols-3">
            {group.tasks.map((task) => (
              <article
                key={task.id}
                className="surface-soft flex h-full flex-col rounded-[1.8rem] border border-[var(--line)] p-6"
              >
                <div className="flex flex-wrap gap-2 text-xs uppercase tracking-[0.22em] text-[var(--muted)]">
                  <span>{task.level}</span>
                  <span>·</span>
                  <span>{task.family}</span>
                </div>
                <h3 className="mt-4 text-2xl font-semibold tracking-tight">{task.title}</h3>
                <p className="mt-3 text-sm leading-6 text-[var(--muted)]">{task.summary}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {task.skillFocus.map((skill) => (
                    <span
                      key={skill}
                      className="rounded-full border border-[var(--line)] px-3 py-1 text-xs text-[var(--muted)]"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
                <div className="mt-6 flex items-center justify-between gap-4 border-t border-[var(--line)] pt-5">
                  <span className="text-sm text-[var(--muted)]">{task.estimatedMinutes}</span>
                  <Link className="secondary-link" href={`/gyakorlas/${task.id}`}>
                    Feladat megnyitása
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>
      ))}

      <section className="grid gap-5 lg:grid-cols-2">
        {practiceBlueprint.map((item) => (
          <article key={item.title} className="section-card p-6 sm:p-8">
            <p className="eyebrow">{item.target}</p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight">
              {item.title}
            </h2>
            <p className="mt-4 text-base leading-7 text-[var(--muted)]">
              {item.description}
            </p>
          </article>
        ))}
      </section>

      <section className="section-card p-8 sm:p-10">
        <p className="eyebrow">Készségtérkép</p>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight">
          A gyakorlóbank ezekre a visszatérő skill-családokra lesz ráfűzve.
        </h2>
        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {skillFamilies.map((skill) => (
            <div key={skill} className="surface-soft rounded-3xl border border-[var(--line)] p-4 text-sm font-medium leading-6 text-[var(--foreground)]">
              {skill}
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}