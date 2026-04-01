import { officialProgrammingArchiveSeeds, type OfficialProgrammingArchiveSeed } from "@/lib/official-programming-archive-data";

export type NavigationItem = {
  href: string;
  label: string;
};

export type SiteMetric = {
  label: string;
  value: string;
  description: string;
};

export type Lesson = {
  id: string;
  title: string;
  summary: string;
  examValue: string;
};

export type LessonTaskLink = {
  kind: "practice" | "archive";
  targetId: string;
  reason: string;
};

export type LessonPhase = {
  slug: string;
  title: string;
  audience: string;
  description: string;
  lessons: Lesson[];
};

export type BlueprintCard = {
  title: string;
  target: string;
  description: string;
};

export type ArchiveAsset = {
  label: string;
  href: string;
};

export type ArchiveEntry = {
  id: string;
  year: number;
  season: string;
  level: "Közép" | "Emelt";
  title: string;
  family: string;
  note: string;
  source: string;
  workspaceTaskId?: string;
  fileHighlights?: string[];
  assets?: ArchiveAsset[];
};

export type Milestone = {
  title: string;
  stage: string;
  description: string;
};

export type ProgressRoadmapItem = {
  title: string;
  stage: string;
  summary: string;
  unlocks: string;
};

export const navigationItems: NavigationItem[] = [
  { href: "/tanulas", label: "Tanulás" },
  { href: "/gyakorlas", label: "Gyakorlás" },
  { href: "/probaerettsegi", label: "Próbaérettségi" },
  { href: "/vizsgaarchivum", label: "Vizsgaarchívum" },
  { href: "/fejlodes", label: "Fejlődés" },
];

export const siteMetrics: SiteMetric[] = [
  {
    label: "Lecke",
    value: "40",
    description:
      "18 közös, 8 közép-specifikus, 10 emelt-specifikus és 4 review lecke az első curriculum draftban.",
  },
  {
    label: "Gyakorló feladat",
    value: "100",
    description:
      "50 közép és 50 emelt feladat, mindegyik saját szövegezéssel, vizsgahű mintával.",
  },
  {
    label: "Próbaérettségi",
    value: "20",
    description:
      "10 közép és 10 emelt teljes, időre teljesíthető szimuláció a tényleges vizsga logikájára hangolva.",
  },
  {
    label: "Archívum ablak",
    value: "2021-2025",
    description:
      "A korábbi évek feladattípusai taxonómiaként és nehézségi mintaként támogatják a saját tartalmat.",
  },
];

