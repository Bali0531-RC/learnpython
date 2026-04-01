import type { TaskFile, TaskTestCase, WorkspaceTask } from "@/lib/task-types";

type BaseSeed = {
  id: string;
  title: string;
  family: string;
  estimatedMinutes: string;
  summary: string;
  sourceNote: string;
};

type NumericStatsSeed = BaseSeed & {
  threshold: number;
  calmLimit: number;
  measurementLabel: string;
  context: string;
};

type ValidationSeed = BaseSeed & {
  length: number;
  prefixLetters: number;
  preferredStart: string;
  codeLabel: string;
  context: string;
};

type TimeWindowSeed = BaseSeed & {
  thresholdTime: string;
  timeLabel: string;
  context: string;
};

type BoundedStateSeed = BaseSeed & {
  limit: number;
  stateLabel: string;
  context: string;
};

type FileStatsSeed = BaseSeed & {
  filePath: string;
  fileDescription: string;
  threshold: number;
  recordLabel: string;
  valueLabel: string;
  context: string;
  names: readonly string[];
  values: readonly number[];
};

type RankingSeed = BaseSeed & {
  qualifyLine: number;
  contestantLabel: string;
  context: string;
  names: readonly string[];
  scoreSets?: readonly [number, number, number][];
};

type RouteSeed = BaseSeed & {
  gridSize: number;
  startX: number;
  startY: number;
  context: string;
};

type SchedulingSeed = BaseSeed & {
  resourceCount: number;
  limit: number;
  resourceLabel: string;
  jobLabel: string;
  context: string;
};

type AsciiSeed = BaseSeed & {
  borderChar: string;
  mainDiagonalChar: string;
  secondaryDiagonalChar: string;
  fillChar: string;
  centerChar: string;
  themeLabel: string;
  context: string;
};

type AccessLogSeed = BaseSeed & {
  attendeeLabel: string;
  context: string;
  names: readonly string[];
};

type LeaderboardSeed = BaseSeed & {
  qualifyLine: number;
  contestantLabel: string;
  context: string;
  names: readonly string[];
  scoreSets?: readonly [number, number, number, number][];
};

const PLATFORM_LABEL = "Platform-feladat";

const STDIN_WORKSPACE_RULES = [
  {
    title: "Stdin/stdout mód",
    description:
      "A feladat kizárólag standard bemenetet és standard kimenetet használ. Import, hálózat és tetszőleges fájlművelet nincs.",
  },
  {
    title: "Determinista pontozás",
    description:
      "A platform a megadott tesztesetek alapján értékel. A pontos sortörések és a kimeneti fegyelem ezért mindenütt számítanak.",
  },
];

const FILE_WORKSPACE_RULES = [
  {
    title: "Automatikusan csatolt munkafájl",
    description:
      "A feladathoz adott fájl a judge munkamappájába automatikusan bekerül. A megoldásnak ezt kell beolvasnia, más állomány nem érhető el.",
  },
  {
    title: "Vizsgaszerű sandbox",
    description:
      "A futtatókörnyezet csak a megadott fájlt és a standard kimenetet engedi. Külső folyamat, hálózat és importált segédprogram nincs.",
  },
];

const NUMERIC_STATS_CASES = [
  [2, 5, 1, 7, 4, 5],
  [0, 2, 1, 2],
  [9, 3, 6, 1, 5],
  [1, 1, 1, 1, 1],
] as const;

const TIME_WINDOW_CASES = [
  ["07:20", "07:45", "08:10", "08:35", "09:05"],
  ["08:00", "08:05", "08:07", "08:08"],
  ["13:15", "12:40", "13:05", "14:10", "13:55"],
  ["09:50", "09:49", "10:15", "10:40", "10:05"],
] as const;

const BOUNDED_STATE_CASES = [
  [2, 3, -1, 4, -2, 1, 1],
  [3, -2, 2, 2, -1, -4, 1],
  [1, 1, 1, -2, 3, -1, 2],
  [4, 4, -3, 2, -1, -1, 5],
] as const;

const ROUTE_CASES = [
  ["J", "J", "F", "F", "B", "L", "L", "L"],
  ["B", "B", "B", "B", "L", "L"],
  ["F", "F", "J", "J", "J", "L", "B", "B", "F"],
  ["J", "F", "J", "F", "B", "L", "B", "L", "L"],
] as const;

const SCHEDULING_CASES = [
  [6, 4, 3, 5, 2, 4, 1],
  [8, 8, 8, 8, 8],
  [5, 3, 4, 2, 6, 1, 2, 3],
  [10, 2, 7, 6, 5, 1],
] as const;

const ACCESS_LOG_PATTERNS = [
  ["IN", "IN", "OUT", "OUT", "OUT", "IN", "IN"],
  ["IN", "OUT", "OUT", "IN", "IN", "OUT"],
  ["IN", "IN", "IN", "OUT", "OUT", "IN", "OUT"],
  ["OUT", "IN", "IN", "OUT", "IN", "OUT", "OUT"],
] as const;

const DEFAULT_RANKING_SCORE_SETS: [number, number, number][] = [
  [8, 7, 9],
  [6, 9, 8],
  [10, 5, 7],
  [7, 7, 7],
  [9, 8, 6],
];

const DEFAULT_LEADERBOARD_SCORE_SETS: [number, number, number, number][] = [
  [10, 8, 9, 7],
  [7, 9, 9, 8],
  [8, 8, 8, 8],
  [10, 10, 6, 5],
  [9, 7, 8, 9],
];

function buildSource(note: string) {
  return {
    kind: "platform-authored" as const,
    label: PLATFORM_LABEL,
    note,
  };
}

function numberListInput(values: readonly number[]) {
  return `${values.length}\n${values.join(" ")}\n`;
}

function timeListInput(values: readonly string[]) {
  return `${values.length}\n${values.join("\n")}\n`;
}

function signedChangesInput(limit: number, values: readonly number[]) {
  return `${values.length} ${limit}\n${values.join(" ")}\n`;
}

function commandsInput(values: readonly string[]) {
  return `${values.length}\n${values.join(" ")}\n`;
}

function schedulingInput(
  resourceCount: number,
  limit: number,
  durations: readonly number[],
) {
  return `${resourceCount} ${limit} ${durations.length}\n${durations.join(" ")}\n`;
}

function formatLines(lines: Array<string | number>) {
  return lines.join("\n");
}

function sum(values: readonly number[]) {
  return values.reduce((accumulator, value) => accumulator + value, 0);
}

function max(values: readonly number[]) {
  return values.reduce(
    (current, value) => (value > current ? value : current),
    Number.NEGATIVE_INFINITY,
  );
}

function min(values: readonly number[]) {
  return values.reduce(
    (current, value) => (value < current ? value : current),
    Number.POSITIVE_INFINITY,
  );
}

