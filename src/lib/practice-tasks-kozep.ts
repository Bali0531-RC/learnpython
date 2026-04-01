import {
  buildKozepBoundedStateTask,
  buildKozepFileStatsTask,
  buildKozepNumericStatsTask,
  buildKozepRankingTask,
  buildKozepTimeWindowTask,
  buildKozepValidationTask,
} from "@/lib/practice-task-factories";

const numericTasks = [
  {
    id: "sorfigyelo",
    title: "Sorfigyelő",
    family: "gyűjtés és kiválasztás",
    estimatedMinutes: "20-25 perc",
    summary:
      "Pénztársorok adataiból kell gyors összesítést, maximumkeresést és állapotjelzést készíteni.",
    sourceNote:
      "Saját szövegezésű közép szintű rutin, amely ugyanazt a gyűjtési gondolkodást gyakoroltatja, mint a vizsgán tipikus rövidebb adatsoros feladatok.",
    threshold: 5,
    calmLimit: 3,
    measurementLabel: "sorhossz",
    context:
      "Egy iskolai büfében minden pénztárnál kijelzik, hány diák várakozik. A műszak végén rövid állapotjelentést kell készíteni az aktuális helyzetről.",
  },
  {
    id: "uzsonnakeret",
    title: "Uzsonnakeret",
    family: "gyűjtés és kiválasztás",
    estimatedMinutes: "20-25 perc",
    summary:
      "Diákonkénti költésekből kell összesíteni a napi terhelést és a kiugró összegeket.",
    sourceNote:
      "Közép szintű pénzügyi rutin új kontextusban, hangsúlyosan kezdőbarát bemenetfeldolgozással.",
    threshold: 1200,
    calmLimit: 900,
    measurementLabel: "költés",
    context:
      "Az osztálykirándulás napján minden tanuló feljegyezte, mennyit költött uzsonnára. A szervező gyors áttekintést kér az összegekről.",
  },
  {
    id: "palacknap",
    title: "Palacknap",
    family: "gyűjtés és kiválasztás",
    estimatedMinutes: "20-25 perc",
    summary:
      "Visszaváltási adatokból kell meghatározni az összbevételhez kapcsolódó alapmutatókat.",
    sourceNote:
      "Egyszerű, vizsgahű számlálási és maximumkeresési gyakorló más történettel.",
    threshold: 20,
    calmLimit: 12,
    measurementLabel: "palackszám",
    context:
      "Az iskola zöldnapján több csapat gyűjtött visszaváltható palackokat. A szervezők a leadott darabszámokból szeretnének rövid összesítést.",
  },
  {
    id: "vizora",
    title: "Vízóra",
    family: "gyűjtés és kiválasztás",
    estimatedMinutes: "20-25 perc",
    summary:
      "Mérési adatokból kell kiemelni az összesített és szélsőértékes jellemzőket.",
    sourceNote:
      "Rövid, közép szintű adatsoros feladat, amely a rutin számolásokat és a fegyelmezett kiírást gyakoroltatja.",
    threshold: 30,
    calmLimit: 18,
    measurementLabel: "fogyasztás",
    context:
      "Egy kollégiumi szinten a napi vízfelhasználásokat kell összesíteni, hogy látható legyen, mikor nőtt meg feltűnően a fogyasztás.",
  },
  {
    id: "akkuszint",
    title: "Akkuszint",
    family: "gyűjtés és kiválasztás",
    estimatedMinutes: "20-25 perc",
    summary:
      "Eszközönkénti töltöttségi értékekből kell egyszerű állapotképet készíteni.",
    sourceNote:
      "Kezdőbarát közép drill digitális kultúra közegben, tiszta számlálási mintával.",
    threshold: 40,
    calmLimit: 25,
    measurementLabel: "töltöttségi érték",
    context:
      "A laptopkocsi visszaadásakor minden gépnél feljegyezték az akkumulátor töltöttségét. Ezekből kell gyors összegző jelentést készíteni.",
  },
  {
    id: "buszmegallo",
    title: "Buszmegálló",
    family: "gyűjtés és kiválasztás",
    estimatedMinutes: "20-25 perc",
    summary:
      "Megállónkénti utasszámokból kell megadni a terhelés legfontosabb mutatóit.",
    sourceNote:
      "Közép szintű rutinfeladat új városi sztorival, ugyanarra a feldolgozási mintára építve.",
    threshold: 25,
    calmLimit: 12,
    measurementLabel: "utaslétszám",
    context:
      "Egy iskolabusz reggeli útvonalán több megállóban megszámolták, hány utas várakozik. A járatszervezőnek összesítés kell.",
  },
  {
    id: "hofokor",
    title: "Hőkör",
    family: "gyűjtés és kiválasztás",
    estimatedMinutes: "20-25 perc",
    summary:
      "Óránkénti mérési értékekből kell megmutatni a nap szélső pontjait és a kiugró adatokat.",
    sourceNote:
      "Egyszerű mérési adatos gyakorló, amely a szélsőérték- és darabszámolási logikát gyakoroltatja.",
    threshold: 30,
    calmLimit: 20,
    measurementLabel: "hőmérséklet",
    context:
      "Az iskolaudvaron egy szenzor egész nap mérte a hőmérsékletet. A gondnok rövid áttekintést kér az adatsorról.",
  },
  {
    id: "raktarpolc",
    title: "Raktárpolc",
    family: "gyűjtés és kiválasztás",
    estimatedMinutes: "20-25 perc",
    summary:
      "Polconkénti darabszámokból kell jelezni a készletállapot főbb pontjait.",
    sourceNote:
      "Saját közép feladat készletlogisztikai témában, a klasszikus számlálás-maximum mintára építve.",
    threshold: 15,
    calmLimit: 8,
    measurementLabel: "darabszám",
    context:
      "Egy tanműhely raktárában polconként rögzítették, hány tartalék alkatrész maradt. A műszakvezető ebből szeretne rövid összesítést.",
  },
] as const;

