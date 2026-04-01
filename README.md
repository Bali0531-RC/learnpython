# Kódérettségi

Magyar nyelvű, dockerizált felkészítő platform a digitális kultúra érettségi Python programozási részéhez. A cél egy olyan tanulási rendszer, amely 0 tudástól indulva készít fel közép- és emelt szinten, saját feladatbankkal, vizsgaarchívummal, determinisztikus javítással és opcionális OpenAI-alapú review-val.

## Jelenlegi állapot

- Next.js App Router alapoldalak magyar nyelvű kezdőlappal és külön szekciókkal
- részletes lesson map v1 strukturált adatmodellben
- 50 közép + 50 emelt saját interaktív gyakorlófeladat, valamint 10-10 közép és emelt próbaérettségi pack
- vizsgaarchívum szemléleti alapok a korábbi évek feladattípusaihoz
- Docker Compose alap a web, judge, PostgreSQL és Redis szolgáltatásokhoz
- külön Python judge service szigorított vizsgamódú AST-ellenőrzéssel és processzlimitekkel
- a judge konténer hard capje 1 CPU-mag, 2 GB RAM és 5 GB írható sandbox-terület, túllépéskor a futás megszakad és a felület visszajelzi az okot
- valódi light és dark mode váltó a felületen
- opcionális OpenAI review a legutóbbi judge-olt submissionhöz, böngészőnként 20 kéréses cookie-kerettel

## Technológiai irány

- Web: Next.js 16, TypeScript, App Router, Tailwind CSS 4
- Infrastruktúra a lokális fejlesztéshez: Docker Compose
- Adatbázis: PostgreSQL
- ORM és seedelt tartalomréteg: Prisma
- Queue és cache alap: Redis
- Kódfuttatás és deterministic grading: Python FastAPI judge service

## Lokális futtatás Dockerrel

```bash
cp .env.example .env
npm run docker:up
```

Ez elindítja a következő szolgáltatásokat:

- `web` a Next.js alkalmazáshoz a `http://localhost:3000` címen
- `judge` a Python értékelőszolgáltatáshoz a `http://localhost:8001` címen
- `db` PostgreSQL a `5432` porton
- `redis` a `6379` porton

### Judge erőforráskorlátok

A judge szolgáltatás konténer- és runner-szinten is védett:

- a Docker Compose limit 1 CPU-mag és 2 GB memória fölé nem engedi a szolgáltatást
- a sandbox írási területe 5 GB-ra van korlátozva
- ha egy futtatás időben, memóriában vagy tárhelyhasználatban túllépi a keretet, a judge megszakítja a végrehajtást és magyar nyelvű értesítést küld vissza a felületnek

Leállítás:

```bash
npm run docker:down
```

## Lokális futtatás Docker nélkül

```bash
npm install
npm run dev
```

A webes felület külön is elindul, de az interaktív futtatás és beküldés csak akkor működik, ha a judge service is fut. Ehhez a legegyszerűbb a dockeres judge használata, vagy a `JUDGE_API_URL` beállítása egy elérhető judge példányra.

## OpenAI review bekapcsolása

Az AI review alapból opcionális. Ha nincs `OPENAI_API_KEY`, a felület buildel és fut tovább, csak az AI review panel tiltott állapotban marad.

Szükséges env változók:

```bash
OPENAI_API_KEY=...
OPENAI_REVIEW_MODEL=gpt-5.4
```

Jellemzők:

- az AI review csak már judge-olt kódhoz kérhető
- a review a legutóbbi futtatott vagy beküldött kódváltozatot elemzi, nem a még el nem futtatott editorállapotot
- a keret böngészőnként 20 kérés, szerveroldali HTTP-only cookie-ban tárolva
- a deterministic judge pontszám marad az elsődleges igazságforrás, az AI review ehhez ad magyar nyelvű összképet, tippeket és egy külön AI pontszámot

## Ellenőrzés

```bash
npm run lint
npm run typecheck
npm run build
```

## Adatbázis-alapozás

Ez az a kör, ahol a database, profiles, lessons és tests szerveroldali implementációja ténylegesen elkezdődik:

- Prisma séma készült a profilokhoz, leckékhez, lesson-resource linkekhez, interaktív taskokhoz, publikus és rejtett tesztekhez, archive bejegyzésekhez és submission rekordokhoz
- a jelenlegi statikus lesson/task/archive registry seedelhető PostgreSQL tartalomként is
- a health endpoint már vissza tudja jelezni, hogy az adatbázis elérhető-e, és mennyi seeded tartalom van benne

Első lokális bootstrap:

```bash
npm run db:generate
npm run db:push
npm run db:seed
```

Hasznos további parancsok:

```bash
npm run db:migrate
npm run db:studio
```

## Következő nagyobb implementációs lépések

1. A lesson, practice és archive oldalak első olvasási útvonalának Prisma-alapú lekérdezésekre váltása.
2. Profilok, auth és submission persistence bekötése a most létrehozott sémára.
3. A pontozott beküldés szerveroldali mentése submission és submission-result rekordokba.
4. Lesson-progress számolás szerveroldalon, nem csak localStorage-ból.
5. Auth és valódi user-szintű quota/persistencia ráhúzása a mostani böngésző-cookie alapú AI review-ra.
