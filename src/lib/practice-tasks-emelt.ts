import {
  buildEmeltAccessLogTask,
  buildEmeltAsciiTask,
  buildEmeltFileAnalyticsTask,
  buildEmeltLeaderboardTask,
  buildEmeltRouteTask,
  buildEmeltSchedulingTask,
} from "@/lib/practice-task-factories";

const fileTasks = [
  {
    id: "utnaplo",
    title: "Útnapló",
    family: "fájlbeolvasás és adatsor-feldolgozás",
    estimatedMinutes: "30-35 perc",
    summary:
      "A csatolt ut.txt állományból kell méréspontokat és sebességadatokat összesíteni.",
    sourceNote:
      "Saját, emelt hangulatú fájlos feladat a hivatalos adatfeldolgozós logikák mintájára, de új történettel és rövidebb részfeladatszerkezettel.",
    filePath: "ut.txt",
    fileDescription: "Mintaállomány az útszakasz ellenőrzőpontjaival és a mért sebességekkel.",
    threshold: 50,
    recordLabel: "ellenőrzőpont",
    valueLabel: "mért sebesség",
    context:
      "Az útnapló minden sorban egy ellenőrzőpont nevét és az ott mért sebességet rögzíti. A fájlból kell rövid forgalmi kivonatot készíteni.",
    names: ["Varoskapu", "Hid", "Tanya", "Erdo", "Lejto", "Cel"],
    values: [48, 52, 67, 45, 61, 50],
  },
  {
    id: "menetrendtar",
    title: "Menetrendtár",
    family: "összetett fájlfeldolgozás",
    estimatedMinutes: "35-40 perc",
    summary:
      "Járatonkénti adatokból kell pontossági és terhelési mutatókat előállítani.",
    sourceNote:
      "Emelt fájlos gyakorló menetrendi történettel, a közös adatszerkezetre épülő feldolgozást erősítve.",
    filePath: "menetrend.txt",
    fileDescription: "Mintaállomány a járatok eltérési perceivel.",
    threshold: 12,
    recordLabel: "járat",
    valueLabel: "eltérés percekben",
    context:
      "A közlekedési központ minden járathoz egy eltérési értéket rögzített. Ezekből kell megállapítani a legsúlyosabb és a küszöb feletti eseteket.",
    names: ["J101", "J204", "J305", "J412", "J509", "J610"],
    values: [5, 8, 14, 11, 18, 9],
  },
  {
    id: "meresablak",
    title: "Mérésablak",
    family: "összetett fájlfeldolgozás",
    estimatedMinutes: "35-40 perc",
    summary:
      "Szenzoradatokból kell kiválasztani a kritikus tartományokat és az összesített terhelést.",
    sourceNote:
      "Emelt, de még átlátható fájlos feladat mérési környezetben, több részfeladatot egyetlen beolvasásból megoldva.",
    filePath: "meres.txt",
    fileDescription: "Mintaállomány a szenzorablakok átlagértékeivel.",
    threshold: 70,
    recordLabel: "ablak",
    valueLabel: "átlagérték",
    context:
      "A labor több mérési ablak átlagértékét mentette el. A fájlból kell gyorsan összesíteni a kiugró részeket.",
    names: ["Ablak1", "Ablak2", "Ablak3", "Ablak4", "Ablak5", "Ablak6"],
    values: [62, 75, 68, 81, 73, 66],
  },
  {
    id: "raktarjarat",
    title: "Raktárjárat",
    family: "összetett fájlfeldolgozás",
    estimatedMinutes: "35-40 perc",
    summary:
      "Raktári állomások adataiból kell csúcsterhelést és összesített árumennyiséget számolni.",
    sourceNote:
      "Logisztikai témájú emelt gyakorló a biztos fájlos rekordfeldolgozásra fókuszálva.",
    filePath: "jarat.txt",
    fileDescription: "Mintaállomány a raktárjárat állomásain felvett tételekkel.",
    threshold: 90,
    recordLabel: "állomás",
    valueLabel: "kezelési egység",
    context:
      "A raktárjárat minden állomáson feljegyezte, hány egységet vett fel vagy adott át. Az adatokból összesítő jelentés kell.",
    names: ["Kapcsolo", "Felvetel", "Atado", "Tarolo", "Kiado", "Zaro"],
    values: [88, 94, 76, 102, 85, 91],
  },
  {
    id: "termescsucs",
    title: "Terméscsúcs",
    family: "összetett fájlfeldolgozás",
    estimatedMinutes: "35-40 perc",
    summary:
      "Parcellánkénti hozamokból kell kiemelni a csúcseredményeket és az összkibocsátást.",
    sourceNote:
      "Adatfeldolgozós emelt rutin mezőgazdasági történettel, de tisztán vizsgahű logikával.",
    filePath: "termes.txt",
    fileDescription: "Mintaállomány a parcellánkénti terméshozamokkal.",
    threshold: 300,
    recordLabel: "parcella",
    valueLabel: "kilogrammban mért hozam",
    context:
      "A gazdasági gyakorlókert minden parcellájához megadták az aznapi hozamot. Ezekből kell rövid eredményösszesítést készíteni.",
    names: ["P1", "P2", "P3", "P4", "P5", "P6"],
    values: [280, 315, 292, 330, 301, 288],
  },
  {
    id: "adatkozpont",
    title: "Adatközpont",
    family: "összetett fájlfeldolgozás",
    estimatedMinutes: "35-40 perc",
    summary:
      "Szerverterhelési adatokból kell riasztási és összegző mutatókat készíteni.",
    sourceNote:
      "Digitális közegű emelt gyakorló a stabil fájlos feldolgozásért, eredeti platformos szövegezéssel.",
    filePath: "szerver.txt",
    fileDescription: "Mintaállomány a szerverterhelési értékekkel.",
    threshold: 80,
    recordLabel: "szerver",
    valueLabel: "terhelési százalék",
    context:
      "Az iskola adatközpontjában minden gépről mentettek egy terhelési értéket. A rendszergazda ezekből szeretne gyors áttekintést.",
    names: ["SrvA", "SrvB", "SrvC", "SrvD", "SrvE", "SrvF"],
    values: [74, 83, 69, 91, 88, 77],
  },
  {
    id: "szervizut",
    title: "Szervizút",
    family: "összetett fájlfeldolgozás",
    estimatedMinutes: "35-40 perc",
    summary:
      "Útpontokhoz rendelt költségekből kell meghatározni az emelt szintű összesítő mutatókat.",
    sourceNote:
      "Fájlbeolvasásos emelt gyakorlat mobil karbantartási történettel, a részfeladatok közös adatkezelését hangsúlyozva.",
    filePath: "szerviz.txt",
    fileDescription: "Mintaállomány a szervizút állomásainak költségeivel.",
    threshold: 45,
    recordLabel: "állomás",
    valueLabel: "költségpont",
    context:
      "A karbantartó járat minden megállónál rögzítette a ráfordítási költségpontot. Ebből kell rövid összesítést készíteni.",
    names: ["Kapu", "Muhely", "Raktar", "Csarnok", "Udvar", "Zaro"],
    values: [38, 46, 51, 42, 49, 44],
  },
  {
    id: "turanaplo",
    title: "Túranapló",
    family: "összetett fájlfeldolgozás",
    estimatedMinutes: "35-40 perc",
    summary:
      "Túrapontok értékeiből kell magassági és terhelési jellegű mutatókat számolni.",
    sourceNote:
      "Emelt fájlos gyakorló kültéri történettel, stabil rekord-feldolgozó alapszerkezettel.",
    filePath: "tura.txt",
    fileDescription: "Mintaállomány a túrapontok szintértékeivel.",
    threshold: 120,
    recordLabel: "pont",
    valueLabel: "szintérték",
    context:
      "Egy hegyi túra ellenőrzőpontjaihoz szintértéket rendeltek. A napló alapján kell összesíteni a nehezebb szakaszokat.",
    names: ["Rajt", "Patak", "Hegyoldal", "Kilato", "Gerinc", "Cel"],
    values: [85, 112, 138, 121, 147, 109],
  },
  {
    id: "vizminoseg",
    title: "Vízminőség",
    family: "összetett fájlfeldolgozás",
    estimatedMinutes: "35-40 perc",
    summary:
      "Mintapontok minőségi értékeiből kell gyors riasztási áttekintést készíteni.",
    sourceNote:
      "Mérési témájú emelt gyakorló a fájlból dolgozó judge-felülethez igazítva.",
    filePath: "viz.txt",
    fileDescription: "Mintaállomány a mintapontok minőségi értékeivel.",
    threshold: 65,
    recordLabel: "mintapont",
    valueLabel: "minőségi index",
    context:
      "A vízvizsgálati állomás több ponton mért egy összesített minőségi indexet. Ezekből kell rövid jelentést készíteni.",
    names: ["M1", "M2", "M3", "M4", "M5", "M6"],
    values: [61, 68, 59, 72, 70, 64],
  },
] as const;

