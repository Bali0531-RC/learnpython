import Link from "next/link";

import { listMockExamPacksByTrack } from "@/lib/mock-exams";
import { practiceTasks } from "@/lib/practice-tasks";

const mockExamStructure = [
  {
    track: "kozep" as const,
    level: "Közép",
    description:
      "Gyors, biztos rutinokra építő csomagok inputtal, adatsor-feldolgozással, sztringvalidációval és vizsgaszerű outputfegyelemmel.",
  },
  {
    track: "emelt" as const,
    level: "Emelt",
    description:
      "Hosszabb, összetettebb mockok fájlos feldolgozással, koordinátás szimulációval, greedy kiosztással és ASCII pontossággal.",
  },
];

const scoringPrinciples = [
  "minden pack konkrét, idődobozolt feladatlistát ad",
  "a deterministic judge lesz a pontozás alapja",
  "a feedback külön jelzi majd a logikai, formátumos és validációs hibákat",
  "a későbbi AI-mentor a beküldés eredményére épülő magyar nyelvű tanácsot ad",
];

export default function MockExamPage() {
  const kozepPacks = listMockExamPacksByTrack("kozep");
  const emeltPacks = listMockExamPacksByTrack("emelt");
  const kozepTaskCount = practiceTasks.filter((task) => task.track === "kozep").length;
  const emeltTaskCount = practiceTasks.filter((task) => task.track === "emelt").length;

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-6 pb-24 pt-10 sm:px-10 lg:px-12">
      <section className="section-card p-8 sm:p-10">
        <p className="eyebrow">Próbaérettségi</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">
          Vizsgaszerű, teljes csomagok mindkét szintre.
        </h1>
        <p className="mt-5 max-w-3xl text-lg leading-8 text-[var(--muted)]">
          A mockok most már nem csak ígéretként szerepelnek: a közép és emelt
          szinthez is teljes, idődobozolt packek tartoznak, amelyek a már elkészült
          50-50 saját gyakorlófeladatból állnak össze vizsgaszerű csomagokká.
        </p>

        <div className="mt-8 grid gap-4 md:grid-cols-4">
          <article className="surface-soft rounded-[1.6rem] border border-[var(--line)] p-5">
            <p className="eyebrow">Közép bank</p>
            <p className="mt-3 text-3xl font-semibold tracking-tight">{kozepTaskCount}</p>
            <p className="mt-2 text-sm leading-6 text-[var(--muted)]">önálló közép gyakorló</p>
          </article>
          <article className="surface-soft rounded-[1.6rem] border border-[var(--line)] p-5">
            <p className="eyebrow">Emelt bank</p>
            <p className="mt-3 text-3xl font-semibold tracking-tight">{emeltTaskCount}</p>
            <p className="mt-2 text-sm leading-6 text-[var(--muted)]">önálló emelt gyakorló</p>
          </article>
          <article className="surface-soft rounded-[1.6rem] border border-[var(--line)] p-5">
            <p className="eyebrow">Közép mock</p>
            <p className="mt-3 text-3xl font-semibold tracking-tight">{kozepPacks.length}</p>
            <p className="mt-2 text-sm leading-6 text-[var(--muted)]">teljes próba csomag</p>
          </article>
          <article className="surface-soft rounded-[1.6rem] border border-[var(--line)] p-5">
            <p className="eyebrow">Emelt mock</p>
            <p className="mt-3 text-3xl font-semibold tracking-tight">{emeltPacks.length}</p>
            <p className="mt-2 text-sm leading-6 text-[var(--muted)]">teljes próba csomag</p>
          </article>
        </div>
      </section>

      {mockExamStructure.map((group) => {
        const packs = group.track === "kozep" ? kozepPacks : emeltPacks;

        return (
          <section key={group.track} className="section-card p-8 sm:p-10">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="eyebrow">{packs.length} teljes mock</p>
                <h2 className="mt-3 text-3xl font-semibold tracking-tight">
                  {group.level} szintű próbaérettségik
                </h2>
              </div>
              <p className="max-w-2xl text-sm leading-6 text-[var(--muted)]">
                {group.description}
              </p>
            </div>

            <div className="mt-6 grid gap-5 xl:grid-cols-2">
              {packs.map((pack) => (
                <article
                  key={pack.id}
                  className="surface-soft flex h-full flex-col rounded-[1.8rem] border border-[var(--line)] p-6"
                >
                  <div className="flex flex-wrap gap-2 text-xs uppercase tracking-[0.22em] text-[var(--muted)]">
                    <span>{pack.level}</span>
                    <span>·</span>
                    <span>{pack.duration}</span>
                    <span>·</span>
                    <span>{pack.theme}</span>
                  </div>
                  <h3 className="mt-4 text-2xl font-semibold tracking-tight">{pack.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-[var(--muted)]">{pack.summary}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {pack.focus.map((item) => (
                      <span
                        key={item}
                        className="rounded-full border border-[var(--line)] px-3 py-1 text-xs text-[var(--muted)]"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                  <div className="mt-5 rounded-[1.4rem] border border-[var(--line)] bg-[var(--surface)] p-4 text-sm leading-6 text-[var(--muted)]">
                    <p className="font-semibold text-[var(--foreground)]">Feladatsor</p>
                    <p className="mt-2">
                      {pack.taskSlots.length} idődobozolt feladat, egyenként külön megnyitható,
                      de teljes mock ritmusban is végigvihető.
                    </p>
                  </div>
                  <div className="mt-6 flex items-center justify-between gap-4 border-t border-[var(--line)] pt-5">
                    <span className="text-sm text-[var(--muted)]">{pack.taskSlots.length} task</span>
                    <Link className="secondary-link" href={`/probaerettsegi/${pack.id}`}>
                      Mock megnyitása
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </section>
        );
      })}

      <section className="section-card p-8 sm:p-10">
        <p className="eyebrow">Pontozási szemlélet</p>
        <ul className="mt-5 grid gap-4 md:grid-cols-2">
          {scoringPrinciples.map((item) => (
            <li key={item} className="surface-soft rounded-3xl border border-[var(--line)] p-4 text-sm leading-6 text-[var(--foreground)]">
              {item}
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}