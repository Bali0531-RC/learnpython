type LessonArticleLink = {
  kind: "practice" | "archive";
  href: string;
  title: string;
  badge: string;
  meta: string;
  reason: string;
};

export type LessonCodeExample = {
  title: string;
  code: string;
  explanation: string;
  output?: string;
};

export type LessonArticleSection = {
  title: string;
  paragraphs: string[];
  bullets?: string[];
  examples?: LessonCodeExample[];
};

export type LessonArticle = {
  intro: string;
  estimatedMinutes: string;
  goals: string[];
  sections: LessonArticleSection[];
  pitfalls: string[];
  quickChecks: string[];
  practiceHint?: string;
  authored: boolean;
};

type LessonArticleInput = {
  id: string;
  title: string;
  summary: string;
  examValue: string;
  phaseTitle: string;
  phaseAudience: string;
  resourceLinks: LessonArticleLink[];
};

const lessonArticleOverrides: Record<string, LessonArticle> = {
  "shared-01": {
    intro:
      "Az első lecke lényege nem az, hogy minden Python-elemet egyszerre megtanulj, hanem az, hogy a magyar feladatszövegből kis, végrehajtható lépések legyenek. Ha ezt most rendbe teszed, később sokkal ritkábban fogsz rossz irányba elindulni.",
    estimatedMinutes: "25-35 perc",
    goals: [
      "Értsd meg, hogy a program mindig bemenetből indul, állapotot kezel, majd pontos választ ad.",
      "Tudd a feladatot részproblémákra bontani még kódírás előtt.",
      "Kezdd el tudatosan használni a változókat mint névvel ellátott gondolatokat.",
    ],
    sections: [
      {
        title: "Feladatszövegből megoldási terv",
        paragraphs: [
          "Vizsgán a leggyakoribb kezdő hiba az, hogy valaki túl korán nyitja meg a szerkesztőt. Előbb azt kell tisztázni, mit kap a program, mit kell kiszámolni, és milyen formában kell kiírni az eredményt.",
          "Érdemes minden feladatot úgy olvasni, mintha három kérdést tenne fel: milyen adat érkezik, milyen szabályokat kell alkalmazni, és pontosan mit várnak vissza. Ha ez a három tiszta, a kód már csak végrehajtás.",
        ],
        bullets: [
          "Karikázd be a bemeneti adatokat és azok típusát.",
          "Írd külön sorba, mit kell kiszámolni vagy eldönteni.",
          "Ne mondatban gondolkodj, hanem lépésekben: beolvasás, feldolgozás, kiírás.",
        ],
        examples: [
          {
            title: "Mini példa: teljes buszok és maradék utasok",
            code:
              "utasok = 27\nferohely = 5\n\ntele_buszok = utasok // ferohely\nmaradek = utasok % ferohely\n\nprint(\"Tele buszok:\", tele_buszok)\nprint(\"Maradó utasok:\", maradek)",
            output: "Tele buszok: 5\nMaradó utasok: 2",
            explanation:
              "A feladat valójában két részprobléma: hány teljes csoport fér ki, és mi marad utána. Ha külön nevük van, a gondolkodás és a hibakeresés is egyszerűbb.",
          },
        ],
      },
      {
        title: "Változók mint gondolati kapaszkodók",
        paragraphs: [
          "A jó változónév nem dísz, hanem támpont. Ha a változó neve rögtön elmondja, mit tárol, kevésbé fogsz elveszni hosszabb feladatokban is.",
          "Már kezdő szinten is érdemes kerülni az olyan neveket, mint x vagy a, ha a probléma valós jelentést ad. A vizsgaidőben ez közvetlenül csökkenti a félreértéseket.",
        ],
        bullets: [
          "Használj beszédes neveket: osszeg, darab, legnagyobb, ervenyes.",
          "Egy változó egy szerepet vigyen, ne több fél-feladatot egyszerre.",
          "Papíron vagy fejben tudj végigmenni rajta: mikor kap értéket, mikor változik, mikor írjuk ki.",
        ],
      },
    ],
    pitfalls: [
      "Ne kezdd a kódot azelőtt, hogy világos lenne a kimenet pontos formája.",
      "Ne próbáld egyetlen sorban megoldani azt, ami három tiszta lépésben olvashatóbb.",
      "Ne hagyd névtelenül a fontos köztes eredményeket.",
    ],
    quickChecks: [
      "El tudod mondani egy mondatban, mi a bemenet és mi a kimenet?",
      "Meg tudod nevezni a köztes eredményeket, amelyeket a feladat megkíván?",
      "Papíron végig tudod követni a változók értékét egy mintaadaton?",
    ],
    practiceHint:
      "A kapcsolódó workspace-ben most még nem a sebesség a cél, hanem az, hogy minden kódrészlet mögött lásd a feladatlogikai lépést is.",
    authored: true,
  },
  "shared-02": {
    intro:
      "A bemenet és kimenet a legalapabb téma, mégis itt esik el rengeteg pont. A program lehet logikailag helyes, ha rossz típussal olvasol be vagy pontatlanul írsz ki, a teszt mégis hibásnak fogja látni.",
    estimatedMinutes: "20-30 perc",
    goals: [
      "Tudd, mikor kell számot, szöveget vagy több elemet beolvasni.",
      "Értsd a típuskasztolás szerepét az input után.",
      "Szokj rá a pontos, elvárt formátumú kiírásra.",
    ],
    sections: [
      {
        title: "Mit kap a program a bemeneten?",
        paragraphs: [
          "A Python input() mindig szöveget ad vissza. Ha számolni akarsz vele, át kell alakítani int-té vagy szükség esetén floattá.",
          "Vizsgán különösen gyakori, hogy egy sorban több szám érkezik. Ilyenkor a split() és a map() együtt a legfontosabb rutinok közé tartozik.",
        ],
        bullets: [
          "input() csak sztringet ad.",
          "Egész számhoz legtöbbször int(input()) kell.",
          "Több adat egy sorban: input().split() és szükség esetén map(int, ...).",
        ],
        examples: [
          {
            title: "Egyetlen egész szám beolvasása és használata",
            code:
              "kor = int(input())\nprint(\"Jövőre ennyi lesz:\", kor + 1)",
            output: "Ha a bemenet 16, akkor a kimenet: Jövőre ennyi lesz: 17",
            explanation:
              "A beolvasott adat csak az átalakítás után használható számként. Enélkül a + művelet sztring-összefűzéssé vagy hibává válna.",
          },
          {
            title: "Két szám egy sorban",
            code:
              "a, b = map(int, input().split())\nprint(a + b)",
            output: "Bemenet: 4 7\nKimenet: 11",
            explanation:
              "A split feldarabolja a sort, a map pedig mindkét elemet számmá alakítja. Ez a minta nagyon gyakran visszajön a vizsgában.",
          },
        ],
      },
      {
        title: "A kimenet pontossága",
        paragraphs: [
          "A gép nem találgat: ha a feladat például kettőspontot, szóközt vagy külön sort vár, azt ugyanúgy kell kiírni. A logikailag helyes, de formailag pontatlan megoldás pontot veszíthet.",
          "Jó rutin, ha a végső print sorokat külön ellenőrzöd. Sokszor nem a számítás, hanem az utolsó formázás hibásodik el.",
        ],
        bullets: [
          "Figyelj az elválasztókra, szóközökre és sortörésekre.",
          "A mintaoutput nem dísz, hanem formai szerződés.",
          "Ha több sort kell kiírni, ellenőrizd külön-külön a címkéket és sorrendet.",
        ],
      },
    ],
    pitfalls: [
      "Ne felejtsd el az int() vagy float() átalakítást, ha számolni kell.",
      "Ne cseréld fel a beolvasott adatok sorrendjét.",
      "Ne írd át a kimenet szövegét csak azért, mert szerinted szebben hangzik.",
    ],
    quickChecks: [
      "Meg tudod mondani minden bemeneti adatról, hogy szöveg vagy szám legyen?",
      "Egy sorban több adatnál biztos vagy benne, hogyan bontod szét őket?",
      "A kimenet formája karakterre ugyanaz, mint amit a feladat elvár?",
    ],
    authored: true,
  },
  "shared-03": {
    intro:
      "Ez a lecke azért fontos, mert a vizsgafeladatok nagy része végső soron valamilyen kiszámított eredményt kér. Ha az alapműveletek, az egész osztás, a maradék és a sorrend nem stabil, a későbbi feladatok is bizonytalan alapra épülnek.",
    estimatedMinutes: "20-30 perc",
    goals: [
      "Használd magabiztosan az alapműveleteket és az osztási formákat.",
      "Értsd, miért számít a műveleti sorrend.",
      "Tudd szétválasztani a köztes és végső számításokat.",
    ],
    sections: [
      {
        title: "Köztes eredményekkel gondolkodj",
        paragraphs: [
          "A kezdők gyakran túl bonyolult egyetlen kifejezésekben számolnak. Vizsgán jobb stratégia a számítást kis, ellenőrizhető lépésekre bontani.",
          "Ettől nemcsak olvashatóbb lesz a program, hanem sokkal könnyebb észrevenni, ha valamelyik részszámítás hibás.",
        ],
        examples: [
          {
            title: "Átlag és maradék pénz kiszámítása",
            code:
              "osszes_pont = 83\nfeladatok = 5\natlag = osszes_pont / feladatok\n\npenz = 1450\ntermek_ara = 320\nmaradek = penz % termek_ara\n\nprint(\"Átlag:\", atlag)\nprint(\"Maradék pénz:\", maradek)",
            output: "Átlag: 16.6\nMaradék pénz: 170",
            explanation:
              "Két külön számítás fut egymás mellett, de mindkettőnek saját, beszédes változója van. Így nem keveredik össze az átlag és a maradéklogika.",
          },
        ],
      },
      {
        title: "Mire figyelj osztásnál?",
        paragraphs: [
          "A / valós osztást ad, a // lefelé kerekített egész osztást, a % pedig maradékot. Sok feladatban épp az a lényeg, hogy melyik kell közülük.",
          "Ha valami csoportokba rendezésről, teljes körökről vagy maradékról szól, nagyon gyakran a // és a % lesz a jó választás.",
        ],
        bullets: [
          "Átlaghoz vagy arányhoz többnyire / kell.",
          "Teljes egységek számához gyakran // kell.",
          "Maradékhoz vagy ciklikus viselkedéshez % kell.",
        ],
      },
    ],
    pitfalls: [
      "Ne keverd össze az egész osztást a normál osztással.",
      "Ne rejts el többféle számítást egyetlen nehezen olvasható sorba.",
      "Ne feledd ellenőrizni, hogy a feladat egész számot vagy tizedes eredményt vár-e.",
    ],
    quickChecks: [
      "Meg tudod indokolni, hogy egy adott feladatrészben miért /, // vagy % kell?",
      "A köztes eredményeket külön névvel tárolod?",
      "Papíron ellenőrizted legalább egy saját mintával az eredményt?",
    ],
    authored: true,
  },
  "shared-04": {
    intro:
      "A döntések minden olyan feladatban megjelennek, ahol szabályokat kell alkalmazni. A jó if-ág nemcsak helyes, hanem rendezett is: egyértelmű, melyik eset melyik szabály alá esik.",
    estimatedMinutes: "25-35 perc",
    goals: [
      "Tudd elkülöníteni az egymást kizáró eseteket.",
      "Használj tiszta if-elif-else szerkezetet szabályrendszerekhez.",
      "Tanulj meg határértékekben gondolkodni.",
    ],
    sections: [
      {
        title: "Az esetek sorrendje számít",
        paragraphs: [
          "Ha több szabályod van, azok gyakran egymásra épülnek. Ilyenkor a rossz sorrend ugyanúgy hibát okoz, mintha a feltétel lenne rossz.",
          "Érdemes úgy felírni az eseteket, hogy előbb a különleges vagy szűk feltételek jöjjenek, és csak utána az általánosabb ágak.",
        ],
        examples: [
          {
            title: "Pontszám kategorizálása",
            code:
              "pont = int(input())\n\nif pont >= 90:\n    print(\"kiemelkedő\")\nelif pont >= 60:\n    print(\"megfelelő\")\nelse:\n    print(\"javítandó\")",
            output: "Bemenet: 74\nKimenet: megfelelő",
            explanation:
              "Az első igaz ág fut le. Ha a 60-as ellenőrzés lenne elöl, a 90 fölötti pontszámok is idő előtt megállnának a középső kategóriában.",
          },
        ],
      },
      {
        title: "Határértékek és logikai feltételek",
        paragraphs: [
          "Sok rejtett hiba abból jön, hogy a programozó nem tisztázza, mi történik pont a határon. Például benne van-e a 18 az intervallumban, vagy már a következő kategóriába esik?",
          "Érdemes külön kipróbálni a szélső eseteket: legalacsonyabb, legmagasabb és közvetlenül határ körüli bemenetekkel.",
        ],
        bullets: [
          "Írd le külön, mely értékek tartoznak egy kategóriába.",
          "Használj <= és >= jeleket tudatosan, ne rutinból.",
          "A tesztadatok közé mindig tegyél határértékeket is.",
        ],
      },
    ],
    pitfalls: [
      "Ne duplikáld ugyanazt a feltételt több ágban feleslegesen.",
      "Ne hagyd tisztázatlanul, mi történik a határértékeken.",
      "Ne használj sok egymás utáni külön if-et, ha valójában csak egy kategória lehet igaz.",
    ],
    quickChecks: [
      "Egymást kizárják az eseteid, vagy lehet két ág is igaz?",
      "Kipróbáltad a legkisebb, legnagyobb és a határon lévő bemenetet?",
      "A feltételek sorrendje biztosan a szűkebb esetektől halad az általánosabb felé?",
    ],
    authored: true,
  },
  "shared-05": {
    intro:
      "A ciklus a feldolgozás motorja. Ha ez stabil, onnantól már nem egyetlen adatot, hanem adatsorokat, lépéssorokat és szimulációkat is kézben tudsz tartani.",
    estimatedMinutes: "25-35 perc",
    goals: [
      "Értsd a for és a while alaphelyzeteit.",
      "Tudd, mikor ismétlünk előre ismert darabszámmal és mikor feltétel alapján.",
      "Védd ki az off-by-one hibákat a range használatakor.",
    ],
    sections: [
      {
        title: "Darabszámos ismétlés for ciklussal",
        paragraphs: [
          "Amikor előre tudod, hányszor kell ismételni, a for ciklus a legegyszerűbb választás. Ez a vizsga sok részfeladatában előkerül, különösen beolvasásnál és összegzésnél.",
          "A range(n) nullától n-1-ig megy. Ez a pont az egyik leggyakoribb kezdő hiba, ezért tudatosan kell kezelni.",
        ],
        examples: [
          {
            title: "Öt szám összegének kiszámítása",
            code:
              "osszeg = 0\n\nfor _ in range(5):\n    szam = int(input())\n    osszeg += szam\n\nprint(osszeg)",
            output: "Bemenet: 3 4 5 1 2\nKimenet: 15",
            explanation:
              "A minta jól mutatja a ciklus három lépését: új adat beolvasása, állapot frissítése, majd a végén eredmény kiírása.",
          },
        ],
      },
      {
        title: "Állapotfrissítés ismétlés közben",
        paragraphs: [
          "Ciklusban a változók már nem egyszeri tárolók, hanem állapotok. Minden körben frissülnek, és a ciklus végére ebből áll össze a válasz.",
          "Ha el tudod mondani minden fontos változóról, hogyan változik körönként, sokkal könnyebben megoldasz hosszabb szimulációs feladatokat is.",
        ],
        bullets: [
          "Indulóérték nélkül nehéz helyesen gyűjteni.",
          "Minden ciklus elején tudd, mi az aktuális állapot.",
          "A ciklus végén ellenőrizd, hogy pontosan annyiszor futott-e le, ahányszor kell.",
        ],
      },
    ],
    pitfalls: [
      "Ne feledd, hogy range(5) öt ismétlés, nem hat.",
      "Ne inicializáld rossz helyen az összegző vagy számláló változókat.",
      "Ne írd ki a végeredményt minden körben, ha csak a végén kell.",
    ],
    quickChecks: [
      "El tudod mondani, hányszor fut le a ciklus?",
      "Megvan minden gyűjtőváltozó kezdőértéke a ciklus előtt?",
      "Tudsz fejben vagy papíron végigmenni legalább két cikluskörön?",
    ],
    authored: true,
  },
  "shared-06": {
    intro:
      "A listák azért fontosak, mert a vizsga ritkán szól egyetlen adatról. Általában több elemet kell együtt tárolni, bejárni, összegezni vagy összehasonlítani.",
    estimatedMinutes: "25-35 perc",
    goals: [
      "Ismerd meg a listaépítés és a bejárás alapmintáit.",
      "Értsd az index és az elem közti különbséget.",
      "Tudd, mikor jobb közvetlenül elemenként, és mikor index alapján dolgozni.",
    ],
    sections: [
      {
        title: "Lista létrehozása és bejárása",
        paragraphs: [
          "A lista egy rendezett adatsor. Az elemek sorrendje számít, és később akár többször is végig lehet rajta menni különböző célokkal.",
          "Kezdőként sokszor elég annyi, hogy megtanuld: előbb tárolunk, utána feldolgozunk. Ez különösen jól jön, ha ugyanazokra az adatokra több kérdés is vonatkozik.",
        ],
        examples: [
          {
            title: "Számok listája egy sorból",
            code:
              "szamok = list(map(int, input().split()))\nosszeg = 0\n\nfor szam in szamok:\n    osszeg += szam\n\nprint(\"Elemek száma:\", len(szamok))\nprint(\"Összeg:\", osszeg)",
            output: "Bemenet: 4 9 1 6\nKimenet: Elemek száma: 4\nÖsszeg: 20",
            explanation:
              "A lista külön tárolja az adatokat, így később újra végigmehetsz rajtuk. Ez a vizsgában gyakori, amikor ugyanabból az adatsorból több választ kell előállítani.",
          },
        ],
      },
      {
        title: "Elem vagy index?",
        paragraphs: [
          "Ha csak az értékekre van szükséged, kényelmesebb elemenként bejárni a listát. Ha a helye is fontos, például szomszédokat hasonlítasz vagy módosítasz, akkor index kell.",
          "Nem az a cél, hogy mindig indexet használj, hanem az, hogy tudd, mikor indokolt.",
        ],
        bullets: [
          "Egyszerű összegzésnél általában elég az elem szerinti bejárás.",
          "Szomszédos elemek összevetésénél az index hasznosabb.",
          "A len(lista) gyakori segédeszköz, de csak akkor, ha valóban a lista hosszára van szükség.",
        ],
      },
    ],
    pitfalls: [
      "Ne keverd össze a lista elemét az indexével.",
      "Ne menj a lista végén túl, ha indexszel dolgozol.",
      "Ne olvasd be ugyanazt az adatot újra, ha egyszer már eltároltad listában.",
    ],
    quickChecks: [
      "Meg tudod mondani, mikor kell index és mikor elég az elem?",
      "A lista tényleg akkor hasznos, ha később még szükséged lesz ugyanarra az adatsorra?",
      "Ellenőrizted, hogy a bejárás nem hagy ki és nem ismétel meg elemeket?",
    ],
    authored: true,
  },
  "shared-07": {
    intro:
      "A sztringes feladatok sokszor ártatlanul néznek ki, mégis tele vannak apró formai csapdákkal. A jó hír az, hogy néhány alapminta stabil használatával ezek a feladatok nagyon jól kontrollálhatók.",
    estimatedMinutes: "20-30 perc",
    goals: [
      "Használd a split, join és szeletelési alapokat.",
      "Tudd, hogyan lehet karakterekkel és részekkel dolgozni.",
      "Vedd észre a formátum- és hosszfeltételeket a szöveges inputokban.",
    ],
    sections: [
      {
        title: "Szöveg feldarabolása és újbóli összerakása",
        paragraphs: [
          "Sok feladatban a bemenet szöveg, de valójában külön mezőket rejt. Ilyenkor az első lépés legtöbbször az, hogy szétszeded kezelhető darabokra.",
          "A split() tipikusan belépési pont, a join() pedig akkor hasznos, amikor új formában kell visszaadni a szöveget.",
        ],
        examples: [
          {
            title: "Kód részeinek kiolvasása",
            code:
              "kod = input()\nreszek = kod.split('-')\n\nprint(\"Első rész:\", reszek[0])\nprint(\"Utolsó rész:\", reszek[-1])",
            output: "Bemenet: ABC-17-K\nKimenet: Első rész: ABC\nUtolsó rész: K",
            explanation:
              "A sztring nem egyetlen megfoghatatlan szöveg, hanem mezők sorozata. A feldolgozás sokkal egyszerűbb, ha ezt korán felismered.",
          },
        ],
      },
      {
        title: "Karakterenkénti ellenőrzés",
        paragraphs: [
          "Vannak feladatok, ahol nem elég a teljes szöveget nézni; külön egyes karaktereket kell vizsgálni. Ilyenkor a ciklus és a feltétel együtt dolgozik a sztringen.",
          "Ez különösen fontos azonosítók, kódok, rövid jelölések és formátumvizsgálat esetén.",
        ],
        bullets: [
          "A sztring is bejárható ciklussal.",
          "A hossz ellenőrzése gyakran már önmagában része a validálásnak.",
          "Érdemes külön gondolni a teljes szöveg szintjére és az egyes karakterek szintjére.",
        ],
      },
    ],
    pitfalls: [
      "Ne feltételezd, hogy a szöveg mindig pontosan olyan alakú, mint a mintában.",
      "Ne keverd össze a karakterek számát a mezők számával.",
      "Ne feledd, hogy a split eredménye lista.",
    ],
    quickChecks: [
      "Látod a bemeneti szövegben a természetes elválasztókat?",
      "Tudod, hogy teljes mezőkkel vagy egyes karakterekkel kell dolgozni?",
      "Ellenőrizted a hossz- és formafeltételeket is?",
    ],
    authored: true,
  },
  "shared-08": {
    intro:
      "Az összegzés, számlálás, minimum, maximum és átlag a vizsga igazi alapmintái közé tartoznak. Ha ezek automatizmussá válnak, a közép feladatok nagy része sokkal gyorsabban megoldható.",
    estimatedMinutes: "25-35 perc",
    goals: [
      "Ismerd fel a klasszikus gyűjtési mintákat.",
      "Tudd kiválasztani a megfelelő gyűjtőváltozót a feladathoz.",
      "Lásd, hogyan épülnek ezek a cikluson belüli állapotfrissítésre.",
    ],
    sections: [
      {
        title: "Számlálás és összegzés együtt",
        paragraphs: [
          "A gyűjtési feladatokban minden cikluskör után egy kicsit okosabb lesz a program. Egy változó az összeghez, egy másik a darabhoz, esetleg egy harmadik a legjobb értékhez.",
          "A kulcs az, hogy induláskor helyes kezdőértéket adj, majd csak akkor frissíts, amikor a feltétel tényleg teljesül.",
        ],
        examples: [
          {
            title: "Páros számok száma és összege",
            code:
              "szamok = list(map(int, input().split()))\ndarab = 0\nosszeg = 0\n\nfor szam in szamok:\n    if szam % 2 == 0:\n        darab += 1\n        osszeg += szam\n\nprint(\"Páros darab:\", darab)\nprint(\"Páros összeg:\", osszeg)",
            output: "Bemenet: 3 8 4 5 2\nKimenet: Páros darab: 3\nPáros összeg: 14",
            explanation:
              "Ugyanaz a feltétel egyszerre két gyűjtőváltozót is frissíthet. Ez vizsgán nagyon gyakori minta.",
          },
        ],
      },
      {
        title: "Minimum és maximum keresése",
        paragraphs: [
          "A szélsőérték-keresés akkor stabil, ha világos a kezdőérték. Gyakran a lista első eleme a legjobb indulás, és onnantól csak összehasonlítás kell.",
          "Ha ehhez még a helyét is tárolod, később rangsorolási vagy tie-break helyzetekben is tudsz rá építeni.",
        ],
        bullets: [
          "Szélsőértékhez tarts fenn külön változót.",
          "Döntsd el, kell-e mellé index vagy más kapcsolódó adat is.",
          "A ciklus minden körében ugyanazt az összehasonlítási szabályt alkalmazd.",
        ],
      },
    ],
    pitfalls: [
      "Ne frissítsd a számlálót vagy összeget a feltételvizsgálaton kívül.",
      "Ne válassz rossz kezdőértéket minimumhoz vagy maximumhoz.",
      "Ne keverd össze a darabszámot a tényleges összeggel vagy átlaggal.",
    ],
    quickChecks: [
      "Minden gyűjtési célhoz külön változót használsz?",
      "Világos, hogy mikor kell frissíteni a gyűjtőváltozókat?",
      "A mintaadaton fejben kijön ugyanaz az eredmény, mint a programban?",
    ],
    authored: true,
  },
  "shared-09": {
    intro:
      "Az ellenőrzés és validálás nem extra dísz, hanem védelem. Minél összetettebb a feladat, annál több pontot menthet meg az, ha tudatosan ellenőrzöd a bemenetet és a szabályok teljesülését.",
    estimatedMinutes: "20-30 perc",
    goals: [
      "Ismerd fel a formai és tartalmi ellenőrzések különbségét.",
      "Tudd lépésenként felépíteni a validációt.",
      "Szokj rá a szélső esetek tudatos tesztelésére.",
    ],
    sections: [
      {
        title: "Mit kell ellenőrizni?",
        paragraphs: [
          "A validálásnak lehet formai része, például egy kód hossza vagy egy jel elhelyezkedése, és lehet tartalmi része, például egy számérték intervalluma. A kettőt érdemes külön fejben tartani.",
          "Sok hibát az okoz, hogy a programozó csak az egyik szintet ellenőrzi, a másikat nem.",
        ],
        examples: [
          {
            title: "Egyszerű azonosító ellenőrzése",
            code:
              "kod = input()\n\nervenyes = len(kod) == 5 and kod[:2].isalpha() and kod[2:].isdigit()\n\nif ervenyes:\n    print(\"érvényes\")\nelse:\n    print(\"hibás\")",
            output: "Bemenet: AB123\nKimenet: érvényes",
            explanation:
              "A program egyszerre több szabályt vizsgál. Ez tipikus vizsgahelyzet: az adat csak akkor jó, ha minden feltétel teljesül.",
          },
        ],
      },
      {
        title: "Szélső esetekkel tesztelj",
        paragraphs: [
          "A validálás akkor válik igazán erőssé, ha nem csak egy szép mintát próbálsz ki, hanem a határeseteket is. Sokszor ezekben bukik ki a hiba.",
          "Érdemes külön kipróbálni a legrövidebb, leghosszabb, legkisebb és legnagyobb még elfogadható értéket is.",
        ],
        bullets: [
          "Használj tudatos ellenpéldákat is, ne csak helyes mintákat.",
          "Írd le, milyen feltételeknek kell egyszerre teljesülniük.",
          "Ha sok a szabály, gondolkodj külön részellenőrzésekben.",
        ],
      },
    ],
    pitfalls: [
      "Ne tesztelj csak ideális bemenetekkel.",
      "Ne keverd össze az 'egy feltétel teljesül' és a 'minden feltétel teljesül' helyzetet.",
      "Ne hagyd ki a határértékeket a kézi ellenőrzésből.",
    ],
    quickChecks: [
      "Tisztán szétválasztottad a formai és tartalmi szabályokat?",
      "Van legalább egy határeseted és egy hibás ellenpéldád?",
      "A program csak akkor fogadja el az adatot, ha minden szükséges feltétel igaz?",
    ],
    authored: true,
  },
  "shared-10": {
    intro:
      "A függvény nem kötelező minden rövid feladathoz, de a hosszabb vagy többrészes megoldásoknál kulcsszerepe van. Segít elválasztani a részfeladatokat, és olvashatóbbá teszi a kódot.",
    estimatedMinutes: "25-35 perc",
    goals: [
      "Értsd a paraméter és a visszatérési érték szerepét.",
      "Tudd felismerni, mikor érdemes segédfüggvényt írni.",
      "Szokj rá arra, hogy egy függvény egy világos feladatot végezzen.",
    ],
    sections: [
      {
        title: "Miért jó a felbontás?",
        paragraphs: [
          "Ha egy program több részfeladatból áll, nem kell mindent egyetlen hosszú kódfolyamba zsúfolni. A segédfüggvények külön nevet adnak a visszatérő vagy jól körülírható műveleteknek.",
          "Ez nemcsak kényelmesebb, hanem hibakereséskor is hasznos: könnyebb egyetlen kis részt ellenőrizni, mint egy hosszú, összefüggő blokkot.",
        ],
        examples: [
          {
            title: "Kedvezményes ár külön függvényben",
            code:
              "def kedvezmenyes_ar(ar, szazalek):\n    return ar * (100 - szazalek) / 100\n\nalap_ar = int(input())\nprint(kedvezmenyes_ar(alap_ar, 15))",
            output: "Bemenet: 2000\nKimenet: 1700.0",
            explanation:
              "A képlet külön nevet kapott. Később máshol is újrahasználható, és a főprogram olvashatóbb marad.",
          },
        ],
      },
      {
        title: "Paraméterek és visszatérés",
        paragraphs: [
          "A paraméter a függvény bemenete, a return a kimenete. Ugyanaz a logika, mint a teljes programnál, csak kisebb léptékben.",
          "Kezdőként jó szabály, hogy a függvény vagy számoljon valamit és adja vissza, vagy ellenőrizzen valamit és adjon vissza igaz/hamis eredményt.",
        ],
        bullets: [
          "A függvény neve mondja meg, mi a szerepe.",
          "A paraméterek legyenek valóban szükséges bemenetek.",
          "A visszatérési értéket a főprogram használja fel további lépésekben.",
        ],
      },
    ],
    pitfalls: [
      "Ne írj túl általános vagy semmitmondó függvényneveket.",
      "Ne keverd a print-et a returnnel: nem ugyanaz a szerepük.",
      "Ne bontsd annyira apróra a programot, hogy a függvények már ne adjanak valódi átláthatóságot.",
    ],
    quickChecks: [
      "Meg tudod mondani, mi a függvény bemenete és mi a kimenete?",
      "A főprogram olvashatóbb lett a felbontástól?",
      "A függvény egyetlen tiszta részfeladatot végez?",
    ],
    authored: true,
  },
};