export const lessonPhases: LessonPhase[] = [
  {
    slug: "shared-foundation",
    title: "Közös alapozás I.",
    audience: "Mindenkinek",
    description:
      "Nulláról indul a változóktól a ciklusokig, hogy a teljesen kezdő tanuló is stabil Python-alapot kapjon.",
    lessons: [
      {
        id: "shared-01",
        title: "Python alapok és programozói gondolkodás",
        summary: "Mi a program, hogyan olvasunk feladatot, hogyan gondolkodunk részproblémákban.",
        examValue: "Megtanít értelmezni a vizsgafeladat nyelvét.",
      },
      {
        id: "shared-02",
        title: "Bemenet és kimenet",
        summary: "Input, print, típuskasztolás, pontos outputelvárások.",
        examValue: "A legtöbb pontvesztés itt kezdődik, ezt stabilizálja.",
      },
      {
        id: "shared-03",
        title: "Számítások és kifejezések",
        summary: "Alapműveletek, precedencia, egyszerű kimeneti számítások.",
        examValue: "Kis részfeladatokra és adatatvezetésre készít fel.",
      },
      {
        id: "shared-04",
        title: "Döntések",
        summary: "If, elif, else, intervallumvizsgálat, logikai kombinációk.",
        examValue: "Szabályrendszerek és validációk alapja.",
      },
      {
        id: "shared-05",
        title: "Ciklusok alapjai",
        summary: "For, while, range, lépésközök, off-by-one hibák.",
        examValue: "Minden sorozatfeldolgozás és szimuláció előkészítése.",
      },
      {
        id: "shared-06",
        title: "Listák és bejárás",
        summary: "Listaépítés, indexelés, bejárás, egyszerű transzformációk.",
        examValue: "Adatsorokkal dolgozó vizsgafeladatok alapja.",
      },
    ],
  },
  {
    slug: "shared-processing",
    title: "Közös alapozás II.",
    audience: "Mindenkinek",
    description:
      "A sztringek, gyűjtési minták, validáció és függvények együtt már közel visznek a valódi vizsgafeladatokhoz.",
    lessons: [
      {
        id: "shared-07",
        title: "Sztringek és karakterek",
        summary: "Split, join, replace, keresési rutinok, karakterenkénti feldolgozás.",
        examValue: "Szöveges inputok, kódok és jelölések feldolgozására készít fel.",
      },
      {
        id: "shared-08",
        title: "Gyűjtés és számolás",
        summary: "Összegzés, darabszám, minimum, maximum, átlag, szűrés.",
        examValue: "Az egyik leggyakoribb vizsgapontszerző mintát gyakoroltatja.",
      },
      {
        id: "shared-09",
        title: "Ellenőrzés és validálás",
        summary: "Határértékek, formátumvizsgálat, védekező gondolkodás.",
        examValue: "Megelőzi a teszteseti buktákat és rejtett hibatípusokat.",
      },
      {
        id: "shared-10",
        title: "Függvények és felbontás",
        summary: "Paraméterek, visszatérési érték, segédfüggvények, modularitási alapok.",
        examValue: "Hosszabb emelt feladatoknál kulcsfontosságú.",
      },
      {
        id: "shared-11",
        title: "Fájlkezelés",
        summary: "Soronkénti beolvasás, kiírás, strukturált rekordok.",
        examValue: "A vizsga adatfájlos részfeladataihoz alapfeltétel.",
      },
      {
        id: "shared-12",
        title: "Adatsorok feldolgozása",
        summary: "Egymásba ágyazott adatkezelés, csoportosítás, dictionary-alapok.",
        examValue: "Összetettebb közép és emelt feladatokra vezet át.",
      },
    ],
  },
  {
    slug: "shared-exam-workbench",
    title: "Közös vizsgaműhely",
    audience: "Választóág előtt",
    description:
      "A diák itt tanulja meg, hogyan kell hosszabb magyar nyelvű vizsgafeladatból megvalósítható tervet csinálni.",
    lessons: [
      {
        id: "shared-13",
        title: "Vizsgafeladat értelmezése",
        summary: "Szabálykivonás, részfeladatokra bontás, változótervezés.",
        examValue: "Csökkenti a rossz nekifutás és az elkapkodás kockázatát.",
      },
      {
        id: "shared-14",
        title: "Hibakeresés és tesztelés",
        summary: "Kézi trace, ellenőrző inputok, output-összehasonlítás.",
        examValue: "Pontot ment a vizsga utolsó perceiben.",
      },
      {
        id: "shared-15",
        title: "Egyszerű állapotgépek",
        summary: "Sorozatos állapotfrissítések, eseménysorok, egyszerű szimulációk.",
        examValue: "Közép és emelt szinten is gyakori mintát ad.",
      },
      {
        id: "shared-16",
        title: "Formázott kimenet",
        summary: "Táblák, igazítás, precíz stringkimenet, formahibák elkerülése.",
        examValue: "Pontveszteség nélküli végső kimenetre készít fel.",
      },
      {
        id: "shared-17",
        title: "Összefoglaló mini projekt",
        summary: "Parsing, ciklus, validálás és formázott kiírás egy integrált feladaton.",
        examValue: "Átviszi a tanulást a vizsgaszerű rutinba.",
      },
      {
        id: "shared-18",
        title: "Alapozás záró felmérés",
        summary: "Diagnosztika, szintajánlás, következő útvonal kijelölése.",
        examValue: "Döntés a közép vagy emelt fő fókuszról.",
      },
    ],
  },
  {
    slug: "kozep-track",
    title: "Közép szintű specializáció",
    audience: "Közép ág",
    description:
      "A hangsúly a gyors, megbízható megoldásokon van: klasszikus adatsorok, egyszerűbb szimulációk, tiszta output.",
    lessons: [
      {
        id: "kozep-01",
        title: "Tipikus közép feladatszerkezetek",
        summary: "Visszatérő minták, stabil megoldási sablonok.",
        examValue: "Megtanít gyorsan felismerni a megszokott feladattípusokat.",
      },
      {
        id: "kozep-02",
        title: "Lista- és sztringrutinok",
        summary: "Gyakori közép szintű rutinok friss adatokkal és más szövegezéssel.",
        examValue: "Sebességet és magabiztosságot ad.",
      },
      {
        id: "kozep-03",
        title: "Számlálás, keresés, szűrőfeltételek",
        summary: "Klasszikus pontszerző algoritmusok vizsgaszerű adatokon.",
        examValue: "A közép szint gerincét gyakorolja.",
      },
      {
        id: "kozep-04",
        title: "Fájlos közép feladatok",
        summary: "Egyszerűbb rekordfeldolgozás, pontozás, rangsorolás.",
        examValue: "A hivatalos feladatforma szimulációja.",
      },
      {
        id: "kozep-05",
        title: "Egyszerű szimulációk",
        summary: "Vezérlés, lépésszámlálás, állapotfrissítés kis komplexitással.",
        examValue: "A nehezebb közép feladatokhoz épít rutint.",
      },
      {
        id: "kozep-06",
        title: "Közép nehezítő tényezők",
        summary: "Tie-break, szegmensenkénti gyűjtés, furcsa input, precíz kiírás.",
        examValue: "Megtanítja kezelni a kis csavarokat.",
      },
      {
        id: "kozep-07",
        title: "Időalapú és pontozásos feladatok",
        summary: "Időrend, összesítés, eredménytáblák, egyszerű folyamatsorok.",
        examValue: "A valódi közép feladatok átlagmintáját adja.",
      },
      {
        id: "kozep-08",
        title: "Közép próbaérettségi stratégia",
        summary: "Időbeosztás, output-ellenőrzés, hibaellenőrző rutin.",
        examValue: "Vizsganapra optimalizált megoldási fegyelmet épít.",
      },
    ],
  },
  {
    slug: "emelt-track",
    title: "Emelt szintű specializáció",
    audience: "Emelt ág",
    description:
      "Itt már többlépcsős állapotkezelés, ütemezés, mozgásszimuláció, összetett fájlfeldolgozás és ASCII-szigor jelenik meg.",
    lessons: [
      {
        id: "emelt-01",
        title: "Emelt problémabontás",
        summary: "Hosszabb feladat előtervezése, helperfüggvények és részfeladatok.",
        examValue: "Nélküle nehéz kontroll alatt tartani a hosszú megoldásokat.",
      },
      {
        id: "emelt-02",
        title: "Összetett állapotkezelés",
        summary: "Többszintű állapotok, események, átmenetek.",
        examValue: "Szimulációs emelt feladatok alapja.",
      },
      {
        id: "emelt-03",
        title: "Ütemezés és sorrendkezelés",
        summary: "Feladatsorrend, prioritás, kiosztási logika.",
        examValue: "A gyakori emelt logikai feladatcsaládot célozza.",
      },
      {
        id: "emelt-04",
        title: "Összetett fájlfeldolgozás",
        summary: "Több mezős rekordok, származtatott mutatók, több szabály együtt.",
        examValue: "Valódi emelt adatfeldolgozó mintákra készít fel.",
      },
      {
        id: "emelt-05",
        title: "Geometria és mozgás",
        summary: "Koordináták, lépték, irányok, pályafrissítés, távolság.",
        examValue: "Olyan témákat fed le, amelyek középen ritkábban jönnek elő.",
      },
      {
        id: "emelt-06",
        title: "Formázott és ASCII kimenet",
        summary: "Karakteralapú rajzolás, vizuális szabályok, pontos alakzatok.",
        examValue: "Szigorú kiírási feladatokra készít fel.",
      },
      {
        id: "emelt-07",
        title: "Tisztább és hatékonyabb gondolkodás",
        summary: "Naiv megoldások felismerése, kevesebb átjárás, átgondoltabb állapot.",
        examValue: "Biztonságosabb emelt megoldásokat eredményez.",
      },
      {
        id: "emelt-08",
        title: "Összetett validáció és szabályrendszer",
        summary: "Több feltétel kölcsönhatása, speciális esetek kezelése.",
        examValue: "A pontvesztő csavarok ellen épít védelmet.",
      },
      {
        id: "emelt-09",
        title: "Teljes emelt mintafeladat bontása",
        summary: "Egy hosszabb feladat végigvitele a prompttól a végső ellenőrzésig.",
        examValue: "A teljes vizsgamenetet gyakoroltatja.",
      },
      {
        id: "emelt-10",
        title: "Emelt próbaérettségi stratégia",
        summary: "Időbeosztás, részpontmentés, önellenőrző rutin, hibatolerancia.",
        examValue: "Vizsgakész ritmust alakít ki.",
      },
    ],
  },
  {
    slug: "review",
    title: "Review és próbaérettségi",
    audience: "Végső felkészülés",
    description:
      "Az utolsó blokk a hibaminták javítására, a teljes vizsgaszimulációra és a személyre szabott visszazárkózásra fókuszál.",
    lessons: [
      {
        id: "review-01",
        title: "Vegyes hibaminták",
        summary: "Valódi kezdő és haladó hibák javítása kategóriánként.",
        examValue: "Gyorsan emel a megbízhatóságon a vizsga előtt.",
      },
      {
        id: "review-02",
        title: "Teljes közép próbaérettségi",
        summary: "Időre oldható, pontozható szimuláció közép szinten.",
        examValue: "Valódi terhelés alatt teszteli a rutint.",
      },
      {
        id: "review-03",
        title: "Teljes emelt próbaérettségi",
        summary: "Időre oldható, pontozható szimuláció emelt szinten.",
        examValue: "Megmutatja a hosszú feladatokkal kapcsolatos gyenge pontokat.",
      },
      {
        id: "review-04",
        title: "Személyre szabott felzárkóztatás",
        summary: "A későbbi skill-gap és submission adatokra épülő visszatérési út.",
        examValue: "Lehetővé teszi a célzott, utólagos javítást.",
      },
    ],
  },
];

