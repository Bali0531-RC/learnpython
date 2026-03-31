const mockExamStructure = [
  {
    level: "Közép",
    count: "10 teljes mock",
    description:
      "Gyors, biztos rutinokra építő csomagok, ahol a hangsúly az inputon, az adatsor-feldolgozáson és a precíz outputfegyelmen van.",
  },
  {
    level: "Emelt",
    count: "10 teljes mock",
    description:
      "Hosszabb, többrészes feladatsorok állapotkezeléssel, ütemezéssel, formázott vagy ASCII kiírással.",
  },
];

const scoringPrinciples = [
  "minden mockhoz skill-tag alapú bontás tartozik majd",
  "a deterministic judge lesz a pontozás alapja",
  "a feedback külön jelzi majd a logikai, formátumos és validációs hibákat",
  "a későbbi AI-mentor a beküldés eredményére épülő magyar nyelvű tanácsot ad",
];

export default function MockExamPage() {
  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-6 pb-24 pt-10 sm:px-10 lg:px-12">
      <section className="section-card p-8 sm:p-10">
        <p className="eyebrow">Próbaérettségi</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">
          Vizsgaszerű, teljes csomagok mindkét szintre.
        </h1>
        <p className="mt-5 max-w-3xl text-lg leading-8 text-[var(--muted)]">
          Ezek a csomagok időkerettel, pontozható szerkezettel és későbbi
          beküldési előzmény támogatással ugyanazt a nyomást modellezik, amit a
          valódi programozási vizsga jelent.
        </p>
      </section>

      <section className="grid gap-5 lg:grid-cols-2">
        {mockExamStructure.map((item) => (
          <article key={item.level} className="section-card p-6 sm:p-8">
            <p className="eyebrow">{item.count}</p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight">
              {item.level} szintű próbaérettségi
            </h2>
            <p className="mt-4 text-base leading-7 text-[var(--muted)]">
              {item.description}
            </p>
          </article>
        ))}
      </section>

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