const validationTasks = [
  {
    id: "rajtlista",
    title: "Rajtlista",
    family: "sztringvalidáció és szűrés",
    estimatedMinutes: "25-30 perc",
    summary:
      "Rövid rajtkódokat kell formai szabályok szerint ellenőrizni és összesíteni.",
    sourceNote:
      "Közép szintű, vizsgahű sztringes rutin friss versenyhelyzettel és egyszerű szabályrendszerrel.",
    length: 5,
    prefixLetters: 2,
    preferredStart: "A",
    codeLabel: "rajtkód",
    context:
      "Egy iskolai háziverseny nevezési rendszerében minden induló rövid rajtkódot kap. A szervezők szeretnék kiszűrni a hibás rögzítéseket.",
  },
  {
    id: "jegykod",
    title: "Jegykód",
    family: "sztringvalidáció és szűrés",
    estimatedMinutes: "25-30 perc",
    summary:
      "Belépőjegy-azonosítókról kell eldönteni, melyek felelnek meg a megadott mintának.",
    sourceNote:
      "Formaellenőrző közép gyakorlat új szövegezéssel, a klasszikus prefix-suffix mintára építve.",
    length: 6,
    prefixLetters: 2,
    preferredStart: "J",
    codeLabel: "jegykód",
    context:
      "A sportcsarnok digitális beléptetője minden látogatónak rövid azonosítót ad. A műszak végén ezeket kell ellenőrizni és összesíteni.",
  },
  {
    id: "polccimke",
    title: "Polccímke",
    family: "sztringvalidáció és szűrés",
    estimatedMinutes: "25-30 perc",
    summary:
      "Raktári jelöléseket kell forma szerint validálni és a jó címkéket kigyűjteni.",
    sourceNote:
      "Raktári környezetű közép szintű validációs drill, amely az alap stringműveleteket gyakoroltatja.",
    length: 6,
    prefixLetters: 2,
    preferredStart: "P",
    codeLabel: "polccímke",
    context:
      "A tanműhely új polccímkéket vezet be. Minden címkét meg kell vizsgálni, hogy megfelel-e a belső azonosítási szabálynak.",
  },
  {
    id: "szekrenykulcs",
    title: "Szekrénykulcs",
    family: "sztringvalidáció és szűrés",
    estimatedMinutes: "25-30 perc",
    summary:
      "Öltözőkulcs-kódokat kell ellenőrizni hossz és karakterosztályok alapján.",
    sourceNote:
      "Egyszerű, tiszta közép feladat a többszempontú kódvizsgálat begyakorlására.",
    length: 5,
    prefixLetters: 2,
    preferredStart: "S",
    codeLabel: "kulcskód",
    context:
      "Az uszodai öltözőkulcsok kiosztásakor automatikusan generált kódok keletkeztek. A személyzet ezek helyességét ellenőrzi.",
  },
  {
    id: "teremjel",
    title: "Teremjel",
    family: "sztringvalidáció és szűrés",
    estimatedMinutes: "25-30 perc",
    summary:
      "Teremazonosítókat kell megvizsgálni az iskola jelölési szabálya szerint.",
    sourceNote:
      "Közép validációs rutin iskolai nyilvántartási kontextusban.",
    length: 5,
    prefixLetters: 2,
    preferredStart: "T",
    codeLabel: "teremazonosító",
    context:
      "Az órarendi rendszerbe több új teremjel került be. A hibásan felvitt azonosítókat ki kell szűrni.",
  },
  {
    id: "belepokod",
    title: "Belépőkód",
    family: "sztringvalidáció és szűrés",
    estimatedMinutes: "25-30 perc",
    summary:
      "Egyszerű belépőkódokból kell kiválasztani a helyes formátumú elemeket.",
    sourceNote:
      "Platformos gyakorló, amely a klasszikus vizsgás stringellenőrzést teljesen új történettel adja vissza.",
    length: 6,
    prefixLetters: 2,
    preferredStart: "B",
    codeLabel: "belépőkód",
    context:
      "A könyvtár új kapurendszere rövid belépőkódokat olvas. A tesztüzem után a naplózott kódokat kell ellenőrizni.",
  },
  {
    id: "pultkod",
    title: "Pultkód",
    family: "sztringvalidáció és szűrés",
    estimatedMinutes: "25-30 perc",
    summary:
      "Termékazonosítókból kell meghatározni, melyek vehetők fel a pultkészletbe.",
    sourceNote:
      "Közép szintű azonosítóvalidálás kereskedelmi környezetben.",
    length: 5,
    prefixLetters: 2,
    preferredStart: "P",
    codeLabel: "pultazonosító",
    context:
      "A büfé új termékcímkéi rövid pultkódot kapnak. A beérkező kódokat a készletfeltöltés előtt ellenőrizni kell.",
  },
  {
    id: "csomagkod",
    title: "Csomagkód",
    family: "sztringvalidáció és szűrés",
    estimatedMinutes: "25-30 perc",
    summary:
      "Futárcsomag-kódokat kell forma szerint szűrni és lexikusan rendezett módon értékelni.",
    sourceNote:
      "Egyszerű, de vizsgahű validációs drill logisztikai történettel.",
    length: 6,
    prefixLetters: 2,
    preferredStart: "C",
    codeLabel: "csomagkód",
    context:
      "A suli recepciójára érkező küldemények mind rövid azonosítót kapnak. Ezek közül kell kiszűrni a szabályos formátumúakat.",
  },
] as const;