function authoredLesson(article: Omit<LessonArticle, "authored">): LessonArticle {
  return {
    ...article,
    authored: true,
  };
}

const additionalSharedAndKozepLessonArticleOverrides: Record<string, LessonArticle> = {
  "shared-11": authoredLesson({
    intro:
      "A fájlkezelésnél már közel kerülsz a valódi vizsgaérzéshez: nem csak egy-egy értéket olvasol be, hanem egész adathalmazokat dolgozol fel. Itt az a cél, hogy a soronkénti olvasás és a strukturált feldolgozás biztos rutinná váljon.",
    estimatedMinutes: "25-35 perc",
    goals: [
      "Tudd soronként beolvasni és feldolgozni a fájl tartalmát.",
      "Ismerd fel, mikor kell a sorokat rögtön feldolgozni és mikor érdemes eltárolni őket.",
      "Tudd a fájlból érkező adatokat saját rekordlogikává alakítani.",
    ],
    sections: [
      {
        title: "Soronkénti olvasás és tisztítás",
        paragraphs: [
          "Fájlos feladatnál a legfontosabb rutin az, hogy minden sort ugyanazzal a szemlélettel kezelsz: beolvasás, darabolás, átalakítás, majd feldolgozás. Ha ezt a négy lépést következetesen használod, sokkal kevesebbet hibázol.",
          "A sorvégi whitespace, a fejléc vagy az üres sorok külön figyelmet igényelhetnek. Már a legelején döntsd el, mely sorok számítanak valódi adatnak.",
        ],
        examples: [
          {
            title: "Egyszerű fájlos összegzés",
            code:
              "osszeg = 0\n\nwith open(\"pontok.txt\", encoding=\"utf-8\") as fajl:\n    for sor in fajl:\n        pont = int(sor.strip())\n        osszeg += pont\n\nprint(osszeg)",
            output: "A program a pontok.txt számait összeadja és kiírja az összegüket.",
            explanation:
              "A strip eltávolítja a sortörést, az int alakít számmá, a ciklus pedig egységesen dolgozza fel az összes sort. Ez a fájlos alapminta nagyon sok feladatban visszajön.",
          },
        ],
      },
      {
        title: "Sorokból rekordok",
        paragraphs: [
          "A vizsgán a sorok gyakran több mezőt tartalmaznak. Ilyenkor nem elég egy egész sort eltárolni, a részek jelentését is külön kell választani.",
          "Jó rutin, ha minden sorhoz rögtön nevet adsz a mezőknek. A rekordfeldolgozás akkor marad tiszta, ha később már nem indexszámokkal, hanem szerepekkel gondolkodsz.",
        ],
        bullets: [
          "Döntsd el, kell-e fejlécet átugrani vagy minden sor adat.",
          "A sorokat bontsd mezőkre a valódi elválasztó szerint.",
          "A rekordból készült változónevek beszéljenek: datum, nev, pont, tavolsag, ido.",
        ],
      },
    ],
    pitfalls: [
      "Ne felejtsd el eltávolítani a sortörést, ha a teljes sort használod tovább.",
      "Ne kezeld minden fájlsort ugyanolyannak, ha van fejléc vagy speciális formátum.",
      "Ne indexekből próbáld fejben megérteni a rekordot, ha már elnevezhető mezőkre bontható.",
    ],
    quickChecks: [
      "Világos, hogy egy fájlsor pontosan milyen mezőkre bontható?",
      "El tudod mondani, mi történik a fájl minden egyes során?",
      "A kimenet a teljes fájl feldolgozása után készül, nem véletlenül ciklus közben?",
    ],
    practiceHint:
      "A kapcsolódó fájlos workspace-eknél külön figyeld meg, hol dől el, hogy egy sort azonnal feldolgozol vagy későbbre is eltárolsz.",
  }),
  "shared-12": authoredLesson({
    intro:
      "Az adatsorok feldolgozása már nem csak egyetlen érték vagy egyetlen lista kérdése, hanem több mező és több szabály együttese. Ez a lecke hidat képez a sima alapozás és a valódi közép vagy emelt adatfeldolgozó feladatok között.",
    estimatedMinutes: "25-35 perc",
    goals: [
      "Tudd többmezős adatokkal együtt kezelni az összegzést, csoportosítást és keresést.",
      "Értsd, mikor érdemes dictionary-t vagy segédstruktúrát használni.",
      "Tudd egy rekordlistából többféle eredményt is előállítani.",
    ],
    sections: [
      {
        title: "Rekordlogika és származtatott adatok",
        paragraphs: [
          "A feladat gyakran nem azt kérdezi vissza, amit közvetlenül beolvastál, hanem abból képzett új adatokat. Ilyenkor a gondolkodás kulcsa az, hogy a rekordból milyen származtatott jellemzőt kell kiszámolni.",
          "Ha ezt hamar felismered, a feldolgozás egyszerűsödik: nem a nyers sorral dolgozol végig, hanem a már értelmezett mezőkkel és a belőlük képzett mutatókkal.",
        ],
        examples: [
          {
            title: "Csoportosítás dictionary-val",
            code:
              "darabok = {}\n\nfor varos in [\"Szeged\", \"Pecs\", \"Szeged\", \"Gyor\"]:\n    if varos not in darabok:\n        darabok[varos] = 0\n    darabok[varos] += 1\n\nprint(darabok[\"Szeged\"])",
            output: "2",
            explanation:
              "A dictionary akkor jó választás, amikor egy kulcshoz többször visszatérő számolást vagy összegzést rendelsz. Vizsgán ez gyakran város, kategória, nap vagy állapot szerint jelenik meg.",
          },
        ],
      },
      {
        title: "Egy adatsorból több válasz",
        paragraphs: [
          "Sok feladat több kérdést tesz fel ugyanarra az adatkészletre. A jó megoldás ilyenkor tudatosan dönti el, hogy egyetlen bejárásban gyűjt több választ, vagy több tiszta részre bontja a feldolgozást.",
          "Nem az a cél, hogy mindig egyetlen ciklus legyen, hanem az, hogy az adatútvonal világos maradjon. Az olvashatóság vizsgahelyzetben is közvetlen előny.",
        ],
        bullets: [
          "Döntsd el, kell-e ugyanazon adatokon többször végigmenni.",
          "Ha több választ adsz, mindegyikhez külön gyűjtőváltozó vagy segédszerkezet kell.",
          "A rekordmezőkből képzett új értékeket nevezd el külön, ne beágyazott kifejezésekben rejtsd el őket.",
        ],
      },
    ],
    pitfalls: [
      "Ne maradj a nyers sorok szintjén, ha a feladat valójában rekordokkal gondolkodik.",
      "Ne használj dictionary-t csak megszokásból, ha egyszerű lista-bejárással is tisztábban megoldható.",
      "Ne keverd a beolvasott adatot a belőle számolt származtatott értékkel.",
    ],
    quickChecks: [
      "Meg tudod nevezni a rekord mezőit és a belőlük számolt új adatokat?",
      "Világos, melyik kérdéshez milyen gyűjtőstruktúra tartozik?",
      "A megoldásod akkor is átlátható marad, ha még egy új kérdés érkezik ugyanarra az adatsorra?",
    ],
  }),
  "shared-13": authoredLesson({
    intro:
      "A vizsgafeladat értelmezése sokszor fontosabb, mint maga a kódolás. A legtöbb elcsúszás nem Python-szintaxisból jön, hanem abból, hogy valaki rosszul érti a szabályokat vagy kihagy egy részfeladatot.",
    estimatedMinutes: "20-30 perc",
    goals: [
      "Tudd a hosszabb magyar nyelvű feladatszöveget szabályokra és részfeladatokra bontani.",
      "Ismerd fel a bemenet, a feldolgozás és a kimenet külön rétegeit.",
      "Tudd a megoldás előtt vázlatosan megtervezni a program szerkezetét.",
    ],
    sections: [
      {
        title: "A feladatszöveg boncolása",
        paragraphs: [
          "Egy hosszabb promptot nem érdemes lineárisan fejben tartani. Sokkal jobb stratégia, ha külön kiemeled, milyen adatok jönnek, milyen szabályok érvényesek, és pontosan milyen kérdésekre kell válaszolni.",
          "Vizsgán érdemes saját mini vázlatot készíteni: bemenet, tárolás, részfeladatok, kiírás. Ez gyorsít és közben védi a megoldást a félreértésektől.",
        ],
        bullets: [
          "Jelöld külön a kötelező részfeladatokat.",
          "Karikázd be a kivételeket és speciális szabályokat.",
          "A mintaadatot ne csak olvasd, hanem vezesd végig rajta a szabályokat.",
        ],
      },
      {
        title: "Megoldási terv kód előtt",
        paragraphs: [
          "A jó terv nem pszeudokód-regény, hanem rövid szerkezeti döntés: mit kell eltárolni, hogyan járjuk be, és melyik részfeladathoz milyen állapot tartozik.",
          "Ha ezt a vázat a kód előtt felállítod, kisebb eséllyel kell teljes blokkokat újraírnod. Különösen emelt feladatoknál ez pontmentő rutin.",
        ],
        bullets: [
          "Döntsd el, egy vagy több bejárás kell-e az adatokon.",
          "Írd mellé, melyik részfeladat milyen gyűjtőváltozót vagy segédszerkezetet használ.",
          "Csak akkor kezdj függvényekre bontani, ha a részfeladatok már világosak.",
        ],
      },
    ],
    pitfalls: [
      "Ne kódolj úgy, hogy még nem tiszta az összes részfeladat.",
      "Ne hagyd figyelmen kívül a mintaadathoz tartozó szöveges magyarázatot.",
      "Ne kezeld egyetlen blokként a promptot, ha valójában több önálló kérdésből áll.",
    ],
    quickChecks: [
      "Külön fel tudod sorolni a részfeladatokat?",
      "Világos, melyik részhez milyen adat vagy állapot kell?",
      "A mintabemeneten kézzel végig tudod vezetni a tervezett megoldást?",
    ],
    practiceHint:
      "A kapcsolódó archív feladatot most ne időre oldd, hanem úgy, mintha elemzőként bontanád fel egy másik diák számára.",
  }),
  "shared-14": authoredLesson({
    intro:
      "A hibakeresés és tesztelés a vizsgán nem külön szakasz, hanem folyamatos önvédelem. Ha tudatosan vezeted végig a változókat és tudatos ellenpéldákat használsz, sok pontot menthetsz meg az utolsó percekben.",
    estimatedMinutes: "20-30 perc",
    goals: [
      "Tudd kézzel követni a változók állapotát egy mintaadaton.",
      "Építs gyors, célzott teszteket tipikus hibák ellen.",
      "Különítsd el a logikai, formai és adatspecifikus hibákat.",
    ],
    sections: [
      {
        title: "Kézi trace és állapotkövetés",
        paragraphs: [
          "Amikor a program nem azt adja, amit vársz, gyakran nem teljes újraírásra van szükség, hanem arra, hogy körönként lásd, mi történik. A kézi trace ehhez ad fegyelmet.",
          "Írd egymás alá a fontos változók értékét minden releváns lépésnél. Ebből gyorsan látszik, hol csúszik el az állapotfrissítés vagy a feltétel.",
        ],
        examples: [
          {
            title: "Off-by-one hiba nyoma",
            code:
              "osszeg = 0\nfor i in range(1, 5):\n    osszeg += i\nprint(osszeg)",
            output: "10",
            explanation:
              "Ha valaki 1-től 5-ig szeretne összeadni, de csak 10-et kap, a trace gyorsan megmutatja, hogy a range felső határa kimarad. A hiba nem a képletben, hanem az ismétlési tartományban van.",
          },
        ],
      },
      {
        title: "Célzott tesztek építése",
        paragraphs: [
          "Ne csak egyetlen szép mintabemenetet használj. A jó tesztkészlet külön célozza a határértékeket, a ritka eseteket és a formázási hibákat is.",
          "A rövid, célzott ellenpéldák sokkal hasznosabbak, mint a véletlen nagy bemenetek. Vizsgán időhiány mellett is ez a legjobb megtérülésű ellenőrzés.",
        ],
        bullets: [
          "Legyen legalább egy normál, egy szélső és egy hibára hajlamos teszted.",
          "A formázott kimenetet külön ellenőrizd, ne csak a számértéket.",
          "A teszt akkor jó, ha meg tudod mondani, pontosan milyen hibát szűr ki.",
        ],
      },
    ],
    pitfalls: [
      "Ne csak újrafuttasd ugyanazt a mintabemenetet reménykedve.",
      "Ne a teljes kódot gyanúsítsd, ha egyetlen feltétel vagy ciklushatár is lehet a gond.",
      "Ne hagyd a formázási hibákat a végére, mintha külön témát jelentenének.",
    ],
    quickChecks: [
      "Tudod, melyik változót kell legelőször követni kézi trace-ben?",
      "Van legalább egy teszted, ami csak a határértéket vizsgálja?",
      "A hibát logikai, formai vagy adatkezelési kategóriába tudod sorolni?",
    ],
  }),
  "shared-15": authoredLesson({
    intro:
      "Az egyszerű állapotgépek ott jelennek meg, ahol valami lépésről lépésre változik: pozíció, készlet, pontszám, engedélyezett állapot. Ezek a feladatok sokszor könnyebbek lesznek, ha nem eseménysorozatként, hanem állapotfrissítő ciklusként nézed őket.",
    estimatedMinutes: "25-35 perc",
    goals: [
      "Tudd az állapotot világos változókban tárolni.",
      "Értsd az esemény, a szabály és az állapotfrissítés kapcsolatát.",
      "Tudd észrevenni, mikor kell blokkolni vagy kihagyni egy frissítést.",
    ],
    sections: [
      {
        title: "Állapot, esemény, új állapot",
        paragraphs: [
          "Az ilyen feladatokban minden lépés ugyanarra a sémára épül: van egy aktuális állapot, jön egy bemeneti esemény vagy szabály, majd ebből kiszámoljuk az új állapotot.",
          "Ha ezt a három elemet külön tudod tartani, a szimuláció sokkal átláthatóbb lesz, mint ha minden szabályt külön-külön mondatként próbálsz fejben tartani.",
        ],
        examples: [
          {
            title: "Egyszerű mozgási állapotfrissítés",
            code:
              "pozicio = 0\nlepesek = [2, -1, 3]\n\nfor lepes in lepesek:\n    uj_pozicio = pozicio + lepes\n    if uj_pozicio >= 0:\n        pozicio = uj_pozicio\n\nprint(pozicio)",
            output: "4",
            explanation:
              "A szabály itt az, hogy negatív tartományba nem mehetünk át. A frissítés ezért kétlépcsős: előbb kiszámoljuk a jelölt új állapotot, aztán eldöntjük, elfogadható-e.",
          },
        ],
      },
      {
        title: "Blokkolt és speciális esetek",
        paragraphs: [
          "Sok állapotgépes feladat nem attól nehéz, hogy sokat kell számolni, hanem attól, hogy néhány esetben nem szabad frissíteni az állapotot. Ezek a blokkolt vagy kivételes helyzetek döntik el a helyes megoldást.",
          "Jó szokás külön változóban vagy külön lépésben kezelni a jelölt új állapotot. Így a szabályok nem mosódnak össze a tényleges állapottal.",
        ],
        bullets: [
          "Az aktuális és a jelölt új állapot ne keveredjen össze.",
          "A blokkoló feltételeket írd külön, jól olvasható if-ágba.",
          "A mintaadaton minden lépésnél mondd ki, mi marad és mi változik.",
        ],
      },
    ],
    pitfalls: [
      "Ne frissítsd az állapotot, mielőtt ellenőrizted volna a szabályt.",
      "Ne próbáld a kivételes eseteket ugyanabba a sorba sűríteni a normál frissítéssel.",
      "Ne csak a végállapotot ellenőrizd, a köztes lépések is számítanak.",
    ],
    quickChecks: [
      "Meg tudod mondani, melyik változó jelenti az aktuális állapotot?",
      "Van külön helye a blokkolt vagy speciális eseteknek?",
      "A mintalépéseken kézzel is ugyanaz az állapot alakul ki, mint a programban?",
    ],
  }),
  "shared-16": authoredLesson({
    intro:
      "A formázott kimenet a vizsga egyik legkegyetlenebb területe: a logikád lehet jó, ha az utolsó karakter nem ott van, ahol kellene, a megoldás mégis hibás lehet. Ezért ezt külön rutinokkal kell gyakorolni.",
    estimatedMinutes: "20-30 perc",
    goals: [
      "Tudd a szöveges és numerikus eredményeket pontos formában kiírni.",
      "Értsd a szeparátorok, a sorvégek és az igazítás szerepét.",
      "Tudd a mintaoutputot kötelező szerződésként kezelni.",
    ],
    sections: [
      {
        title: "A formátum nem utólagos díszítés",
        paragraphs: [
          "A feladat által előírt alak a megoldás része. Ha a program jó számot ír ki rossz helyre vagy rossz elválasztóval, az nem fél siker, hanem hibás kimenet.",
          "Ezért már a tervezéskor döntsd el, milyen sorokból fog állni a végső output. Sokkal jobb előre látni a szerkezetet, mint utólag toldozni a print sorokat.",
        ],
        examples: [
          {
            title: "Formázott összesítés",
            code:
              "nev = \"Anna\"\npont = 17\nprint(f\"Versenyző: {nev}\")\nprint(f\"Pontszám: {pont}\")",
            output: "Versenyző: Anna\nPontszám: 17",
            explanation:
              "A formázott string segít, hogy az elvárt szöveg és a változó értéke egyetlen, jól áttekinthető kimeneti sorban találkozzon.",
          },
        ],
      },
      {
        title: "Pontosság és ellenőrzés",
        paragraphs: [
          "A kimenetet nem csak vizuálisan kell ellenőrizni, hanem karakterlogikával is: kell-e kettőspont, van-e szóköz, jó helyen van-e a sortörés, kell-e üres sor vagy sem.",
          "A mintaoutputot érdemes karakterről karakterre összevetni a sajátoddal, ha makacs hiba marad. A legtöbb formázási gond ekkor gyorsan lebukik.",
        ],
        bullets: [
          "A címkék és az értékek sorrendje számít.",
          "A szóköz és a sortörés ugyanúgy része a megoldásnak, mint a számított eredmény.",
          "Ha több sor készül, külön ellenőrizd mindegyik szerkezetét.",
        ],
      },
    ],
    pitfalls: [
      "Ne szépítsd át a feladat által kért szöveget saját ízlés szerint.",
      "Ne a végén kapkodj a formázással, mintha különálló apróság lenne.",
      "Ne csak a számértéket ellenőrizd, a teljes sort nézd.",
    ],
    quickChecks: [
      "Pontosan ugyanaz a sorstruktúra jön ki, mint amit a feladat kér?",
      "Külön ellenőrizted a szóközöket, címkéket és sortöréseket?",
      "A kimenetet egy másik ember is ugyanúgy olvasná, mint a feladat mintáját?",
    ],
  }),
  "shared-17": authoredLesson({
    intro:
      "Az összefoglaló mini projekt célja nem új fogalmak tanítása, hanem annak ellenőrzése, hogy az eddigi elemek együtt is működnek-e. Itt már egyszerre kell kezelni bemenetet, feldolgozást, ellenőrzést és kiírást.",
    estimatedMinutes: "30-40 perc",
    goals: [
      "Tudd egyetlen feladatban összekapcsolni az alapozó blokkok mintáit.",
      "Érezd, hogy a több részből álló megoldás is felbontható kezelhető egységekre.",
      "Készülj fel arra, hogy a közép vagy emelt ágban már természetes lesz az ilyen összetett workflow.",
    ],
    sections: [
      {
        title: "Összekapcsolt lépésekben gondolkodj",
        paragraphs: [
          "A mini projektben már nem egyetlen algoritmikus fogás a cél, hanem az, hogy a teljes megoldásív átlátható maradjon. Ehhez külön kell választani a beolvasást, a gyűjtést, a speciális eseteket és a kiírást.",
          "Ha egy nagyobb feladat szétesik a kezedben, szinte mindig az a gond, hogy nincs világos belső szerkezete. Ez a lecke pont ezt a hibát előzi meg.",
        ],
        bullets: [
          "Készíts rövid vázlatot a megoldás fő részeiről.",
          "Minden részhez rendelj kulcsváltozókat vagy segédfüggvényeket.",
          "A végső kimenet előtt külön ellenőrizd a köztes eredményeket.",
        ],
      },
      {
        title: "Önellenőrzés összetett feladat után",
        paragraphs: [
          "Az integrált feladatnál különösen fontos, hogy ne csak a végső választ nézd, hanem a feldolgozási útvonalat is. Ha a végeredmény hibás, tudd megmondani, melyik részszinten romlott el a megoldás.",
          "Jó rutin, ha ilyenkor részfeladatonként végzel gyors kontrollt: beolvasás rendben, gyűjtés rendben, speciális esetek rendben, formázás rendben.",
        ],
        bullets: [
          "A teljes megoldásnál is részproblémákban gondolkodj.",
          "A kód szerkezete tükrözze a feladatszöveg belső logikáját.",
          "Ha valamelyik rész elcsúszik, ne a teljes megoldást írd újra, hanem a hibás blokkot javítsd.",
        ],
      },
    ],
    pitfalls: [
      "Ne kezeld egyetlen óriási blokként az egész mini projektet.",
      "Ne a végső print alapján próbáld kitalálni, hol romlott el valami.",
      "Ne hagyd ki a köztes eredmények gyors ellenőrzését csak azért, mert a feladat hosszabb.",
    ],
    quickChecks: [
      "Fel tudod bontani a mini projektet 3-5 világos részlépésre?",
      "Minden részlépéshez tartozik külön adat vagy állapot?",
      "Ha hibás az eredmény, tudod, melyik blokkot kell elsőként ellenőrizni?",
    ],
    practiceHint:
      "Ezt a leckét akkor tekintsd késznek, ha két különböző kapcsolódó workspace-ben is végig tudsz menni ugyanazon a gondolkodási íven.",
  }),
  "shared-18": authoredLesson({
    intro:
      "Az alapozás záró felmérés nem pusztán ellenőrzőpont, hanem szintirányító csomópont. Itt dől el, hogy a közös alapok tényleg eléggé stabilak-e a közép vagy emelt fókuszhoz.",
    estimatedMinutes: "20-30 perc",
    goals: [
      "Tudd felmérni, mely alapminták mennek már automatikusan és melyek szorulnak erősítésre.",
      "Értsd, miben más a közép és miben más az emelt továbblépési út.",
      "Készülj tudatos döntéssel a következő blokkra, ne csak megérzésből lépj tovább.",
    ],
    sections: [
      {
        title: "Milyen készségeket kell most biztosan tudni?",
        paragraphs: [
          "A záró felmérésnél nem az a kérdés, hogy minden részfeladat elsőre hibátlan-e, hanem hogy a fő minták stabilak-e: bemenet, ciklus, gyűjtés, döntés, validálás, formázott kimenet és alapvető feladatértelmezés.",
          "Ha ezek közül bármelyik bizonytalan, a specializáció csak ráépíti a hibát. Ezért érdemes most őszintén felmérni a hiányokat.",
        ],
        bullets: [
          "Bemenet és kimenet kezelése hiba nélkül.",
          "Ciklus és gyűjtési minták stabil használata.",
          "Fájl- és sztringalapú feladatok értelmezése.",
        ],
      },
      {
        title: "Hogyan válassz ágakat?",
        paragraphs: [
          "A közép ág akkor jó fókusz, ha gyors, megbízható, tiszta megoldási rutinra akarsz építeni, és a tipikus feladatszerkezetekben akarsz nagyon biztos lenni.",
          "Az emelt ág akkor való neked, ha már most is könnyen bontasz fel hosszabb feladatot részekre, és szívesen foglalkozol összetettebb állapotkezeléssel vagy szabályrendszerekkel.",
        ],
        bullets: [
          "Nem végleges döntést hozol, hanem fókuszt választasz.",
          "A gyengébb alapmintákat érdemes még a specializáció előtt megerősíteni.",
          "A kapcsolódó drill-ek sokkal pontosabban mutatják meg a szintedet, mint a puszta önérzet.",
        ],
      },
    ],
    pitfalls: [
      "Ne csak azt nézd, melyik feladattípus tetszik, hanem azt is, melyik megy stabilan.",
      "Ne ugorj emelt mintákra, ha az alapozó blokkok még szétesnek időnyomás alatt.",
      "Ne úgy értékeld magad, hogy csak a legszebb mintabemeneteket próbálod ki.",
    ],
    quickChecks: [
      "Melyik három alapminta megy már automatikusan?",
      "Melyik kettő igényel még biztosan célzott gyakorlást?",
      "A jelenlegi tudásod alapján a közép vagy az emelt fókusz adna jobb következő lépést?",
    ],
  }),
  "kozep-01": authoredLesson({
    intro:
      "A közép szintű specializáció elején a legfontosabb cél a felismerési sebesség. Nem új nyelvi elemeket tanulsz, hanem azt, hogyan ismerd fel gyorsan a megszokott feladatszerkezeteket és válaszd hozzájuk a stabil megoldási sablont.",
    estimatedMinutes: "20-30 perc",
    goals: [
      "Ismerd fel a közép szint legtipikusabb feladatsémáit.",
      "Tudd gyorsan kiválasztani a megfelelő megoldási vázat.",
      "Szokj rá arra, hogy nem improvizálsz minden feladatnál teljesen nulláról.",
    ],
    sections: [
      {
        title: "Visszatérő közép sémák",
        paragraphs: [
          "Közép szinten sok feladat ugyanarra a néhány gondolkodási mintára épül: összegzés, szűrés, szélsőérték-keresés, egyszerű rekordfeldolgozás, alap szimuláció és pontos kiírás. A különbség általában a történetben és a bemenet részleteiben van.",
          "A gyors felismerés azért fontos, mert felszabadítja az időt a pontos ellenőrzésre. Ha rögtön látod a mintát, kevesebb energia megy el a szerkezet kitalálására.",
        ],
        bullets: [
          "Kérdezd meg: egy adatot, egy listát vagy rekordokat dolgozok fel?",
          "Kérdezd meg: számolok, szűrök, keresek vagy szimulálok?",
          "Kérdezd meg: a kimenet egyetlen érték, lista vagy több külön válasz?",
        ],
      },
      {
        title: "Megoldási vázlat kiválasztása",
        paragraphs: [
          "A közép szint erőssége a stabil rutin. Itt sokszor jobb egy egyszerűbb, de átlátható megoldás, mint egy rövidebb, de nehezen ellenőrizhető változat.",
          "A feladatok nagy részénél az első jó döntés az, hogy listába gyűjtesz-e, rögtön feldolgozol-e, vagy valamilyen klasszikus gyűjtési sémát használsz.",
        ],
        bullets: [
          "Előny a tiszta, kiszámítható szerkezet, nem a trükkös rövidség.",
          "Ugyanaz a feladattípus többféle szöveggel is jöhet, de a vázlat ugyanaz marad.",
          "A sablon csak kiindulópont: a speciális szabályokat külön kell ráépíteni.",
        ],
      },
    ],
    pitfalls: [
      "Ne kezeld minden feladatot teljesen egyedinek, ha a mögötte lévő séma ismert.",
      "Ne rövidségi versenyt nyerj, hanem megbízható megoldást írj.",
      "Ne hagyd ki a promptból a kis különszabályokat csak azért, mert a fő minta ismerős.",
    ],
    quickChecks: [
      "Három mondatban meg tudod nevezni a közép leggyakoribb mintáit?",
      "Egy új feladatról gyorsan eldöntöd, melyik sémához áll közel?",
      "A választott megoldási váz tényleg illik a bemeneti és kimeneti szerkezethez?",
    ],
  }),
  "kozep-02": authoredLesson({
    intro:
      "A lista- és sztringrutinok közép szinten különösen nagy súlyúak, mert rengeteg feladat ilyen egyszerűnek látszó, de pontos feldolgozást igénylő adatokra épül. Itt a cél a gördülékenység és a formai biztonság.",
    estimatedMinutes: "20-30 perc",
    goals: [
      "Tudd gyorsan kombinálni a listás és sztringes alapmintákat.",
      "Értsd, mikor kell elemeken és mikor karaktereken gondolkodni.",
      "Szokj rá a közép szinthez szükséges pontos, de egyszerű adatútvonalra.",
    ],
    sections: [
      {
        title: "Sztringből lista, listából válasz",
        paragraphs: [
          "Közép szinten sok feladat valójában rövid adattranszformáció: a bemenet szövegként érkezik, majd listává vagy mezőkké bontod, végül valamilyen összesített választ adsz vissza.",
          "Ha ezt a váltást gyorsan és pontosan végzed, rengeteg feladat megoldása válik rutinná.",
        ],
        bullets: [
          "Figyeld meg, hol a természetes elválasztó a szövegben.",
          "A feldarabolt elemekből azonnal döntsd el, számként vagy szövegként kell-e kezelni őket.",
          "A végső választ külön logikai lépésként kezeld, ne a darabolás közepén próbáld kiírni.",
        ],
      },
      {
        title: "Rutinépítés ismétlődő mintákból",
        paragraphs: [
          "A közép szint itt elsősorban nem kreatív trükköket kér, hanem fegyelmezett végrehajtást. Ugyanaz a minta sokszor visszajön más adatokkal, más történettel, kicsit más feltételekkel.",
          "Minél tudatosabban építed ezt rutinná, annál kevesebb időt kell a szerkezet újrafelfedezésére szánnod.",
        ],
        bullets: [
          "Gyakorolj ugyanarra a sémára többféle történettel.",
          "Ugyanazt a feladattípust oldd meg egyszer lista-, egyszer sztringfókuszú bemenettel.",
          "A gyorsaság csak akkor ér valamit, ha közben a kimenet formája is stabil marad.",
        ],
      },
    ],
    pitfalls: [
      "Ne gondold egyszerűnek a sztringes feladatot csak azért, mert rövid a bemenet.",
      "Ne veszítsd el a típuskasztolást a lista- és sztringkezelés között.",
      "Ne keverd össze a feldolgozás logikáját a kiírás formai feladatával.",
    ],
    quickChecks: [
      "Látod, hogy a feladat inkább listás vagy inkább sztringes gondolkodást kér?",
      "A darabolás után egyértelmű, milyen típust kezel minden mező?",
      "A megoldásod akkor is működne, ha ugyanaz a minta más történetbe lenne csomagolva?",
    ],
  }),
  "kozep-03": authoredLesson({
    intro:
      "A számlálás, keresés és szűrés a közép szint gerince. Ezek azok a klasszikus algoritmikus rutinok, amelyekből a legtöbb rövid és közepes nehézségű feladat felépül.",
    estimatedMinutes: "25-35 perc",
    goals: [
      "Tudd magabiztosan használni a klasszikus számláló és kereső sémákat.",
      "Értsd, mikor kell több feltételt egyszerre vizsgálni.",
      "Tudd stabilan összekötni a szűrést az összegzéssel vagy darabszámmal.",
    ],
    sections: [
      {
        title: "Klasszikus pontszerző minták",
        paragraphs: [
          "A közép szinten a legtöbb kérdés valamilyen 'hány darab', 'mekkora az összeg', 'melyik a legnagyobb', 'van-e ilyen' típusú problémává alakítható. Ha ezt gyorsan felismered, a megoldás szerkezete szinte azonnal megvan.",
          "A kihívás többnyire nem maga a séma, hanem az, hogy a feltételeket pontosan vidd bele a cikluson belüli frissítésekbe.",
        ],
        bullets: [
          "Minden kérdéshez külön gyűjtőváltozó tartozzon.",
          "A feltételek helye a cikluson belüli frissítési pontokon van.",
          "A keresésnél döntsd el, kell-e maga az érték, az index vagy mindkettő.",
        ],
      },
      {
        title: "Szűrés és kiválasztás együtt",
        paragraphs: [
          "A közép feladatok gyakran nem minden adatot akarnak figyelembe venni, hanem csak azokat, amelyek megfelelnek egy szabálynak. Ilyenkor a szűrés és a gyűjtés együtt fut.",
          "Ez a lecke azt erősíti meg, hogy a szűrőfeltétel nem utólagos extra, hanem a gyűjtés definíciója.",
        ],
        bullets: [
          "Előbb döntsd el, kik tartoznak a vizsgált halmazba.",
          "Csak utána számolj, darabolj vagy válassz szélsőértéket.",
          "A feltétel és a frissítés maradjon ugyanabban a logikai blokkban.",
        ],
      },
    ],
    pitfalls: [
      "Ne frissíts többféle célú változót ugyanazzal a névvel.",
      "Ne felejts el külön kezelni 'nem találtunk ilyet' típusú helyzeteket.",
      "Ne keverd a szűrés feltételét a végső kiírás szabályával.",
    ],
    quickChecks: [
      "Minden részfeladathoz külön meg tudod nevezni a megfelelő klasszikus sémát?",
      "A szűrt halmaz definíciója egyértelmű a kódban is?",
      "Ha nincs megfelelő elem, a programod akkor is helyesen viselkedik?",
    ],
  }),
  "kozep-04": authoredLesson({
    intro:
      "A fájlos közép feladatok már közelebb állnak a hivatalos megoldási hangulathoz. Itt a siker kulcsa az, hogy az adatbeolvasás és az egyszerű rekordlogika stabilan menjen, mert erre épül az összes többi részfeladat.",
    estimatedMinutes: "25-35 perc",
    goals: [
      "Tudd gyorsan felépíteni a fájlos feldolgozás vázát.",
      "Értsd, hogyan lesz a nyers sorokból közép szintű rekordfeldolgozás.",
      "Tudd a többkérdéses közép feladatokat átlátható blokkokra bontani.",
    ],
    sections: [
      {
        title: "A fájlos vázlat gyors felépítése",
        paragraphs: [
          "Közép szinten nagy előny, ha a fájlos megoldás eleje már majdnem rutinból készül: megnyitás, soronkénti olvasás, mezőkre bontás, tárolás vagy rögtön feldolgozás.",
          "Ez azért hasznos, mert így a figyelmed nagyobb része mehet a részfeladatok logikájára, nem vesz el időt az alapváz kitalálása.",
        ],
        bullets: [
          "A fájl beolvasását különítsd el a feldolgozástól, ha több kérdés lesz ugyanarra az adatkészletre.",
          "Ha egyetlen bejárás is elég, csak akkor egyszerűsíts erre.",
          "A mezők jelentését nevezd el rögtön a beolvasás után.",
        ],
      },
      {
        title: "Több részfeladat ugyanarra az adatra",
        paragraphs: [
          "A hivatalos feladatforma sokszor több kisebb kérdésből áll. Jó stratégia, ha a részfeladatokat külön gondolati egységként kezeled, még akkor is, ha ugyanazt az adatsort használják.",
          "Így könnyebb javítani, ellenőrizni és akár részeredményeknél is pontot menteni.",
        ],
        bullets: [
          "A részfeladatokhoz külön gyűjtő- vagy eredményváltozókat használj.",
          "A fájlos adatsor legyen központi forrás, ne olvasd újra feleslegesen.",
          "A végső kiírást a részfeladatok logikai sorrendje szerint szervezd.",
        ],
      },
    ],
    pitfalls: [
      "Ne hagyd, hogy a fájlbeolvasás logikája összefolyjon a részfeladatokkal.",
      "Ne olvasd újra a fájlt csak azért, mert nem tervezted meg előre a feldolgozást.",
      "Ne egyetlen gyűjtőváltozóval próbálj több külön kérdést is kiszolgálni.",
    ],
    quickChecks: [
      "A fájlból érkező rekordok szerepe minden mezőnél tiszta?",
      "A részfeladatokat külön tudod kezelni ugyanazon az adatkészleten?",
      "A megoldásod bírná azt is, ha még egy új kérdést hozzáadnának a végére?",
    ],
  }),
  "kozep-05": authoredLesson({
    intro:
      "Az egyszerű szimulációk közép szinten tipikusan olyan feladatok, ahol valami lépésenként változik, de a szabályrendszer még átlátható marad. Ezek a feladatok jól mérik, mennyire stabil a ciklus- és állapotgondolkodásod.",
    estimatedMinutes: "25-35 perc",
    goals: [
      "Tudd lépésenként modellezni az állapotváltozást.",
      "Értsd a blokkoló és kivételes esetek szerepét.",
      "Tudd a szimulációt közép szinten egyszerű, ellenőrizhető logikával megírni.",
    ],
    sections: [
      {
        title: "Lépésenkénti gondolkodás",
        paragraphs: [
          "A szimulációt mindig idő- vagy eseménylépésekre kell bontani. Minden körben ugyanaz a kérdés: mi az aktuális állapot, milyen szabály jön, és mi lesz az új állapot.",
          "A közép szint ereje az, hogy ez a logika még általában tisztán kezelhető néhány változóval és jól szervezett feltételekkel.",
        ],
        bullets: [
          "A lépés fogalma legyen világos: időegység, esemény vagy inputelem.",
          "Az állapotváltozást különítsd el a végső eredmény kiírásától.",
          "Minden kivételes szabályhoz külön ellenőrző helyet tervezz.",
        ],
      },
      {
        title: "Közép szintű egyszerűség",
        paragraphs: [
          "Itt még nem az a cél, hogy minden lehetséges optimalizálást megírj. Sokkal többet ér egy tiszta szimuláció, amelyet könnyű ellenőrizni és kézzel végigvezetni.",
          "A közép feladatoknál a megbízhatóság fontosabb, mint a bonyolult rövidítés. Ha a szerkezet ellenőrizhető, az már fél siker.",
        ],
        bullets: [
          "Ne bonyolítsd túl a szimulációt felesleges segédstruktúrákkal.",
          "A változónevek mondják meg, mit modelleznek.",
          "A kézi mintakövetés legyen a megoldásod természetes része.",
        ],
      },
    ],
    pitfalls: [
      "Ne ugorj át lépéseket fejben csak azért, mert egyszerűnek tűnik a minta.",
      "Ne keverd össze az aktuális és a következő állapotot.",
      "Ne hagyd ki a blokkoló szabályok külön kezelését.",
    ],
    quickChecks: [
      "Minden lépésben meg tudod mondani, mi változik és mi marad?",
      "Külön kezeled a normál és a speciális eseteket?",
      "A szimulációt kézzel is végig tudod vezetni a mintaadaton?",
    ],
  }),
  "kozep-06": authoredLesson({
    intro:
      "A közép nehezítő tényezők általában nem teljesen új algoritmusok, hanem apró csavarok: tie-break, furcsa input, speciális sorrend, kivételes kiírás. Ezeken múlik, hogy a stabil alapmegoldásból valóban jó vizsgamegoldás lesz-e.",
    estimatedMinutes: "20-30 perc",
    goals: [
      "Ismerd fel a feladat apró, pontvesztő csavarjait.",
      "Tudd tisztán ráépíteni a különszabályokat az alapmegoldásra.",
      "Szokj rá a prompt apró részleteinek tudatos ellenőrzésére.",
    ],
    sections: [
      {
        title: "A csavar nem külön feladat, hanem a fő feladat része",
        paragraphs: [
          "Közép szinten a legtöbb nehézség abból jön, hogy a diák felismeri a fő sémát, aztán elsiklik egy kisebb, de kötelező részlet felett. Ilyen lehet egy döntetlenkezelés, egy extra szűrő vagy egy kivételes formátum.",
          "A jó stratégia az, hogy a fő váz után külön listázod ezeket a csavarokat, és ellenőrzöd, hol lépnek be a logikába.",
        ],
        bullets: [
          "Külön gyűjtsd ki a promptból a speciális szabályokat.",
          "Ne keverd a fő algoritmusba őket olvashatatlanul.",
          "A kivételes eseteket külön mintabemenettel is próbáld ki.",
        ],
      },
      {
        title: "Pontosság a kis részletekben",
        paragraphs: [
          "A közép pontvesztések nagy része nem ott történik, ahol a diák számít rá. Gyakran egy rossz sorrend, egy hiányzó döntetlen-szabály vagy egy félreolvasott formátum dönti el a teszt eredményét.",
          "Ezért a megoldás végén nem csak a fő logikát, hanem a kis részleteket is külön checklist szerint érdemes átnézni.",
        ],
        bullets: [
          "Van-e döntetlen vagy speciális sorrendkezelés?",
          "Van-e külön feltétel a szélső esetekre?",
          "A kiírás minden részletében megfelel-e a feladatnak?",
        ],
      },
    ],
    pitfalls: [
      "Ne gondold, hogy ha a fő séma jó, a feladat már kész is.",
      "Ne rejtsd el a kivételes eseteket ugyanabba az ágba, ahol a normál eset fut.",
      "Ne csak normál teszteket futtass, a csavarok külön ellenpéldát kérnek.",
    ],
    quickChecks: [
      "Ki tudod listázni a feladat különszabályait külön a fő mintától?",
      "A kódban jól látható helyük van ezeknek a csavaroknak?",
      "Próbáltál olyan tesztet is, amelyik pont a kivételes esetre fut rá?",
    ],
  }),
  "kozep-07": authoredLesson({
    intro:
      "Az időalapú, pontozásos és rangsoros feladatok közép szinten nagyon gyakoriak, mert egyszerre kérnek összesítést, sorrendiséget és pontos szabályalkalmazást. Ezek jó gyakorlóterei annak, hogyan kell több feltételt együtt kezelni anélkül, hogy a kód szétesne.",
    estimatedMinutes: "25-35 perc",
    goals: [
      "Tudd modellezni az időrend, pontozás és rangsorolás közép szintű változatait.",
      "Értsd a többfeltételes összehasonlítások szerepét.",
      "Tudd az összesítést és a sorrendet ugyanazon adathalmazon kezelni.",
    ],
    sections: [
      {
        title: "Összesítés és sorrendiség együtt",
        paragraphs: [
          "Ezekben a feladatokban nem elég pusztán összeadni vagy számolni; az is kérdés lehet, hogy mi mikor történt, ki előz meg kit, vagy milyen sorrend szerint kell eldönteni a végeredményt.",
          "A jó megoldás itt is ugyanazzal indul: tisztázod a rekord mezőit, az összesítési szabályt és a sorrendképzés logikáját.",
        ],
        bullets: [
          "Döntsd el, kell-e tényleges rendezés vagy elég szélsőérték-keresés.",
          "A pontozási szabályokat külön írd ki magadnak.",
          "Az időrend nem csak számérték, hanem gyakran tie-break is lehet.",
        ],
      },
      {
        title: "Tie-break és többkulcsos gondolkodás",
        paragraphs: [
          "A rangsorolás sokszor nem egyetlen mérőszámon múlik. Előfordul, hogy előbb pontszám, aztán idő, aztán név szerinti döntés kell. Közép szinten ezt még egyszerű, de következetes szabályrendszerrel lehet jól kezelni.",
          "A lényeg az, hogy a prioritásokat egyértelműen lásd. Mi az elsődleges, mi a másodlagos és mikor jön csak elő a harmadik szempont.",
        ],
        bullets: [
          "Ne egyetlen feltételben zsúfold össze az egész döntési láncot, ha olvashatatlan lesz.",
          "Mondd ki külön, melyik szempont előzi meg a másikat.",
          "A tie-break logikát saját mintával külön teszteld.",
        ],
      },
    ],
    pitfalls: [
      "Ne keverd össze az összesítés és a rangsorolás szabályait.",
      "Ne hagyd homályban, mi történik döntetlen helyzetben.",
      "Ne rendezz teljes listát, ha valójában csak a legjobb vagy a legrosszabb elem kell.",
    ],
    quickChecks: [
      "Egyértelmű az elsődleges és a másodlagos összehasonlítási szempont?",
      "A tie-break helyzetekre van külön teszted?",
      "A feladat megoldható tisztábban egyszerű kereséssel, mint teljes rendezéssel?",
    ],
  }),
  "kozep-08": authoredLesson({
    intro:
      "A közép próbaérettségi stratégia már nem új algoritmika, hanem teljesítményfegyelem. Itt azt tanulod meg, hogyan hozz stabil pontszámot időnyomás alatt úgy, hogy közben ne ess bele a leggyakoribb vizsgahibákba.",
    estimatedMinutes: "20-30 perc",
    goals: [
      "Tudd beosztani az idődet közép szintű feladatmegoldás közben.",
      "Építs önellenőrző rutint a tipikus közép hibák ellen.",
      "Tanuld meg, mikor érdemes továbbmenni és mikor kell még javítani egy részfeladatot.",
    ],
    sections: [
      {
        title: "Időbeosztás és fókusz",
        paragraphs: [
          "A közép szinten nem az a cél, hogy minden feladaton maximalista módon tökéletesíts, hanem hogy a biztos pontokat gyorsan és tisztán megszerezd. Ehhez fontos tudni, mikor vagy kész egy részfeladattal.",
          "A jó időbeosztás azt jelenti, hogy előbb a biztos, könnyen ellenőrizhető részekre szerzel pontot, és csak utána finomítasz.",
        ],
        bullets: [
          "Előbb biztosítsd a fő vázat és a könnyű részeredményeket.",
          "Ne ragadj bent túl sokáig egyetlen bizonytalan apróságban.",
          "Hagyj időt a kimenet és a különszabályok végső ellenőrzésére.",
        ],
      },
      {
        title: "Vizsga alatti önellenőrzés",
        paragraphs: [
          "A közép szintű pontvesztések gyakran ugyanazokból a hibákból jönnek: rossz input, kihagyott határeset, elrontott kimeneti forma, elmulasztott tie-break. Ezeket checklistként érdemes fejben tartani.",
          "A stratégia nem csak tempó, hanem kontroll. Akkor működik jól, ha gyorsan át tudod futni a legkockázatosabb pontokat a beadás előtt.",
        ],
        bullets: [
          "Input és típuskasztolás rendben?",
          "A fő gyűjtőváltozók helyesen frissülnek?",
          "A kimenet pontosan a kért formában jelenik meg?",
        ],
      },
    ],
    pitfalls: [
      "Ne az első apró hibánál veszítsd el az időbeosztásodat.",
      "Ne hagyd a formázási ellenőrzést az utolsó másodpercre.",
      "Ne gondold, hogy a logikai helyesség önmagában elég a pontokhoz.",
    ],
    quickChecks: [
      "Van világos sorrended arra, hogy mit oldasz meg először?",
      "Tudod, milyen közép szintű hibákat kell beadás előtt biztosan végigellenőrizni?",
      "A mostani tempód mellett marad időd célzott végellenőrzésre is?",
    ],
    practiceHint:
      "A kapcsolódó közép workspace-eket már érdemes időre is kipróbálni, de a végén mindig legyen 2-3 perc saját ellenőrző köröd.",
  }),
};

