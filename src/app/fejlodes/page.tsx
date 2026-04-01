import Link from "next/link";

import { ProgressSnapshot } from "@/components/progress-snapshot";
import { implementationMilestones, progressRoadmap } from "@/lib/site-data";

const progressSignals = [
  {
    label: "Most él",
    title: "Helyi progress snapshot",
    summary:
      "A platform már most elteszi a draftot, a friss futásokat és a pontozott beküldések nyomát ebben a böngészőben.",
  },
  {
    label: "Most visszavetíthető",
    title: "Lecke és workspace kapcsolat",
    summary:
      "A helyi aktivitásból már most kirajzolható, mely leckéket érintetted, és mi lenne a következő logikus lecke vagy gyakorlófeladat.",
  },
  {
    label: "Most készül elő",
    title: "AI-kompatibilis submission modell",
    summary:
      "A judge és az AI review ugyanarra a strukturált payloadra épít, így a későbbi coaching nem külön szigetként érkezik majd meg.",
  },
] as const;

const progressTracks = [
  {
    title: "Ami ma is mérhető",
    intro:
      "A jelenlegi oldal nem ígéretlista, hanem annak a bizonyítéka, hogy a progress-modell néhány része már most működik helyi állapottal.",
    bullets: [
      "A workspace menti a félkész kódot és a visszaérkező judge-futásokat.",
      "A lecketérképre már most visszavetíthető, melyik témakörökhöz jutottál el.",
      "A következő ajánlott lecke helyi aktivitásból is megbecsülhető.",
    ],
    href: "/gyakorlas",
    cta: "Gyakorló workspace megnyitása",
  },
  {
    title: "Amit a következő iteráció nyit ki",
    intro:
      "A következő kör célja nem pusztán több adat tárolása, hanem hogy a tanuló számára értelmezhető fejlődési ív és visszatérő hibakép rajzolódjon ki.",
    bullets: [
      "Fiókhoz kötött, több eszközről folytatható history.",
      "Valódi mastery státuszok és skill-gap alapú ajánlások.",
      "Feladatonkénti submission timeline és hosszabb távú visszaesések kimutatása.",
    ],
    href: "/tanulas",
    cta: "Tanulási útvonal megnyitása",
  },
] as const;