function parseTime(value: string) {
  const [hours, minutes] = value.split(":").map(Number);
  return hours * 60 + minutes;
}

function formatTime(totalMinutes: number) {
  const hours = Math.floor(totalMinutes / 60)
    .toString()
    .padStart(2, "0");
  const minutes = (totalMinutes % 60).toString().padStart(2, "0");
  return `${hours}:${minutes}`;
}

function toPublicAndHiddenTests<T>(
  cases: readonly T[],
  build: (value: T, index: number) => TaskTestCase,
) {
  return {
    publicTests: cases.slice(0, 2).map(build),
    hiddenTests: cases.slice(2).map((value, index) => build(value, index + 2)),
  };
}

function buildValidationCases(seed: ValidationSeed) {
  const suffixLength = seed.length - seed.prefixLetters;
  const goodPrefixA = `${seed.preferredStart}${"B".repeat(Math.max(0, seed.prefixLetters - 1))}`;
  const goodPrefixB = `${String.fromCharCode(seed.preferredStart.charCodeAt(0) + 1)}${"C".repeat(Math.max(0, seed.prefixLetters - 1))}`;
  const goodPrefixC = `${String.fromCharCode(seed.preferredStart.charCodeAt(0) + 2)}${"D".repeat(Math.max(0, seed.prefixLetters - 1))}`;
  const digits = (value: string) => value.repeat(suffixLength).slice(0, suffixLength);

  return [
    [
      `${goodPrefixA}${digits("1")}`,
      `${goodPrefixA}${digits("0")}`,
      `${goodPrefixB}${digits("2")}`,
      `${goodPrefixA.toLowerCase()}${digits("3")}`,
      `${goodPrefixC}${digits("4").slice(0, Math.max(0, suffixLength - 1))}X`,
      `${goodPrefixA}${digits("9")}9`,
    ],
    [
      `${goodPrefixB}${digits("7")}`,
      `${goodPrefixC}${digits("5")}`,
      `${goodPrefixB.toLowerCase()}${digits("4")}`,
      `${goodPrefixA}${digits("1").slice(0, Math.max(0, suffixLength - 1))}Q`,
    ],
    [
      `${goodPrefixA}${digits("3")}`,
      `${goodPrefixA}${digits("2")}`,
      `${goodPrefixC}${digits("8")}`,
      `${goodPrefixB}${digits("1")}`,
      `${goodPrefixC}${digits("6")}0`,
    ],
    [
      `${goodPrefixC}${digits("9")}`,
      `${goodPrefixB}${digits("0")}`,
      `${goodPrefixA}${digits("4")}`,
      `${goodPrefixA.slice(0, Math.max(0, seed.prefixLetters - 1))}${digits("5")}`,
    ],
  ] as const;
}

function buildFileContent(names: readonly string[], values: readonly number[]) {
  const rows = names.map((name, index) => `${name} ${values[index]}`);
  return [String(rows.length), ...rows].join("\n");
}

function buildFileRecords(names: readonly string[], values: readonly number[]) {
  return names.map((name, index) => ({ name, value: values[index] }));
}

function buildRankingRows(
  names: readonly string[],
  scoreSets: readonly [number, number, number][],
) {
  return names.map((name, index) => ({
    name,
    scores: scoreSets[index % scoreSets.length],
  }));
}

function buildLeaderboardRows(
  names: readonly string[],
  scoreSets: readonly [number, number, number, number][],
) {
  return names.map((name, index) => ({
    name,
    scores: scoreSets[index % scoreSets.length],
  }));
}

function buildAccessLogCases(names: readonly string[]) {
  return ACCESS_LOG_PATTERNS.map((pattern, patternIndex) =>
    pattern.map((action, index) => [names[(index + patternIndex) % names.length], action] as const),
  );
}

export function buildKozepNumericStatsTask(seed: NumericStatsSeed): WorkspaceTask {
  const tests = toPublicAndHiddenTests(NUMERIC_STATS_CASES, (values, index) => ({
    label: index < 2 ? `Minta ${index + 1}` : `Rejtett ${index - 1}`,
    input: numberListInput(values),
    expectedOutput: formatLines([
      sum(values),
      max(values),
      values.filter((value) => value >= seed.threshold).length,
      values.every((value) => value < seed.calmLimit) ? "nyugodt" : "figyelem",
    ]),
    explanation:
      index < 2
        ? "A minta a teljes összegzést, a maximumkeresést és a küszöbszámlálást egyszerre ellenőrzi."
        : "A rejtett kör a küszöb- és végállapot-logika stabil működését vizsgálja.",
  }));

  return {
    id: seed.id,
    title: seed.title,
    track: "kozep",
    level: "Közép",
    family: seed.family,
    inputMode: "stdin",
    estimatedMinutes: seed.estimatedMinutes,
    summary: seed.summary,
    skillFocus: [
      "bemenet feldolgozása",
      "összegzés",
      "maximumkeresés",
      "küszöbszámlálás",
    ],
    editorTips: [
      "Olvasd be először az összes adatot egy listába, és utána külön változókkal számold a kért eredményeket.",
      "Ha elakadsz, haladj a négy kimeneti sor szerint: összeg, maximum, darabszám, majd állapotjelzés.",
    ],
    source: buildSource(seed.sourceNote),
    statement: [
      {
        title: "Feladat",
        paragraphs: [
          seed.context,
          `A program első sora egy n egész szám, utána egy sorban n darab egész szám érkezik. Mindegyik a vizsgált ${seed.measurementLabel} aktuális értéke.`,
        ],
        bullets: [
          `Számold ki az összes ${seed.measurementLabel} összegét.`,
          "Határozd meg a legnagyobb értéket.",
          `Számold meg, hány adat legalább ${seed.threshold}.`,
          `Ha minden adat kisebb ${seed.calmLimit}-nél, írd ki, hogy nyugodt, különben azt, hogy figyelem.`,
        ],
      },
    ],
    inputFormat: [
      "Az első sor egy n egész szám, az adatok száma.",
      "A második sor n darab egész számot tartalmaz, szóközzel elválasztva.",
    ],
    outputFormat: [
      "1. sor: az összeg.",
      "2. sor: a maximum.",
      `3. sor: a legalább ${seed.threshold} értékek darabszáma.`,
      "4. sor: nyugodt vagy figyelem.",
    ],
    workspaceRules: STDIN_WORKSPACE_RULES,
    publicTests: tests.publicTests,
    hiddenTests: tests.hiddenTests,
    starterCode: [
      "n = int(input())",
      "ertekek = list(map(int, input().split()))",
      "",
      "# Számold ki az összeget, a maximumot, a küszöb feletti darabszámot és az állapotjelzést.",
      "",
      "# print(...)",
    ].join("\n"),
  };
}