export const lessonTaskLinksByLessonId: Record<string, LessonTaskLink[]> = {
  "shared-01": [
    {
      kind: "practice",
      targetId: "sorfigyelo",
      reason: "Első, lineárisan végigvihető drill a feladatolvasás és a többválaszos kiírás összekötésére.",
    },
  ],
  "shared-02": [
    {
      kind: "practice",
      targetId: "sorfigyelo",
      reason: "A szabványos bemenet és a pontos, többsoros kimenet itt közvetlenül gyakorolható.",
    },
  ],
  "shared-03": [
    {
      kind: "practice",
      targetId: "sorfigyelo",
      reason: "Alapműveletek, részszámítások és végső kiírás egy rövid rutinfeladaton.",
    },
  ],
  "shared-04": [
    {
      kind: "practice",
      targetId: "rajtlista",
      reason: "If-ágak és formai feltételek gyakorlása rövid, jól tesztelhető bemenetekkel.",
    },
  ],
  "shared-05": [
    {
      kind: "practice",
      targetId: "tetojaror",
      reason: "A ciklus és a lépésenkénti állapotfrissítés itt gyorsan kézzelfoghatóvá válik.",
    },
  ],
  "shared-06": [
    {
      kind: "practice",
      targetId: "sorfigyelo",
      reason: "Lista-bejárás, összegzés és maximumkeresés egyetlen feladatlapon.",
    },
  ],
  "shared-07": [
    {
      kind: "practice",
      targetId: "rajtlista",
      reason: "Split, karaktervizsgálat és mintafelismerés a valós vizsgasztringek hangulatában.",
    },
  ],
  "shared-08": [
    {
      kind: "practice",
      targetId: "sorfigyelo",
      reason: "Összegzés, darabszám és maximum ugyanazon a publikus mintacsomagon gyakorolható.",
    },
  ],
  "shared-09": [
    {
      kind: "practice",
      targetId: "rajtlista",
      reason: "A validációs gondolkodás itt rögtön látható tesztesetekhez kapcsolódik.",
    },
  ],
  "shared-10": [
    {
      kind: "practice",
      targetId: "tetojaror",
      reason: "Jó alap arra, hogy a hosszabb megoldást részfeladatokra és segédlépésekre bontsd.",
    },
  ],
  "shared-11": [
    {
      kind: "practice",
      targetId: "utnaplo",
      reason: "Az első valós fájlos workflow: beolvasás, rekordok feldolgozása és több válasz kiírása.",
    },
  ],
  "shared-12": [
    {
      kind: "practice",
      targetId: "utnaplo",
      reason: "A rekordokból képzett származtatott mutatók itt rögtön megjelennek a megoldásban.",
    },
  ],
  "shared-13": [
    {
      kind: "archive",
      targetId: "2025-oktober-emelt-sebesseg",
      reason: "Hosszabb magyar nyelvű prompt bontása egy valódi hivatalos feladaton.",
    },
  ],
  "shared-14": [
    {
      kind: "practice",
      targetId: "sorfigyelo",
      reason: "Kézi trace és ellenőrző inputok gyors kipróbálása ugyanazon az oldalon.",
    },
  ],
  "shared-15": [
    {
      kind: "practice",
      targetId: "tetojaror",
      reason: "Állapotgépszerű lépésfrissítés és blokkolt esetek kezelése egy helyen.",
    },
  ],
  "shared-16": [
    {
      kind: "archive",
      targetId: "2025-majus-idegen-emelt-ascii-rajzok",
      reason: "Archív referencia a különösen szigorú formázott kimeneti feladatokhoz.",
    },
  ],
  "shared-17": [
    {
      kind: "practice",
      targetId: "sorfigyelo",
      reason: "Integrált alapozó rutin parsinggal, ciklussal és többféle eredménnyel.",
    },
    {
      kind: "practice",
      targetId: "rajtlista",
      reason: "Második rövid drill ugyanebből a szintről, hogy ne egyetlen mintára épüljön a rutin.",
    },
  ],
  "shared-18": [
    {
      kind: "practice",
      targetId: "sorfigyelo",
      reason: "Első diagnosztikus közép-barát feladat a tempó és az outputfegyelem mérésére.",
    },
    {
      kind: "practice",
      targetId: "tetojaror",
      reason: "Második, állapotfrissítéses drill arra, hogy látszódjon, elbír-e hosszabb szabálysort a megoldás.",
    },
  ],
  "kozep-01": [
    {
      kind: "practice",
      targetId: "sorfigyelo",
      reason: "Tipikus közép váz: gyors összesítés, maximum, feltételes zárósor.",
    },
  ],
  "kozep-02": [
    {
      kind: "practice",
      targetId: "rajtlista",
      reason: "Sztring- és listaműveletek közép szintű kombinációja új sztoriban.",
    },
  ],
  "kozep-03": [
    {
      kind: "practice",
      targetId: "sorfigyelo",
      reason: "Számlálás, keresés és szűrőfeltételek klasszikus közép ritmusban.",
    },
  ],
  "kozep-04": [
    {
      kind: "practice",
      targetId: "utnaplo",
      reason: "Egyszerű, de már fájlból dolgozó rekordfeldolgozás a közép fájlos rutin előszobájaként.",
    },
  ],
  "kozep-05": [
    {
      kind: "archive",
      targetId: "2025-majus-kozep-kihivas",
      reason: "Archív közép példa egyszerűbb állapotfrissítésre és folyamatszerű gondolkodásra.",
    },
  ],
  "kozep-06": [
    {
      kind: "archive",
      targetId: "2024-oktober-kozep-befozes",
      reason: "Kis csavaros szabályalkalmazás és precíz végső kiírás közép szinten.",
    },
  ],
  "kozep-07": [
    {
      kind: "archive",
      targetId: "2023-oktober-kozep-szallitas",
      reason: "Időrend, állapot és összesítés egy középhez már nehezebb mintán.",
    },
  ],
  "kozep-08": [
    {
      kind: "archive",
      targetId: "2025-oktober-kozep-forgalomszamlalas",
      reason: "Vizsgaszerű közép referencia a végső tempó és outputellenőrzés gyakorlásához.",
    },
    {
      kind: "practice",
      targetId: "rajtlista",
      reason: "Rövid ráhangoló drill a próba előtt, ha még kell egy gyors, biztos sikerélmény.",
    },
  ],
  "emelt-01": [
    {
      kind: "archive",
      targetId: "2025-oktober-emelt-sebesseg",
      reason: "Hosszabb emelt prompt bontása és részfeladatos tervezés hivatalos feladatlapon.",
    },
  ],
  "emelt-02": [
    {
      kind: "practice",
      targetId: "tetojaror",
      reason: "Összetettebb állapotkezelés és útvonalfrissítés interaktív drillben.",
    },
  ],
  "emelt-03": [
    {
      kind: "archive",
      targetId: "2023-majus-emelt-utemezes",
      reason: "Archív minta az ütemezési és sorrendkezelési gondolkodáshoz.",
    },
  ],
  "emelt-04": [
    {
      kind: "practice",
      targetId: "utnaplo",
      reason: "Összetettebb fájlos adatsor-feldolgozás a saját gyakorlóbankból.",
    },
  ],
  "emelt-05": [
    {
      kind: "archive",
      targetId: "2025-oktober-emelt-sebesseg",
      reason: "Koordináta, mozgás és szabályvezérelt limitváltás egy hivatalos mintán.",
    },
  ],
  "emelt-06": [
    {
      kind: "archive",
      targetId: "2025-majus-idegen-emelt-ascii-rajzok",
      reason: "Archív referenciapont a különösen szigorú ASCII és formai kimenetekhez.",
    },
  ],
  "emelt-07": [
    {
      kind: "practice",
      targetId: "tetojaror",
      reason: "Naiv és átgondoltabb állapotfrissítések közti különbség jól megfigyelhető rajta.",
    },
  ],
  "emelt-08": [
    {
      kind: "archive",
      targetId: "2024-majus-emelt-belepteto-rendszer",
      reason: "Több szabály kölcsönhatása és szélső esetek kezelése emelt szinten.",
    },
  ],
  "emelt-09": [
    {
      kind: "archive",
      targetId: "2025-oktober-emelt-sebesseg",
      reason: "Teljes emelt mintafeladat végigvezetése a prompttól az utolsó részfeladatig.",
    },
    {
      kind: "practice",
      targetId: "tetojaror",
      reason: "Rövidebb, interaktív drill ugyanannak a részfeladatos gondolkodásnak a begyakorlására.",
    },
  ],
  "emelt-10": [
    {
      kind: "archive",
      targetId: "2025-oktober-emelt-sebesseg",
      reason: "Vizsgatempó, részpontmentés és hosszú feladatos ritmus gyakorlása emelten.",
    },
    {
      kind: "practice",
      targetId: "utnaplo",
      reason: "Rövid bemelegítő fájlos feladat, ha a próba előtt még kell egy gyors ismétlés.",
    },
  ],
  "review-01": [
    {
      kind: "practice",
      targetId: "rajtlista",
      reason: "Forma- és logikai hibák gyors levadászására rövid, jól tesztelhető drill.",
    },
  ],
  "review-02": [
    {
      kind: "archive",
      targetId: "2025-oktober-kozep-forgalomszamlalas",
      reason: "Teljes közép referencia a végső vizsgaszimuláció előtti visszanézéshez.",
    },
    {
      kind: "practice",
      targetId: "sorfigyelo",
      reason: "Rövid ráhangoló drill ugyanebben a készségcsaládban.",
    },
  ],
  "review-03": [
    {
      kind: "archive",
      targetId: "2025-oktober-emelt-sebesseg",
      reason: "Teljes emelt referencia a hosszú, több részes feladatkezelés ellenőrzésére.",
    },
    {
      kind: "practice",
      targetId: "tetojaror",
      reason: "Interaktív emelt drill a teljes próba előtti utolsó mozgásszimulációs ismétléshez.",
    },
  ],
  "review-04": [
    {
      kind: "practice",
      targetId: "rajtlista",
      reason: "Gyors, célzott visszazárkózó drill, ha újra előjönnek a validációs hibák.",
    },
    {
      kind: "practice",
      targetId: "utnaplo",
      reason: "Fájlos pótlógyakorlat, ha a rekordfeldolgozás még bizonytalan marad.",
    },
  ],
};

