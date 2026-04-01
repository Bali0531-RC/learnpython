export type MockExamTaskSlot = {
  taskId: string;
  timebox: string;
  reason: string;
};

export type MockExamPack = {
  id: string;
  track: "kozep" | "emelt";
  level: "Közép" | "Emelt";
  title: string;
  duration: string;
  theme: string;
  summary: string;
  focus: string[];
  instructions: string[];
  taskSlots: MockExamTaskSlot[];
};

const kozepMockPacks: MockExamPack[] = [
  {
    id: "kozep-gyors-rahangolo",
    track: "kozep",
    level: "Közép",
    title: "Gyors ráhangoló",
    duration: "80 perc",
    theme: "alaprutinok és tiszta output",
    summary:
      "Rövid, biztosan megfogható közép pack bemelegítésre: alap parsing, számlálás, egyszerű szimuláció és egy könnyebb rangsorolás.",
    focus: [
      "gyors bemenetfeldolgozás",
      "külön soros kimenet",
      "hibamentes alapszámítás",
    ],
    instructions: [
      "Először a legegyenesebb két feladatot oldd meg teljesen, csak utána menj a hosszabbakra.",
      "A végén legalább egyszer olvasd vissza a kiírás sorrendjét minden feladatnál.",
    ],
    taskSlots: [
      { taskId: "sorfigyelo", timebox: "12 perc", reason: "gyors összegzés és maximum" },
      { taskId: "uzsonnakeret", timebox: "12 perc", reason: "számolási rutin és küszöbfigyelés" },
      { taskId: "buszora", timebox: "16 perc", reason: "időpontkezelés nyomás alatt" },
      { taskId: "lampasor", timebox: "18 perc", reason: "egyszerű állapotszimuláció" },
      { taskId: "ponttabla", timebox: "22 perc", reason: "rekordos lezáró feladat" },
    ],
  },
  {
    id: "kozep-kodmintak",
    track: "kozep",
    level: "Közép",
    title: "Kódminták",
    duration: "85 perc",
    theme: "sztringvalidáció és formaellenőrzés",
    summary:
      "Az egész pack a közép szinten visszatérő formai szabályokra épül, több azonosítós kontextussal és egy rövid levezető eredményfeladattal.",
    focus: ["hossz-ellenőrzés", "prefix és suffix vizsgálat", "lexikografikus minimum"],
    instructions: [
      "Írj külön, fejben követhető szabálylistát minden feladat elé, és csak utána kódolj.",
      "Ha egy kód nem érvényes, ne próbáld részlegesen is beleszámolni semmilyen statisztikába.",
    ],
    taskSlots: [
      { taskId: "rajtlista", timebox: "15 perc", reason: "alap kódellenőrzés" },
      { taskId: "jegykod", timebox: "15 perc", reason: "hosszabb suffix kezelése" },
      { taskId: "polccimke", timebox: "15 perc", reason: "hasonló szabály más történetben" },
      { taskId: "szekrenykulcs", timebox: "15 perc", reason: "hibás minták szűrése" },
      { taskId: "teremjel", timebox: "20 perc", reason: "záró validáció nyugodt tempóval" },
    ],
  },
  {
    id: "kozep-idokezeles",
    track: "kozep",
    level: "Közép",
    title: "Időkezelés",
    duration: "90 perc",
    theme: "óra-perc átalakítások és szélsőértékek",
    summary:
      "Közép mock, amely kizárólag időpontokból és időablakokból építkezik, hogy a percekre bontás automatikussá váljon.",
    focus: ["HH:MM parsing", "minimum és maximum", "küszöb utáni darabszám"],
    instructions: [
      "Minden feladat elején rögtön alakítsd percekké az időpontokat, ne többféleképp kezeld őket ugyanazon belül.",
      "A visszaalakítást csak a legvégén csináld meg, amikor már biztos a minimum és a maximum értéke.",
    ],
    taskSlots: [
      { taskId: "buszora", timebox: "16 perc", reason: "alap időpontkezelés" },
      { taskId: "csengorend", timebox: "16 perc", reason: "szünetes adatsor" },
      { taskId: "futamido", timebox: "18 perc", reason: "sportos környezetben ugyanaz a minta" },
      { taskId: "szunetfigyelo", timebox: "18 perc", reason: "rövidebb, de figyelmes parsing" },
      { taskId: "idobeosztas", timebox: "22 perc", reason: "lezáró vegyes időpontfeladat" },
    ],
  },
  {
    id: "kozep-fajlos-elso",
    track: "kozep",
    level: "Közép",
    title: "Első fájlos kör",
    duration: "95 perc",
    theme: "egyszerű fájlbeolvasás és rekordösszegzés",
    summary:
      "Az első olyan közép pack, ahol minden feladat csatolt adatfájlból dolgozik, de a részfeladatok továbbra is rövidek és jól elkülönülnek.",
    focus: ["fájl megnyitása", "rekordlista építése", "rekordszintű maximum és összegzés"],
    instructions: [
      "Minden feladatnál egyszer olvasd be a fájlt, és ugyanabból a listából oldj meg mindent.",
      "Ne írj vissza a fájlba, a mock minden eleme csak olvasási helyzetet modellez.",
    ],
    taskSlots: [
      { taskId: "osztalykirandulas", timebox: "18 perc", reason: "belépő fájlos rutin" },
      { taskId: "sportkor", timebox: "18 perc", reason: "csoportos adatok összesítése" },
      { taskId: "menzahet", timebox: "18 perc", reason: "napszerű rekordok" },
      { taskId: "konyvkolcsonzes", timebox: "18 perc", reason: "nyitott mennyiségek kezelése" },
      { taskId: "vizallas", timebox: "23 perc", reason: "szélsőértékes záró feladat" },
    ],
  },
  {
    id: "kozep-allapotok",
    track: "kozep",
    level: "Közép",
    title: "Állapotok",
    duration: "90 perc",
    theme: "egylépéses szimulációk és terheléskövetés",
    summary:
      "Közép szintű állapotszimulációs pack, ahol minden feladat egyetlen fő változó mentén halad, de figyelni kell a blokkolt műveletekre.",
    focus: ["következő állapot számítása", "érvénytelen lépések kezelése", "maximumkövetés"],
    instructions: [
      "Soha ne írd át az állapotot közvetlenül, előbb számold ki a következőt és ellenőrizd a korlátot.",
      "A blokkolt művelet nem módosít, de a darabszámba beleszámít.",
    ],
    taskSlots: [
      { taskId: "liftnaplo", timebox: "15 perc", reason: "emeletmodell" },
      { taskId: "karszalag", timebox: "15 perc", reason: "bentlétszám" },
      { taskId: "parkolohaz", timebox: "18 perc", reason: "kapacitáskorlát" },
      { taskId: "termosztat", timebox: "18 perc", reason: "felső és alsó határ" },
      { taskId: "buszkor", timebox: "24 perc", reason: "összetettebb, de még egyváltozós zárófeladat" },
    ],
  },
  {
    id: "kozep-rangsorok",
    track: "kozep",
    level: "Közép",
    title: "Rangsorok",
    duration: "95 perc",
    theme: "pontösszegzés és abc tie-break",
    summary:
      "Öt rangsoroló feladat egymás után, hogy a rekordfeldolgozás és a tie-break logika automatikussá váljon közép szinten.",
    focus: ["összpontszám képzése", "győztes kiválasztása", "küszöb feletti darabszám"],
    instructions: [
      "Először minden résztvevőhöz képezd a teljes pontszámot, csak utána keresd a győztest.",
      "Azonos pontnál mindig név szerint dönts, és ezt a szabályt következetesen tartsd végig.",
    ],
    taskSlots: [
      { taskId: "locsolokor", timebox: "18 perc", reason: "gyors csapatpontozás" },
      { taskId: "ponttabla", timebox: "18 perc", reason: "klasszikus versenyzős rekordok" },
      { taskId: "suti-verseny", timebox: "18 perc", reason: "eltérő környezet, azonos logika" },
      { taskId: "teremliga", timebox: "18 perc", reason: "bajnoki összegzés" },
      { taskId: "celdobas", timebox: "23 perc", reason: "lezáró rangsorolási rutin" },
    ],
  },
  {
    id: "kozep-meresi-mix",
    track: "kozep",
    level: "Közép",
    title: "Mérési mix",
    duration: "85 perc",
    theme: "mérési adatok és készletjellegű számlálás",
    summary:
      "Ez a pack különböző mérési és készletjellegű történeteket kever, de mind ugyanazt a gyűjtési rutint mélyíti el.",
    focus: ["összegzés", "maximumkeresés", "riasztási küszöb"],
    instructions: [
      "Ne próbálj új mintát keresni minden történetben, inkább ismerd fel a közös struktúrát.",
      "A kimeneti sorrend minden feladatban ugyanilyen fontos, mint maga a számolás.",
    ],
    taskSlots: [
      { taskId: "palacknap", timebox: "12 perc", reason: "gyors bemelegítés" },
      { taskId: "vizora", timebox: "12 perc", reason: "fogyasztási adatsor" },
      { taskId: "akkuszint", timebox: "12 perc", reason: "digitális környezetű változat" },
      { taskId: "buszmegallo", timebox: "14 perc", reason: "utaslétszámos minta" },
      { taskId: "hofokor", timebox: "16 perc", reason: "mérési záróelem" },
      { taskId: "raktarpolc", timebox: "19 perc", reason: "készletállapotos lezárás" },
    ],
  },
  {
    id: "kozep-vegyes-iskolai",
    track: "kozep",
    level: "Közép",
    title: "Vegyes iskolai kör",
    duration: "90 perc",
    theme: "iskolai adminisztrációs és órarendi helyzetek",
    summary:
      "Vegyes közép mock olyan feladatokból, amelyek mind iskolai környezetből jönnek, ezért jó vizsga előtti átmozgatásnak.",
    focus: ["azonosítók", "időpontok", "egyszerű rangsorok", "fájlos rutin"],
    instructions: [
      "Kezdd a leginkább ismerős szerkezettel, ne feltétlenül a lista elején szereplő feladattal.",
      "Ha egy feladat elakad, jelöld meg a részpontig biztos részeket, és menj tovább.",
    ],
    taskSlots: [
      { taskId: "teremjel", timebox: "14 perc", reason: "rövid nyitó validáció" },
      { taskId: "csengorend", timebox: "16 perc", reason: "időkezelési blokk" },
      { taskId: "kapunyitas", timebox: "16 perc", reason: "állapotszimuláció" },
      { taskId: "osztalykirandulas", timebox: "20 perc", reason: "fájlos rutin" },
      { taskId: "eredmenytabla", timebox: "24 perc", reason: "záró rekordfeldolgozás" },
    ],
  },
  {
    id: "kozep-rutin-plusz",
    track: "kozep",
    level: "Közép",
    title: "Rutin plusz",
    duration: "95 perc",
    theme: "különböző típusok gyors váltása",
    summary:
      "Olyan pack, ahol minden új feladat más készségcsaládból jön, ezért a vizsga közbeni gyors mentális váltást gyakoroltatja.",
    focus: ["feladattípus-felismerés", "tempóváltás", "részpontmentés"],
    instructions: [
      "Minden új feladat előtt fél percben nevezd meg magadnak, hogy milyen alapsémába tartozik.",
      "Ne tölts túl sok időt a szépre írt kóddal: itt a stabil, gyors megoldás a cél.",
    ],
    taskSlots: [
      { taskId: "pultkod", timebox: "14 perc", reason: "sztringes nyitás" },
      { taskId: "teremberlet", timebox: "16 perc", reason: "időpontkezelés" },
      { taskId: "lepcsojarat", timebox: "16 perc", reason: "korlátos állapot" },
      { taskId: "jegyeladas", timebox: "20 perc", reason: "fájlos összegzés" },
      { taskId: "csapatsorrend", timebox: "24 perc", reason: "lezáró rangsorolás" },
    ],
  },
  {
    id: "kozep-teljes-proba",
    track: "kozep",
    level: "Közép",
    title: "Teljes próba",
    duration: "100 perc",
    theme: "vizsgaszerű közép mix",
    summary:
      "A legkiegyensúlyozottabb közép mock: validáció, adatsor, szimuláció, fájl és rangsor egyetlen teljes csomagban.",
    focus: ["tempó", "hibamentes output", "széles készséglefedés"],
    instructions: [
      "Próbáld valódi közép vizsgahelyzetként kezelni: nincs külső segítség, nincs végtelen újraírás.",
      "A végén maradjon legalább 8-10 perced kizárólag ellenőrzésre.",
    ],
    taskSlots: [
      { taskId: "sorfigyelo", timebox: "12 perc", reason: "biztos belépő feladat" },
      { taskId: "rajtlista", timebox: "16 perc", reason: "sztringes blokk" },
      { taskId: "parkolohaz", timebox: "18 perc", reason: "állapotszimuláció" },
      { taskId: "vizallas", timebox: "24 perc", reason: "fájlos középrész" },
      { taskId: "kispalya", timebox: "30 perc", reason: "rekordos zárófeladat" },
    ],
  },
];