export function buildKozepValidationTask(seed: ValidationSeed): WorkspaceTask {
  const cases = buildValidationCases(seed);
  const tests = toPublicAndHiddenTests(cases, (codes, index) => {
    const valid = codes.filter((code) => {
      if (code.length !== seed.length) {
        return false;
      }

      const prefix = code.slice(0, seed.prefixLetters);
      const suffix = code.slice(seed.prefixLetters);

      return /^[A-Z]+$/.test(prefix) && /^\d+$/.test(suffix);
    });

    return {
      label: index < 2 ? `Minta ${index + 1}` : `Rejtett ${index - 1}`,
      input: `${codes.length}\n${codes.join("\n")}\n`,
      expectedOutput: formatLines([
        valid.length,
        valid.filter((code) => code.startsWith(seed.preferredStart)).length,
        valid.sort()[0] ?? "nincs",
      ]),
      explanation:
        index < 2
          ? "A minta az érvényességi szabályokat és a lexikografikus minimum kiválasztását ellenőrzi."
          : "A rejtett teszt vegyesen tartalmaz jó és hibás kódokat, hogy a formaellenőrzés minden ága lefusson.",
    };
  });

  return {
    id: seed.id,
    title: seed.title,
    track: "kozep",
    level: "Közép",
    family: seed.family,
    inputMode: "stdin",
    estimatedMinutes: seed.estimatedMinutes,
    summary: seed.summary,
    skillFocus: [
      "sztringfeldolgozás",
      "validáció",
      "darabszámolás",
      "lexikografikus minimum",
    ],
    editorTips: [
      "Külön bontsd szét a prefix és a suffix ellenőrzését, így könnyebben látszik, melyik feltétel hibás.",
      "Először gyűjtsd ki az érvényes kódokat, és utána számold meg a speciális csoportokat.",
    ],
    source: buildSource(seed.sourceNote),
    statement: [
      {
        title: "Feladat",
        paragraphs: [
          seed.context,
          `Egy ${seed.codeLabel} akkor érvényes, ha pontosan ${seed.length} karakterből áll, az első ${seed.prefixLetters} karakter nagy angol betű, a többi pedig számjegy.`,
        ],
        bullets: [
          "Számold meg az érvényes kódokat.",
          `Számold meg, ezek közül hány kezdődik ${seed.preferredStart} betűvel.`,
          "Add meg a lexikografikusan legkisebb érvényes kódot, vagy írd ki, hogy nincs.",
        ],
      },
    ],
    inputFormat: [
      "Az első sor egy n egész szám, a vizsgált kódok száma.",
      "Ezután n sor következik, soronként egy kóddal.",
    ],
    outputFormat: [
      "1. sor: az érvényes kódok száma.",
      `2. sor: az ${seed.preferredStart} betűvel kezdődő érvényes kódok száma.`,
      "3. sor: a legkisebb érvényes kód vagy nincs.",
    ],
    workspaceRules: STDIN_WORKSPACE_RULES,
    publicTests: tests.publicTests,
    hiddenTests: tests.hiddenTests,
    starterCode: [
      "n = int(input())",
      "kodok = [input().strip() for _ in range(n)]",
      "",
      "# Ellenőrizd a prefixet, a suffixet és a teljes hosszt, majd készítsd el a három kimeneti sort.",
      "",
      "# print(...)",
    ].join("\n"),
  };
}

export function buildKozepTimeWindowTask(seed: TimeWindowSeed): WorkspaceTask {
  const thresholdMinutes = parseTime(seed.thresholdTime);
  const tests = toPublicAndHiddenTests(TIME_WINDOW_CASES, (times, index) => {
    const minutes = times.map(parseTime);
    return {
      label: index < 2 ? `Minta ${index + 1}` : `Rejtett ${index - 1}`,
      input: timeListInput(times),
      expectedOutput: formatLines([
        formatTime(min(minutes)),
        formatTime(max(minutes)),
        minutes.filter((value) => value >= thresholdMinutes).length,
        max(minutes) - min(minutes),
      ]),
      explanation:
        index < 2
          ? "A minta az időpontok percekké alakítását és a szélsőértékekből számolt különbséget egyszerre ellenőrzi."
          : "A rejtett tesztben nem időrendben érkeznek az adatok, ezért a minimumot és a maximumot valóban keresni kell.",
    };
  });

  return {
    id: seed.id,
    title: seed.title,
    track: "kozep",
    level: "Közép",
    family: seed.family,
    inputMode: "stdin",
    estimatedMinutes: seed.estimatedMinutes,
    summary: seed.summary,
    skillFocus: [
      "időpontok kezelése",
      "minimum- és maximumkeresés",
      "feltételes számlálás",
      "típusátalakítás",
    ],
    editorTips: [
      "Alakítsd át a HH:MM alakú időpontokat percekké, így a későbbi összehasonlítás egyszerű lesz.",
      "A végén a minimumot és a maximumot formázd vissza kétjegyű órára és percre.",
    ],
    source: buildSource(seed.sourceNote),
    statement: [
      {
        title: "Feladat",
        paragraphs: [
          seed.context,
          `A program első sora egy n egész szám, utána n sorban egy-egy ${seed.timeLabel} időpontja érkezik HH:MM formában.`,
        ],
        bullets: [
          "Add meg a legkorábbi időpontot.",
          "Add meg a legkésőbbi időpontot.",
          `Számold meg, hány időpont legalább ${seed.thresholdTime}.`,
          "Számold ki a legkisebb és legnagyobb időpont közötti különbséget percben.",
        ],
      },
    ],
    inputFormat: [
      "Az első sor egy n egész szám, az időpontok száma.",
      "Ezután n sor következik, soronként egy HH:MM alakú időponttal.",
    ],
    outputFormat: [
      "1. sor: a legkorábbi időpont HH:MM alakban.",
      "2. sor: a legkésőbbi időpont HH:MM alakban.",
      `3. sor: a legalább ${seed.thresholdTime} időpontok darabszáma.`,
      "4. sor: a teljes idősáv hossza percben.",
    ],
    workspaceRules: STDIN_WORKSPACE_RULES,
    publicTests: tests.publicTests,
    hiddenTests: tests.hiddenTests,
    starterCode: [
      "n = int(input())",
      "idopontok = [input().strip() for _ in range(n)]",
      "",
      "# Alakítsd az időpontokat percekké, majd készítsd el a négy válaszsort.",
      "",
      "# print(...)",
    ].join("\n"),
  };
}