const additionalEmeltAndReviewLessonArticleOverrides: Record<string, LessonArticle> = {
  "emelt-01": authoredLesson({
    intro:
      "Az emelt problémabontás lényege, hogy a hosszabb feladatot még kód előtt strukturált részekre törd. Emelt szinten a legtöbb hiba nem abból jön, hogy nincs ötlet, hanem abból, hogy a megoldás szerkezete nincs előre kézben tartva.",
    estimatedMinutes: "25-35 perc",
    goals: [
      "Tudd a hosszabb emelt feladatot egymásra épülő részproblémákra bontani.",
      "Értsd, mikor kell segédfüggvény, segédszerkezet vagy külön bejárás.",
      "Tudd a megoldás előtt kijelölni a kockázatos részeket és az ellenőrzési pontokat.",
    ],
    sections: [
      {
        title: "Szerkezeti terv emelt feladat előtt",
        paragraphs: [
          "Emelt szinten a feladat sokszor túl hosszú ahhoz, hogy egyetlen gondolati blokkban kezeld. A jó stratégia az, hogy külön veszed a beolvasást, az állapotmodellt, a részfeladatokat és a végső formázást.",
          "A problémabontás itt nem opcionális kényelem, hanem pontvédő technika. Ha a szerkezeted tiszta, sokkal kisebb az esélye annak, hogy egy részjavítás szétveri a teljes programot.",
        ],
        bullets: [
          "Jelöld ki, mely részek tiszta adatfeldolgozások és melyek összetett döntési blokkok.",
          "Döntsd el, hol kell külön függvénybe szervezni a logikát.",
          "A kritikus adatokat és állapotokat már a tervezéskor nevezd el.",
        ],
      },
      {
        title: "A részproblémák közti kapcsolatok",
        paragraphs: [
          "A bontás akkor jó, ha a részek tényleg összeilleszthetők. Nem elég listázni a feladatdarabokat; azt is látni kell, melyik rész milyen adatot ad a következőnek.",
          "Érdemes ezért minden blokkhoz röviden leírni: mi jön be, mi megy ki, és melyik másik rész használja fel ezt az eredményt. Ez a szemlélet különösen segít emelt feladatok hibakeresésénél.",
        ],
        bullets: [
          "Minden részfeladatnak legyen világos bemenete és kimenete.",
          "A segédfüggvények ne globális varázslatok legyenek, hanem jól körülírható egységek.",
          "A szerkezetet úgy válaszd meg, hogy részfeladatonként is ellenőrizhető maradjon.",
        ],
      },
    ],
    pitfalls: [
      "Ne kezdj el emelt feladatot teljes szerkezeti terv nélkül.",
      "Ne keverd össze a részproblémák határait, mert ettől lesz kaotikus a kód.",
      "Ne csak azt tervezd meg, mit kell kiszámolni, hanem azt is, mivel fogod ellenőrizni.",
    ],
    quickChecks: [
      "Fel tudod bontani a feladatot 3-6 világos részre?",
      "Minden részhez tudsz nevet adni és meg tudod mondani, mit ad tovább?",
      "A szerkezeted akkor is stabil maradna, ha az egyik részfeladat hibás lenne és külön kéne javítanod?",
    ],
  }),
  "emelt-02": authoredLesson({
    intro:
      "Az összetett állapotkezelés az emelt feladatok egyik legtipikusabb nehézsége. Itt már nem elég egyetlen számláló vagy pozíció: több egymásra ható állapotot kell következetesen karbantartani.",
    estimatedMinutes: "30-40 perc",
    goals: [
      "Tudd több állapotváltozó kapcsolatát egyszerre modellezni.",
      "Értsd az eseménysor és az állapotfrissítési sorrend szerepét.",
      "Tudd külön kezelni a normál, blokkolt és speciális átmeneteket.",
    ],
    sections: [
      {
        title: "Több állapot, egy eseménysor",
        paragraphs: [
          "Emelt feladatban gyakori, hogy ugyanarra az eseményre több állapot is változik: helyzet, kapacitás, pontszám, státusz vagy jogosultság. Ilyenkor a fő veszély az, hogy a frissítések rossz sorrendben vagy rossz feltételekkel futnak le.",
          "A jó megoldás a frissítéseket tudatos sorrendbe rendezi. Előbb eldönti, mi történhet meg, aztán végrehajtja a szükséges állapotváltásokat.",
        ],
        bullets: [
          "Külön nevezd meg az állapotváltozókat és szerepüket.",
          "A frissítési sorrend legyen tudatos, ne véletlenszerű.",
          "A speciális eseteknek legyen külön kezelési pontjuk.",
        ],
      },
      {
        title: "Átmenetek és invariánsok",
        paragraphs: [
          "Az emelt állapotgépes feladatoknál segít, ha tudod, minek kell mindig igaznak maradnia. Például kapacitás nem lehet negatív, pozíció nem mehet pályán kívülre, egy státuszváltás után más szabályok lesznek érvényesek.",
          "Ezeket az invariánsokat érdemes külön kimondani, mert így a hibakeresés sem a teljes rendszerben történik, hanem célzottan a megsértett szabály körül.",
        ],
        bullets: [
          "Mondd ki, mely állapotoknak kell mindig érvényesnek maradniuk.",
          "A jelölt új állapot és a végleges állapot ne keveredjen.",
          "A kézi trace itt különösen fontos, mert a köztes állapotok döntik el a helyességet.",
        ],
      },
    ],
    pitfalls: [
      "Ne frissíts több állapotot egyszerre átláthatatlan sorokban.",
      "Ne hagyd homályban, hogy egy esemény után mi milyen sorrendben változik.",
      "Ne csak a végállapotot ellenőrizd, a köztes átmenetek is lehetnek hibásak.",
    ],
    quickChecks: [
      "Meg tudod nevezni az összes lényeges állapotváltozót?",
      "Egy eseménynél világos, melyik frissítés miért történik előbb?",
      "Kézi trace-ben meg tudod mutatni, hol sérülhet valamelyik invariáns?",
    ],
  }),
  "emelt-03": authoredLesson({
    intro:
      "Az ütemezés és sorrendkezelés az emelt logikai feladatok egyik visszatérő családja. Ezekben a feladatokban nem elég számolni, azt is modellezni kell, mi mikor, milyen prioritással és milyen korlátozások mellett történhet meg.",
    estimatedMinutes: "25-35 perc",
    goals: [
      "Tudd felismerni az ütemezési logika fő elemeit: prioritás, sorrend, foglaltság, elérhetőség.",
      "Értsd, mikor kell időrendben és mikor prioritási rendben gondolkodni.",
      "Tudd következetesen kezelni a választási szabályokat és tie-break helyzeteket.",
    ],
    sections: [
      {
        title: "Mi dönti el a sorrendet?",
        paragraphs: [
          "Az ütemezési feladatok akkor lesznek átláthatók, ha külön nevezed meg a rendezőelvet. Mi alapján választunk a lehetőségek közül: korábbi időpont, nagyobb érték, kisebb azonosító, rövidebb időtartam vagy valami összetett szabály?",
          "A sorrendkezelés lényege nem a rendezés önmagában, hanem a kiválasztás logikája. Amint ez tiszta, a kód is sokkal kevésbé lesz ad hoc.",
        ],
        bullets: [
          "A választási szabályt fogalmazd meg mondatban is.",
          "Döntsd el, kell-e teljes rendezés vagy elegendő iteratív kiválasztás.",
          "A tie-break logikát külön teszteld, ne csak reméld, hogy jó lesz.",
        ],
      },
      {
        title: "Foglalt erőforrások és korlátok",
        paragraphs: [
          "Sok ütemezési feladatban ugyanaz az erőforrás nem használható egyszerre több helyen. Ilyenkor nemcsak a sorrendet, hanem a foglaltsági állapotot is modellezni kell.",
          "A jó megoldás ezért nem csak kiválaszt, hanem nyomon is követi, mi elérhető és mi már foglalt. Ettől válik a logika valósághűvé és ellenőrizhetővé.",
        ],
        bullets: [
          "A korlátozott erőforrásokat külön állapotként tartsd nyilván.",
          "Mindig tudd, mikor és miért válik valami újra elérhetővé.",
          "A sorrendi döntés és a foglaltsági frissítés legyen külön logikai lépés.",
        ],
      },
    ],
    pitfalls: [
      "Ne keverd össze a rendezettséget a kiválasztási logikával.",
      "Ne hagyd ki a foglaltsági vagy elérhetőségi korlátokat.",
      "Ne kezeld félvállról a tie-break helyzeteket, mert ott gyakran bukik az emelt megoldás.",
    ],
    quickChecks: [
      "Egy mondatban meg tudod mondani, mi alapján választ a program?",
      "Nyomon követed az erőforrások foglaltságát is, nem csak a sorrendet?",
      "Van külön teszted olyan esetre, ahol több jelölt közül kell választani?",
    ],
  }),
  "emelt-04": authoredLesson({
    intro:
      "Az összetett fájlfeldolgozás emelt szinten már több rétegből áll: nem csak sorokat olvasol, hanem azokból összetett mutatókat, többféle részválaszt és szabályrendszert építesz. A feladat gyakran inkább adatmodell-építés, mint egyszerű beolvasás.",
    estimatedMinutes: "30-40 perc",
    goals: [
      "Tudd a több mezős rekordokat tudatos adattá alakítani.",
      "Értsd, mikor kell több bejárás vagy többféle nézet ugyanarra az adathalmazra.",
      "Tudd úgy szervezni a fájlos megoldást, hogy a részfeladatok ne keveredjenek össze.",
    ],
    sections: [
      {
        title: "Adatmodell a nyers sorok helyett",
        paragraphs: [
          "Emelt szinten a fájlból beolvasott sor ritkán marad önmagában hasznos. A cél az, hogy a rekordokból olyan adatmodellt építs, amelyre a többi kérdés könnyen ráfut.",
          "Ez lehet lista rekordokból, csoportosított dictionary, segédindex vagy többféle nézet ugyanarról az adatról. A lényeg, hogy a további részfeladatok számára a nyers sorok már értelmezett formában álljanak rendelkezésre.",
        ],
        bullets: [
          "A beolvasás után minél hamarabb emeld át az adatot jelentéses mezőkre.",
          "A későbbi részfeladatok igényei alapján döntsd el, kell-e kiegészítő struktúra.",
          "Ne hagyd, hogy a nyers fájlsorok uralják a teljes kódot.",
        ],
      },
      {
        title: "Többrétegű részfeladatok kezelése",
        paragraphs: [
          "Az emelt fájlos feladatokban gyakran van alapösszesítés, szélsőérték, csoportosítás és speciális szabály ugyanazon az adaton. Ezeket logikai rétegekbe kell szervezni.",
          "Minél tudatosabban építed fel ezeket a rétegeket, annál könnyebb lesz később egyetlen kérdést javítani anélkül, hogy a teljes megoldás szétessen.",
        ],
        bullets: [
          "A részfeladatokat kódblokkonként is különítsd el.",
          "Döntsd el, mi oldható meg egyetlen bejárással és mi érdemel külön szakaszt.",
          "Az összetett fájlos kódnál a jó változónevek különösen sokat számítanak.",
        ],
      },
    ],
    pitfalls: [
      "Ne ragadj a nyers fájlsorok szintjén az egész megoldásban.",
      "Ne próbálj minden részfeladatot ugyanazon a cikluson belül átláthatatlanul kiszolgálni.",
      "Ne hagyd, hogy a beolvasási rész és a feldolgozási rész szétválaszthatatlanná váljon.",
    ],
    quickChecks: [
      "A rekordokból épített adatmodell tényleg segíti a részfeladatokat?",
      "Világos, melyik kérdés melyik szerkezetre támaszkodik?",
      "A kódod úgy is olvasható, ha csak egyetlen részfeladatra kellene javítást készíteni?",
    ],
  }),
  "emelt-05": authoredLesson({
    intro:
      "A geometria és mozgás témájú emelt feladatok gyakran azért nehezek, mert egyszerre kérnek koordinátás gondolkodást, állapotfrissítést és szabályellenőrzést. Ezekben a feladatokban a precíz modell fontosabb, mint a látványos ötlet.",
    estimatedMinutes: "25-35 perc",
    goals: [
      "Tudd koordinátákban és irányváltásokban modellezni a mozgást.",
      "Értsd a lépték, irány és határfeltételek szerepét.",
      "Tudd a térbeli vagy útvonal-jellegű feladatot egyszerű állapotmodellé alakítani.",
    ],
    sections: [
      {
        title: "Koordináták mint állapotok",
        paragraphs: [
          "Az ilyen feladatoknál a pozíció nem elvont fogalom, hanem több komponensből álló állapot. Lehet x és y koordináta, lehet irány, lehet megtett út vagy határátlépési állapot is.",
          "A fő sikerfaktor itt az, hogy a mozgás minden lépését ugyanarra a modellre fordítsd le. Amint ez megvan, a geometriai történet hirtelen sima adatfeldolgozássá válik.",
        ],
        examples: [
          {
            title: "Egyszerű koordinátafrissítés",
            code:
              "x = 0\ny = 0\nmozgasok = [\"E\", \"E\", \"N\", \"W\"]\n\nfor lep in mozgasok:\n    if lep == \"E\":\n        x += 1\n    elif lep == \"W\":\n        x -= 1\n    elif lep == \"N\":\n        y += 1\n    else:\n        y -= 1\n\nprint(x, y)",
            output: "1 1",
            explanation:
              "A történet lehet összetettebb, de a modell ugyanaz: egy mozgási utasítás egyértelmű koordinátaváltozást jelent. Az emelt nehézség sokszor csak a további szabályokból jön rá erre az alapra.",
          },
        ],
      },
      {
        title: "Határok, ütközések, speciális helyzetek",
        paragraphs: [
          "Az emelt geometriai feladatok ritkán állnak meg a sima mozgásnál. Gyakran van pályahatár, visszafordulás, blokkolás, távolságmérés vagy valamilyen esemény, amelyet mozgás közben kell figyelni.",
          "A jó megoldás ezért nem csak frissíti a koordinátát, hanem közben ellenőrzi is, hogy az új állapot érvényes-e.",
        ],
        bullets: [
          "A jelölt új pozíciót sokszor külön érdemes kiszámolni.",
          "A határfeltételeket ne keverd össze az irányváltó logikával.",
          "A mozgásból származó mutatókat, például távolságot vagy fordulások számát külön tartsd nyilván.",
        ],
      },
    ],
    pitfalls: [
      "Ne fejben próbáld tartani a koordináták jelentését, nevezd el őket tisztán.",
      "Ne frissítsd azonnal a pozíciót, ha előbb még ellenőrizni kell a határokat.",
      "Ne felejtsd el, hogy a mozgásból másodlagos mutatók is keletkezhetnek.",
    ],
    quickChecks: [
      "Pontosan tudod, mely változók írják le a mozgási állapotot?",
      "Külön kezeled a jelölt új pozíciót és a végleges új állapotot?",
      "A pályahatárok és speciális mozgási szabályok minden lépésben érvényesülnek?",
    ],
  }),
  "emelt-06": authoredLesson({
    intro:
      "A formázott és ASCII kimenet emelt szinten már nem csak sorok pontos kiírását jelenti, hanem gyakran minták, alakzatok vagy többdimenziós gondolkodás precíz megjelenítését. Itt a logika és a vizuális pontosság egyszerre számít.",
    estimatedMinutes: "25-35 perc",
    goals: [
      "Tudd a vizuális vagy táblázatos kimenetet adatmodellé fordítani.",
      "Értsd, hogyan lesz egy minta sorok és oszlopok rendszeréből program.",
      "Tudd ellenőrizni a formátumot karakterpontosan, nem csak ránézésre.",
    ],
    sections: [
      {
        title: "A kimenet mint szerkezet",
        paragraphs: [
          "ASCII és formázott kimenetnél a feladatot gyakran úgy érdemes felfogni, mint sorok vagy cellák előállítását. Nem magát a végső képet kell fejben tartani, hanem az előállítási szabályt.",
          "Ha a kimenetet táblaként vagy sorozatként modellezed, a feladat sokkal kevésbé lesz misztikus és sokkal inkább programozható.",
        ],
        bullets: [
          "Döntsd el, mi a sor és mi az oszlop logikája.",
          "A vizuális mintát fordítsd vissza szabályrendszerre.",
          "A kiírás előtt sokszor érdemes részeredményként soronként gondolkodni.",
        ],
      },
      {
        title: "Karakterpontosság és ellenőrzés",
        paragraphs: [
          "Az ilyen feladatoknál gyakran minden karakter jelentést hordoz. Egy hiányzó szóköz, elcsúszott elválasztó vagy rossz sortörés az egész kimenetet hibássá teheti.",
          "A jó rutin az, hogy a mintaoutputot soronként és mintaszerűen ellenőrzöd. Ne csak nézd, hanem logikailag hasonlítsd a saját szerkezetedhez.",
        ],
        bullets: [
          "A kimenet minden sorára külön szabályod legyen.",
          "A szóköz és a kitöltő karakter ugyanúgy adat, mint a szám vagy betű.",
          "A legkisebb és legnagyobb méretű mintákkal is próbáld ki a megoldást.",
        ],
      },
    ],
    pitfalls: [
      "Ne vizuális benyomás alapján ítéld meg a kimenetet, hanem karakterlogikával.",
      "Ne keverd össze a minta előállítási szabályát magával a kész képpel.",
      "Ne hagyd a formátumellenőrzést a legvégére, mintha apróság lenne.",
    ],
    quickChecks: [
      "Meg tudod mondani, milyen szabály szerint készül minden sor?",
      "A szóközök és kitöltő karakterek is részei a tudatos tervnek?",
      "Próbáltál minimális és maximális méretű mintákat is?",
    ],
  }),
  "emelt-07": authoredLesson({
    intro:
      "A tisztább és hatékonyabb gondolkodás emelt szinten nem feltétlenül bonyolult optimalizálást jelent, hanem azt, hogy észreveszed, mikor válik a naiv megoldás veszélyesen nehézkessé, törékennyé vagy ellenőrizhetetlenné.",
    estimatedMinutes: "20-30 perc",
    goals: [
      "Tudd felismerni a túl sok felesleges bejárásból vagy rossz szerkezetből fakadó kockázatot.",
      "Értsd, mikor kell letisztítani egy naiv ötletet jobb adatútra.",
      "Tudd egyensúlyban tartani a megbízhatóságot, az olvashatóságot és az ésszerű hatékonyságot.",
    ],
    sections: [
      {
        title: "A naiv megoldás felismerése",
        paragraphs: [
          "Nem minden lassabb megoldás rossz, de emelt szinten már számít, ha ugyanazt az adatot sokszor járatod át, vagy bonyolult egymásba ágyazott logikával oldasz meg valamit, amit tisztább szerkezettel is lehetne.",
          "A jó emelt megoldás sokszor nem rövidebb, hanem szervezettebb. Kevesebb véletlen ismétlés, kevesebb rejtett függés, több világos adatútvonal.",
        ],
        bullets: [
          "Figyeld meg, ismételsz-e ugyanazon adatokon feleslegesen.",
          "Keresd meg, mi az a köztes eredmény, amit érdemes egyszer kiszámolni és eltárolni.",
          "Az olvashatóság maradjon elsődleges, a hatékonyság ne legyen öncél.",
        ],
      },
      {
        title: "Refaktorálás vizsga-kompatibilisen",
        paragraphs: [
          "Vizsgán nem teljes újratervezésre van idő, hanem célzott tisztításra. Ha látod, hogy a naiv ötleted törékeny, akkor azt a részt kell átszervezni, ahol a legtöbb ismétlés vagy legnagyobb kockázat jelentkezik.",
          "Ez a lecke azt erősíti meg, hogy a jobb szerkezet nem luxus, hanem a hibamentesebb emelt megoldás egyik feltétele.",
        ],
        bullets: [
          "A refaktorálás célja legyen konkrét: kevesebb bejárás, tisztább állapot, egyszerűbb feltétel.",
          "Ne egyszerre írd újra az egészet, a legkockázatosabb részre fókuszálj.",
          "Az új szerkezetet a régi teszteken is futtasd át.",
        ],
      },
    ],
    pitfalls: [
      "Ne keverd össze a 'komplexebb' és a 'jobb' megoldást.",
      "Ne optimalizálj úgy, hogy közben az ellenőrizhetőség romlik.",
      "Ne hagyd bent a felesleges bejárásokat csak azért, mert a kis mintán még elfutnak.",
    ],
    quickChecks: [
      "Meg tudod mondani, hol ismétli magát feleslegesen a megoldásod?",
      "A tisztább adatútvonal csökkenti a hibalehetőséget is?",
      "Az átszervezett kód ugyanazokon a teszteken stabil marad?",
    ],
  }),
  "emelt-08": authoredLesson({
    intro:
      "Az összetett validáció és szabályrendszer az emelt feladatok egyik legnehezebb pontja, mert itt több feltétel egyszerre hat egymásra. Nem különálló 'ha' mondatokról van szó, hanem kölcsönhatásban lévő szabályokról.",
    estimatedMinutes: "25-35 perc",
    goals: [
      "Tudd rétegekben kezelni a többfeltételes szabályrendszereket.",
      "Értsd, mely feltételek kizárják, melyek módosítják és melyek engedik a normál működést.",
      "Tudd a validációt olvasható és tesztelhető szerkezetben megírni.",
    ],
    sections: [
      {
        title: "Szabályrétegek és kölcsönhatások",
        paragraphs: [
          "Az emelt validációban gyakran több szint fut együtt: formai megfelelés, tartalmi korlátok, kivételek és speciális felülírások. Ha ezt egyetlen if-láncba sűríted, nagyon gyorsan olvashatatlan lesz.",
          "Jobb stratégia a szabályokat rétegekbe rendezni: mi az alapelv, mi a kizáró feltétel, mi a kivételes feloldás, és mi a végső döntés.",
        ],
        bullets: [
          "A szabályrendszert előbb írd le szavakkal, csak utána kódold.",
          "Különítsd el a kizáró és a módosító szabályokat.",
          "A végső döntési pont legyen jól látható a kódban.",
        ],
      },
      {
        title: "Tesztelés bonyolult szabályrendszerre",
        paragraphs: [
          "Minél összetettebb a validáció, annál fontosabb a célzott tesztmátrix. Nem elég egyetlen helyes és egyetlen hibás eset; a szabályok kombinációit is tudatosan le kell fedni.",
          "A jó tesztek itt nem hosszúak, hanem pontosak. Mindegyiknek van egy kijelölt szerepe: ezt a kivételt ellenőrzi, azt a kizárást, amaz a többfeltételes ütközést.",
        ],
        bullets: [
          "Minden külön szabályhoz legyen legalább egy célzott teszted.",
          "A szabályok ütközését is próbáld ki, ne csak külön-külön őket.",
          "A legveszélyesebb az a helyzet, amikor több feltétel egyszerre igaz.",
        ],
      },
    ],
    pitfalls: [
      "Ne próbáld az egész szabályrendszert egyetlen összetett feltételbe besűríteni.",
      "Ne hagyd ki a szabályok kölcsönhatásait a tesztelésből.",
      "Ne csak azt ellenőrizd, mikor érvényes valami, hanem azt is, mikor kell elutasítani.",
    ],
    quickChecks: [
      "Külön tudod sorolni az alap-, kizáró- és kivételszabályokat?",
      "Van teszted olyan esetre, amikor több szabály egyszerre lép működésbe?",
      "A végső döntési pont a kódban is jól látszik?",
    ],
  }),
  "emelt-09": authoredLesson({
    intro:
      "A teljes emelt mintafeladat bontása annak a próbája, hogy a külön tanult technikákat valódi, hosszú feladathelyzetben is össze tudod-e kapcsolni. Itt már nem mintákat gyakorolsz külön, hanem teljes megoldási ívet viszel végig.",
    estimatedMinutes: "35-45 perc",
    goals: [
      "Tudd a teljes promptot strukturált megoldási tervvé alakítani.",
      "Értsd, hogyan kapcsolódik össze a beolvasás, a részfeladat-bontás, az állapotkezelés és az ellenőrzés.",
      "Tudd a hosszabb emelt feladatot kontroll alatt tartani részellenőrzési pontokkal.",
    ],
    sections: [
      {
        title: "Promptból implementációs váz",
        paragraphs: [
          "A teljes mintafeladatnál a legfontosabb első lépés, hogy ne a kódra ugorj, hanem a promptot szerkezetté alakítsd. Melyek az adatforrások, mi a központi modell, hol vannak a részfeladatok és melyik kérdés milyen adatot használ?",
          "Ez a fajta bontás már közel áll a valódi emelt vizsgarutinhoz. Ha jól megy, sokkal kevesebb lesz a kapkodás és a teljes újraírás.",
        ],
        bullets: [
          "Készíts részfeladat-listát és jelöld a köztük lévő függéseket.",
          "A feladat egészére tervezz ellenőrzési pontokat, ne csak a végére.",
          "A kód szerkezete kövesse a prompt logikai szerkezetét.",
        ],
      },
      {
        title: "Részellenőrzés hosszú feladat közben",
        paragraphs: [
          "Emelt feladatnál nem elég a végén reménykedni. Sokkal jobb stratégia részfeladatonként zárni a megoldást: működik-e a beolvasás, reálisak-e a köztes mutatók, kijön-e az első válasz, egyezik-e a speciális eset kezelése.",
          "Ettől a hosszú feladat nem egy törékeny egész lesz, hanem több ellenőrizhető blokk együttese.",
        ],
        bullets: [
          "A köztes eredményeket is merd röviden ellenőrizni saját mintával.",
          "A részfeladatok készültségét külön kezeld, ne csak a teljes programét.",
          "Ha valami elromlik, előbb lokalizáld a hibás blokkot, utána javíts.",
        ],
      },
    ],
    pitfalls: [
      "Ne próbáld az egész emelt feladatot egyetlen lendületből, szerkezeti váz nélkül megírni.",
      "Ne csak a végső outputot ellenőrizd, a köztes lépések is fontosak.",
      "Ne veszítsd el a részfeladatok határait, mert ettől válik kontrollálhatatlanná a kód.",
    ],
    quickChecks: [
      "A promptból külön listázni tudod a részfeladatokat és függéseiket?",
      "Van világos ellenőrzési pontod a hosszú feladat több helyén is?",
      "A szerkezeted akkor is olvasható marad, ha egyetlen részfeladatot kell újranyitni?",
    ],
    practiceHint:
      "A kapcsolódó emelt workspace-et itt már teljes vizsgaszimulációként kezeld: tervezés, kivitelezés, részellenőrzés, végső kontroll.",
  }),
  "emelt-10": authoredLesson({
    intro:
      "Az emelt próbaérettségi stratégia a technikai tudást vizsgakompetenciává fordítja. Itt már nem az a fő kérdés, tudsz-e megoldani egy mintát, hanem az, hogyan hozol megbízható eredményt nyomás alatt, részpontmentéssel és tudatos önellenőrzéssel.",
    estimatedMinutes: "20-30 perc",
    goals: [
      "Tudd beosztani az idődet hosszabb emelt feladatok alatt.",
      "Építs részpontmentő gondolkodást a teljes megoldás helyett vagy mellett.",
      "Használj tudatos végellenőrző rutint emelt szintű feladatnál is.",
    ],
    sections: [
      {
        title: "Idő és részpontok kezelése",
        paragraphs: [
          "Emelt szinten könnyű túl sok időt tölteni egyetlen makacs részlettel. A jobb stratégia az, hogy előbb a stabilan megszerezhető pontokra építesz, és csak utána küzdesz a legnehezebb finomságokkal.",
          "A részpontmentés nem félmegoldás, hanem tudatos vizsgatechnika. Sokkal jobb egy jól működő váz és több kész rész, mint egy félkész, de túl ambiciózus teljes megoldás.",
        ],
        bullets: [
          "A fő szerkezetet minél előbb zárd le működőképesre.",
          "A kockázatos finomságokat csak stabil alap után vedd elő.",
          "Mindig tudd, mi az a következő pontszerző lépés, nem csak azt, mi a legérdekesebb.",
        ],
      },
      {
        title: "Emelt végellenőrzés",
        paragraphs: [
          "Az emelt végellenőrzés már nem csak kimeneti formai kontroll, hanem szerkezeti kontroll is: biztos jó a kivételes eset, helyes az állapotfrissítési sorrend, működik a tie-break, nem maradt félkész részfeladat?",
          "A legerősebb rutin az, ha van saját fix ellenőrző listád, amit a beadás előtt mindig végigmész. Ettől lesz stabil a teljesítményed, nem csak egyszeri szerencsés.",
        ],
        bullets: [
          "Külön ellenőrizd a kritikus részfeladatokat és kivételeket.",
          "A formai pontosságot az utolsó körben is nézd át.",
          "A beadás előtt tudd megmondani, melyik részek biztosak és melyek maradtak kockázatosak.",
        ],
      },
    ],
    pitfalls: [
      "Ne akarj mindent tökéletesíteni a fő pontszerző részek lezárása előtt.",
      "Ne add be úgy, hogy a kivételes esetekre nem volt külön ellenőrzésed.",
      "Ne csak az idő fogyását figyeld, hanem a megszerzett biztos pontokat is.",
    ],
    quickChecks: [
      "Van stratégiád arra, hogyan mentesz részpontot, ha szorít az idő?",
      "A végellenőrző rutinod külön kitér a kritikus emelt hibákra?",
      "Tudod, mikor kell elengedni egy bizonytalan finomságot a stabilabb eredmény érdekében?",
    ],
    practiceHint:
      "Ezt a blokkot érdemes teljes emelt mockkal összekötni, és utána külön visszanézni, hol veszítettél volna pontot nem algoritmikai, hanem vizsgastratégiai okból.",
  }),
  "review-01": authoredLesson({
    intro:
      "A vegyes hibaminták blokk célja nem új témák tanítása, hanem a visszatérő hibák felismerése és javítása. Itt abból tanulsz, ami a vizsgán a legtöbb pontot viszi el: rossz input, hibás feltétel, elcsúszott állapotfrissítés, pontatlan output.",
    estimatedMinutes: "20-30 perc",
    goals: [
      "Tudd a hibákat típus szerint csoportosítani, ne csak egyenként javítgatni.",
      "Értsd, melyik hibatípus milyen ellenőrzési rutinnal fogható meg.",
      "Használd a hibajavítást tudatos ismétlésként, ne puszta foltozásként.",
    ],
    sections: [
      {
        title: "Hibatípusok szerint gondolkodj",
        paragraphs: [
          "A javítás sokkal gyorsabb, ha nem csak azt látod, hogy 'rossz lett', hanem azt is, milyen kategóriába esik a hiba. Másképp kell javítani a formázást, másképp a ciklushatárt és másképp a szabályértelmezést.",
          "A cél az, hogy a hiba ne egyszeri botlás legyen, hanem felismerhető minta. Így a következő feladatnál már a megelőzésen lesz a hangsúly.",
        ],
        bullets: [
          "Formai hiba: kimenet, szóköz, sorrend, címke.",
          "Logikai hiba: rossz feltétel, rossz frissítés, rossz sorrend.",
          "Adatkezelési hiba: rossz típus, rossz beolvasás, rossz rekordértelmezés.",
        ],
      },
      {
        title: "Javításból ismétlés",
        paragraphs: [
          "A jó hibajavítás nem ér véget a konkrét hiba eltüntetésével. Érdemes megfogalmazni, milyen ellenőrző kérdéssel lehetett volna ezt korábban kiszűrni.",
          "Így minden javított hiba egy új védekező rutin alapja lesz. Ez különösen fontos a vizsgát megelőző hetekben.",
        ],
        bullets: [
          "Minden javított hibához rendelj egy rövid ellenőrző kérdést.",
          "A hibát okozó mintát külön próbáld ki még egy hasonló feladaton.",
          "Ne csak a javított végeredményt nézd, hanem azt is, mi vezetett a téves útra.",
        ],
      },
    ],
    pitfalls: [
      "Ne kezeld a hibát puszta véletlenként, ha valójában visszatérő mintát mutat.",
      "Ne csak kijavítsd, hanem értsd is meg, hogyan csúszott be.",
      "Ne egyszerre túl sok hibát javíts kontroll nélkül, lokalizáld őket külön.",
    ],
    quickChecks: [
      "Meg tudod nevezni, milyen kategóriába tartozik a hiba?",
      "Van hozzá olyan ellenőrző kérdés, amellyel korábban is kiszűrhető lett volna?",
      "A javítás után újra lefuttattad ugyanarra és hasonló esetre is?",
    ],
  }),
  "review-02": authoredLesson({
    intro:
      "A teljes közép próbaérettségi célja, hogy a különálló közép rutinokat egyetlen, időre megoldandó helyzetben is biztosan tudd használni. Itt a tudás már nem részekben, hanem vizsgafolyamatként mérődik.",
    estimatedMinutes: "30-40 perc",
    goals: [
      "Tudd a közép szintű feladattípusokat vizsgahelyzetben is stabilan kombinálni.",
      "Értsd, hogyan kell időre dolgozni anélkül, hogy szétesne az ellenőrzési rutin.",
      "Tanuld meg utólag kiértékelni, hol vesztettél volna pontot.",
    ],
    sections: [
      {
        title: "Közép mock vizsgaként, nem sima gyakorlóként",
        paragraphs: [
          "A próbaérettségit nem érdemes laza gyakorlóként kezelni. Akkor ad valós képet, ha időkeretben, megszakítás nélkül és a végén célzott önértékeléssel végzed végig.",
          "A cél nem csak a helyes megoldás, hanem a vizsganapi ritmus felépítése: olvasás, tervezés, kivitelezés, ellenőrzés, beadás.",
        ],
        bullets: [
          "Tartsd a közép szinthez tervezett időkeretet.",
          "A mock közben ne nézz megoldást és ne javíts végtelenül egy részleten.",
          "A végén külön írd fel, mely pontok voltak biztosak és melyek voltak kockázatosak.",
        ],
      },
      {
        title: "Utólagos kiértékelés",
        paragraphs: [
          "A mock akkor tanít a legtöbbet, ha utólag nem csak azt nézed, hány pont lett, hanem azt is, hol és miért ment el idő vagy pont. Lehet algoritmikai, formai vagy stratégiai ok.",
          "Ez az utólagos visszanézés készíti elő a célzott ismétlést és a személyre szabott javító utat.",
        ],
        bullets: [
          "Külön listázd a technikai és a stratégiai hibákat.",
          "Nézd meg, mely hibák jönnek vissza több mockban is.",
          "A következő gyakorlási blokkot ezekre a visszatérő hibákra építsd.",
        ],
      },
    ],
    pitfalls: [
      "Ne csak a végeredményt nézd, a megoldási folyamat is értékelendő.",
      "Ne törd meg a mockot folyamatos külső segítséggel, mert így torz képet kapsz.",
      "Ne hagyd a kiértékelést általános érzések szintjén, nevezd meg a konkrét hibákat.",
    ],
    quickChecks: [
      "Valódi vizsgahelyzetként kezelted a mockot?",
      "Meg tudod mondani, mely hibák voltak algoritmikai és melyek stratégiai jellegűek?",
      "A következő gyakorlási lépésed konkrétan ebből a mockból következik?",
    ],
  }),
  "review-03": authoredLesson({
    intro:
      "A teljes emelt próbaérettségi már nem csak tudást, hanem terhelés alatti szervezettséget is mér. Itt dől el, hogy a hosszabb feladatoknál is képes vagy-e higgadt szerkezeti gondolkodásra és részpontmentésre.",
    estimatedMinutes: "35-45 perc",
    goals: [
      "Tudd az emelt rutinokat időnyomás alatt is működtetni.",
      "Értsd, hogyan kell hosszabb feladatnál is kontroll alatt tartani a szerkezetet.",
      "Használj tudatos részpont- és végellenőrzési stratégiát teljes emelt mockban.",
    ],
    sections: [
      {
        title: "Szerkezetmegtartás nyomás alatt",
        paragraphs: [
          "Az emelt mock egyik fő tanulsága az, hogy a jó szerkezet időnyomás alatt is védi a megoldást. Ha kapkodsz és elveszíted a részfeladatok határát, a hibák gyorsan láncreakcióvá válnak.",
          "Ezért az emelt próba során különösen fontos, hogy a tervezésre szánt rövid időt ne spórold meg. A jó váz sok perc kapkodást vált ki később.",
        ],
        bullets: [
          "A hosszabb feladat elején mindig legyen rövid szerkezeti terv.",
          "A részfeladatok készültségét menet közben is tudd nyomon követni.",
          "A bizonytalan részeket jelöld meg, ne hagyd őket névtelen ködben.",
        ],
      },
      {
        title: "Emelt mock utóértékelés",
        paragraphs: [
          "Emelt szinten a kiértékelés egyik fő kérdése az, hogy hol ment el a kontroll: a problémabontásnál, a szabályértelmezésnél, az állapotkezelésnél vagy a végellenőrzésnél. Ez sokkal hasznosabb, mint pusztán annyit látni, hogy kevés lett a pont.",
          "Ha a hibát a folyamat egy konkrét pontjához tudod kötni, abból célzott javító terv lesz. Ez különbözteti meg a tudatos felkészülést a puszta ismétléstől.",
        ],
        bullets: [
          "A szerkezeti, logikai és formai hibákat külön kategóriázd.",
          "Nézd meg, hol omlott össze a részpontmentő stratégia, ha összeomlott.",
          "A következő emelt gyakorlást a legnagyobb kontrollvesztési pontra építsd.",
        ],
      },
    ],
    pitfalls: [
      "Ne csak az algoritmust hibáztasd, ha valójában a szerkezeti terv hiányzott.",
      "Ne becsüld alá az emelt mock eleji tervezés értékét.",
      "Ne zárd le a kiértékelést annyival, hogy 'legközelebb jobban figyelek'.",
    ],
    quickChecks: [
      "Meg tudod nevezni, a folyamat mely pontján vesztetted el leginkább a kontrollt?",
      "A részpontmentés működött, vagy túl sokáig ragadtál egyetlen bizonytalan részletben?",
      "A következő emelt blokkod konkrétan erre a gyenge pontra épül?",
    ],
  }),
  "review-04": authoredLesson({
    intro:
      "A személyre szabott felzárkóztatás azt a szemléletet erősíti meg, hogy nem mindenki ugyanott hibázik. A jó javító út nem általános ismétlés, hanem tudatos visszatérés azokhoz a skill-ekhez, amelyek valóban instabilak maradtak.",
    estimatedMinutes: "20-30 perc",
    goals: [
      "Tudd a hibákat konkrét skill-hiányokhoz kötni.",
      "Értsd, hogyan lesz a submission historyból célzott ismétlési terv.",
      "Tanuld meg rövid javító körökben megerősíteni a valóban gyenge területeket.",
    ],
    sections: [
      {
        title: "Hibából skill-gap",
        paragraphs: [
          "A felzárkóztatás akkor hatékony, ha a hibát nem csak feladatszinten nézed, hanem mögöttes készségszinten is. Nem az a fő kérdés, hogy melyik feladat ment rosszul, hanem hogy milyen rutin hiányzott mögüle.",
          "Ez a gondolkodás készíti elő a későbbi AI-ajánlásokat és a valóban személyre szabott tanulási útvonalat is.",
        ],
        bullets: [
          "Kösd a hibát készségcímkéhez: input, validáció, állapotkezelés, formázás, problémabontás.",
          "A visszatérő hibák fontosabbak, mint az egyszeri megbotlások.",
          "A javító terv mindig skillből induljon, ne pusztán feladatsorszámból.",
        ],
      },
      {
        title: "Rövid, célzott javító ciklusok",
        paragraphs: [
          "A felzárkóztatás nem végtelen újratanulás. Hatékonyabb, ha rövid ciklusokban dolgozol: egy skill, egy vagy két kapcsolódó feladat, célzott önellenőrzés, majd újramérés.",
          "Ez segít elkerülni azt, hogy a diák egyszerre túl sok gyengeséget próbáljon javítani. A fókuszált blokk gyorsabb fejlődést ad és jobban visszamérhető.",
        ],
        bullets: [
          "Egyszerre egy fő gyenge skillre fókuszálj.",
          "A javító blokk végén mindig legyen visszamérés.",
          "A javulást ne érzésre, hanem újrafutó feladattal vagy mock-részlettel nézd.",
        ],
      },
    ],
    pitfalls: [
      "Ne általános ismétléssel próbálj skill-hiányt javítani.",
      "Ne akarj egyszerre minden gyengeségen dolgozni.",
      "Ne hagyd visszamérés nélkül a javító blokkot, mert így nem derül ki, valóban javultál-e.",
    ],
    quickChecks: [
      "Minden gyenge feladathoz tudsz mögöttes skill-hiányt rendelni?",
      "A következő javító köröd egyetlen fő fókuszra épül?",
      "A javító gyakorlás végén lesz konkrét visszamérésed is?",
    ],
    practiceHint:
      "Ezt a blokkot érdemes a submission historyval együtt használni: nézd végig, mely hibák ismétlődnek, és azokra építs rövid, célzott felzárkóztató köröket.",
  }),
};

