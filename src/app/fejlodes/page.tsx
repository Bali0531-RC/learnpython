import { ProgressSnapshot } from "@/components/progress-snapshot";
import { progressRoadmap } from "@/lib/site-data";

export default function ProgressPage() {
  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-6 pb-24 pt-10 sm:px-10 lg:px-12">
      <section className="section-card p-8 sm:p-10">
        <p className="eyebrow">Fejlődés és profilépítés</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">
          A felület már most a későbbi progress tracking logikára van szabva.
        </h1>
        <p className="mt-5 max-w-3xl text-lg leading-8 text-[var(--muted)]">
          A mostani implementáció a későbbi felhasználói profil, beküldési előzmény,
          skill-gap és AI-feedback adatmodelljét készíti elő. A design már most erre
          az útvonalra szerveződik.
        </p>
      </section>

      <section className="grid gap-5 lg:grid-cols-2">
        {progressRoadmap.map((item) => (
          <article key={item.title} className="section-card p-6 sm:p-8">
            <h2 className="text-2xl font-semibold tracking-tight">{item.title}</h2>
            <p className="mt-4 text-base leading-7 text-[var(--muted)]">
              {item.summary}
            </p>
          </article>
        ))}
      </section>

      <ProgressSnapshot />
    </main>
  );
}