export function buildKozepBoundedStateTask(seed: BoundedStateSeed): WorkspaceTask {
  const tests = toPublicAndHiddenTests(BOUNDED_STATE_CASES, (changes, index) => {
    let state = 0;
    let blocked = 0;
    let maxState = 0;
    let fullHits = 0;

    for (const delta of changes) {
      const next = state + delta;

      if (next < 0 || next > seed.limit) {
        blocked += 1;
        continue;
      }

      state = next;
      maxState = Math.max(maxState, state);
      if (state === seed.limit) {
        fullHits += 1;
      }
    }

    return {
      label: index < 2 ? `Minta ${index + 1}` : `Rejtett ${index - 1}`,
      input: signedChangesInput(seed.limit, changes),
      expectedOutput: formatLines([state, blocked, maxState, fullHits]),
      explanation:
        index < 2
          ? "A minta azt vizsgálja, hogy a tiltott lépések nem módosítják az állapotot, de beleszámítanak a blokkolt műveletek közé."
          : "A rejtett kör a limit elérését és a többszörös visszafordulásokat is ellenőrzi.",
    };
  });

  return {
    id: seed.id,
    title: seed.title,
    track: "kozep",
    level: "Közép",
    family: seed.family,
    inputMode: "stdin",
    estimatedMinutes: seed.estimatedMinutes,
    summary: seed.summary,
    skillFocus: [
      "állapotfrissítés",
      "feltételes logika",
      "maximumkövetés",
      "hibás műveletek kezelése",
    ],
    editorTips: [
      "Minden változtatás előtt számold ki a következő állapotot egy külön változóba, és csak utána dönts róla, alkalmazható-e.",
      "Vezesd külön a blokkolt műveleteket és a valósan elért maximumot.",
    ],
    source: buildSource(seed.sourceNote),
    statement: [
      {
        title: "Feladat",
        paragraphs: [
          seed.context,
          `A program első sora két egész számot tartalmaz: n, a változások száma, valamint a ${seed.stateLabel} felső korlátja. A második sor n darab egész számot tartalmaz, ezek sorban a változások.`,
        ],
        bullets: [
          `A ${seed.stateLabel} kezdetben 0. Ha egy változás 0 alá vagy ${seed.limit} fölé vinné, azt figyelmen kívül kell hagyni, és blokkolt műveletnek számít.`,
          "Add meg a végső állapotot.",
          "Számold meg a blokkolt műveleteket.",
          "Add meg a futás közben elért legnagyobb állapotot.",
          `Számold meg, hányszor lett pontosan ${seed.limit} a ${seed.stateLabel}.`,
        ],
      },
    ],
    inputFormat: [
      "Az első sor két egész szám: n és a felső korlát.",
      "A második sor n darab egész számot tartalmaz, szóközzel elválasztva.",
    ],
    outputFormat: [
      "1. sor: a végső állapot.",
      "2. sor: a blokkolt műveletek száma.",
      "3. sor: az elért maximum.",
      `4. sor: a pontosan ${seed.limit} értékű állapotok száma.`,
    ],
    workspaceRules: STDIN_WORKSPACE_RULES,
    publicTests: tests.publicTests,
    hiddenTests: tests.hiddenTests,
    starterCode: [
      "n, limit = map(int, input().split())",
      "valtozasok = list(map(int, input().split()))",
      "",
      "# Kövesd az állapotot, számold a blokkolt műveleteket, és írd ki a négy választ.",
      "",
      "# print(...)",
    ].join("\n"),
  };
}

export function buildKozepFileStatsTask(seed: FileStatsSeed): WorkspaceTask {
  const records = buildFileRecords(seed.names, seed.values);
  const maximum = max(seed.values);
  const firstMaximum = records.find((record) => record.value === maximum)?.name ?? "";
  const total = sum(seed.values);
  const providedFile: TaskFile = {
    path: seed.filePath,
    description: seed.fileDescription,
    content: buildFileContent(seed.names, seed.values),
  };

  return {
    id: seed.id,
    title: seed.title,
    track: "kozep",
    level: "Közép",
    family: seed.family,
    inputMode: "provided-files",
    estimatedMinutes: seed.estimatedMinutes,
    summary: seed.summary,
    skillFocus: [
      "fájlbeolvasás",
      "rekordfeldolgozás",
      "küszöbszámlálás",
      "maximumkeresés",
    ],
    editorTips: [
      `A fájlnevet ne kérd be, hanem közvetlenül a ${seed.filePath} állományt nyisd meg.`,
      "Először olvasd be a rekordokat, és csak utána készítsd el az összesítést a listából.",
    ],
    source: buildSource(seed.sourceNote),
    statement: [
      {
        title: "Feladat",
        paragraphs: [
          seed.context,
          `A ${seed.filePath} első sora a rekordok számát tartalmazza. A további sorok mindegyike egy ${seed.recordLabel} nevét és egy ${seed.valueLabel} értéket tartalmaz.`,
        ],
        bullets: [
          "Add meg a rekordok számát.",
          `Számold meg, hány érték legalább ${seed.threshold}.`,
          "Add meg a legnagyobb értéket.",
          "Írd ki annak az első rekordnak a nevét, ahol ez a maximum előfordul.",
          "Számold ki az összes érték összegét.",
        ],
      },
    ],
    inputFormat: [
      `Nincs standard bemenet, a program a ${seed.filePath} állományból dolgozik.`,
      "Az első sor a darabszám, a további sorok név és egész szám párokat tartalmaznak.",
    ],
    outputFormat: [
      "1. sor: a rekordok száma.",
      `2. sor: a legalább ${seed.threshold} értékek darabszáma.`,
      "3. sor: a legnagyobb érték.",
      "4. sor: a maximum első előfordulásához tartozó név.",
      "5. sor: az összeg.",
    ],
    workspaceRules: FILE_WORKSPACE_RULES,
    publicTests: [
      {
        label: "Minta ellenőrzés",
        input: "",
        expectedOutput: formatLines([
          records.length,
          records.filter((record) => record.value >= seed.threshold).length,
          maximum,
          firstMaximum,
          total,
        ]),
        explanation:
          "A publikus teszt a csatolt mintafájlt használja, és a rekordszám, a küszöbszámlálás, a maximumkeresés, valamint az összeg helyességét ellenőrzi.",
      },
    ],
    providedFiles: [providedFile],
    starterCode: [
      `with open("${seed.filePath}", encoding="utf-8") as source:`,
      "    sorok = [sor.strip() for sor in source if sor.strip()]",
      "",
      "db = int(sorok[0])",
      "adatok = sorok[1:]",
      "",
      "# Dolgozd fel a rekordokat, majd írd ki az öt kimeneti sort.",
      "",
      "# print(...)",
    ].join("\n"),
  };
}