const routeTasks = [
  {
    id: "tetojaror",
    title: "Tetőjárőr",
    family: "állapotszimuláció és koordinátakezelés",
    estimatedMinutes: "35-40 perc",
    summary:
      "Parancssor alapján kell követni egy drón útvonalát és a blokkolt lépéseket.",
    sourceNote:
      "Emelt szintű, vizsgaszerű szimulációs feladat koordinátás modellben, teljesen saját történettel.",
    gridSize: 7,
    startX: 3,
    startY: 3,
    context:
      "Egy karbantartó drón egy négyzethálós tetőn mozog. A parancssorozat alapján kell követni a pozícióját és a mozgás legfontosabb mutatóit.",
  },
  {
    id: "csatornadrone",
    title: "Csatornadrón",
    family: "állapotszimuláció és koordinátakezelés",
    estimatedMinutes: "35-40 perc",
    summary:
      "Szűk hálózatban mozgó drón koordinátáit és kitéréseit kell elemezni.",
    sourceNote:
      "Emelt koordinátás drill új műszaki történettel, a korlátkezelt mozgáslogikára építve.",
    gridSize: 8,
    startX: 4,
    startY: 4,
    context:
      "Egy szervizdrón zárt csatornahálózatban halad mérési pontok között. A lépésekből kell meghatározni a végpontot és a kitérések mértékét.",
  },
  {
    id: "palyafuto",
    title: "Pályafutó",
    family: "állapotszimuláció és koordinátakezelés",
    estimatedMinutes: "35-40 perc",
    summary:
      "Egy jeladó mozgását kell pályán követni határfeltételek mellett.",
    sourceNote:
      "Emelt szimulációs gyakorlat sportos történettel, változatlanul rácsos modellben.",
    gridSize: 9,
    startX: 4,
    startY: 4,
    context:
      "Egy stadion edzőrácsán mozgó jeladót parancsokkal vezérelnek. A feladat a pozíciók és a legnagyobb eltávolodás követése.",
  },
  {
    id: "raktarjaro",
    title: "Raktárjáró",
    family: "állapotszimuláció és koordinátakezelés",
    estimatedMinutes: "35-40 perc",
    summary:
      "Raktári robot útvonalát kell követni, beleértve a falba ütköző lépéseket is.",
    sourceNote:
      "Emelt gyakorló logisztikai környezetben, a koordinátás állapotkezelés rendszeres ismétlésére.",
    gridSize: 8,
    startX: 2,
    startY: 2,
    context:
      "Egy raktári robot a kijelölt sávok mentén mozog. A parancssorozat alapján kell összesíteni a teljes útvonal jellemzőit.",
  },
  {
    id: "partfigyelo",
    title: "Partfigyelő",
    family: "állapotszimuláció és koordinátakezelés",
    estimatedMinutes: "35-40 perc",
    summary:
      "Őrjárat útvonalából kell meghatározni a végpontot, az eltávolodást és az érintett zónákat.",
    sourceNote:
      "Emelt szintű térbeli szimuláció eredeti történettel és stabilan tesztelhető outputtal.",
    gridSize: 10,
    startX: 5,
    startY: 5,
    context:
      "A tóparton járőröző felügyelő útvonalát rövid irányparancsok adják meg. A nap végén ebből kell kivonatot készíteni.",
  },
  {
    id: "terkepjaro",
    title: "Térképjáró",
    family: "rács és útvonal-logika",
    estimatedMinutes: "35-40 perc",
    summary:
      "Jelzőrobot útvonalát kell követni négyzethálós pályán.",
    sourceNote:
      "Emelt rácsos útvonal-feladat a koordináták magabiztos kezeléséhez.",
    gridSize: 9,
    startX: 1,
    startY: 1,
    context:
      "Egy térképező robot sorban kapja a mozgásparancsokat. A pályán maradás és az érintett mezők száma egyaránt fontos.",
  },
  {
    id: "labirintusraktar",
    title: "Labirintusraktár",
    family: "rács és útvonal-logika",
    estimatedMinutes: "35-40 perc",
    summary:
      "Raktári kocsi útvonalát kell elemezni egy korlátos rácsrendszerben.",
    sourceNote:
      "Saját emelt gyakorló, amely a pozíciókezelés és a blokkolt lépések kezelését erősíti.",
    gridSize: 7,
    startX: 1,
    startY: 5,
    context:
      "Egy kézikocsi a raktár kijelölt sávjaiban halad. A mozgásnapló alapján kell megadni a legfontosabb útvonali statisztikákat.",
  },
  {
    id: "taktikapadlo",
    title: "Taktikapadló",
    family: "rács és útvonal-logika",
    estimatedMinutes: "35-40 perc",
    summary:
      "Rácson végzett jelöléseket kell útvonallá alakítva feldolgozni.",
    sourceNote:
      "Emelt térbeli gyakorló edzésstratégiai történettel, a koordinátás logikát megőrizve.",
    gridSize: 8,
    startX: 3,
    startY: 4,
    context:
      "Egy edző digitális padlón követi a mozgásmintákat. A parancsokból kell meghatározni a bejárt mezőket és az eltávolodást.",
  },
  {
    id: "uveghid",
    title: "Üveghíd",
    family: "rács és útvonal-logika",
    estimatedMinutes: "35-40 perc",
    summary:
      "Keskeny hídon vezetett útvonalból kell összesíteni a blokkolt és sikeres mozgásokat.",
    sourceNote:
      "Szimulációs emelt drill, ahol a pozíció és a határkezelés egyszerre kap hangsúlyt.",
    gridSize: 6,
    startX: 2,
    startY: 2,
    context:
      "Egy keskeny vizsgapályán minden hibás lépés blokkolódik. Az útvonalból kell végpontot és távolsági adatokat meghatározni.",
  },
] as const;