export const practiceBlueprint: BlueprintCard[] = [
  {
    title: "Közép gyakorlóbank",
    target: "50 feladat",
    description:
      "Visszatérő közép szintű minták új történetbe csomagolva: számlálás, szűrés, egyszerű szimuláció, fájlkezelés.",
  },
  {
    title: "Emelt gyakorlóbank",
    target: "50 feladat",
    description:
      "Összetett állapotok, ütemezés, geometria, ASCII és többrészes feldolgozó logika emeltre hangolva.",
  },
  {
    title: "Közép próbaérettségi",
    target: "10 teljes csomag",
    description:
      "Időre teljesíthető, vizsgaszerű, saját tartalmú, de feladattípusban reális szimulációk.",
  },
  {
    title: "Emelt próbaérettségi",
    target: "10 teljes csomag",
    description:
      "Komplexebb, hosszabb és pontosabb tervezést igénylő mock exam csomagok emelt diákoknak.",
  },
];

const archiveSourcePageByLevel: Record<ArchiveEntry["level"], string> = {
  "Közép": "https://farkascs.hu/digkult-kozep/",
  "Emelt": "https://farkascs.hu/digkult-emelt/",
};

function buildDefaultArchiveNote(seed: OfficialProgrammingArchiveSeed) {
  const level = seed.level.toLowerCase();

  if (seed.season === "minta") {
    return `A digitális kultúra ${seed.year}. minta ${level} programozási feladata közvetlen PDF- és ZIP-hivatkozásokkal az eredeti forrásoldal alapján.`;
  }

  if (seed.season.includes("idegen")) {
    return `A hivatalos ${seed.year}. ${seed.season} ${level} programozási feladata közvetlen PDF- és ZIP-hivatkozásokkal az idegen nyelvű vizsgaváltozatból.`;
  }

  return `A hivatalos ${seed.year}. ${seed.season} ${level} programozási feladata közvetlen PDF- és ZIP-hivatkozásokkal az eredeti archív forrásoldalról.`;
}