export function buildKozepRankingTask(seed: RankingSeed): WorkspaceTask {
  const rows = buildRankingRows(seed.names, seed.scoreSets ?? DEFAULT_RANKING_SCORE_SETS);
  const tests = toPublicAndHiddenTests(
    [0, 1, 2, 3] as const,
    (offset, index) => {
      const rotated = rows.map((row, rowIndex) => ({
        name: row.name,
        scores: rows[(rowIndex + offset) % rows.length].scores,
      }));
      const totals = rotated.map((row) => ({
        name: row.name,
        total: sum(row.scores),
      }));
      const winner = [...totals].sort(
        (left, right) => right.total - left.total || left.name.localeCompare(right.name),
      )[0];

      return {
        label: index < 2 ? `Minta ${index + 1}` : `Rejtett ${index - 1}`,
        input: `${rotated.length}\n${rotated
          .map((row) => `${row.name} ${row.scores.join(" ")}`)
          .join("\n")}\n`,
        expectedOutput: formatLines([
          winner.name,
          winner.total,
          totals.filter((row) => row.total >= seed.qualifyLine).length,
          sum(totals.map((row) => row.total)),
        ]),
        explanation:
          index < 2
            ? "A minta a pontösszegzést, a tie-break szerinti győzteskeresést és a kvalifikációs darabszámot ellenőrzi."
            : "A rejtett teszt más ponteloszlást használ, így a holtverseny kezelése és az összegzés is külön ellenőrzést kap.",
      };
    },
  );

  return {
    id: seed.id,
    title: seed.title,
    track: "kozep",
    level: "Közép",
    family: seed.family,
    inputMode: "stdin",
    estimatedMinutes: seed.estimatedMinutes,
    summary: seed.summary,
    skillFocus: [
      "rekordfeldolgozás",
      "pontösszegzés",
      "tie-break logika",
      "feltételes számlálás",
    ],
    editorTips: [
      "Minden résztvevőhöz számold ki először a teljes pontszámot, és azt tedd el egy új listába vagy változókba.",
      "A győztes keresésénél kezeld külön a holtversenyt: azonos pontnál az abc-ben korábbi név nyer.",
    ],
    source: buildSource(seed.sourceNote),
    statement: [
      {
        title: "Feladat",
        paragraphs: [
          seed.context,
          `Az első sor egy n egész szám, utána n sor következik. Minden sor egy ${seed.contestantLabel} nevét és három egész pontszámát tartalmazza.`,
        ],
        bullets: [
          "Számold ki minden résztvevő teljes pontszámát.",
          "Add meg a győztes nevét. Holtversenynél az abc-ben korábbi név legyen a nyertes.",
          "Írd ki a győztes pontszámát.",
          `Számold meg, hány résztvevő ért el legalább ${seed.qualifyLine} pontot.`,
          "Számold ki az összes megszerzett pont összegét.",
        ],
      },
    ],
    inputFormat: [
      "Az első sor egy n egész szám, a résztvevők száma.",
      "Ezután n sor következik: név és három egész pontszám.",
    ],
    outputFormat: [
      "1. sor: a győztes neve.",
      "2. sor: a győztes pontszáma.",
      `3. sor: a legalább ${seed.qualifyLine} pontot elérők darabszáma.`,
      "4. sor: az összes megszerzett pont összege.",
    ],
    workspaceRules: STDIN_WORKSPACE_RULES,
    publicTests: tests.publicTests,
    hiddenTests: tests.hiddenTests,
    starterCode: [
      "n = int(input())",
      "eredmenyek = [input().split() for _ in range(n)]",
      "",
      "# Számold ki a teljes pontszámokat, keresd meg a győztest, majd írd ki a négy eredményt.",
      "",
      "# print(...)",
    ].join("\n"),
  };
}

export function buildEmeltFileAnalyticsTask(seed: FileStatsSeed): WorkspaceTask {
  const records = buildFileRecords(seed.names, seed.values);
  const maximum = max(seed.values);
  const firstMaximum = records.find((record) => record.value === maximum)?.name ?? "";
  const total = sum(seed.values);
  const providedFile: TaskFile = {
    path: seed.filePath,
    description: seed.fileDescription,
    content: buildFileContent(seed.names, seed.values),
  };

  return {
    id: seed.id,
    title: seed.title,
    track: "emelt",
    level: "Emelt",
    family: seed.family,
    inputMode: "provided-files",
    estimatedMinutes: seed.estimatedMinutes,
    summary: seed.summary,
    skillFocus: [
      "fájlbeolvasás",
      "rekordfeldolgozás",
      "szűrés",
      "összegzés",
      "maximumkeresés",
    ],
    editorTips: [
      `A ${seed.filePath} állományt közvetlenül megnyithatod a munkamappából. Először alakíts ki egy egységes adatszerkezetet a rekordoknak.`,
      "Ha több részfeladatot kér a feladat, érdemes egyetlen beolvasás után újrahasznosítani ugyanazt a listát minden kimeneti sornál.",
    ],
    source: buildSource(seed.sourceNote),
    statement: [
      {
        title: "Feladat",
        paragraphs: [
          seed.context,
          `A ${seed.filePath} első sora a bejegyzések számát tartalmazza. A további sorok egy ${seed.recordLabel} nevét és egy ${seed.valueLabel} egész értéket adnak meg.`,
        ],
        bullets: [
          "Írd ki a rekordok számát.",
          `Számold meg, hány rekord értéke legalább ${seed.threshold}.`,
          "Add meg a legnagyobb értéket.",
          "Írd ki annak az első rekordnak a nevét, ahol a maximum előfordul.",
          "Számold ki az összes érték összegét.",
        ],
      },
      {
        title: "Megjegyzés",
        paragraphs: [
          "A feladat nem kér standard bemenetet. A programnak kizárólag a csatolt adatfájlból kell dolgoznia.",
        ],
      },
    ],
    inputFormat: [
      `Nincs standard bemenet, a program a ${seed.filePath} fájlt olvassa.`,
      "Az első sor a darabszám, a további sorok név és egész érték párokat tartalmaznak.",
    ],
    outputFormat: [
      "1. sor: a rekordok száma.",
      `2. sor: a legalább ${seed.threshold} értékű rekordok darabszáma.`,
      "3. sor: a maximum érték.",
      "4. sor: a maximum első előfordulásához tartozó név.",
      "5. sor: az értékek összege.",
    ],
    workspaceRules: FILE_WORKSPACE_RULES,
    publicTests: [
      {
        label: "Minta ellenőrzés",
        input: "",
        expectedOutput: formatLines([
          records.length,
          records.filter((record) => record.value >= seed.threshold).length,
          maximum,
          firstMaximum,
          total,
        ]),
        explanation:
          "A publikus ellenőrzés a csatolt mintafájl teljes feldolgozását kéri számon, beleértve az összegzést és a maximum első előfordulását is.",
      },
    ],
    providedFiles: [providedFile],
    starterCode: [
      `with open("${seed.filePath}", encoding="utf-8") as source:`,
      "    sorok = [sor.strip() for sor in source if sor.strip()]",
      "",
      "db = int(sorok[0])",
      "adatok = sorok[1:]",
      "",
      "# Alakíts ki egységes rekordlistát, és oldd meg belőle az összes részfeladatot.",
      "",
      "# print(...)",
    ].join("\n"),
  };
}