const schedulingTasks = [
  {
    id: "vizsgabeosztas",
    title: "Vizsgabeosztás",
    family: "ütemezés és kiosztás",
    estimatedMinutes: "40-45 perc",
    summary:
      "Vizsgacsoportokat kell termekhez kiosztani kapacitáskorlát mellett.",
    sourceNote:
      "Emelt szintű greedy kiosztási gyakorlat, amely a legkevésbé terhelt erőforrás keresését erősíti.",
    resourceCount: 3,
    limit: 12,
    resourceLabel: "terem",
    jobLabel: "csoport",
    context:
      "A szóbeli vizsgához a csoportokat egymás után kell termekhez rendelni. Minden teremnek van maximális terhelési korlátja.",
  },
  {
    id: "muszakrend",
    title: "Műszakrend",
    family: "ütemezés és kiosztás",
    estimatedMinutes: "40-45 perc",
    summary:
      "Feladatblokkokat kell műszakokhoz rendelni terhelési limit alapján.",
    sourceNote:
      "Klasszikus emelt terheléselosztási minta eredeti műszaktervezési történettel.",
    resourceCount: 4,
    limit: 15,
    resourceLabel: "műszak",
    jobLabel: "feladatblokk",
    context:
      "Egy üzem négy műszakja kapja meg sorban a napi feladatblokkokat. A kiosztás mindig a legkevésbé terhelt műszakhoz történik.",
  },
  {
    id: "csomagkioszto",
    title: "Csomagkiosztó",
    family: "ütemezés és kiosztás",
    estimatedMinutes: "40-45 perc",
    summary:
      "Beérkező egységeket kell ablakokhoz rendelni kiegyenlített terheléssel.",
    sourceNote:
      "Emelt kiosztási feladat logisztikai környezetben, egyszerű és jól ellenőrizhető outputtal.",
    resourceCount: 4,
    limit: 18,
    resourceLabel: "ablak",
    jobLabel: "csomagcsomó",
    context:
      "A raktári átvételi ablakok sorban kapják a beérkező csomagcsomókat. A cél az egyenletes terhelés fenntartása a korlát figyelembevételével.",
  },
  {
    id: "mentorbeosztas",
    title: "Mentorbeosztás",
    family: "ütemezés és kiosztás",
    estimatedMinutes: "40-45 perc",
    summary:
      "Diákcsoportokat kell mentorokhoz osztani kapacitáskorláttal.",
    sourceNote:
      "Emelt szintű hozzárendelési rutin oktatási történettel és jól mérhető terhelési listával.",
    resourceCount: 3,
    limit: 14,
    resourceLabel: "mentor",
    jobLabel: "csoport",
    context:
      "A tehetséggondozó program csoportjait mentorokhoz kell sorban hozzárendelni. A mentorok terhelése nem léphet túl egy felső határt.",
  },
  {
    id: "palyafoglalas",
    title: "Pályafoglalás",
    family: "ütemezés és kiosztás",
    estimatedMinutes: "40-45 perc",
    summary:
      "Edzésblokkokat kell sportpályákhoz rendelni terhelési plafon mellett.",
    sourceNote:
      "Greedy típusú emelt feladat, amely ugyanazt a gondolkodást kéri számon, mint több hivatalos kiosztási minta.",
    resourceCount: 5,
    limit: 16,
    resourceLabel: "pálya",
    jobLabel: "edzésblokk",
    context:
      "Az iskola sportpályái egész délután foglalásokat kapnak. A blokkokat mindig a legkevésbé terhelt pályához kell rendelni.",
  },
  {
    id: "termbeoszto",
    title: "Terembeosztó",
    family: "ütemezés és kiosztás",
    estimatedMinutes: "40-45 perc",
    summary:
      "Foglalkozásokat kell termekre osztani egy egyszerű terheléselosztó szabály szerint.",
    sourceNote:
      "Emelt beosztási rutin az egyszerű, de pontos terheléskövetéshez.",
    resourceCount: 4,
    limit: 17,
    resourceLabel: "terem",
    jobLabel: "foglalkozás",
    context:
      "A nyári tábor foglalkozásait termekre kell szétosztani. Minden új elem a legkevésbé terhelt teremhez kerül, ha még belefér.",
  },
  {
    id: "muszakmester",
    title: "Műszakmester",
    family: "ütemezés és kiosztás",
    estimatedMinutes: "40-45 perc",
    summary:
      "Javítási blokkokból kell kiegyenlített műszakterhelést kialakítani.",
    sourceNote:
      "Platformos emelt feladat műhelyi beosztással, determinisztikus kiosztási szabállyal.",
    resourceCount: 3,
    limit: 20,
    resourceLabel: "műszak",
    jobLabel: "javítás",
    context:
      "A műhelyvezető a napi javításokat műszakokhoz rendeli. A cél az, hogy a terhelés egyenletes maradjon és ne lépje túl a korlátot.",
  },
  {
    id: "gepfoglalas",
    title: "Gépfoglalás",
    family: "ütemezés és kiosztás",
    estimatedMinutes: "40-45 perc",
    summary:
      "Laborgépeket kell foglalásokhoz rendelni időigény szerint.",
    sourceNote:
      "Emelt kapacitáskezelős gyakorló a gépterhelés és az elutasítások pontos követésére.",
    resourceCount: 4,
    limit: 19,
    resourceLabel: "gép",
    jobLabel: "foglalás",
    context:
      "Az informatika laborban a foglalások sorban érkeznek. Minden új kérés a legkevésbé terhelt géphez kerülhet, ha belefér a napi limitbe.",
  },
] as const;

