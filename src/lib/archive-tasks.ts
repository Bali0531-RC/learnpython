import "server-only";

import { readFileSync } from "node:fs";
import { join } from "node:path";

import type { WorkspaceTask } from "@/lib/task-types";

const officialRoadFilePath = join(
  process.cwd(),
  "public",
  "archive",
  "2025-oktober-emelt",
  "sebesseg",
  "3_Sebesseg",
  "ut.txt",
);

const officialRoadFileContent = readFileSync(officialRoadFilePath, "utf8")
  .replace(/\r\n/g, "\n")
  .trimEnd();

const officialSettlementNames = [
  "Varos301",
  "Varos702",
  "Varos403",
  "Varos504",
  "Varos805",
  "Varos106",
  "Varos207",
  "Varos308",
  "Varos609",
  "Varos010",
  "Varos911",
  "Varos112",
  "Varos513",
  "Varos214",
  "Varos115",
];

export const archiveTasks: WorkspaceTask[] = [
  {
    id: "2025-oktober-emelt-sebesseg",
    title: "3. Sebesség",
    track: "emelt",
    level: "Emelt",
    family: "fájlos feldolgozás és szabályvezérelt állapotkezelés",
    inputMode: "provided-files",
    estimatedMinutes: "45-60 perc",
    summary:
      "Hivatalos 2025. októberi emelt feladat: útszakaszon érvényes sebességhatárok, települések és táblák alapján kell több részfeladatot megoldani az ut.txt állományból.",
    skillFocus: [
      "fájlbeolvasás",
      "állapotkövetés",
      "szakaszkezelés",
      "százalékszámítás",
      "szomszédkeresés",
    ],
    editorTips: [
      "A jelenlegi publikus judge akkor lesz a legstabilabb, ha az inputkéréseket külön print()-tel írod ki, és csak utána hívod meg az input()-ot.",
      "Először alakíts ki egy közös adatszerkezetet a fájl eseményeire, és abból oldd meg a 2-6. részfeladatot.",
      "A településen belüli alapértelmezett limit 50, településen kívül 90. A táblák és kereszteződések ezt ideiglenesen felülírhatják.",
    ],
    source: {
      kind: "official-archive",
      label: "Hivatalos archív feladat",
      note:
        "Ez a feladatlap a 2025. októberi emelt digitális kultúra vizsga hivatalos Sebesség feladatának strukturált, helyben megjelenített változata. A lokális PDF, ZIP és az ut.txt adatfájl is elérhető mellette.",
    },
    statement: [
      {
        title: "Helyzetkép",
        paragraphs: [
          "A feladat egy olyan útszakasz sebességhatár-változásait dolgozza fel, ahol az autóút és az autópálya kizárt, a sofőr pedig településeken, kereszteződéseken és sebességkorlátozó táblák mellett halad át.",
          "Személygépkocsinál a kiinduló szabály településen belül 50 km/h, azon kívül 90 km/h. Ezt módosíthatják a sebességkorlátozó táblák, amelyeket másik tábla, kereszteződés vagy feloldó jelzés törölhet.",
        ],
      },
      {
        title: "Az ut.txt szerkezete",
        paragraphs: [
          "Az ut.txt első sora a megfigyelt út teljes hosszát adja meg méterben. A további sorok mindegyike egy út menti eseményt ír le a kezdőponttól mért távolsággal együtt.",
          "Az események a távolság szerint növekvő sorrendben szerepelnek, és az út minden települést legfeljebb egyszer érint.",
        ],
        bullets: [
          "Számérték: sebességkorlátozó tábla, amely 10 és 90 közötti egész határt ad meg.",
          "Legalább 4, legfeljebb 30 karakteres szöveg: a megadott nevű település kezdete.",
          "] jel: a település vége.",
          "# jel: bekötőút vagy útkereszteződés.",
          "% jel: sebességkorlátozás feloldása.",
        ],
      },
      {
        title: "Megoldandó részfeladatok",
        paragraphs: [
          "A hivatalos feladatsor 1-6. pontból áll. Az 1. pont csak beolvasást és tárolást kér, a 2-6. pontok pedig képernyőre írt eredményeket várnak.",
          "A képernyőre írt részfeladatok előtt a feladat sorszámát is meg kell jeleníteni. Ha a program bemenetet kér, azt is jelezni kell a felhasználónak.",
        ],
        bullets: [
          "1. Olvasd be és tárold el az ut.txt adatait.",
          "2. Írd ki az úton található települések nevét, mindegyiket külön sorba.",
          "3. Kérj be egy valós számot km-ben, és add meg az út első x km-es szakaszán előforduló legalacsonyabb sebességhatárt.",
          "4. Számold ki, hogy az út hány százaléka vezet településen belül, és írd ki két tizedes pontossággal.",
          "5. Kérj be egy településnevet, majd add meg, hány sebességkorlátozó tábla van ott, és milyen hosszan halad át rajta az út.",
          "6. Add meg a kiválasztott településhez legközelebb eső település nevét a hivatalos definíció szerint.",
        ],
      },
      {
        title: "Vizsgamegkötések",
        paragraphs: [
          "A bemenet helyességét nem kell ellenőrizni. A nem egész számoknál tizedespont és tizedesvessző is elfogadott, de a jelenlegi publikus judge a minta szerint ponttal megadott lebegőpontos bemenetet használ.",
          "A platform ezen a körön még csak egy publikus mintatesztet futtat ehhez a hivatalos feladathoz, ezért a rejtett tesztek és a részpontozás külön körben jönnek majd.",
        ],
      },
    ],
    inputFormat: [
      "Az ut.txt fájlból kell beolvasni az út teljes hosszát és az eseménylistát.",
      "A 3. részfeladatnál a standard bemenetről egy valós szám érkezik, ami km-ben adja meg a vizsgált szakasz végét.",
      "Az 5. részfeladatnál a standard bemenetről egy településnevet kell bekérni.",
    ],
    outputFormat: [
      "2. feladat: a települések nevei, mindegyik új sorban.",
      "3. feladat: a vizsgált szakasz legkisebb megengedett sebessége.",
      "4. feladat: a településen belüli arány két tizedes pontossággal.",
      "5. feladat: a kiválasztott település tábláinak száma és a belső úthossza.",
      "6. feladat: a legközelebbi település neve.",
    ],
    workspaceRules: [
      {
        title: "Hivatalos adatfájl",
        description:
          "A judge az eredeti ut.txt állományt csatolja a futtatási mappába. A fájl csak olvasható, írni vagy más állományhoz hozzáférni továbbra sem lehet.",
      },
      {
        title: "Interim publikus teszt",
        description:
          "A hivatalos archív slice egyelőre egy mintabemenetes publikus ellenőrzést futtat. A teljes rejtett tesztkészlet és a részpontozás későbbi körben érkezik.",
      },
      {
        title: "Szigorított sandbox",
        description:
          "Import, külső folyamatindítás, hálózat és tetszőleges fájlművelet továbbra sincs. Csak az ut.txt olvasható be a munkamappából.",
      },
    ],
    publicTests: [
      {
        label: "Hivatalos mintabemenet",
        input: "1.8\nVaros010\n",
        expectedOutput: [
          "2. feladat",
          "A települések neve:",
          ...officialSettlementNames,
          "3. feladat",
          "Adja meg a vizsgált szakasz hosszát km-ben!",
          "Az első 1.8 km-en 70 km/h volt a legalacsonyabb megengedett sebesség.",
          "4. feladat",
          "Az út 22.38 százaléka vezet településen belül.",
          "5. feladat",
          "Adja meg egy település nevét!",
          "A sebességkorlátozó táblák száma: 4",
          "Az út hossza a településen belül 2000 méter.",
          "6. feladat",
          "A legközelebbi település: Varos609",
        ].join("\n"),
        explanation:
          "Ez a publikus teszt a hivatalos mintakimenet logikáját követi. A promptokat külön soros print + input formával érdemes kezelni, így a judge kimenete stabil marad.",
      },
    ],
    providedFiles: [
      {
        path: "ut.txt",
        description:
          "A 2025. októberi emelt Sebesség feladat eredeti adatfájlja, amelyet a judge automatikusan bemásol a sandbox munkamappájába.",
        content: officialRoadFileContent,
      },
    ],
    starterCode: [
      "# 1. Olvasd be az út teljes hosszát és az eseményeket az ut.txt fájlból.",
      "with open(\"ut.txt\", encoding=\"utf-8\") as source:",
      "    sorok = [sor.strip() for sor in source if sor.strip()]",
      "",
      "ut_hossz = int(sorok[0])",
      "esemenyek = []",
      "for sor in sorok[1:]:",
      "    tavolsag, adat = sor.split(maxsplit=1)",
      "    esemenyek.append((int(tavolsag), adat))",
      "",
      "# 2. Építs saját segédlistákat: települések, szakaszok, aktív limitek, stb.",
      "",
      "print(\"2. feladat\")",
      "print(\"A települések neve:\")",
      "# ... írd ki a településneveket külön sorokban",
      "",
      "print(\"3. feladat\")",
      "print(\"Adja meg a vizsgált szakasz hosszát km-ben!\")",
      "vizsgalt_km = float(input())",
      "# ... számold ki az első vizsgalt_km km legalacsonyabb megengedett sebességét",
      "",
      "print(\"4. feladat\")",
      "# ... írd ki a településen belüli arányt",
      "",
      "print(\"5. feladat\")",
      "print(\"Adja meg egy település nevét!\")",
      "telepules = input().strip()",
      "# ... számold ki a táblák számát és a belső úthosszt",
      "",
      "print(\"6. feladat\")",
      "# ... írd ki a legközelebbi település nevét",
    ].join("\n"),
  },
];

export function getArchiveTaskById(taskId: string): WorkspaceTask | undefined {
  return archiveTasks.find((task) => task.id === taskId);
}