export function buildEmeltRouteTask(seed: RouteSeed): WorkspaceTask {
  const tests = toPublicAndHiddenTests(ROUTE_CASES, (commands, index) => {
    let x = seed.startX;
    let y = seed.startY;
    let blocked = 0;
    let maxDistance = 0;
    const visited = new Set([`${x}:${y}`]);

    for (const command of commands) {
      let nextX = x;
      let nextY = y;

      if (command === "F") nextY += 1;
      if (command === "L") nextY -= 1;
      if (command === "B") nextX -= 1;
      if (command === "J") nextX += 1;

      if (
        nextX < 0 ||
        nextY < 0 ||
        nextX >= seed.gridSize ||
        nextY >= seed.gridSize
      ) {
        blocked += 1;
        continue;
      }

      x = nextX;
      y = nextY;
      visited.add(`${x}:${y}`);
      maxDistance = Math.max(
        maxDistance,
        Math.abs(x - seed.startX) + Math.abs(y - seed.startY),
      );
    }

    return {
      label: index < 2 ? `Minta ${index + 1}` : `Rejtett ${index - 1}`,
      input: commandsInput(commands),
      expectedOutput: formatLines([`${x} ${y}`, blocked, maxDistance, visited.size]),
      explanation:
        index < 2
          ? "A minta a mozgáskövetést, a rácshatárok miatti blokkolást és a különböző érintett mezők számolását egyszerre ellenőrzi."
          : "A rejtett teszt a visszalépéseket és a nagyobb kitérésekből adódó Manhattan-távolságot is figyeli.",
    };
  });

  return {
    id: seed.id,
    title: seed.title,
    track: "emelt",
    level: "Emelt",
    family: seed.family,
    inputMode: "stdin",
    estimatedMinutes: seed.estimatedMinutes,
    summary: seed.summary,
    skillFocus: [
      "állapotszimuláció",
      "koordinátakezelés",
      "határfeltételek",
      "Manhattan-távolság",
    ],
    editorTips: [
      "Használj külön x és y változót, és minden lépés előtt számold ki a következő koordinátát.",
      "Az érintett mezők számolásához a legegyszerűbb megoldás egy halmaz, amelyben a koordinátapárokat szövegként vagy tuple-ként tárolod.",
    ],
    source: buildSource(seed.sourceNote),
    statement: [
      {
        title: "Feladat",
        paragraphs: [
          seed.context,
          `A mozgás egy ${seed.gridSize}x${seed.gridSize}-es rácson történik. A kezdőpozíció (${seed.startX}, ${seed.startY}). A parancsok: F = fel, L = le, B = balra, J = jobbra.`,
        ],
        bullets: [
          "Ha egy lépés kivezetne a rácsról, a szereplő marad a helyén, és ez blokkolt lépésnek számít.",
          "Add meg a végső koordinátát.",
          "Számold meg a blokkolt lépéseket.",
          "Határozd meg a kezdőponttól mért legnagyobb Manhattan-távolságot.",
          "Számold meg, hány különböző mezőt érintett az útvonal a kezdőmezővel együtt.",
        ],
      },
    ],
    inputFormat: [
      "Az első sor egy n egész szám, a parancsok száma.",
      "A második sor n darab parancsot tartalmaz szóközzel elválasztva: F, L, B vagy J.",
    ],
    outputFormat: [
      "1. sor: a végső x és y koordináta szóközzel elválasztva.",
      "2. sor: a blokkolt lépések száma.",
      "3. sor: a legnagyobb Manhattan-távolság.",
      "4. sor: az érintett különböző mezők száma.",
    ],
    workspaceRules: STDIN_WORKSPACE_RULES,
    publicTests: tests.publicTests,
    hiddenTests: tests.hiddenTests,
    starterCode: [
      "n = int(input())",
      "parancsok = input().split()",
      `x = ${seed.startX}`,
      `y = ${seed.startY}`,
      "",
      "# Kövesd végig a mozgást, és készítsd el a négy kimeneti sort.",
      "",
      "# print(...)",
    ].join("\n"),
  };
}

export function buildEmeltSchedulingTask(seed: SchedulingSeed): WorkspaceTask {
  const tests = toPublicAndHiddenTests(SCHEDULING_CASES, (durations, index) => {
    const loads = new Array(seed.resourceCount).fill(0);
    let accepted = 0;
    let rejected = 0;

    for (const duration of durations) {
      let targetIndex = 0;

      for (let index = 1; index < loads.length; index += 1) {
        if (loads[index] < loads[targetIndex]) {
          targetIndex = index;
        }
      }

      if (loads[targetIndex] + duration > seed.limit) {
        rejected += 1;
        continue;
      }

      loads[targetIndex] += duration;
      accepted += 1;
    }

    const busiestIndex = loads.reduce(
      (current, value, index, list) =>
        value > list[current] ? index : current,
      0,
    );

    return {
      label: index < 2 ? `Minta ${index + 1}` : `Rejtett ${index - 1}`,
      input: schedulingInput(seed.resourceCount, seed.limit, durations),
      expectedOutput: formatLines([
        accepted,
        rejected,
        busiestIndex + 1,
        max(loads),
        loads.join(" "),
      ]),
      explanation:
        index < 2
          ? "A minta a legkevésbé terhelt erőforrás kiválasztását, az elutasítást és a végső terhelési lista kialakítását ellenőrzi."
          : "A rejtett teszt több olyan feladatot is tartalmaz, amely már nem fér bele a limitbe, így az elutasítási ág is biztosan lefut.",
    };
  });

  return {
    id: seed.id,
    title: seed.title,
    track: "emelt",
    level: "Emelt",
    family: seed.family,
    inputMode: "stdin",
    estimatedMinutes: seed.estimatedMinutes,
    summary: seed.summary,
    skillFocus: [
      "kapacitáskezelés",
      "greedy hozzárendelés",
      "állapotfrissítés",
      "végső terhelés összesítése",
    ],
    editorTips: [
      "Minden új feladat előtt keresd meg a legkisebb aktuális terhelésű erőforrást. Holtversenynél maradjon a kisebb index.",
      "A végén ne csak a legnagyobb terhelést írd ki, hanem a teljes terhelési listát is, mert az is része a pontozásnak.",
    ],
    source: buildSource(seed.sourceNote),
    statement: [
      {
        title: "Feladat",
        paragraphs: [
          seed.context,
          `Az első sor három egész számot tartalmaz: m, a ${seed.resourceLabel} száma; L, az egy ${seed.resourceLabel}re jutó maximális terhelés; valamint n, a ${seed.jobLabel} száma. A második sor n darab pozitív egész szám, ezek a ${seed.jobLabel} időigényei.`,
        ],
        bullets: [
          `A ${seed.jobLabel}okat sorban kell kiosztani mindig a pillanatnyilag legkevésbé terhelt ${seed.resourceLabel}nek.`,
          `Ha a választott ${seed.resourceLabel} terhelése a kiosztás után meghaladná ${seed.limit}-et, az adott ${seed.jobLabel}ot el kell utasítani.`,
          "Írd ki az elfogadott feladatok számát.",
          "Írd ki az elutasított feladatok számát.",
          "Add meg a legterheltebb erőforrás 1-alapú sorszámát.",
          "Add meg a legnagyobb terhelést.",
          "Írd ki a végső terhelési listát szóközzel elválasztva.",
        ],
      },
    ],
    inputFormat: [
      "Az első sor: m L n.",
      "A második sor n darab pozitív egész számot tartalmaz, a feladatok időigényét.",
    ],
    outputFormat: [
      "1. sor: az elfogadott feladatok száma.",
      "2. sor: az elutasított feladatok száma.",
      "3. sor: a legterheltebb erőforrás sorszáma.",
      "4. sor: a legnagyobb terhelés.",
      "5. sor: a végső terhelési lista.",
    ],
    workspaceRules: STDIN_WORKSPACE_RULES,
    publicTests: tests.publicTests,
    hiddenTests: tests.hiddenTests,
    starterCode: [
      "m, limit, n = map(int, input().split())",
      "idotartamok = list(map(int, input().split()))",
      "terhelesek = [0] * m",
      "",
      "# Oszd ki sorban a feladatokat, majd írd ki az öt válaszsort.",
      "",
      "# print(...)",
    ].join("\n"),
  };
}