const asciiTasks = [
  {
    id: "jelvenyrajz",
    title: "Jelvényrajz",
    family: "ASCII és formázott kimenet",
    estimatedMinutes: "35-40 perc",
    summary:
      "Szabály alapján kell szimmetrikus jelvényt rajzolni karakterekből.",
    sourceNote:
      "Emelt ASCII drill, amely a karakter-prioritás és a rácsos gondolkodás fegyelmezett kezelését gyakoroltatja.",
    borderChar: "#",
    mainDiagonalChar: "/",
    secondaryDiagonalChar: "\\",
    fillChar: ".",
    centerChar: "O",
    themeLabel: "jelvényszerű",
    context:
      "Egy iskolaünnepre szimmetrikus jelvényt kell generálni. Az ábra több szabályból álló karakterprioritással készül.",
  },
  {
    id: "tribunekep",
    title: "Tribünkép",
    family: "ASCII és formázott kimenet",
    estimatedMinutes: "35-40 perc",
    summary:
      "Lelátó-szerű mintát kell kiírni rácsszabályok alapján.",
    sourceNote:
      "Precíz kimeneti feladat emelt szinten, egyértelmű karakterelsőbbségi szabályokkal.",
    borderChar: "=",
    mainDiagonalChar: "X",
    secondaryDiagonalChar: "Y",
    fillChar: "-",
    centerChar: "@",
    themeLabel: "lelátó",
    context:
      "A stadion digitális táblájára egy szektorábra kerül. A mintát a megadott rácsszabályok szerint kell előállítani.",
  },
  {
    id: "lampafal",
    title: "Lámpafal",
    family: "ASCII és formázott kimenet",
    estimatedMinutes: "35-40 perc",
    summary:
      "Fényfal-szerű mintát kell készíteni többféle karakterrel.",
    sourceNote:
      "Emelt kiírási rutin látványos, de teljesen algoritmizálható vizuális mintával.",
    borderChar: "+",
    mainDiagonalChar: "*",
    secondaryDiagonalChar: "x",
    fillChar: ".",
    centerChar: "0",
    themeLabel: "fényfal",
    context:
      "Egy rendezvény háttérfalára programozott fényrajz kerül. A mintát négyzethálós szabályok alapján kell előállítani.",
  },
  {
    id: "mozaikkeret",
    title: "Mozaikkeret",
    family: "ASCII és formázott kimenet",
    estimatedMinutes: "35-40 perc",
    summary:
      "Díszítő mintát kell kirajzolni keret- és átlós szabályok kombinációjával.",
    sourceNote:
      "Kimenetfegyelmet és rácslogikát gyakorló emelt ASCII feladat.",
    borderChar: "~",
    mainDiagonalChar: "A",
    secondaryDiagonalChar: "V",
    fillChar: "_",
    centerChar: "M",
    themeLabel: "mozaikos",
    context:
      "Egy kiállítás plakátjához egyszerű mozaikmintát kell generálni. A középpont és az átlók külön szerepet kapnak.",
  },
  {
    id: "kodtabla",
    title: "Kódtábla",
    family: "ASCII és formázott kimenet",
    estimatedMinutes: "35-40 perc",
    summary:
      "Karaktertáblát kell kiírni rögzített prioritás szerint.",
    sourceNote:
      "Emelt ASCII gyakorlat, amely a tömör, de precíz sorépítést kéri számon.",
    borderChar: "|",
    mainDiagonalChar: "1",
    secondaryDiagonalChar: "2",
    fillChar: ".",
    centerChar: "C",
    themeLabel: "kódtáblás",
    context:
      "Egy oktatási demóhoz karakteres kódtáblát kell kirajzolni. A mintát a rácson elfoglalt hely határozza meg.",
  },
  {
    id: "raszterjel",
    title: "Raszterjel",
    family: "ASCII és formázott kimenet",
    estimatedMinutes: "35-40 perc",
    summary:
      "Raszteres jelképet kell előállítani egyetlen méretparaméterből.",
    sourceNote:
      "Vizsgaszerű ASCII gyakorló, amely tudatos soronkénti generálást igényel.",
    borderChar: "%",
    mainDiagonalChar: "R",
    secondaryDiagonalChar: "S",
    fillChar: ":",
    centerChar: "G",
    themeLabel: "raszteres",
    context:
      "A robotika szakkör egy saját raszterjelet használ. A jel minden méretben ugyanazzal a prioritási szabállyal rajzolható ki.",
  },
  {
    id: "szinpajzs",
    title: "Színpajzs",
    family: "ASCII és formázott kimenet",
    estimatedMinutes: "35-40 perc",
    summary:
      "Pajzsszerű karaktermintát kell generálni fix szabályrendszer alapján.",
    sourceNote:
      "Emelt kiírási drill kulturált, jól tesztelhető mintaspecifikációval.",
    borderChar: "!",
    mainDiagonalChar: "P",
    secondaryDiagonalChar: "Q",
    fillChar: ",",
    centerChar: "K",
    themeLabel: "pajzs",
    context:
      "A csapatverseny digitális díszítéséhez pajzsszerű mintát kell létrehozni. A különböző mezők karaktereit a pozíciójuk dönti el.",
  },
  {
    id: "csillagterv",
    title: "Csillagterv",
    family: "ASCII és formázott kimenet",
    estimatedMinutes: "35-40 perc",
    summary:
      "Szabályozott rácsmintából kell csillagszerű elrendezést kiírni.",
    sourceNote:
      "Formázott kimeneti emelt feladat a több rétegű feltételkezelés gyakorlására.",
    borderChar: "^",
    mainDiagonalChar: "*",
    secondaryDiagonalChar: "/",
    fillChar: ".",
    centerChar: "#",
    themeLabel: "csillagterv",
    context:
      "Egy díszkivilágítási tervhez karakteres alaprajz készül. Az ábra minden mezője egyszerű koordinátaszabályok szerint dönthető el.",
  },
] as const;