function buildOfficialArchiveAssets(seed: OfficialProgrammingArchiveSeed) {
  const assets: ArchiveAsset[] = [...(seed.additionalAssets ?? [])];

  assets.push({
    label: "Programleírás (PDF)",
    href: seed.programPdfHref,
  });

  if (seed.programZipHref) {
    assets.push({
      label: "Program forráscsomag (ZIP)",
      href: seed.programZipHref,
    });
  }

  if (seed.taskSheetPdfHref) {
    assets.push({
      label: "Teljes feladatlap (PDF)",
      href: seed.taskSheetPdfHref,
    });
  }

  if (seed.solutionZipHref) {
    assets.push({
      label: "Hivatalos megoldáscsomag (ZIP)",
      href: seed.solutionZipHref,
    });
  }

  return assets.filter((asset, index, collection) =>
    collection.findIndex((candidate) => candidate.href === asset.href) === index,
  );
}

function toOfficialArchiveEntry(seed: OfficialProgrammingArchiveSeed): ArchiveEntry {
  return {
    id: seed.id,
    year: seed.year,
    season: seed.season,
    level: seed.level,
    title: seed.title,
    family: seed.family ?? "hivatalos programozási archív referencia",
    note: seed.note ?? buildDefaultArchiveNote(seed),
    source: archiveSourcePageByLevel[seed.level],
    workspaceTaskId: seed.workspaceTaskId,
    fileHighlights: seed.fileHighlights,
    assets: buildOfficialArchiveAssets(seed),
  };
}