function renderAsciiPattern(seed: AsciiSeed, size: number) {
  const rows: string[] = [];

  for (let row = 0; row < size; row += 1) {
    let line = "";

    for (let column = 0; column < size; column += 1) {
      const isBorder = row === 0 || column === 0 || row === size - 1 || column === size - 1;
      const isMainDiagonal = row === column;
      const isSecondaryDiagonal = row + column === size - 1;
      const isCenter = size % 2 === 1 && row === Math.floor(size / 2) && column === Math.floor(size / 2);

      if (isCenter) {
        line += seed.centerChar;
      } else if (isMainDiagonal) {
        line += seed.mainDiagonalChar;
      } else if (isSecondaryDiagonal) {
        line += seed.secondaryDiagonalChar;
      } else if (isBorder) {
        line += seed.borderChar;
      } else {
        line += seed.fillChar;
      }
    }

    rows.push(line);
  }

  return rows.join("\n");
}

export function buildEmeltAsciiTask(seed: AsciiSeed): WorkspaceTask {
  const sizes = [5, 6, 7, 8] as const;
  const tests = toPublicAndHiddenTests(sizes, (size, index) => ({
    label: index < 2 ? `Minta ${index + 1}` : `Rejtett ${index - 1}`,
    input: `${size}\n`,
    expectedOutput: renderAsciiPattern(seed, size),
    explanation:
      index < 2
        ? "A minta az ábra rétegeit és a karakter-prioritást ellenőrzi a különböző méretek mellett."
        : "A rejtett teszt más paritású méretet is ad, így a középső mező kezelését is számon kéri.",
  }));

  return {
    id: seed.id,
    title: seed.title,
    track: "emelt",
    level: "Emelt",
    family: seed.family,
    inputMode: "stdin",
    estimatedMinutes: seed.estimatedMinutes,
    summary: seed.summary,
    skillFocus: [
      "ciklusok",
      "koordinátás gondolkodás",
      "feltételes karakterkiírás",
      "formázott output",
    ],
    editorTips: [
      "A legstabilabb megoldás, ha két egymásba ágyazott ciklussal építed fel soronként az ábrát.",
      "Döntsd el előre a prioritási sorrendet: közép, diagonálok, keret, kitöltés. Ettől lesz átlátható a feltételrendszer.",
    ],
    source: buildSource(seed.sourceNote),
    statement: [
      {
        title: "Feladat",
        paragraphs: [
          seed.context,
          `Adj meg egy n méretű négyzetes ábrát a következő szabályokkal: a keret karaktere ${seed.borderChar}, a főátlóé ${seed.mainDiagonalChar}, a mellékátlóé ${seed.secondaryDiagonalChar}, a belső kitöltésé ${seed.fillChar}. Páratlan n esetén a középső mező karaktere ${seed.centerChar}.`,
        ],
        bullets: [
          "A karaktereket minden sorban összefüggően, szóközök nélkül kell kiírni.",
          "Az ábra pontosan n sorból álljon.",
          "Ha egy mezőre több szabály is igaz, a középső mező elsőbbséget élvez, utána a főátló, majd a mellékátló, végül a keret.",
        ],
      },
    ],
    inputFormat: ["Az első sor egy n pozitív egész szám, az ábra mérete."],
    outputFormat: [
      `Pontosan n sorból álló ${seed.themeLabel} mintázat a megadott szabályok szerint.`,
    ],
    workspaceRules: STDIN_WORKSPACE_RULES,
    publicTests: tests.publicTests,
    hiddenTests: tests.hiddenTests,
    starterCode: [
      "n = int(input())",
      "",
      "# Építsd fel soronként a mintát, majd minden sort írj ki külön sorba.",
      "",
      "# print(...)",
    ].join("\n"),
  };
}