export default function ProgressPage() {
  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-12 px-6 pb-24 pt-10 sm:px-10 lg:px-12">
      <section className="grid gap-8 lg:grid-cols-[1.12fr_0.88fr]">
        <div className="section-card grid-lines overflow-hidden p-8 sm:p-10">
          <div className="flex flex-wrap gap-3">
            <span className="chip">Helyi snapshot</span>
            <span className="chip">Progress tracking</span>
            <span className="chip">Fiókos modell előkészítve</span>
          </div>

          <div className="mt-8 max-w-3xl space-y-6">
            <p className="eyebrow">Fejlődés és profilépítés</p>
            <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
              A /fejlodes oldal most már megmutatja, hogyan nő át a helyi workspace-nyom egy valódi tanulási profillá.
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-[var(--muted)] sm:text-xl">
              A jelenlegi rendszer már lát draftot, futást, beküldést és leckeérintést. A következő iterációk ezt nem lecserélik, hanem szerveroldali profillá, timeline-ná és skill-gap alapú ajánlássá emelik tovább.
            </p>
          </div>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <Link className="primary-link" href="/tanulas">
              Lecketérkép megnyitása
            </Link>
            <Link className="secondary-link" href="/gyakorlas">
              Gyakorlóbank megnyitása
            </Link>
          </div>
        </div>

        <aside className="section-card flex flex-col gap-4 p-6 sm:p-8">
          <p className="eyebrow">Mit látni már most?</p>
          <h2 className="text-2xl font-semibold tracking-tight">
            A progress már nem csak terv, hanem részben működő felületi logika.
          </h2>

          <div className="space-y-4">
            {progressSignals.map((signal) => (
              <article
                key={signal.title}
                className="surface-soft rounded-[1.6rem] border border-[var(--line)] p-5"
              >
                <p className="eyebrow">{signal.label}</p>
                <h3 className="mt-3 text-xl font-semibold tracking-tight">
                  {signal.title}
                </h3>
                <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
                  {signal.summary}
                </p>
              </article>
            ))}
          </div>
        </aside>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        {progressTracks.map((track) => (
          <article key={track.title} className="section-card p-8 sm:p-10">
            <p className="eyebrow">{track.title}</p>
            <p className="mt-5 text-base leading-7 text-[var(--muted)]">
              {track.intro}
            </p>

            <ul className="mt-6 space-y-3 rounded-[1.7rem] border border-[var(--line)] bg-[var(--surface-soft)] p-5 text-sm leading-6 text-[var(--foreground)]">
              {track.bullets.map((bullet) => (
                <li key={bullet} className="flex gap-3">
                  <span className="mt-2 h-2 w-2 rounded-full bg-[var(--accent)]" />
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>

            <div className="mt-6">
              <Link className="secondary-link" href={track.href}>
                {track.cta}
              </Link>
            </div>
          </article>
        ))}
      </section>

      <section className="section-card p-8 sm:p-10">
        <div className="flex flex-col gap-4 border-b border-[var(--line)] pb-5 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="eyebrow">Roadmap és mérföldkövek</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight">
              Jól elkülönül, mi működik most, és mi az a réteg, amit a következő szeletek építenek rá.
            </h2>
          </div>
          <p className="max-w-2xl text-sm leading-6 text-[var(--muted)]">
            A fejlődési oldal célja nem az, hogy minden jövőbeli ötletet felsoroljon, hanem hogy megmutassa, melyik technikai döntés milyen tanulói élményt fog később kinyitni.
          </p>
        </div>

        <div className="mt-6 grid gap-5 xl:grid-cols-[0.95fr_1.05fr]">
          <article className="surface-soft rounded-[1.8rem] border border-[var(--line)] p-6">
            <p className="eyebrow">Platform mérföldkövek</p>
            <div className="mt-5 space-y-5">
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

          <div className="grid gap-4">
            {progressRoadmap.map((item) => (
              <article
                key={item.title}
                className="surface-soft rounded-[1.8rem] border border-[var(--line)] p-6"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h3 className="text-2xl font-semibold tracking-tight">{item.title}</h3>
                  <span className="rounded-full border border-[var(--line)] px-3 py-1 text-xs uppercase tracking-[0.22em] text-[var(--muted)]">
                    {item.stage}
                  </span>
                </div>
                <p className="mt-4 text-base leading-7 text-[var(--muted)]">
                  {item.summary}
                </p>
                <div className="background-soft mt-5 rounded-[1.4rem] px-4 py-4 text-sm leading-6 text-[var(--foreground)]">
                  <span className="font-semibold">Mit nyit ki?</span> {item.unlocks}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-5 xl:grid-cols-[0.82fr_1.18fr] xl:items-start">
        <article className="section-card p-8 sm:p-10 xl:sticky xl:top-24">
          <p className="eyebrow">Élő állapotkép</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight">
            Az alábbi blokk már nem mock, hanem a mostani böngésző tényleges helyi aktivitását olvassa ki.
          </h2>
          <p className="mt-5 text-base leading-7 text-[var(--muted)]">
            Ez még átmeneti, böngészőhöz kötött perzisztencia, de pont azért fontos, mert ugyanazokat a jeleket mutatja meg, amelyekből később szerveroldali profil, ajánlás és hosszabb távú haladási kép épül.
          </p>

          <div className="mt-6 grid gap-4">
            <div className="surface-soft rounded-[1.5rem] border border-[var(--line)] p-5">
              <p className="eyebrow">Most még helyi</p>
              <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
                Draftok, history és AI review-k a jelenlegi böngészőből olvasva.
              </p>
            </div>
            <div className="surface-soft rounded-[1.5rem] border border-[var(--line)] p-5">
              <p className="eyebrow">Később szerveroldali</p>
              <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
                Profil, több eszköz közti folytonosság, submission timeline és mastery logika.
              </p>
            </div>
          </div>
        </article>

        <ProgressSnapshot />
      </section>

      <section className="grid gap-5 lg:grid-cols-2">
        <Link className="section-card block p-8 transition-colors hover:bg-[var(--surface-soft)]" href="/tanulas">
          <p className="eyebrow">Kapcsolódó nézet</p>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight">
            Nézd meg, hogyan kapcsolódik ugyanez a logika a lecketérképhez.
          </h2>
          <p className="mt-4 text-sm leading-6 text-[var(--muted)]">
            A helyi aktivitás már most visszavetíthető a tanulási ívre, így a fejlődés nem csak feladatszinten, hanem témakörök mentén is értelmezhető.
          </p>
        </Link>

        <Link className="section-card block p-8 transition-colors hover:bg-[var(--surface-soft)]" href="/probaerettsegi">
          <p className="eyebrow">Következő terhelés</p>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight">
            Ha már van néhány próbád, fordítsd át a snapshotot vizsgaszerű csomagokra.
          </h2>
          <p className="mt-4 text-sm leading-6 text-[var(--muted)]">
            A próbaérettségi oldalon ugyanaz a tudásidom már hosszabb, idődobozolt ritmusban mérhető vissza, ami jól mutatja, hol esik szét a rutin terhelés alatt.
          </p>
        </Link>
      </section>
    </main>
  );
}