const timeTasks = [
  {
    id: "buszora",
    title: "Buszóra",
    family: "időkezelés és szélsőértékek",
    estimatedMinutes: "25-30 perc",
    summary:
      "Érkezési időpontokból kell a nap szélső pontjait és a kritikus idősávokat megadni.",
    sourceNote:
      "Időpontkezelős közép rutin, amely a HH:MM alakú inputokkal való biztonságos munkát gyakoroltatja.",
    thresholdTime: "08:30",
    timeLabel: "buszérkezés",
    context:
      "A közlekedési szakkör feljegyezte a reggeli járatok érkezési idejét. Ezekből kell rövid pontossági áttekintést készíteni.",
  },
  {
    id: "csengorend",
    title: "Csengőrend",
    family: "időkezelés és szélsőértékek",
    estimatedMinutes: "25-30 perc",
    summary:
      "Napi csengetési időpontokból kell meghatározni a legrövidebb és leghosszabb idősávokat.",
    sourceNote:
      "Közép feladat iskolai időbeosztásos történettel, biztos típusátalakítási igénnyel.",
    thresholdTime: "10:00",
    timeLabel: "csengetés",
    context:
      "Egy próbanapon eltérő csengetési rendet teszteltek. A rögzített időpontokat most ellenőrizni kell.",
  },
  {
    id: "futamido",
    title: "Futamidő",
    family: "időkezelés és szélsőértékek",
    estimatedMinutes: "25-30 perc",
    summary:
      "Versenyidőkből kell gyorsan kiválasztani a szélsőket és a megadott határidő fölötti értékeket.",
    sourceNote:
      "Sporteredményes közép drill, amely a percekre bontott időkezelést rutinosítja.",
    thresholdTime: "13:00",
    timeLabel: "futamidő",
    context:
      "Az iskolai terepfutás részidejeit HH:MM alakban mentették el. A szervezők a szélső eredményekre kíváncsiak.",
  },
  {
    id: "szunetfigyelo",
    title: "Szünetfigyelő",
    family: "időkezelés és szélsőértékek",
    estimatedMinutes: "25-30 perc",
    summary:
      "Ügyeleti időpontokból kell összefoglalni, mikor volt a legnagyobb késés vagy csúszás.",
    sourceNote:
      "Rövid időpontkezelős feladat tanórai környezetben, egyszerű összehasonlításokra építve.",
    thresholdTime: "09:45",
    timeLabel: "ügyeleti kezdés",
    context:
      "A tanári ügyeletek kezdési időpontjait összegyűjtötték. Ezekből kell a nap késési mintáit áttekinteni.",
  },
  {
    id: "idobeosztas",
    title: "Időbeosztás",
    family: "időkezelés és szélsőértékek",
    estimatedMinutes: "25-30 perc",
    summary:
      "Délutáni programkezdésekből kell kiválasztani a legkorábbi és legkésőbbi időpontokat.",
    sourceNote:
      "Időrendi gondolkodást erősítő közép gyakorlat személyes programtervezési történettel.",
    thresholdTime: "15:00",
    timeLabel: "programkezdés",
    context:
      "Egy diák minden délutáni elfoglaltságához felírta a kezdési időpontot. A lista alapján szeretne gyors áttekintést készíteni.",
  },
  {
    id: "mozimaraton",
    title: "Mozimaraton",
    family: "időkezelés és szélsőértékek",
    estimatedMinutes: "25-30 perc",
    summary:
      "Vetítési kezdésekből kell ellenőrizni, mely időpontok számítanak későinek a programban.",
    sourceNote:
      "Szórakoztató kontextusú közép rutin, változatlanul vizsgahű időkezelési mintával.",
    thresholdTime: "20:00",
    timeLabel: "vetítéskezdés",
    context:
      "A filmklub egy maratoni vetítés estéjére időpontlistát készített. A szervező azt nézi, meddig húzódik el a program.",
  },
  {
    id: "teremberlet",
    title: "Terembérlet",
    family: "időkezelés és szélsőértékek",
    estimatedMinutes: "25-30 perc",
    summary:
      "Foglalási kezdésekből kell gyors kimutatást készíteni a kritikus idősávokról.",
    sourceNote:
      "Közép szintű időpontkezelős feladat helyiségfoglalási témában.",
    thresholdTime: "17:30",
    timeLabel: "foglalási kezdés",
    context:
      "A közösségi ház termeit több délutáni foglalás érinti. A vezető a kezdési időpontokból kér összesítést.",
  },
  {
    id: "oraindulas",
    title: "Óraindulás",
    family: "időkezelés és szélsőértékek",
    estimatedMinutes: "25-30 perc",
    summary:
      "Próbaórák kezdési időpontjaiból kell meghatározni a nap szélső pontjait.",
    sourceNote:
      "Iskolai környezetű, rövid időkezeléses gyakorlat a biztos parsing begyakorlására.",
    thresholdTime: "11:15",
    timeLabel: "óraindulás",
    context:
      "A nyílt napon több bemutatóóra indult eltérő időpontokban. A szervezők ezeket szeretnék gyorsan összesíteni.",
  },
] as const;