const accessTasks = [
  {
    id: "kapunaplo",
    title: "Kapunapló",
    family: "eseménynapló és szabálykezelés",
    estimatedMinutes: "35-40 perc",
    summary:
      "IN/OUT naplóból kell bentléti és hibastatisztikát készíteni.",
    sourceNote:
      "Emelt állapotkezelős gyakorló, amely a halmazszerű bentléti nyilvántartást teszi szükségessé.",
    attendeeLabel: "dolgozó",
    context:
      "Egy irodaház kapurendszere sorban rögzíti a dolgozók belépéseit és kilépéseit. A szabálytalan naplóbejegyzéseket is észre kell venni.",
    names: ["Anna", "Bence", "Csilla", "Dani", "Eszter", "Feri", "Gabi"],
  },
  {
    id: "beleptetolanc",
    title: "Beléptetőlánc",
    family: "eseménynapló és szabálykezelés",
    estimatedMinutes: "35-40 perc",
    summary:
      "Beléptető pontok eseményeiből kell állapotot és hibákat számolni.",
    sourceNote:
      "Emelt szintű validációs és állapotkövető feladat, rövid, de vizsgahű adatsorral.",
    attendeeLabel: "résztvevő",
    context:
      "Egy konferencia több beengedési pontja közös eseménylistát használ. A rendszernek végig követnie kell, ki van bent szabályosan.",
    names: ["Hanna", "Imre", "Juli", "Kata", "Laci", "Mira", "Nora"],
  },
  {
    id: "forgalomor",
    title: "Forgalomőr",
    family: "eseménynapló és szabálykezelés",
    estimatedMinutes: "35-40 perc",
    summary:
      "Átengedett járművekből kell állapotot és hibás eseményeket meghatározni.",
    sourceNote:
      "Eredeti emelt feladat közlekedési környezetben, a bentléti állapot általánosított modelljével.",
    attendeeLabel: "jármű",
    context:
      "Egy lezárt útszakasz váltott irányú forgalmat enged át. A naplózott IN és OUT eseményekből kell összesítést készíteni.",
    names: ["Auto1", "Auto2", "Auto3", "Auto4", "Auto5", "Auto6", "Auto7"],
  },
  {
    id: "liftvezeto",
    title: "Liftvezető",
    family: "eseménynapló és szabálykezelés",
    estimatedMinutes: "35-40 perc",
    summary:
      "Liftbe belépő és kilépő utasok naplójából kell bentléti adatokat számolni.",
    sourceNote:
      "Emelt állapotkezelős gyakorlat zárt rendszerben mozgó szereplőkkel.",
    attendeeLabel: "utas",
    context:
      "Egy magasépületi lift használatát utasonként naplózták. A szabálytalan ki- és beszállásokat is észlelni kell.",
    names: ["U1", "U2", "U3", "U4", "U5", "U6", "U7"],
  },
  {
    id: "viztorony",
    title: "Víztorony",
    family: "eseménynapló és szabálykezelés",
    estimatedMinutes: "35-40 perc",
    summary:
      "Töltő és ürítő egységek be- és kimeneteiből kell állapotot követni.",
    sourceNote:
      "Általános állapotkezelési minta emelt szinten, műszaki történetre átírva.",
    attendeeLabel: "szivattyúegység",
    context:
      "A víztorony karbantartásánál több szivattyúegység kerül ki-be a rendszerből. A naplót szabályosság szerint kell ellenőrizni.",
    names: ["P1", "P2", "P3", "P4", "P5", "P6", "P7"],
  },
  {
    id: "jelzovaltas",
    title: "Jelzőváltás",
    family: "eseménynapló és szabálykezelés",
    estimatedMinutes: "35-40 perc",
    summary:
      "Aktív jelzőegységek állapotát kell IN/OUT eseményekkel nyomon követni.",
    sourceNote:
      "Emelt logikai rutin, amely a hibás átállások felismerését helyezi előtérbe.",
    attendeeLabel: "jelzőmodul",
    context:
      "Egy ideiglenes forgalomirányító rendszer jelzőmoduljai nap közben aktiválódnak és leállnak. A napló alapján kell hibákat keresni.",
    names: ["J1", "J2", "J3", "J4", "J5", "J6", "J7"],
  },
  {
    id: "osztottora",
    title: "Osztott óra",
    family: "eseménynapló és szabálykezelés",
    estimatedMinutes: "35-40 perc",
    summary:
      "Csoportok váltását kell követni egy párhuzamos oktatási blokk naplójában.",
    sourceNote:
      "Emelt iskolai gyakorlat, amely ugyanazt a bentléti állapotmodellt használja összetettebb sztoriban.",
    attendeeLabel: "csoport",
    context:
      "Egy osztott órában csoportok lépnek be és ki a laborból. A hibás sorrendeket és a bent maradó csoportokat is jelezni kell.",
    names: ["Acs", "Bta", "Cga", "Dda", "Eta", "Ffa", "Gga"],
  },
  {
    id: "kuldemenykapu",
    title: "Küldeménykapu",
    family: "eseménynapló és szabálykezelés",
    estimatedMinutes: "35-40 perc",
    summary:
      "Be- és kiléptetett csomagegységekből kell rendszerszintű kivonatot készíteni.",
    sourceNote:
      "Logisztikai emelt feladat a szabályos eseménysor ellenőrzésére.",
    attendeeLabel: "küldemény",
    context:
      "Egy válogatókapu minden csomag be- és kilépését rögzíti. A napló alapján meg kell találni a szabálytalan mozgásokat és a bennragadt egységeket.",
    names: ["C01", "C02", "C03", "C04", "C05", "C06", "C07"],
  },
] as const;