export const archiveEntries: ArchiveEntry[] = officialProgrammingArchiveSeeds.map(
  toOfficialArchiveEntry,
);

export function getArchiveEntryById(entryId: string): ArchiveEntry | undefined {
  return archiveEntries.find((entry) => entry.id === entryId);
}

export const implementationMilestones: Milestone[] = [
  {
    title: "Dockerizált fejlesztői alap",
    stage: "Most",
    description:
      "Next.js web app, külön judge service, PostgreSQL és Redis egy közös Docker Compose stackben.",
  },
  {
    title: "Lecke-regiszter és skill graph",
    stage: "Alfa",
    description:
      "A lecke-, skill- és track-összefüggések egységes adatmodellben lesznek kezelve.",
  },
  {
    title: "Beküldési átjáró",
    stage: "Alfa",
    description:
      "A web app route handleren keresztül küldi tovább a kódot a deterministic judge irányába.",
  },
  {
    title: "Progress tracking",
    stage: "Beta",
    description:
      "Felhasználói fiók, lecketeljesítés, task history és skill-gap alapú ajánlás.",
  },
  {
    title: "AI feedback adapter",
    stage: "Később",
    description:
      "A determinisztikus eredményre épülő magyar nyelvű coaching, hibamagyarázat és következő leckeajánlás.",
  },
];