const emeltMockPacks: MockExamPack[] = [
  {
    id: "emelt-fajlos-lanc",
    track: "emelt",
    level: "Emelt",
    title: "Fájlos lánc",
    duration: "150 perc",
    theme: "többrészes adatfájl-feldolgozás",
    summary:
      "Öt egymásra épülő fájlos emelt feladat, hogy a beolvasás utáni közös adatszerkezet építése rutinná váljon.",
    focus: ["fájlbeolvasás", "rekordtárolás", "egy adatforrásból több részfeladat"],
    instructions: [
      "Minden feladatnál előbb tervezz meg egy egységes adatszerkezetet, és csak utána menj a részfeladatokra.",
      "Ha a beolvasás biztos, az idő felét már megnyerted ezen a packen.",
    ],
    taskSlots: [
      { taskId: "utnaplo", timebox: "25 perc", reason: "bemelegítő fájlos rutin" },
      { taskId: "menetrendtar", timebox: "28 perc", reason: "időeltérések kezelése" },
      { taskId: "meresablak", timebox: "28 perc", reason: "mérési adatsorok" },
      { taskId: "raktarjarat", timebox: "32 perc", reason: "logisztikai rekordok" },
      { taskId: "termescsucs", timebox: "37 perc", reason: "hosszabb záróelem" },
    ],
  },
  {
    id: "emelt-mozgaster",
    track: "emelt",
    level: "Emelt",
    title: "Mozgástér",
    duration: "145 perc",
    theme: "koordináták, korlátok és útvonalak",
    summary:
      "Az emelt szintű rácsos gondolkodást erősítő pack: blokkolt lépések, Manhattan-távolság és bejárt mezők minden feladatban visszatérnek.",
    focus: ["koordinátakezelés", "határvizsgálat", "útvonalstatisztikák"],
    instructions: [
      "Legyen minden feladatban ugyanaz az alapvázad: kezdőpont, következő pont, határellenőrzés, statisztikák.",
      "A különböző történetek ellenére itt ugyanaz a szerkezet tér vissza, ezt használd ki.",
    ],
    taskSlots: [
      { taskId: "tetojaror", timebox: "24 perc", reason: "klasszikus emelt szimuláció" },
      { taskId: "csatornadrone", timebox: "26 perc", reason: "szűkebb térben ugyanaz a logika" },
      { taskId: "palyafuto", timebox: "28 perc", reason: "nagyobb rács" },
      { taskId: "raktarjaro", timebox: "30 perc", reason: "útvonalas záróblokk" },
      { taskId: "partfigyelo", timebox: "37 perc", reason: "legösszetettebb kitérős feladat" },
    ],
  },
  {
    id: "emelt-kiosztas",
    track: "emelt",
    level: "Emelt",
    title: "Kiosztás",
    duration: "150 perc",
    theme: "kapacitáskezelés és greedy hozzárendelés",
    summary:
      "A pack minden feladata ugyanarra a kiosztási sémára épül: mindig a legkevésbé terhelt erőforrás kapja a következő elemet, ha még belefér.",
    focus: ["greedy kiválasztás", "terheléslista", "elutasítások kezelése"],
    instructions: [
      "Minden kör elején csak azt döntsd el: melyik a legkevésbé terhelt erőforrás, és belefér-e az új elem.",
      "A végső terhelési lista gyakran több pontot ér, mint maga az elfogadott darabszám, ne feledd kiírni.",
    ],
    taskSlots: [
      { taskId: "vizsgabeosztas", timebox: "26 perc", reason: "belső termes kiosztás" },
      { taskId: "muszakrend", timebox: "28 perc", reason: "műszakterhelés" },
      { taskId: "csomagkioszto", timebox: "28 perc", reason: "ablakos modell" },
      { taskId: "mentorbeosztas", timebox: "30 perc", reason: "oktatási történet" },
      { taskId: "palyafoglalas", timebox: "38 perc", reason: "hosszabb lezáró feladat" },
    ],
  },
  {
    id: "emelt-ascii",
    track: "emelt",
    level: "Emelt",
    title: "ASCII precizitás",
    duration: "135 perc",
    theme: "réteges karakterrajz és kimenetfegyelem",
    summary:
      "Azoknak az emelt diákoknak szól, akiknek a formázott output még időveszteség. Az öt feladat tudatos karakter-prioritást és sorépítést követel.",
    focus: ["két egymásba ágyazott ciklus", "karakterprioritás", "szigorú kimeneti fegyelem"],
    instructions: [
      "Ne improvizálj: minden feladat előtt írd le magadnak a karakterválasztás prioritási sorrendjét.",
      "A kimenetet mindig nézd át szemmel is, ne csak a logikát ellenőrizd.",
    ],
    taskSlots: [
      { taskId: "jelvenyrajz", timebox: "22 perc", reason: "alap prioritásos rajz" },
      { taskId: "tribunekep", timebox: "24 perc", reason: "eltérő karakterkészlet" },
      { taskId: "lampafal", timebox: "26 perc", reason: "összetettebb vizuális minta" },
      { taskId: "mozaikkeret", timebox: "28 perc", reason: "réteges keret" },
      { taskId: "kodtabla", timebox: "35 perc", reason: "záró ASCII drill" },
    ],
  },
  {
    id: "emelt-naplok",
    track: "emelt",
    level: "Emelt",
    title: "Naplók és állapotok",
    duration: "145 perc",
    theme: "IN/OUT események és bentléti modellek",
    summary:
      "Az emelt naplós pack minden elemében ugyanaz a bentléti modell tér vissza, csak más történettel: kapu, lift, forgalom, logisztika.",
    focus: ["halmazos állapottárolás", "hibás események számlálása", "maximális bentlétszám"],
    instructions: [
      "Gondolkodj egységes sablonban: bent van-e már, kiléphet-e, mi történik hibás eseménynél.",
      "A végállapot és a max bentlétszám külön mutató, mindkettőt vezesd végig külön.",
    ],
    taskSlots: [
      { taskId: "kapunaplo", timebox: "24 perc", reason: "alap naplós modell" },
      { taskId: "beleptetolanc", timebox: "26 perc", reason: "összetettebb sztori" },
      { taskId: "forgalomor", timebox: "28 perc", reason: "járműves átírás" },
      { taskId: "liftvezeto", timebox: "30 perc", reason: "zárt rendszerű napló" },
      { taskId: "viztorony", timebox: "37 perc", reason: "műszaki lezárás" },
    ],
  },
  {
    id: "emelt-pontverseny",
    track: "emelt",
    level: "Emelt",
    title: "Pontverseny",
    duration: "150 perc",
    theme: "összetett pontképzés és továbbjutás",
    summary:
      "Az emelt rangsoroló pack minden feladatában a legkisebb részpont kiesik, ezért a helyes pontképzés a legfontosabb lépés.",
    focus: ["módosított összpontszám", "tie-break", "továbbjutási küszöb"],
    instructions: [
      "Mindig külön tárold el a részpontokat és a képzett végső pontot is.",
      "A győztes keresése előtt győződj meg róla, hogy mindenkinél ugyanúgy vontad le a legkisebb részpontot.",
    ],
    taskSlots: [
      { taskId: "bajnoksagplusz", timebox: "26 perc", reason: "csapatpontozás" },
      { taskId: "pilotapont", timebox: "28 perc", reason: "idényvégi összesítés" },
      { taskId: "selejtezo", timebox: "28 perc", reason: "továbbjutási logika" },
      { taskId: "dobogotabla", timebox: "30 perc", reason: "összetett sportnap" },
      { taskId: "csapatvalto", timebox: "38 perc", reason: "hosszabb lezáró rangsor" },
    ],
  },
  {
    id: "emelt-vegyes-lab",
    track: "emelt",
    level: "Emelt",
    title: "Vegyes lab",
    duration: "145 perc",
    theme: "adatfeldolgozás, útvonal, kiosztás, ASCII",
    summary:
      "Ez a pack szándékosan ugrál a készségcsaládok között, hogy a vizsgahelyzethez hasonló mentális váltásokat gyakoroltasd.",
    focus: ["váltás különböző minták között", "részpontmentés", "stratégiai sorrendválasztás"],
    instructions: [
      "Minden új feladatnál tudatosan mondd ki magadnak, melyik készségcsaládba tartozik, és milyen alapvázat használsz rá.",
      "Ha egy feladat nem indul el gyorsan, hagyj benne kommentet és menj tovább a következőre.",
    ],
    taskSlots: [
      { taskId: "adatkozpont", timebox: "25 perc", reason: "fájlos nyitás" },
      { taskId: "tetojaror", timebox: "24 perc", reason: "koordinátás blokk" },
      { taskId: "termbeoszto", timebox: "28 perc", reason: "kiosztási modell" },
      { taskId: "raszterjel", timebox: "28 perc", reason: "ASCII váltás" },
      { taskId: "orszagkor", timebox: "40 perc", reason: "rekordos lezárás" },
    ],
  },
  {
    id: "emelt-racs-es-naplo",
    track: "emelt",
    level: "Emelt",
    title: "Rács és napló",
    duration: "140 perc",
    theme: "útvonalak és eseménylisták kombinációja",
    summary:
      "A térbeli és az állapotnaplós gondolkodás váltakozik benne, ezért jó tesztje annak, mennyire stabilak az emelt alapmintáid.",
    focus: ["állapotmodellek váltása", "összetett figyelem", "blokkolt események"],
    instructions: [
      "A rácsos és naplós feladatokat kezeld külön fejben, ne keverd a sablonokat.",
      "Ahol blokkolás van, ott mindig külön számold a sikertelen eseteket is.",
    ],
    taskSlots: [
      { taskId: "terkepjaro", timebox: "24 perc", reason: "rácsos nyitás" },
      { taskId: "kapunaplo", timebox: "24 perc", reason: "naplós váltás" },
      { taskId: "labirintusraktar", timebox: "28 perc", reason: "útvonal-mélyítés" },
      { taskId: "jelzovaltas", timebox: "28 perc", reason: "állapotnapló" },
      { taskId: "uveghid", timebox: "36 perc", reason: "rácsos lezáró" },
    ],
  },
  {
    id: "emelt-fajlos-es-rangsor",
    track: "emelt",
    level: "Emelt",
    title: "Fájlos és rangsor",
    duration: "145 perc",
    theme: "rekordstruktúrák két nagy családja",
    summary:
      "Az első fele fájlból olvas, a második fele ponttáblát épít. Jó választás, ha a rekordos gondolkodásodat akarod teljesen összerakni.",
    focus: ["rekordtárolás", "újrafelhasznált adatszerkezet", "összetett összesítések"],
    instructions: [
      "Figyeld meg, hogy a fájlos és a rangsoroló feladatok között sokkal kisebb a távolság, mint elsőre látszik: mindkettő rekordsorokat kezel.",
      "A végső kiírás előtt mindenhol ellenőrizd, hogy az első előfordulást vagy a legkisebb nevet kell-e választanod.",
    ],
    taskSlots: [
      { taskId: "szervizut", timebox: "24 perc", reason: "fájlos nyitófeladat" },
      { taskId: "turanaplo", timebox: "26 perc", reason: "mérési rekordok" },
      { taskId: "bajnoksagplusz", timebox: "28 perc", reason: "rangsorváltás" },
      { taskId: "pilotapont", timebox: "30 perc", reason: "pontverseny" },
      { taskId: "evadtabla", timebox: "37 perc", reason: "lezáró összetett pontképzés" },
    ],
  },
  {
    id: "emelt-teljes-proba",
    track: "emelt",
    level: "Emelt",
    title: "Teljes próba",
    duration: "150 perc",
    theme: "kiegyensúlyozott, vizsgaszerű emelt mix",
    summary:
      "A legátfogóbb emelt pack: van benne fájlos feladat, koordinátás szimuláció, kiosztás, ASCII és összetett rangsoroló lezárás.",
    focus: ["vizsgatempó", "tervezés", "széles készséglefedés", "utóellenőrzés"],
    instructions: [
      "Tekintsd ezt valódi vizsgahelyzetnek: tervezd meg előre a feladatsorrendedet, ne csak sorrendben menj végig rajtuk.",
      "Legalább 10 perc maradjon a végén ellenőrzésre, különösen az ASCII és a kiosztási lista miatt.",
    ],
    taskSlots: [
      { taskId: "utnaplo", timebox: "25 perc", reason: "fájlos nyitás" },
      { taskId: "tetojaror", timebox: "25 perc", reason: "koordinátás rutin" },
      { taskId: "vizsgabeosztas", timebox: "30 perc", reason: "kiosztási középrész" },
      { taskId: "jelvenyrajz", timebox: "28 perc", reason: "ASCII pontosság" },
      { taskId: "selejtezo", timebox: "42 perc", reason: "összetett rekordos lezárás" },
    ],
  },
];

export const mockExamPacks = [...kozepMockPacks, ...emeltMockPacks];

export function getMockExamPackById(mockId: string): MockExamPack | undefined {
  return mockExamPacks.find((pack) => pack.id === mockId);
}

export function listMockExamPacksByTrack(track: "kozep" | "emelt") {
  return mockExamPacks.filter((pack) => pack.track === track);
}