function toSentenceCase(text: string) {
  if (!text) {
    return text;
  }

  return text.charAt(0).toLowerCase() + text.slice(1);
}

function buildFallbackLessonArticle(input: LessonArticleInput): LessonArticle {
  const relatedPracticeBullets = input.resourceLinks.slice(0, 3).map(
    (link) => `${link.badge}: ${link.title} - ${link.reason}`,
  );

  return {
    intro:
      `${input.title} azért került a ${input.phaseTitle} blokkba, mert ${toSentenceCase(input.summary)}. Ez a lecke már nem csak témacímet ad, hanem egy végigvihető tanulási fókuszt: értsd meg a mintát, bontsd lépésekre, majd gyakorlófeladaton rögzítsd.`,
    estimatedMinutes: "20-30 perc",
    goals: [
      input.summary,
      input.examValue,
      "Tudd a témát egy saját mintabemeneten is végigkövetni, ne csak felismerni a nevét.",
    ],
    sections: [
      {
        title: "Mit kell észrevenni ebben a témában?",
        paragraphs: [
          `A lecke fő kérdése: hogyan jelenik meg a ${toSentenceCase(input.title)} a valódi vizsgafeladatokban. Nem a definíció a fontos, hanem hogy felismerd, mikor kell ezt a mintát elővenni.`,
          `A ${input.phaseAudience.toLowerCase()} szánt blokkban ez azért lényeges, mert ${toSentenceCase(input.examValue)}`,
        ],
        bullets: [
          "Előbb a feladat logikáját tisztázd, csak utána írj kódot.",
          "Ne csak a megoldást keresd, hanem azt is, milyen állapotok és részlépések keletkeznek közben.",
          "A mintabemeneteket mindig tudatosan válaszd meg: normál eset, határeset, hibára hajlamos eset.",
        ],
      },
      {
        title: "Hogyan gyakorold tovább?",
        paragraphs: [
          "A lecke akkor válik valódi tudássá, ha rögtön átfordítod gyakorlásba. A kapcsolódó workspace-ek ezért nem különálló extrák, hanem ennek a tananyagnak a folytatásai.",
          "Először oldd meg lassan és magyarázhatóan a kapcsolódó feladatot, csak utána törekedj tempóra vagy rövidebb kódra.",
        ],
        bullets:
          relatedPracticeBullets.length > 0
            ? relatedPracticeBullets
            : [
                "Ha még nincs kapcsolódó workspace, készíts saját kézi mintát és vezesd végig rajta a logikát.",
                "A feladatszövegből írd ki külön a bemenetet, a szabályokat és a kimenetet.",
                "Minden próbánál ellenőrizd a formai pontosságot is, ne csak a logikai eredményt.",
              ],
      },
    ],
    pitfalls: [
      "Ne ugorj rögtön kódolásra anélkül, hogy a részlépések világosak lennének.",
      "Ne csak egyetlen szép mintabemenettel ellenőrizd a megoldást.",
      "Ne feledd, hogy a vizsgaérték nem elméleti címke, hanem konkrét pontmentő rutin.",
    ],
    quickChecks: [
      "Egy mondatban el tudod mondani, mikor kell ezt a mintát használni?",
      "Tudsz hozzá saját, kézzel is ellenőrizhető mintabemenetet írni?",
      "Világos számodra, hogy pontosan mit kellene kiírnia a programnak?",
    ],
    practiceHint:
      input.resourceLinks[0]?.reason ??
      "Ezt a leckét akkor érdemes késznek tekinteni, ha legalább egy kapcsolódó feladatot önállóan végigviszel.",
    authored: false,
  };
}

export function hasDetailedLessonArticle(lessonId: string) {
  return Boolean(
    lessonArticleOverrides[lessonId] ??
      additionalSharedAndKozepLessonArticleOverrides[lessonId] ??
      additionalEmeltAndReviewLessonArticleOverrides[lessonId],
  );
}

export function getLessonArticle(input: LessonArticleInput): LessonArticle {
  return (
    lessonArticleOverrides[input.id] ??
    additionalSharedAndKozepLessonArticleOverrides[input.id] ??
    additionalEmeltAndReviewLessonArticleOverrides[input.id] ??
    buildFallbackLessonArticle(input)
  );
}