export const progressRoadmap: ProgressRoadmapItem[] = [
  {
    title: "Fiók és szintválasztás",
    stage: "Következő kör",
    summary: "A diák a regisztráció után közép vagy emelt fókuszt választ, de közben végig megmarad a közös alapozás visszalépési lehetősége.",
    unlocks:
      "A mostani böngészős snapshotból valódi, fiókhoz kötött tanulási profil lesz, amit több eszközről is ugyanott lehet folytatni.",
  },
  {
    title: "Mastery állapotok",
    stage: "Alfa",
    summary: "Minden skillhez látszani fog, hogy új, gyakorolt, stabil vagy újraerősítendő, és ez visszahat a következő ajánlott lépésre is.",
    unlocks:
      "A lecketérkép nem csak tartalomjegyzék marad, hanem tényleges állapotjelző felületté válik a tanuló számára.",
  },
  {
    title: "Submission timeline",
    stage: "Alfa",
    summary: "A korábbi kódok, futások és hibaminták feladatonként és időrendben is visszanézhetők lesznek, nem csak az aktuális böngésző helyi tárolójából.",
    unlocks:
      "Megjelenhet a valódi fejlődési ív: mi javult, mi esik vissza, és melyik feladattípusnál torpan meg a tanuló.",
  },
  {
    title: "AI-ra kész feedback payload",
    stage: "Beta",
    summary: "A submission adatszerkezetet úgy tervezzük, hogy a deterministic judge eredményére ráépülhessen magyar nyelvű AI-értékelés és coaching.",
    unlocks:
      "A review nem különálló extra lesz, hanem a tényleges submission- és skillmodellre ráfűzött, ellenőrizhető kiegészítő réteg.",
  },
];