const leaderboardTasks = [
  {
    id: "bajnoksagplusz",
    title: "Bajnokság Plusz",
    family: "rangsorolás és pontaggregálás",
    estimatedMinutes: "40-45 perc",
    summary:
      "Többfordulós pontokból kell módosított összpontszámot és továbbjutást számolni.",
    sourceNote:
      "Emelt pontversenyes gyakorló, ahol a részpontokból képzett végső érték a kulcslépés.",
    qualifyLine: 25,
    contestantLabel: "csapat",
    context:
      "Egy körmérkőzéses bajnokságban a csapatok négy fordulóban gyűjtenek pontot. A leggyengébb kör levonása után kell végeredményt készíteni.",
    names: ["Atlasz", "Bika", "Csillag", "Delta", "Ero", "Futar"],
  },
  {
    id: "pilotapont",
    title: "Pilótapont",
    family: "rangsorolás és pontaggregálás",
    estimatedMinutes: "40-45 perc",
    summary:
      "Futamokon szerzett pontokból kell idényvégi sorrendet meghatározni.",
    sourceNote:
      "Emelt rangsoroló feladat versenysportos történettel, több részmutatóval.",
    qualifyLine: 27,
    contestantLabel: "pilóta",
    context:
      "Egy mini versenysorozatban minden pilóta négy futamon indul. A szezonvégi sorrendet a módosított pontszám adja.",
    names: ["Gabor", "Heni", "Imola", "Jona", "Krisz", "Levi"],
  },
  {
    id: "selejtezo",
    title: "Selejtező",
    family: "rangsorolás és pontaggregálás",
    estimatedMinutes: "40-45 perc",
    summary:
      "Továbbjutási pontokat kell kiszámolni több részfeladat eredményéből.",
    sourceNote:
      "Emelt továbbjutásos drill tie-breakkel és módosított összpontszámmal.",
    qualifyLine: 26,
    contestantLabel: "versenyző",
    context:
      "A selejtezőben minden induló négy feladatból kap pontot. A leggyengébb részpont nem számít bele a végső értékbe.",
    names: ["Mara", "Nina", "Orsi", "Pali", "Reka", "Soma"],
  },
  {
    id: "dobogotabla",
    title: "Dobogótábla",
    family: "rangsorolás és pontaggregálás",
    estimatedMinutes: "40-45 perc",
    summary:
      "Több versenyszámból kell közös ponttáblát előállítani.",
    sourceNote:
      "Összetett pontképzésre épülő emelt feladat könnyen ellenőrizhető kimenettel.",
    qualifyLine: 24,
    contestantLabel: "csapat",
    context:
      "Az összetett diákolimpián a csapatok négy külön számban indulnak. A dobogóhoz közös ponttábla készül.",
    names: ["Szikra", "Taraj", "Ugrás", "Vihar", "Zala", "Ypsilon"],
  },
  {
    id: "csapatvalto",
    title: "Csapatváltó",
    family: "rangsorolás és pontaggregálás",
    estimatedMinutes: "40-45 perc",
    summary:
      "Váltóverseny részpontjaiból kell végső sorrendet készíteni.",
    sourceNote:
      "Emelt szintű rangsoroló rutin a részpontokból képzett végső teljesítményértékkel.",
    qualifyLine: 28,
    contestantLabel: "váltócsapat",
    context:
      "A váltóversenyben minden csapat négy szakaszidőből kap pontot. A leggyengébb részpont itt sem számít bele a végső eredménybe.",
    names: ["Aero", "Brix", "Comet", "Drift", "Echo", "Flash"],
  },
  {
    id: "futamliga",
    title: "Futamliga",
    family: "rangsorolás és pontaggregálás",
    estimatedMinutes: "40-45 perc",
    summary:
      "Négy futamból kell ligatáblát készíteni összetett pontozással.",
    sourceNote:
      "Platformos emelt pontversenyes feladat sportligás történettel.",
    qualifyLine: 25,
    contestantLabel: "induló",
    context:
      "Az iskolai futamliga minden indulóhoz négy részpontot rögzít. Ezekből kell megállapítani a végső rangsort és a továbbjutókat.",
    names: ["G1", "G2", "G3", "G4", "G5", "G6"],
  },
  {
    id: "evadtabla",
    title: "Évadtábla",
    family: "rangsorolás és pontaggregálás",
    estimatedMinutes: "40-45 perc",
    summary:
      "Évad közbeni részpontokból kell módosított ponttáblát készíteni.",
    sourceNote:
      "Emelt rekordfeldolgozás ugyanazzal a logikával, mint a többrészes versenyszimulációkban.",
    qualifyLine: 26,
    contestantLabel: "csapat",
    context:
      "Egy teljes tanéves bajnokság rövidített pontlistája áll rendelkezésre. A négy fordulóból összetett ponttábla készül.",
    names: ["Hora", "Iris", "Kappa", "Lumen", "Nova", "Omega"],
  },
  {
    id: "orszagkor",
    title: "Országkör",
    family: "rangsorolás és pontaggregálás",
    estimatedMinutes: "40-45 perc",
    summary:
      "Több állomás eredményeiből kell közös sorrendet és küszöbszámítást adni.",
    sourceNote:
      "Emelt szintű pontaggregáló gyakorló utazóversenyes történettel.",
    qualifyLine: 27,
    contestantLabel: "páros",
    context:
      "Az országkör vetélkedő párosai négy állomáson kaptak pontot. A végső sorrendhez a legkisebb részpont kiesik.",
    names: ["Paar1", "Paar2", "Paar3", "Paar4", "Paar5", "Paar6"],
  },
] as const;

export const emeltPracticeTasks = [
  ...fileTasks.map(buildEmeltFileAnalyticsTask),
  ...routeTasks.map(buildEmeltRouteTask),
  ...schedulingTasks.map(buildEmeltSchedulingTask),
  ...asciiTasks.map(buildEmeltAsciiTask),
  ...accessTasks.map(buildEmeltAccessLogTask),
  ...leaderboardTasks.map(buildEmeltLeaderboardTask),
];