const stateTasks = [
  {
    id: "lampasor",
    title: "Lámpasor",
    family: "egyszerű állapotszimuláció",
    estimatedMinutes: "25-30 perc",
    summary:
      "Kapcsolásokból kell követni egy lámpasor aktív állapotának változását fix korlátok között.",
    sourceNote:
      "Állapotkövetős közép rutin, egyetlen számszerű állapot mentén felépítve.",
    limit: 8,
    stateLabel: "bekapcsolt lámpák száma",
    context:
      "Egy folyosón egyszerre legfeljebb nyolc díszlámpa világíthat. A kapcsolási naplóból kell követni, hogyan változott a világító lámpák száma.",
  },
  {
    id: "liftnaplo",
    title: "Liftnapló",
    family: "egyszerű állapotszimuláció",
    estimatedMinutes: "25-30 perc",
    summary:
      "Emeletváltásokból kell meghatározni a végső pozíciót és a hibás mozgásokat.",
    sourceNote:
      "Közép szintű szimuláció a korlátos állapotváltozás begyakorlására.",
    limit: 10,
    stateLabel: "emeletszint",
    context:
      "Egy kis lift a földszintet 0-nak tekinti, és legfeljebb a 10. emeletig közlekedik. A naplózott mozgásokat kell feldolgozni.",
  },
  {
    id: "karszalag",
    title: "Karszalag",
    family: "egyszerű állapotszimuláció",
    estimatedMinutes: "25-30 perc",
    summary:
      "Belépési és kilépési változásokból kell követni a bent lévők számát.",
    sourceNote:
      "Rendezvényes közép feladat, amely egyetlen állapotváltozót követ végig.",
    limit: 40,
    stateLabel: "bentlétszám",
    context:
      "Az iskolaudvari rendezvény területére karszalaggal léphetnek be a diákok. A kapunál mért változásokat kell összesíteni.",
  },
  {
    id: "parkolohaz",
    title: "Parkolóház",
    family: "egyszerű állapotszimuláció",
    estimatedMinutes: "25-30 perc",
    summary:
      "Behajtási és kihajtási adatokból kell követni a foglaltság változását.",
    sourceNote:
      "Kapacitáskorlátos közép szimuláció parkolási történettel.",
    limit: 60,
    stateLabel: "foglaltság",
    context:
      "Egy kisebb parkolóházba egész nap autók érkeznek és távoznak. A naplózott változásokból kell összesítést készíteni.",
  },
  {
    id: "termosztat",
    title: "Termosztát",
    family: "egyszerű állapotszimuláció",
    estimatedMinutes: "25-30 perc",
    summary:
      "Hőfokváltozásokat kell követni korlátozott skálán és a túlfutó lépéseket számolni.",
    sourceNote:
      "Közép szintű változáskövetős drill egyszerű természeti kontextusban.",
    limit: 30,
    stateLabel: "hőfokszint",
    context:
      "Egy termosztát belső skálája 0 és 30 között mozog. A gombnyomások hatására változó értéket kell követni, a hibás lépések külön számításával.",
  },
  {
    id: "kapunyitas",
    title: "Kapunyitás",
    family: "egyszerű állapotszimuláció",
    estimatedMinutes: "25-30 perc",
    summary:
      "Kapun áthaladó csoportok változásaiból kell kiszámolni a pillanatnyi terhelést.",
    sourceNote:
      "Állapotfrissítős közép gyakorló rendezvénykapus történettel.",
    limit: 50,
    stateLabel: "területen lévők száma",
    context:
      "A sportnap bejáratánál egyszerre legfeljebb ötven diák tartózkodhat a kordonon belül. A belépések és kilépések változásait kell követni.",
  },
  {
    id: "buszkor",
    title: "Buszkör",
    family: "egyszerű állapotszimuláció",
    estimatedMinutes: "25-30 perc",
    summary:
      "Fel- és leszálló utasokból kell követni az iskolabusz pillanatnyi terhelését.",
    sourceNote:
      "Közép szintű menetszimuláció egyszerű számlálási állapottal.",
    limit: 45,
    stateLabel: "utaslétszám",
    context:
      "Egy körjáratú iskolabuszon minden megálló után feljegyezték, mennyivel változott az utasok száma. Ezt kell feldolgozni.",
  },
  {
    id: "lepcsojarat",
    title: "Lépcsőjárat",
    family: "egyszerű állapotszimuláció",
    estimatedMinutes: "25-30 perc",
    summary:
      "Szintváltozásokat kell követni lépcsőfokokban megadott változások alapján.",
    sourceNote:
      "Rövid, kezdőbarát szimulációs feladat a biztonságos állapotkövetés gyakorlására.",
    limit: 30,
    stateLabel: "szintpozíció",
    context:
      "Egy karbantartó robot lépcsőn halad fel és le egy épületben. A mozgásait pozitív és negatív lépések írják le.",
  },
] as const;

