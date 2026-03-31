import type { WorkspaceTask } from "@/lib/task-types";

export type {
  TaskFile as PracticeTaskFile,
  TaskInputMode as PracticeTaskInputMode,
  TaskSource,
  TaskStatementBlock,
  TaskTestCase as PracticeTaskTestCase,
  TaskTrack as PracticeTrack,
  WorkspaceRule,
  WorkspaceTask as PracticeTask,
} from "@/lib/task-types";

export const practiceTasks: WorkspaceTask[] = [
  {
    id: "sorfigyelo",
    title: "Sorfigyelő",
    track: "kozep",
    level: "Közép",
    family: "gyűjtés és kiválasztás",
    inputMode: "stdin",
    estimatedMinutes: "20-25 perc",
    summary:
      "Több pénztár aktuális sorhosszából kell gyors összesítést, maximumkeresést és egyszerű állapotjelzést készíteni.",
    skillFocus: [
      "bemenet feldolgozása",
      "összegzés",
      "maximumkeresés",
      "feltételes kiírás",
    ],
    editorTips: [
      "Nem kötelező függvényt írnod. Haladhatsz egyszerűen fentről lefelé, soronként.",
      "Először olvasd be az adatokat, aztán külön változókban számold ki a négy kért eredményt.",
    ],
    source: {
      kind: "platform-authored",
      label: "Platform-feladat",
      note:
        "Saját szövegezésű közép szintű rutin, amely a vizsgán gyakori gyűjtési mintákat gyakoroltatja.",
    },
    statement: [
      {
        title: "Feladat",
        paragraphs: [
          "Egy iskolai büfé négyzetes kijelzője minden pénztárnál mutatja, hány diák várakozik éppen a sorban. A műszak végén egy rövid összesítést kell készíteni az aktuális állapotról.",
          "A program első lépésben olvassa be, hány pénztárat figyelünk. Ezután ugyanennyi egész szám érkezik, szóközzel elválasztva: mindegyik egy pénztár pillanatnyi sorhosszát jelenti.",
        ],
        bullets: [
          "Számold ki a várakozók teljes számát.",
          "Határozd meg a leghosszabb sor hosszát.",
          "Számold meg, hány pénztárnál áll legalább 5 ember sorban.",
          "Ha minden sor rövidebb 3 főnél, írd ki, hogy nyugodt, különben azt, hogy figyelem.",
        ],
      },
      {
        title: "Megjegyzés",
        paragraphs: [
          "A kimenet minden részét külön sorba írd. A feladat kizárólag standard bemenetet és standard kimenetet használ.",
        ],
      },
    ],
    inputFormat: [
      "Az első sor egy n egész szám, a pénztárak száma.",
      "A második sor n darab egész számot tartalmaz, a sorhosszakat.",
    ],
    outputFormat: [
      "1. sor: a várakozók teljes száma.",
      "2. sor: a leghosszabb sor hossza.",
      "3. sor: az 5 vagy több főből álló sorok darabszáma.",
      "4. sor: nyugodt vagy figyelem.",
    ],
    workspaceRules: [
      {
        title: "Stdin/stdout mód",
        description:
          "A feladatlap csak szabványos bemenetet és kimenetet vár. Fájlnyitás vagy hálózati elérés nincs.",
      },
      {
        title: "Szigorított futtatás",
        description:
          "Import, subprocess, eval/exec és dunder trükkök tiltva vannak, hogy a judge kizárólag vizsgaszerű Python-kódot engedjen.",
      },
    ],
    publicTests: [
      {
        label: "Minta 1",
        input: "6\n2 5 1 7 4 5\n",
        expectedOutput: "24\n7\n3\nfigyelem",
        explanation:
          "A teljes összeg 24, a maximum 7, három sor legalább 5 fős, ezért a jelzés figyelem.",
      },
      {
        label: "Minta 2",
        input: "4\n0 2 1 2\n",
        expectedOutput: "5\n2\n0\nnyugodt",
        explanation:
          "Nincs hosszú sor, ezért a végső állapot nyugodt.",
      },
    ],
    hiddenTests: [
      {
        label: "Rejtett 1",
        input: "5\n2 2 2 2 2\n",
        expectedOutput: "10\n2\n0\nnyugodt",
        explanation:
          "Minden sor rövid, ezért a végső állapot nyugodt, miközben az összeg és a maximum sem nulla.",
      },
      {
        label: "Rejtett 2",
        input: "1\n5\n",
        expectedOutput: "5\n5\n1\nfigyelem",
        explanation:
          "Egyetlen pénztár esetén is jól kell működnie a maximum- és darabszámolásnak.",
      },
    ],
    starterCode: [
      "# 1. Olvasd be, hány pénztár adata érkezik.",
      "n = int(input())",
      "",
      "# 2. Olvasd be a sorhosszakat.",
      "sorok = list(map(int, input().split()))",
      "",
      "# 3. Számolj, majd írj ki minden eredményt külön sorba.",
      "",
      "# print(...)",
    ].join("\n"),
  },
  {
    id: "rajtlista",
    title: "Rajtlista",
    track: "kozep",
    level: "Közép",
    family: "sztringvalidáció és szűrés",
    inputMode: "stdin",
    estimatedMinutes: "25-30 perc",
    summary:
      "Rövid azonosítókat kell forma szerint ellenőrizni, majd a jó kódokból egyszerű statisztikát készíteni.",
    skillFocus: [
      "sztringfeldolgozás",
      "validáció",
      "darabszámolás",
      "lexikografikus minimum",
    ],
    editorTips: [
      "Kezdő megoldásként teljesen jó, ha egy ciklusban végigmész a kódokon, és közben vezeted a számlálókat.",
      "Ha még nem kényelmes a saját függvény, először írd le a szabályokat kommentben, és azután kódold le őket sorban.",
    ],
    source: {
      kind: "platform-authored",
      label: "Platform-feladat",
      note:
        "Közép szintű, vizsgahű sztringes rutin új történettel és szabályrendszerrel.",
    },
    statement: [
      {
        title: "Feladat",
        paragraphs: [
          "Egy iskolai háziverseny nevezési rendszerében minden induló egy 5 karakteres rajtkódot kap. A szervezők szeretnék gyorsan kiszűrni a hibásan rögzített kódokat.",
          "Egy kód akkor érvényes, ha pontosan 5 karakterből áll, az első két karakter nagy angol betű, az utolsó három karakter pedig számjegy.",
        ],
        bullets: [
          "Számold meg az érvényes kódokat.",
          "Számold meg, ezek közül hánynak A az első karaktere.",
          "Határozd meg a lexikografikusan legkisebb érvényes kódot, vagy írd ki, hogy nincs.",
        ],
      },
    ],
    inputFormat: [
      "Az első sor egy n egész szám, a vizsgált kódok száma.",
      "Ezután n sor következik, soronként egy rajtkóddal.",
    ],
    outputFormat: [
      "1. sor: az érvényes kódok száma.",
      "2. sor: az A-val kezdődő érvényes kódok száma.",
      "3. sor: a legkisebb érvényes kód vagy nincs.",
    ],
    workspaceRules: [
      {
        title: "Beépített műveletek előnyben",
        description:
          "A feladathoz nincs szükség importokra. A judge a szokásos stringműveletekre optimalizált, egyszerű Python-megoldást vár.",
      },
      {
        title: "Kétlépcsős ellenőrzés",
        description:
          "A futtatás a látható mintákkal megy, a pontozott beküldés viszont külön rejtett teszteket is használ ennél a feladatnál.",
      },
    ],
    publicTests: [
      {
        label: "Minta 1",
        input: "6\nAB123\nAX002\nA9123\nQQ120\nAR12\nAZ099\n",
        expectedOutput: "4\n3\nAB123",
        explanation:
          "Négy kód felel meg a szabálynak, ezek közül három A-val kezdődik, a legkisebb AB123.",
      },
      {
        label: "Minta 2",
        input: "3\nabc12\nA1234\nZ-100\n",
        expectedOutput: "0\n0\nnincs",
        explanation:
          "Ebben az esetben egyetlen kód sem teljesíti a formai elvárásokat.",
      },
    ],
    hiddenTests: [
      {
        label: "Rejtett 1",
        input: "5\nAA000\nBZ999\nAB12\nA1000\nZA010\n",
        expectedOutput: "3\n1\nAA000",
        explanation:
          "Vegyesen vannak jó és rossz kódok; csak a szabályos, 5 karakteres minták számítanak.",
      },
      {
        label: "Rejtett 2",
        input: "6\nAB001\nAB000\nAA100\nZZ999\nA_100\nBA12A\n",
        expectedOutput: "4\n3\nAA100",
        explanation:
          "A lexikografikus minimumot és az A-val kezdődő darabszámot egyszerre ellenőrzi.",
      },
    ],
    starterCode: [
      "# 1. Olvasd be, hány kódot kell vizsgálni.",
      "n = int(input())",
      "",
      "# 2. Olvasd be a kódokat egy listába.",
      "kodok = [input().strip() for _ in range(n)]",
      "",
      "# 3. Menj végig rajtuk, és vezesd a számlálókat.",
      "",
      "# print(...)",
    ].join("\n"),
  },
  {
    id: "utnaplo",
    title: "Útnapló",
    track: "emelt",
    level: "Emelt",
    family: "fájlbeolvasás és adatsor-feldolgozás",
    inputMode: "provided-files",
    estimatedMinutes: "30-35 perc",
    summary:
      "A feladathoz kapott ut.txt állományból kell ellenőrzőpont-neveket és sebességértékeket beolvasni, majd statisztikát készíteni.",
    skillFocus: [
      "fájlbeolvasás",
      "listaépítés",
      "szűrés",
      "maximumkeresés",
    ],
    editorTips: [
      "Fájlos feladatnál az ut.txt automatikusan bekerül a judge munkamappájába, ezért elég az open(\"ut.txt\") hívás.",
      "Ha még új a Python, most se kell def-fel kezdened. Először olvasd be a fájlt, utána dolgozd fel sorban az adatokat.",
    ],
    source: {
      kind: "platform-authored",
      label: "Platform-feladat",
      note:
        "Saját, emelt hangulatú feladat a hivatalos fájlos adatfeldolgozások logikájára ráhangolva.",
    },
    statement: [
      {
        title: "Feladat",
        paragraphs: [
          "Az ut.txt állomány első sora megadja, hány mérési pont szerepel a naplóban. A további sorok mindegyike egy ellenőrzőpont nevét és az ott mért sebességet tartalmazza.",
          "Készíts programot, amely a fájlból olvas, és a mérések alapján összesítést ad.",
        ],
        bullets: [
          "Írd ki, hány mérési pont van a fájlban.",
          "Számold meg, hány mérésnél volt a sebesség nagyobb 50-nél.",
          "Add meg a legnagyobb mért sebességet.",
          "Írd ki annak az első ellenőrzőpontnak a nevét, ahol ez a legnagyobb érték előfordult.",
        ],
      },
      {
        title: "Megjegyzés",
        paragraphs: [
          "A feladat most nem kér standard bemenetet. A program kizárólag az ut.txt állományból dolgozik.",
        ],
      },
    ],
    inputFormat: [
      "Nincs standard bemenet.",
      "A program az ut.txt fájl első sorából olvassa a darabszámot, a további sorokból pedig a név-sebesség párokat.",
    ],
    outputFormat: [
      "1. sor: a mérési pontok száma.",
      "2. sor: az 50-nél nagyobb sebességek darabszáma.",
      "3. sor: a legnagyobb sebesség értéke.",
      "4. sor: annak az első ellenőrzőpontnak a neve, ahol a maximum előfordult.",
    ],
    workspaceRules: [
      {
        title: "Automatikus munkafájl",
        description:
          "A judge az ut.txt állományt automatikusan elhelyezi a futtatási mappában. Írni továbbra sem lehet, csak olvasni.",
      },
      {
        title: "Szigorított fájlmód",
        description:
          "Csak a feladathoz adott fájlok olvashatók. Tetszőleges más fájl, hálózat vagy import továbbra sem érhető el.",
      },
      {
        title: "Interim pontozás",
        description:
          "Ehhez a fájlos gyakorlófeladathoz egyelőre csak publikus mintafájl és publikus teszt tartozik. A rejtett pontozás külön körben jön.",
      },
    ],
    publicTests: [
      {
        label: "Minta ellenőrzés",
        input: "",
        expectedOutput: "6\n3\n67\nTanya",
        explanation:
          "Hat mérési pont van, közülük három sebesség nagyobb 50-nél, a maximum 67, és ez először a Tanya ellenőrzőponton jelenik meg.",
      },
    ],
    providedFiles: [
      {
        path: "ut.txt",
        description:
          "A gyakorló feladathoz becsatolt mintafájl, amelyből a programnak olvasnia kell.",
        content: [
          "6",
          "Varoskapu 48",
          "Hid 52",
          "Tanya 67",
          "Erdo 45",
          "Lejto 61",
          "Cel 50",
        ].join("\n"),
      },
    ],
    starterCode: [
      "# 1. Nyisd meg a feladathoz adott ut.txt fájlt.",
      "fajl = open(\"ut.txt\", encoding=\"utf-8\")",
      "sorok = [sor.strip() for sor in fajl if sor.strip()]",
      "fajl.close()",
      "",
      "# 2. Az első sor a darabszám, a többi sorban egy név és egy sebesség van.",
      "db = int(sorok[0])",
      "adatok = sorok[1:]",
      "",
      "# 3. Dolgozd fel az adatokat, majd írd ki a négy választ.",
      "",
      "# print(...)",
    ].join("\n"),
  },
  {
    id: "tetojaror",
    title: "Tetőjárőr",
    track: "emelt",
    level: "Emelt",
    family: "állapotszimuláció és koordinátakezelés",
    inputMode: "stdin",
    estimatedMinutes: "35-40 perc",
    summary:
      "Parancssorozat alapján kell egy drón mozgását követni, ütközéseket számolni és útvonali statisztikát készíteni.",
    skillFocus: [
      "állapotfrissítés",
      "koordinátarendszer",
      "feltételes mozgás",
      "halmaz vagy duplikátumkezelés",
    ],
    editorTips: [
      "Készíts egyszerű x és y változót, és minden parancsnál egyenként frissítsd őket.",
      "A külön mezők számolásához már egy halmaz is jó lehet, de ha még nem ismerős, listával is elindulhatsz.",
    ],
    source: {
      kind: "platform-authored",
      label: "Platform-feladat",
      note:
        "Emelt szintű, vizsgaszerű szimulációs feladat koordinátás modellben.",
    },
    statement: [
      {
        title: "Feladat",
        paragraphs: [
          "Egy karbantartó drón egy 7x7-es tetőrácson mozog. A rács koordinátái 0 és 6 közötti egész számok, a drón kezdőpozíciója (3, 3).",
          "A bemenet parancsokat ad a drónnak. Az F parancs egy mezőt felfelé, az L egy mezőt lefelé, a B egy mezőt balra, a J pedig egy mezőt jobbra mozgatná a drónt.",
        ],
        bullets: [
          "Ha egy lépés kivezetné a drónt a rácsról, a drón marad a helyén, és ez blokkolt lépésnek számít.",
          "Határozd meg a végső koordinátát.",
          "Számold meg a blokkolt lépéseket.",
          "Add meg a kezdőponttól mért legnagyobb Manhattan-távolságot.",
          "Számold meg, hány különböző mezőt érintett a drón, a kezdőmezőt is beleszámítva.",
        ],
      },
      {
        title: "Megjegyzés",
        paragraphs: [
          "A második bemeneti sor pontosan n darab parancsot tartalmaz, szóközzel elválasztva.",
          "A végső koordinátát egy sorban, egy szóközzel elválasztva kell kiírni.",
        ],
      },
    ],
    inputFormat: [
      "Az első sor egy n egész szám, a parancsok száma.",
      "A második sor n darab parancsot tartalmaz: F, L, B vagy J.",
    ],
    outputFormat: [
      "1. sor: a végső x és y koordináta.",
      "2. sor: a blokkolt lépések száma.",
      "3. sor: a maximális Manhattan-távolság.",
      "4. sor: az érintett különböző mezők száma.",
    ],
    workspaceRules: [
      {
        title: "Vizsgaszerű futtatás",
        description:
          "Csak standard bemenet és kimenet használható. Importokra, hálózatra és fájlrendszeri műveletekre nincs lehetőség.",
      },
      {
        title: "Determinista judge",
        description:
          "A pontozás kizárólag a tesztesetekre adott kimenet alapján történik, nincs külső segédszolgáltatás vagy rejtett állapot.",
      },
    ],
    publicTests: [
      {
        label: "Minta 1",
        input: "8\nJ J F F B L L L\n",
        expectedOutput: "4 2\n0\n4\n8",
        explanation:
          "Nincs blokkolt lépés, a legtávolabbi pont 4 egységre van a kezdőtől, és összesen 8 külön mezőt érint a drón.",
      },
      {
        label: "Minta 2",
        input: "6\nB B B B L L\n",
        expectedOutput: "0 1\n1\n3\n6",
        explanation:
          "A negyedik balra lépés már kivezetne a tábláról, ezért blokkolt.",
      },
    ],
    hiddenTests: [
      {
        label: "Rejtett 1",
        input: "10\nF F F F J J J J L L\n",
        expectedOutput: "6 4\n2\n6\n9",
        explanation:
          "Két külön blokkolás is előfordul, és a maximális Manhattan-távolság a sarok közelében alakul ki.",
      },
      {
        label: "Rejtett 2",
        input: "8\nB B J J L L F F\n",
        expectedOutput: "3 3\n0\n2\n5",
        explanation:
          "A drón visszatér a kezdőpontra, ezért a külön mezők száma kisebb, mint a lépések száma plusz egy.",
      },
    ],
    starterCode: [
      "# 1. Olvasd be a parancsok számát és a parancslistát.",
      "n = int(input())",
      "parancsok = input().split()",
      "",
      "# 2. A drón induló pozíciója.",
      "x = 3",
      "y = 3",
      "",
      "# 3. Kövesd végig a mozgást, és írd ki a kért statisztikákat.",
      "",
      "# print(...)",
    ].join("\n"),
  },
];

export function getPracticeTaskById(taskId: string): WorkspaceTask | undefined {
  return practiceTasks.find((task) => task.id === taskId);
}