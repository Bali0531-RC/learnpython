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
- opcionális OpenAI review a legutóbbi judge-olt submissionhöz, böngészőnként 20 kéréses cookie-kerettel és globális 24 órás tokenlimittel

## Technológiai irány

- Web: Next.js 16, TypeScript, App Router, Tailwind CSS 4
- Infrastruktúra a lokális fejlesztéshez: Docker Compose
- Adatbázis: PostgreSQL
- ORM és seedelt tartalomréteg: Prisma
- Queue és cache alap: Redis
- Kódfuttatás és deterministic grading: Python FastAPI judge service

## Lokális futtatás Dockerrel

Ha még nincs saját `.env` fájlod, készíthetsz egyet a mintából. Ha már van, elég azt szerkeszteni.

```bash
npm run docker:up
```

A compose-os `web` indulás fejlesztői környezetben automatikusan lefuttatja a `prisma db push` és `prisma db seed` lépéseket is, így a PostgreSQL konténer nem marad üres sémával.

Ha a `next dev` szervert reverse proxy vagy Cloudflare mögött használod, állítsd az `ALLOWED_DEV_ORIGINS` értékét a publikus hostra, különben a Next 16 letilthatja a dev-only `_next/*` és HMR kéréseket.

Ez a `docker-compose.yml` kifejezetten fejlesztői stack: bind mounttal, `next dev`-vel és judge hot readdel fut.

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

Publikus proxy mögötti fejlesztésnél itt is add meg az `ALLOWED_DEV_ORIGINS` változót, például `ALLOWED_DEV_ORIGINS=learn.bali0531.hu npm run dev`.

## Production futtatás Dockerrel

Publikus domain mögé ne a fejlesztői compose-ot tedd ki. Ehhez külön production stack van a `docker-compose.prod.yml` fájlban, ami a webet `next build` + `next start` módban futtatja, a judge-ot pedig reload nélkül indítja.

Első bootstrap egy friss szerveren:

Ha még nincs saját `.env` fájlod, készíthetsz egyet a mintából. Ha már van, elég azt szerkeszteni, és legalább a `NEXT_PUBLIC_APP_URL` értékét production hostra állítani.

```bash
npm run docker:bootstrap:prod
npm run docker:up:prod
```

A `docker:bootstrap:prod` egy egyszer futó Prisma `db push` + `db seed` lépés. A web konténer production módban ezután már nem seedel és nem indít dev szervert.

Leállítás:

```bash
npm run docker:down:prod
```

Production stack jellemzői:

- a Next alkalmazás `next start` módban fut, így nincs HMR websocket és nincs dev-only `_next/webpack-hmr`
- a web csak `127.0.0.1:3000`-ra publikálódik, ezért Nginx tud elé kerülni, de kívülről nem lesz külön nyitott Node-port
- a judge, PostgreSQL és Redis csak belső Docker hálózaton maradnak
- a Redis append-only tárolással fut, így a globális AI tokenkeret újraindítás után is megmarad a 24 órás ablakon belül

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
- van egy globális, minden userre közös 24 órás tokenkeret is, alapértelmezetten összesen 2 000 000 input+output tokennel Redisben számlálva
- a deterministic judge pontszám marad az elsődleges igazságforrás, az AI review ehhez ad magyar nyelvű összképet, tippeket és egy külön AI pontszámot

Opcionális finomhangoló env változók:

```bash
AI_REVIEW_GLOBAL_TOKEN_LIMIT=2000000
AI_REVIEW_GLOBAL_TOKEN_WINDOW_SECONDS=86400
```

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

Ha csak Docker Compose-ot használsz, ezt a bootstrapet a `web` szolgáltatás induláskor elvégzi helyetted. Docker nélküli futtatásnál továbbra is külön le kell futtatni.

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
5. Auth és valódi user-szintű quota/persistencia ráhúzása a mostani böngésző-cookie + globális Redis tokenkeretes AI review-ra.