const fileTasks = [
  {
    id: "osztalykirandulas",
    title: "Osztálykirándulás",
    family: "fájlos rekordfeldolgozás",
    estimatedMinutes: "25-30 perc",
    summary:
      "Befizetési adatokból kell összesíteni a jelentkezők terhelését és a kiugró értékeket.",
    sourceNote:
      "Fájlos közép feladat, amely a beolvasás és az alaprekord-összesítés biztos gyakorlását adja.",
    filePath: "resztvevok.txt",
    fileDescription: "Mintaállomány az osztálykirándulás befizetési adataival.",
    threshold: 18000,
    recordLabel: "tanuló",
    valueLabel: "befizetett összeg",
    context:
      "A kirándulás szervezője minden jelentkezőnél feljegyezte, mennyit fizetett be. A fájlból kell összesítést készíteni.",
    names: ["Anna", "Bence", "Csilla", "Dani", "Eszter", "Feri"],
    values: [16000, 18000, 20000, 14000, 19000, 17500],
  },
  {
    id: "sportkor",
    title: "Sportkör",
    family: "fájlos rekordfeldolgozás",
    estimatedMinutes: "25-30 perc",
    summary:
      "Jelentkezési adatokból kell összefoglalni a létszámot és a legnépszerűbb elemeket.",
    sourceNote:
      "Kezdőbarát fájlos feldolgozás sportos környezetben, az alapműveletekre fókuszálva.",
    filePath: "jelentkezes.txt",
    fileDescription: "Mintaállomány a sportköri jelentkezésekkel.",
    threshold: 20,
    recordLabel: "csoport",
    valueLabel: "létszám",
    context:
      "Az iskola sportköreihez csoportonként rögzítették a jelentkezők számát. Ezekből kell rövid összegző jelentést készíteni.",
    names: ["Foci", "Kosar", "Roplabda", "Futas", "Asztalitenisz", "Tura"],
    values: [24, 18, 21, 15, 12, 20],
  },
  {
    id: "menzahet",
    title: "Menzahet",
    family: "fájlos rekordfeldolgozás",
    estimatedMinutes: "25-30 perc",
    summary:
      "Heti menüadatokból kell megmutatni a forgalmasabb napokat és az összegzést.",
    sourceNote:
      "Fájlos közép rutin a rekordsorok szabályos feldolgozására.",
    filePath: "menza.txt",
    fileDescription: "Mintaállomány a heti menzarendelésekkel.",
    threshold: 100,
    recordLabel: "nap",
    valueLabel: "adagdarab",
    context:
      "A menza heti rendelésszámait naponként gyűjtötték össze. A fájl alapján kell rövid áttekintést készíteni.",
    names: ["Hetfo", "Kedd", "Szerda", "Csutortok", "Pentek"],
    values: [96, 110, 104, 88, 120],
  },
  {
    id: "konyvkolcsonzes",
    title: "Könyvkölcsönzés",
    family: "fájlos rekordfeldolgozás",
    estimatedMinutes: "25-30 perc",
    summary:
      "Olvasónkénti darabszámokból kell meghatározni a kiugró és összesített értékeket.",
    sourceNote:
      "Könyvtári kontextusú fájlos közép feladat a klasszikus rekordkezelés begyakorlására.",
    filePath: "kolcsonzes.txt",
    fileDescription: "Mintaállomány a nyitott kölcsönzések darabszámaival.",
    threshold: 4,
    recordLabel: "olvasó",
    valueLabel: "nyitott könyvek száma",
    context:
      "A könyvtár nap végén olvasónként összesíti, kinél hány nyitott kölcsönzés maradt. A fájlból kell jelentést készíteni.",
    names: ["Anna", "Bori", "Csanad", "Dorka", "Emese", "Geri"],
    values: [2, 5, 3, 6, 1, 4],
  },
  {
    id: "vizallas",
    title: "Vízállás",
    family: "fájlos rekordfeldolgozás",
    estimatedMinutes: "25-30 perc",
    summary:
      "Napi mérésekből kell kiemelni a szélső pontokat és a riasztási küszöböt átlépő adatokat.",
    sourceNote:
      "Mérési témájú fájlos közép gyakorlat, a biztos beolvasási fegyelemre építve.",
    filePath: "vizallas.txt",
    fileDescription: "Mintaállomány a napi vízállás-adatokkal.",
    threshold: 300,
    recordLabel: "nap",
    valueLabel: "centiméterben mért vízállás",
    context:
      "A folyó vízállását több napon keresztül rögzítették. A mérésekből kell összesítést készíteni.",
    names: ["Nap1", "Nap2", "Nap3", "Nap4", "Nap5", "Nap6"],
    values: [245, 280, 301, 295, 320, 315],
  },
  {
    id: "uzemnaplo",
    title: "Üzemnapló",
    family: "fájlos rekordfeldolgozás",
    estimatedMinutes: "25-30 perc",
    summary:
      "Gépenkénti üzemidőkből kell összeállítani a rövid műhelyjelentést.",
    sourceNote:
      "Platformos fájlos gyakorló, amely a közép szintű rekordösszegzést ipari közegben jeleníti meg.",
    filePath: "uzem.txt",
    fileDescription: "Mintaállomány a napi üzemórákkal.",
    threshold: 9,
    recordLabel: "gép",
    valueLabel: "üzemóra",
    context:
      "A tanműhely gépeiről nap végén feljegyezték, hány órát működtek. Ezekből kell gyors összefoglalót készíteni.",
    names: ["CNC1", "CNC2", "Furo", "Eszterga", "Nyomtato", "Lezer"],
    values: [7, 10, 6, 9, 4, 11],
  },
  {
    id: "palyalap",
    title: "Pályalap",
    family: "fájlos rekordfeldolgozás",
    estimatedMinutes: "25-30 perc",
    summary:
      "Sportállomások pontszámaiból kell rövid minősítési összesítést készíteni.",
    sourceNote:
      "Fájlos közép rutin sportos témával, ugyanarra a feldolgozási logikára építve mint a vizsgás rekordfeladatok.",
    filePath: "pontok.txt",
    fileDescription: "Mintaállomány a sportállomások pontjaival.",
    threshold: 80,
    recordLabel: "állomás",
    valueLabel: "pontszám",
    context:
      "A sportnap több ügyességi állomásán pontokat értek el a csapatok. Az állomások összesített pontjait kell feldolgozni.",
    names: ["Sprint", "Dobas", "Ugras", "Egyensuly", "Futas", "Celzas"],
    values: [78, 84, 69, 91, 88, 73],
  },
  {
    id: "jegyeladas",
    title: "Jegyeladás",
    family: "fájlos rekordfeldolgozás",
    estimatedMinutes: "25-30 perc",
    summary:
      "Jegykategóriák eladásaiból kell bevételi jellegű alapszámításokat készíteni.",
    sourceNote:
      "Egyszerű, de vizsgahű fájlos drill kereskedelmi történettel.",
    filePath: "jegyek.txt",
    fileDescription: "Mintaállomány a kategóriánkénti eladott jegyek számával.",
    threshold: 150,
    recordLabel: "jegykategória",
    valueLabel: "eladott darab",
    context:
      "Az iskolai gálára többféle jegykategóriát árultak. A szervezők a napi eladott darabszámokat szeretnék áttekinteni.",
    names: ["Diak", "Felnott", "Csaladi", "Tamogato", "VIP", "Kisero"],
    values: [180, 95, 72, 34, 20, 110],
  },
  {
    id: "kertmero",
    title: "Kertmérő",
    family: "fájlos rekordfeldolgozás",
    estimatedMinutes: "25-30 perc",
    summary:
      "Kerti szenzoradatokból kell határértékes és összegző mutatókat előállítani.",
    sourceNote:
      "Fájlból dolgozó közép gyakorló mérési és gondozási történettel.",
    filePath: "szenzor.txt",
    fileDescription: "Mintaállomány a kerti szenzorok napi értékeivel.",
    threshold: 70,
    recordLabel: "mérőpont",
    valueLabel: "nedvességi érték",
    context:
      "Az iskolaudvar veteményesében több ponton mérték a talaj nedvességét. A gondnok ezekből kér gyors áttekintést.",
    names: ["A1", "A2", "B1", "B2", "C1", "C2"],
    values: [65, 72, 58, 77, 69, 81],
  },
] as const;