export function buildEmeltAccessLogTask(seed: AccessLogSeed): WorkspaceTask {
  const cases = buildAccessLogCases(seed.names);
  const tests = toPublicAndHiddenTests(cases, (events, index) => {
    const inside = new Set<string>();
    let invalid = 0;
    let maxInside = 0;

    for (const [name, action] of events) {
      if (action === "IN") {
        if (inside.has(name)) {
          invalid += 1;
          continue;
        }
        inside.add(name);
        maxInside = Math.max(maxInside, inside.size);
        continue;
      }

      if (!inside.has(name)) {
        invalid += 1;
        continue;
      }

      inside.delete(name);
    }

    const remaining = [...inside].sort();

    return {
      label: index < 2 ? `Minta ${index + 1}` : `Rejtett ${index - 1}`,
      input: `${events.length}\n${events.map(([name, action]) => `${name} ${action}`).join("\n")}\n`,
      expectedOutput: formatLines([
        inside.size,
        invalid,
        maxInside,
        remaining[0] ?? "nincs",
      ]),
      explanation:
        index < 2
          ? "A minta az IN/OUT események szabályos és szabálytalan sorrendjét egyaránt tartalmazza, így a bentléti állapot valódi követését kéri számon."
          : "A rejtett teszt több hibás kilépést és újrabelépést is tartalmaz, ezért az állapottárolás hibái gyorsan látszanak rajta.",
    };
  });

  return {
    id: seed.id,
    title: seed.title,
    track: "emelt",
    level: "Emelt",
    family: seed.family,
    inputMode: "stdin",
    estimatedMinutes: seed.estimatedMinutes,
    summary: seed.summary,
    skillFocus: [
      "állapotkezelés",
      "halmaz vagy lista használata",
      "szabályellenőrzés",
      "maximumkövetés",
    ],
    editorTips: [
      "Tarts nyilván egy gyűjteményt az éppen bent lévő nevekről, és minden eseménynél külön kezeld az IN és OUT ágat.",
      "A hibás események száma csak akkor nő, ha az adott művelet nem hajtható végre az aktuális állapot mellett.",
    ],
    source: buildSource(seed.sourceNote),
    statement: [
      {
        title: "Feladat",
        paragraphs: [
          seed.context,
          `Az első sor egy n egész szám, utána n sorban egy ${seed.attendeeLabel} neve és egy művelet szerepel. A művelet IN vagy OUT lehet.`,
        ],
        bullets: [
          "IN esemény csak akkor szabályos, ha az adott név még nincs bent.",
          "OUT esemény csak akkor szabályos, ha az adott név éppen bent van.",
          "Írd ki, hányan maradnak bent a végén.",
          "Számold meg a hibás eseményeket.",
          "Add meg az egyszerre bent lévők legnagyobb számát.",
          "Írd ki a bent maradók közül az abc-ben legkisebb nevet, vagy azt, hogy nincs.",
        ],
      },
    ],
    inputFormat: [
      "Az első sor egy n egész szám, az események száma.",
      "Ezután n sor következik: név és művelet, például Eva IN vagy Eva OUT.",
    ],
    outputFormat: [
      "1. sor: a végén bent maradó személyek száma.",
      "2. sor: a hibás események száma.",
      "3. sor: az egyszerre bent lévők maximális száma.",
      "4. sor: az abc-ben legkisebb bent maradó név vagy nincs.",
    ],
    workspaceRules: STDIN_WORKSPACE_RULES,
    publicTests: tests.publicTests,
    hiddenTests: tests.hiddenTests,
    starterCode: [
      "n = int(input())",
      "esemenyek = [input().split() for _ in range(n)]",
      "",
      "# Kövesd a bentléti állapotot, és készítsd el a négy kimeneti sort.",
      "",
      "# print(...)",
    ].join("\n"),
  };
}

export function buildEmeltLeaderboardTask(seed: LeaderboardSeed): WorkspaceTask {
  const rows = buildLeaderboardRows(
    seed.names,
    seed.scoreSets ?? DEFAULT_LEADERBOARD_SCORE_SETS,
  );
  const tests = toPublicAndHiddenTests([0, 1, 2, 3] as const, (offset, index) => {
    const rotated = rows.map((row, rowIndex) => ({
      name: row.name,
      scores: rows[(rowIndex + offset) % rows.length].scores,
    }));
    const totals = rotated.map((row) => ({
      name: row.name,
      total: sum(row.scores) - min(row.scores),
      bestScore: max(row.scores),
    }));
    const winner = [...totals].sort(
      (left, right) => right.total - left.total || left.name.localeCompare(right.name),
    )[0];
    const bestSingleScore = max(rotated.flatMap((row) => row.scores));

    return {
      label: index < 2 ? `Minta ${index + 1}` : `Rejtett ${index - 1}`,
      input: `${rotated.length}\n${rotated
        .map((row) => `${row.name} ${row.scores.join(" ")}`)
        .join("\n")}\n`,
      expectedOutput: formatLines([
        winner.name,
        winner.total,
        totals.filter((row) => row.total >= seed.qualifyLine).length,
        bestSingleScore,
        sum(totals.map((row) => row.total)),
      ]),
      explanation:
        index < 2
          ? "A minta az összetett pontszám képzését, a kieső legkisebb részpont levonását és a tie-breaket ellenőrzi."
          : "A rejtett teszt eltérő ponteloszlást használ, így a továbbjutási küszöb és az összegzett pontok is külön vizsgálatot kapnak.",
    };
  });

  return {
    id: seed.id,
    title: seed.title,
    track: "emelt",
    level: "Emelt",
    family: seed.family,
    inputMode: "stdin",
    estimatedMinutes: seed.estimatedMinutes,
    summary: seed.summary,
    skillFocus: [
      "rekordfeldolgozás",
      "összetett pontképzés",
      "tie-break logika",
      "több részfeladat közös adatszerkezetből",
    ],
    editorTips: [
      "Először minden résztvevőhöz számold ki a módosított összpontszámot úgy, hogy a legkisebb részpontját elhagyod.",
      "A győzteskeresést, a továbbjutási darabszámot és az összegzést ugyanabból a tárolt listából oldd meg.",
    ],
    source: buildSource(seed.sourceNote),
    statement: [
      {
        title: "Feladat",
        paragraphs: [
          seed.context,
          `Az első sor egy n egész szám, utána n sor következik. Minden sor egy ${seed.contestantLabel} nevét és négy részpontszámát tartalmazza.`,
        ],
        bullets: [
          "Minden résztvevő végső pontszáma a négy részpont összege úgy, hogy a legkisebb részpontját nem számítjuk bele.",
          "Add meg a győztes nevét. Holtversenynél az abc-ben korábbi név legyen a nyertes.",
          "Írd ki a győztes végső pontszámát.",
          `Számold meg, hány résztvevő ér el legalább ${seed.qualifyLine} pontot.`,
          "Add meg az összes részpont között előforduló legnagyobb értéket.",
          "Számold ki az összes végső pontszám összegét.",
        ],
      },
    ],
    inputFormat: [
      "Az első sor egy n egész szám.",
      "Ezután n sor következik: név és négy egész részpont.",
    ],
    outputFormat: [
      "1. sor: a győztes neve.",
      "2. sor: a győztes végső pontszáma.",
      `3. sor: a legalább ${seed.qualifyLine} pontot szerzők darabszáma.`,
      "4. sor: a legnagyobb egyedi részpont.",
      "5. sor: az összes végső pontszám összege.",
    ],
    workspaceRules: STDIN_WORKSPACE_RULES,
    publicTests: tests.publicTests,
    hiddenTests: tests.hiddenTests,
    starterCode: [
      "n = int(input())",
      "eredmenyek = [input().split() for _ in range(n)]",
      "",
      "# Készítsd el a módosított összpontszámokat, majd oldd meg ugyanebből a listából az összes részfeladatot.",
      "",
      "# print(...)",
    ].join("\n"),
  };
}