const rankingTasks = [
  {
    id: "locsolokor",
    title: "Locsolókör",
    family: "rangsorolás és tie-break",
    estimatedMinutes: "30-35 perc",
    summary:
      "Csapatonkénti pontokból kell kiválasztani a győztest és a küszöb felettieket.",
    sourceNote:
      "Közép szintű pontösszegzős feladat, amely az egyszerű tie-break logikát is megköveteli.",
    qualifyLine: 24,
    contestantLabel: "csapat",
    context:
      "A fenntarthatósági napon több csapat vett részt egy ügyességi körjátékban. A három állomáson szerzett pontokat kell összesíteni.",
    names: ["Bodor", "Cser", "Dio", "Fuge", "Gyertyan"],
  },
  {
    id: "ponttabla",
    title: "Ponttábla",
    family: "rangsorolás és tie-break",
    estimatedMinutes: "30-35 perc",
    summary:
      "Fordulónkénti pontokból kell végső sorrendet és összesítő értékeket számolni.",
    sourceNote:
      "Vizsgahű közép gyakorló a rekordokból képzett végpontszámok begyakorlására.",
    qualifyLine: 22,
    contestantLabel: "versenyző",
    context:
      "Egy házi vetélkedő három fordulójának pontjai állnak rendelkezésre. Ezekből kell rövid eredménylistát készíteni.",
    names: ["Anna", "Bela", "Cinti", "Dani", "Emmi"],
  },
  {
    id: "suti-verseny",
    title: "Süti-verseny",
    family: "rangsorolás és tie-break",
    estimatedMinutes: "30-35 perc",
    summary:
      "Zsűripontokból kell kiválasztani a legerősebb nevezést és az összesített mutatókat.",
    sourceNote:
      "Közép rangsoroló feladat hétköznapi történettel, de vizsgaszerű pontszámítással.",
    qualifyLine: 23,
    contestantLabel: "nevező",
    context:
      "Az iskolai süti-versenyen minden nevező három zsűripontot kapott. A szervezők gyors végeredményt kérnek.",
    names: ["Alma", "Barack", "Csoki", "Dio", "Eper"],
  },
  {
    id: "teremliga",
    title: "Teremliga",
    family: "rangsorolás és tie-break",
    estimatedMinutes: "30-35 perc",
    summary:
      "Mini bajnoki pontokból kell meghatározni a sorrendet és a kvalifikáltakat.",
    sourceNote:
      "Pontösszegzésre és rendezett kiválasztásra épülő közép gyakorló sportos kontextusban.",
    qualifyLine: 21,
    contestantLabel: "csapat",
    context:
      "A tornatermi ligában öt csapat három rövid mérkőzésen gyűjtött pontokat. Ezekből kell a végeredményt összeállítani.",
    names: ["Aqua", "Bora", "Ciklon", "Deru", "Elet"],
  },
  {
    id: "celdobas",
    title: "Céldobás",
    family: "rangsorolás és tie-break",
    estimatedMinutes: "30-35 perc",
    summary:
      "Háromkörös eredményekből kell összesített helyezést készíteni.",
    sourceNote:
      "Egyszerű, vizsgahű rekordfeldolgozás pontversenyes történettel.",
    qualifyLine: 20,
    contestantLabel: "dobó",
    context:
      "A céldobó állomáson minden tanuló három kísérletet tett. A pontokból kell meghatározni a sorrendet.",
    names: ["Aron", "Bori", "Csanad", "Dori", "Erik"],
  },
  {
    id: "medencekor",
    title: "Medencekör",
    family: "rangsorolás és tie-break",
    estimatedMinutes: "30-35 perc",
    summary:
      "Úszóeredményekből kell összesített pontlistát előállítani.",
    sourceNote:
      "Közép szintű eredményfeldolgozás, amely a pontos pontösszegzésre és tie-breakre koncentrál.",
    qualifyLine: 24,
    contestantLabel: "úszó",
    context:
      "Az uszodai körversenyen minden induló három feladatban kapott pontot. A nap végére végső sorrend kell.",
    names: ["Lili", "Mira", "Nori", "Oliv", "Peti"],
  },
  {
    id: "eredmenytabla",
    title: "Eredménytábla",
    family: "rangsorolás és tie-break",
    estimatedMinutes: "30-35 perc",
    summary:
      "Pontszámokból kell rövid eredménytáblát és kvalifikációs összegzést készíteni.",
    sourceNote:
      "Rangsorolós közép gyakorló, amely szándékosan egyszerű adatmodellt használ a biztos megoldhatóságért.",
    qualifyLine: 25,
    contestantLabel: "résztvevő",
    context:
      "Egy tanulmányi miniolimpián a résztvevők három rövid részfeladatban szereztek pontot. A szervezők összesítést kérnek.",
    names: ["Rita", "Soma", "Toni", "Uri", "Vera"],
  },
  {
    id: "csapatsorrend",
    title: "Csapatsorrend",
    family: "rangsorolás és tie-break",
    estimatedMinutes: "30-35 perc",
    summary:
      "Csapateredményekből kell abc-tie-breakkel végleges sorrendet felállítani.",
    sourceNote:
      "Közép szintű táblázatszerű eredményfeldolgozás új iskolai történettel.",
    qualifyLine: 23,
    contestantLabel: "csapat",
    context:
      "Az iskolaudvari challenge-n öt csapat három modulból kapott pontot. Ezeket kell egyetlen eredménylistába rendezni.",
    names: ["Villam", "Zefir", "Yeti", "Xeno", "Watt"],
  },
  {
    id: "kispalya",
    title: "Kispálya",
    family: "rangsorolás és tie-break",
    estimatedMinutes: "30-35 perc",
    summary:
      "Mini tornán szerzett pontokból kell győztest és összesített mutatókat számolni.",
    sourceNote:
      "Sportos, közép nehézségű rangsoroló feladat jól átlátható rekordstruktúrával.",
    qualifyLine: 22,
    contestantLabel: "csapat",
    context:
      "A kispályás szüneti bajnokságban minden csapat három forduló alatt gyűjtött pontot. A végső rangsort kell meghatározni.",
    names: ["Lendulet", "Meteo", "Napsugar", "Orveny", "Pajzs"],
  },
] as const;

export const kozepPracticeTasks = [
  ...numericTasks.map(buildKozepNumericStatsTask),
  ...validationTasks.map(buildKozepValidationTask),
  ...timeTasks.map(buildKozepTimeWindowTask),
  ...stateTasks.map(buildKozepBoundedStateTask),
  ...fileTasks.map(buildKozepFileStatsTask),
  ...rankingTasks.map(buildKozepRankingTask),
];