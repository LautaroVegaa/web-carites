// backend/seed.js
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config(); // Para que lea mongo URI


const services = [

    {
    id: 21,
    title: "Gambe Leggere",
    domicilio: true,
    description: "Trattamento drenante per le gambe con scrub, guasha e dry brushing per stimolare la circolazione e donare leggerezza. Disponibile in locale o a domicilio.",
    duration: "45 min",
    price: 30,
    isPromo: false,
    isMethod: false,
    category: "drenanti",
    image: "assets/img/massaggio-gambe-leggere.jpg",
    details: [
        "Risveglio della circolazione - Lo scrub con manopola e movimenti ascendenti prepara la pelle e stimola la microcircolazione.",
        "Attivazione e drenaggio - Il lavoro con guasha favorisce una piacevole sensazione di leggerezza e benessere.",
        "Dry brushing tonificante - La spazzolatura a secco rivitalizza i tessuti e sostiene il naturale ritorno circolatorio.",
        "Nutrimento e fluidità - Olio di mandorle e spazzola in silicone accompagnano il corpo verso distensione e comfort.",
        "Massaggio ritmico finale - Manualità lente e ascendenti completano il rituale lasciando le gambe più leggere e vitali."
    ]
    },
    {
    id: 20,
    title: "Spa di piedi",
    domicilio: true,
    description: "Rituale completo per i piedi con pediluvio ai sali, lavoro profondo e chiusura aromatica per rilassamento e benessere. Disponibile in locale o a domicilio.",
    duration: "60 min",
    price: 30,
    isPromo: false,
    isMethod: false,
    category: "rilassanti",
    image: "assets/img/massaggio-spa-piedi.jpg",
    details: [
        "Pediluvio rilassante con sali - Il trattamento inizia con un bagno caldo ai piedi per favorire rilassamento, benessere e preparazione al massaggio.",
        "Lavoro profondo su tallone e pianta - Manualità dedicate a tendine d'Achille, tallone, arco plantare e pianta del piede aiutano a sciogliere tensioni e affaticamento.",
        "Massaggio completo del piede - Il lavoro prosegue su dita, pianta, collo del piede e caviglia per una sensazione di leggerezza e comfort.",
        "Distensione e rilassamento profondo - Il trattamento aiuta a ridurre stress e tensioni accumulate durante la giornata.",
        "Chiusura aromatica e asciugamani calda - Oli essenziali, Olio 31 e il calore finale completano il rituale donando una piacevole sensazione di benessere."
    ]
    },
    {
  id: 19,
  title: "Massaggio anticellulite glutei",
  description: "Trattamento mirato alla zona glutea per stimolare la microcircolazione, favorire il drenaggio e migliorare compattezza e tonicità della pelle.",
  duration: "30 min",
  price: 20,
  isPromo: false,
  isMethod: false,
  category: "drenanti",
  image: "assets/img/massaggio-glutei.jpeg",
  details: [
    "Riduzione dell’effetto “buccia d’arancia” - Le tecniche mirate stimolano la microcircolazione, migliorando visibilmente la texture della pelle.",
    "Drenaggio e riduzione dei ristagni - Favorisce l’eliminazione dei liquidi in eccesso e delle tossine localizzate nella zona glutea.",
    "Tonificazione e rimodellamento - L’azione manuale profonda aiuta a rassodare e ridefinire i contorni.",
    "Stimolazione del metabolismo locale - Riattiva il tessuto connettivo, migliorando ossigenazione e nutrimento cellulare.",
    "Sensazione di compattezza e vitalità - Dopo la seduta la pelle appare più tonica, elastica e levigata."
    ]
    },
    {
    id: 18,
    title: "Massaggio bioattivo decontratturante + luce rossa",
    description: "Massaggio profondo con integrazione di luce rossa per sciogliere contratture, ridurre infiammazione e accelerare il recupero muscolare.",
    duration: "60 min",
    price: 35,
    isPromo: false,
    isMethod: false,
    category: "muscolare",
    image: "assets/img/massaggio-bioattivo.jpeg",
    details: [
        "Rilascio profondo delle contratture - La combinazione di manualità e luce rossa favorisce uno scioglimento più rapido ed efficace delle tensioni muscolari profonde.",
        "Riduzione di dolore e infiammazione - La luce rossa stimola la microcircolazione e supporta i naturali processi antinfiammatori dei tessuti.",
        "Maggiore elasticità e mobilità - Il trattamento migliora la flessibilità muscolare e articolare, restituendo libertà di movimento.",
        "Recupero muscolare accelerato - Ideale in caso di stress fisico, posture scorrette o affaticamento prolungato, favorisce la rigenerazione dei tessuti.",
        "Benessere e rilassamento profondo - Induce una sensazione di calore, leggerezza e rilassamento duraturo."
    ]
    },
    {
    id: 17,
    title: "Gomming viso rigenerante",
    description: "Trattamento rigenerante del viso che stimola la microcircolazione e dona luminosità, tonicità e rilassamento profondo.",
    duration: "45 min",
    price: 20,
    isPromo: false,
    isMethod: false,
    category: "viso",
    image: "assets/img/massaggio-gomming-viso.png",
    details: [
        "Stimolazione profonda della microcircolazione del viso - La tecnica Gomming, eseguita con guanti e gel ad alta aderenza, stimola la microcircolazione sanguigna e linfatica del viso, favorendo ossigenazione dei tessuti, luminosità e vitalità della pelle.",
        "Rigenerazione dei tessuti e lavoro fasciale mirato - L’azione di trazione e mobilizzazione profonda agisce sulle fasce del viso, migliorando elasticità, tonicità cutanea e capacità di rigenerazione cellulare.",
        "Rilascio delle tensioni muscolari facciali - Ideale per sciogliere tensioni accumulate su mandibola, zigomi, fronte e contorno occhi, spesso legate a stress, espressioni contratte o affaticamento mentale.",
        "Effetto distensivo e luminosità naturale - Il trattamento favorisce un aspetto più disteso e armonioso del viso, donando una sensazione di freschezza, leggerezza e naturale luminosità della pelle.",
        "Benessere integrato viso–mente - Il ritmo lento e profondo del Gomming aiuta il sistema nervoso a rilassarsi, favorendo una sensazione di calma, centratura e benessere profondo dopo la seduta."
    ]
    },
    {
    id: 16,
    title: "Gomming circolatorio gambe totale",
    description: "Trattamento profondo per stimolare la circolazione sanguigna e linfatica delle gambe, favorendo leggerezza e rigenerazione.",
    duration: "60 min",
    price: 30,
    isPromo: false,
    isMethod: false,
    category: "drenanti",
    image: "assets/img/massaggio-gomming-gambe.png",
    details: [
        "Stimolazione profonda della circolazione sanguigna e linfatica - La tecnica Gomming, eseguita con guanti e gel ad alta aderenza, favorisce il ritorno venoso e il drenaggio linfatico, aiutando a ridurre gonfiore e sensazione di gambe pesanti.",
        "Rigenerazione dei tessuti e lavoro fasciale mirato - L’azione di trazione e mobilizzazione profonda stimola le fasce e il tessuto connettivo, migliorando elasticità, nutrimento cellulare e capacità di recupero.",
        "Rilascio delle tensioni muscolari profonde - Ideale per sciogliere rigidità accumulate su polpacci, cosce e zona poplitea, spesso legate a posture prolungate, stress o affaticamento fisico.",
        "Sensazione di leggerezza e vitalità - Il trattamento riattiva la circolazione energetica delle gambe, donando una percezione immediata di leggerezza, calore e maggiore presenza corporea.",
        "Benessere integrato corpo–mente - Il ritmo lento e profondo del Gomming aiuta il sistema nervoso a rilassarsi, favorendo un senso di stabilità, radicamento e rigenerazione dopo la seduta."
    ]
    },
    { id: 15,  title: "Massaggio Relax Totale   '4 in 1'",
        description: "Un'esperienza 4 in 1 che unisce massaggio rilassante, Reiki, Shiatsu e riflessologia plantare per un riequilibrio completo.",
        duration: "90 min",
        price: 40,
        isPromo: false,
        isMethod: true,
        category: "profondi",
        image: "assets/img/massaggio-relax-totale.jpg",
        details: [
            "Esperienza di benessere completa - Unisce tecniche occidentali e orientali per agire su corpo, mente ed energia in un'unica seduta.",
            "Rilassamento profondo e riequilibrio energetico - Il massaggio rilassante scioglie tensioni muscolari, mentre Reiki e Shiatsu armonizzano il flusso vitale.",
            "Stimolazione di organi e funzioni interne - La riflessologia plantare attiva punti collegati ai principali sistemi del corpo.",
            "Riduzione di stress, ansia e blocchi emotivi - Ogni tecnica contribuisce a liberare tensioni, portando calma e leggerezza interiore.",
            "Effetto rigenerante a lungo termine - Dopo la seduta ci si sente più leggeri, centrati e pieni di energia positiva."
        ]
    },
    { 
    id: 14,
    title: "Trattamento cervicale profondo",
    description: "Trattamento mirato su collo e spalle alte per ridurre rigidità, tensioni muscolari e migliorare la mobilità della zona cervicale.",
    duration: "30 min",
    price: 20,
    isPromo: false,
    isMethod: false,
    category: "muscolare",
    image: "assets/img/trattamento-cervicale-profondo.jpeg",
    details: [
        "Scioglimento delle contratture cervicali con intervento mirato su collo e spalle alte.",
        "Sollievo da postura e stress, ideale per chi lavora al computer o guida molte ore.",
        "Miglioramento della mobilità e dell'elasticità nel tratto cervicale.",
        "Riduzione della pressione muscolare e prevenzione di fastidi ricorrenti.",
        "Sensazione di leggerezza immediata con un trattamento breve ma efficace."
    ]
},
    { id: 13,  title: "Massaggio Gravidanza", 
        domicilio: true,
        description: "Massaggio dolce e sicuro per alleviare tensioni in gravidanza. Disponibile in locale o a domicilio.",
        duration: "60 min", 
        price: 30, 
        isPromo: false, 
        isMethod: false,
        category: "rilassanti",
        image: "assets/img/massaggio-gravidanza.webp", 
    details: [
    "Alleviamento di dolori e tensioni muscolari - Riduce fastidi comuni come mal di schiena, dolori lombari e rigidità alle spalle.",
    "Riduzione di gonfiori a gambe e piedi - Favorisce la circolazione sanguigna e linfatica, diminuendo la ritenzione idrica.",
    "Miglioramento della postura - Aiuta ad adattarsi ai cambiamenti del corpo durante la gestazione, prevenendo tensioni e squilibri.",
    "Riduzione di stress e ansia - Favorisce un profondo rilassamento, migliorando anche la qualità del sonno.",
    "Connessione mamma-bambino - Il momento di cura e rilassamento favorisce un contatto più consapevole e armonioso con il piccolo."
    ]
    },
    { id: 12, title: "Massaggio Anti-Age Viso", 
        description: "Trattamento viso per tonificare e ringiovanire la pelle.", 
        duration: "45 min", 
        price: 20, 
        isPromo: false,
        isMethod: false, 
        category: "viso",
        image: "assets/img/massaggio-viso.jpg", 
    details: [
    "Stimolazione della circolazione sanguigna del viso - Migliora l'apporto di ossigeno e nutrienti alla pelle, rendendola più luminosa.",
    "Tonificazione muscolare - Lavora sui muscoli facciali per mantenere elasticità e prevenire rilassamenti.",
    "Riduzione delle rughe e linee d'espressione - Favorisce la produzione di collagene, attenuando i segni del tempo.",
    "Effetto liftante naturale - Dona un aspetto più compatto e giovane senza ricorrere a trattamenti invasivi.",
    "Rilassamento generale - Un momento di cura che dona benessere non solo alla pelle ma anche alla mente."
    ]
    },
    { id: 11, title: "Reiki Usui", 
        domicilio: true,
        description: "Tecnica energetica per rilassamento profondo ed equilibrio interiore. Disponibile in locale o a domicilio.",
        duration: "60 min", 
        price: 30, 
        isPromo: false, 
        isMethod: false,
        category: "sistema nervoso",
        image: "assets/img/reiki-usui.webp", 
    details: [
    "Profondo rilassamento e riduzione dello stress - L'energia armonizza il sistema nervoso, favorendo calma interiore e serenità.",
    "Riequilibrio energetico - Aiuta a sbloccare e ristabilire il flusso naturale dell'energia vitale (Ki) in tutto il corpo.",
    "Supporto alla guarigione naturale - Stimola la capacità innata dell'organismo di rigenerarsi a livello fisico, emotivo e mentale.",
    "Maggiore chiarezza e centratura mentale - Aiuta a liberare la mente da pensieri confusi o pesanti, migliorando la concentrazione.",
    "Armonia emotiva e spirituale - Favorisce il rilascio di emozioni represse, promuovendo un senso di pace profonda e connessione interiore."
    ]
    },
    { id: 10, title: "Riflessologia Plantare", 
        domicilio: true,
        description: "Tecnica sui punti riflessi dei piedi per riequilibrare corpo e mente. Disponibile in locale o a domicilio.",
        duration: "60 min", 
        price: 30, 
        isPromo: false, 
        isMethod: false,
        category: "sistema nervoso",
        image: "assets/img/riflessologia-plantare.webp", 
    details: [
    "Stimolazione della circolazione sanguigna e linfatica - Migliora l'ossigenazione dei tessuti e favorisce l'eliminazione delle tossine.",
    "Riequilibrio degli organi e delle funzioni corporee - Agendo sui punti riflessi dei piedi, sostiene il corretto funzionamento di diversi sistemi del corpo.",
    "Riduzione di stress e tensioni - Favorisce un rilassamento profondo, sciogliendo blocchi sia fisici che emotivi.",
    "Sostegno al sistema immunitario - Stimola la capacità naturale del corpo di difendersi e rigenerarsi.",
    "Alleviamento di disturbi specifici - Può contribuire a migliorare problemi come mal di testa, disturbi digestivi o dolori muscolari attraverso il lavoro mirato sui punti riflessi."
    ]
    },
    { id: 9,  title: "Massaggio Anti-Stress", 
        domicilio: true,
        description: "Riflessologia plantare + massaggio testa per rilassare corpo e mente. Disponibile in locale o a domicilio.",
        duration: "60 min", 
        price: 30, 
        isPromo: false, 
        isMethod: true, 
        category: "sistema nervoso",
        image: "assets/img/massaggio-anti-stress.jpg", 
    details: [
    "Rilassamento globale corpo-mente - La riflessologia agisce in profondità sul corpo attraverso i piedi, mentre il massaggio alla testa scioglie tensioni mentali ed emotive.",
    "Stimolazione energetica completa - Il lavoro sui punti riflessi e sul cranio favorisce un riequilibrio dell'energia vitale in tutto l'organismo.",
    "Miglioramento della circolazione e drenaggio - Favorisce un flusso sanguigno e linfatico più fluido, migliorando ossigenazione e detossinazione.",
    "Riduzione di stress, ansia e mal di testa - L'azione mirata alla testa e ai piedi aiuta a calmare la mente e ad alleviare disturbi legati a tensione nervosa.",
    "Sensazione di leggerezza e chiarezza mentale - Dopo la seduta, il corpo si sente più leggero e la mente più lucida, con un senso di armonia diffusa."
    ]
    },
    { id: 8,  title: "Massaggio con Pietre Calde", 
        description: "Calore e manualità per rilassamento profondo.", 
        duration: "60 min", 
        price: 30, 
        isPromo: false,
        isMethod: false, 
        category: "rilassanti",
        image: "assets/img/massaggio-pietre.webp",
    details: [
    "Rilassamento profondo e immediato - Il calore penetra nei muscoli, sciogliendo tensioni più rapidamente rispetto a un massaggio tradizionale.",
    "Stimolazione della circolazione - La temperatura delle pietre favorisce la dilatazione dei vasi sanguigni, migliorando il flusso di sangue e ossigeno.",
    "Alleviamento dei dolori muscolari e articolari - Ideale per chi soffre di rigidità, contratture o dolori cronici legati a posture scorrette o stress.",
    "Effetto detox - Il calore favorisce la sudorazione e il drenaggio delle tossine accumulate nei tessuti.",
    "Benessere mente-corpo - La combinazione di calore e tocco manuale riduce ansia e tensione emotiva, regalando una sensazione di armonia e leggerezza."
    ]
    },
     { id: 7,  title: "Massaggio Sportivo", 
        domicilio: true,
        description: "Ideale per preparazione e recupero muscolare. Disponibile in locale o a domicilio.",
        duration: "45 min",
        price: 30, 
        isPromo: false,
        isMethod: false, 
        category: "muscolare",
        image: "assets/img/massaggio-sportivo.webp", 
    details: [
    "Preparazione e recupero muscolare ottimali - Migliora l'elasticità e il tono muscolare prima dell'attività e accelera il recupero dopo lo sforzo.",
    "Riduzione di dolori e affaticamento - Aiuta a sciogliere acido lattico e tensioni accumulate, riducendo rigidità e indolenzimento.",
    "Prevenzione degli infortuni - Mantiene i muscoli flessibili e migliora la mobilità articolare, riducendo il rischio di strappi e contratture.",
    "Miglioramento della circolazione e dell'ossigenazione - Favorisce un apporto costante di ossigeno e nutrienti ai tessuti muscolari.",
    "Aumento della performance - Un corpo più libero da tensioni risponde meglio agli allenamenti e alle competizioni."
    ]
    },
    { id: 6,  title: "Massaggio Linfodrenante", 
        domicilio: true,
        description: "Stimola il sistema linfatico e riduce gonfiori e ritenzione. Disponibile in locale o a domicilio.",
        duration: "60 min", 
        price: 30, 
        isPromo: false, 
        isMethod: false,
        category: "drenanti",
        image: "assets/img/massaggio-linfodrenante.jpg",
        details: [
    "Riduzione di gonfiori e ritenzione idrica - Favorisce il drenaggio dei liquidi in eccesso, specialmente in gambe, caviglie e addome.",
    "Stimolazione del sistema linfatico - Migliora la capacità dell'organismo di eliminare tossine e scorie metaboliche.",
    "Supporto al sistema immunitario - Un flusso linfatico più attivo rafforza le difese naturali del corpo.",
    "Miglioramento della circolazione e della pelle - La pelle appare più tonica, luminosa e compatta grazie all'aumento di ossigenazione.",
    "Effetto rilassante e rigenerante - I movimenti lenti e ritmati inducono calma profonda e benessere generale."
    ]
    },
    { id: 5,  title: "Massaggio Rilassante Corpo Intero", 
        domicilio: true,
        description: "Massaggio total body per ridurre stress e tensioni. Disponibile in locale o a domicilio.",
        duration: "60 min", 
        price: 30, 
        isPromo: false, 
        isMethod: false,
        category: "rilassanti",
        image: "assets/img/massaggio-rilassante.webp", 
    details: [
    "Riduzione dello stress e dell'ansia - Il tocco lento e delicato stimola il sistema nervoso parasimpatico, favorendo calma mentale e rilascio di endorfine.",
    "Miglioramento della circolazione sanguigna - I movimenti fluidi aiutano a far fluire meglio il sangue, ossigenando i tessuti e nutrendo le cellule.",
    "Rilassamento muscolare profondo - Scioglie tensioni e rigidità accumulate, migliorando la mobilità e prevenendo dolori.",
    "Benefici per il sonno - Il corpo entra in uno stato di profondo rilassamento, facilitando un riposo più lungo e rigenerante.",
    "Aumento della consapevolezza corporea - Aiuta a riconnettersi con il proprio corpo, percependo meglio sensazioni e bisogni fisici."
    ]
    },
    { id: 4,  title: "Massaggio Kairós '7 in 1'", 
    description: "Trattamento multisensoriale con aromaterapia, pietre calde e shiatsu.",
    duration: "90 min", 
    price: 50, 
    isPromo: false, 
    isMethod: true, 
    category: "profondi",
    image: "assets/img/massaggio-kairos.webp", 
    details: [
    "Immersione sensoriale totale - L'aromaterapia, la musica binaurale e il massaggiatore per occhi creano un'esperienza multisensoriale unica che favorisce rilassamento profondo.",
    "Rilascio di tensioni fisiche e mentali - Le tecniche manuali e con strumenti (gua sha, shiatsu, pietre calde) sciolgono rigidità muscolari e ristagni energetici.",
    "Stimolazione della circolazione e del drenaggio - La gua sha e la riflessologia plantare riattivano il flusso sanguigno e linfatico, migliorando ossigenazione e detossinazione.",
    "Armonizzazione dell'energia vitale - Lo shiatsu e la riflessologia riequilibrano i canali energetici, favorendo benessere globale.",
    "Effetto rigenerante e duraturo - Lascia una sensazione di leggerezza, centratura e rinnovata vitalità che perdura oltre la seduta."
    ]
    },
    { id: 3,  title: "Massaggio Modellante Anticellulite", 
        description: "Trattamento anticellulite con tecniche mirate e drenanti.", 
        duration: "60 min", 
        price: 30, 
        isPromo: false, 
        isMethod: false,
        category: "drenanti",
        image: "assets/img/massaggio-modellante-anticellulite.webp", 
    details: [
    "Riduzione della cellulite e pelle più liscia - Le tecniche mirate e gli strumenti in legno stimolano la microcircolazione, migliorando l'aspetto della pelle a 'buccia d'arancia'.",
    "Drenaggio dei liquidi in eccesso - Favorisce l'eliminazione di ristagni e gonfiori, specialmente nelle gambe e nelle zone soggette a ritenzione.",
    "Stimolazione del metabolismo locale - L'azione meccanica riattiva il metabolismo dei tessuti, aiutando a bruciare grassi in modo mirato.",
    "Modellamento della silhouette - Tonifica e ridefinisce le forme del corpo, migliorando la compattezza dei tessuti.",
    "Sensazione di leggerezza e vitalità - Dopo la seduta, il corpo appare più sgonfio, dinamico e pieno di energia."
    ]
    },
    { 
        id: 2, 
        title: "Massaggio Anti Ansia e Paura", 
        description: "Metodo strutturato che integra lavoro corporeo ed energetico per intervenire su ansia e paura.", 
        duration: "60 min", 
        price: 30, 
        isPromo: false, 
        isMethod: true,
        category: "sistema nervoso",
        image: "assets/img/massaggio-anti-ansia.jpeg",
        details: [
            "Trattamento neuro-somatico mirato - Metodo strutturato che integra respirazione consapevole, lavoro corporeo ed energetico per intervenire sui meccanismi fisici ed emotivi dell'ansia e della paura.",
            "Regolazione del sistema nervoso - La respirazione addominale guidata e il lavoro sul diaframma favoriscono la riduzione dell'iperattivazione nervosa e aiutano il corpo a ritrovare uno stato di sicurezza interna.",
            "Rilascio delle tensioni viscerali ed emotive - Il trattamento dell'area addominale e la riflessologia su mani e piedi agiscono sui centri somatici legati a paura, controllo e stress accumulato.",
            "Alleggerimento mentale e centratura - Il massaggio su collo e testa riduce la sovraccarica mentale, favorendo maggiore presenza, chiarezza e stabilità emotiva.",
            "Integrazione energetica profonda - Il Reiki su diaframma e plesso solare sostiene il riequilibrio energetico, rafforzando il senso di centratura, fiducia e radicamento dopo la seduta."
        ]
    },
    
    

    { id: 1,  title: "Massaggio Decontratturante", 
        domicilio: true,
        description: "Trattamento mirato per sciogliere contratture muscolari. Disponibile in locale o a domicilio.",
        duration: "45 min", 
        price: 30, 
        isPromo: false,
        isMethod: false, 
        category: "muscolare",
        image: "assets/img/massaggio-descontractturante.webp", 
        details: [
    "Scioglimento delle contratture muscolari - Agisce in profondità sui punti tesi, liberando le fibre muscolari bloccate.",
    "Riduzione del dolore e delle infiammazioni - Migliora l'afflusso di sangue nella zona interessata, favorendo la guarigione.",
    "Miglioramento della mobilità articolare - Allenta tensioni che limitano i movimenti, restituendo elasticità e libertà.",
    "Prevenzione di nuove contratture - Riequilibra la postura e riduce il rischio di tensioni croniche dovute a stress o sforzi fisici.",
    "Aumento dell'energia e del benessere - Liberando i muscoli, il corpo spende meno energie per compensare il dolore e si sente più leggero e vitale."
    ]
    },

    
    { 
    id: 101, 
    title: "Pacchetto Argento I", 
    description: "3 massaggi da 60 minuti a scelta tra trattamenti rilassanti e riequilibranti.", 
    duration: "3 x 60 min", 
    price: 65, 
    isPromo: true, 
    category: "promo",
    image: "assets/img/promo/argento-1.jpeg", 
    details: [
        "Massaggi rilassanti",
        "Riflessologia plantare",
        "Trattamento anti-ansia",
        "Trattamento anti-stress"
    ] 
},
{ 
    id: 102, 
    title: "Pacchetto Argento II", 
    description: "3 massaggi da 60 minuti a scelta per migliorare circolazione e tonicità muscolare.", 
    duration: "3 x 60 min", 
    price: 80, 
    isPromo: true, 
    category: "promo",
    image: "assets/img/promo/argento-2.jpeg", 
    details: [
        "Massaggio decontratturante",
        "Massaggio linfodrenante",
        "Massaggio modellante anticellulite",
        "Gomming gambe"
    ] 
},
{ 
    id: 103, 
    title: "Pacchetto Titanio I", 
    description: "5 massaggi da 60 minuti a scelta per rilassamento profondo e riequilibrio mente-corpo.", 
    duration: "5 x 60 min", 
    price: 110, 
    isPromo: true, 
    category: "promo",
    image: "assets/img/promo/titanio-1.jpeg", 
    details: [
        "Massaggi rilassanti",
        "Riflessologia plantare",
        "Trattamento anti-ansia",
        "Trattamento anti-stress"
    ] 
},
{ 
    id: 104, 
    title: "Pacchetto Titanio II", 
    description: "5 massaggi da 60 minuti a scelta per migliorare circolazione, tono muscolare e benessere delle gambe.", 
    duration: "5 x 60 min", 
    price: 130, 
    isPromo: true, 
    category: "promo",
    image: "assets/img/promo/titanio-2.jpeg", 
    details: [
        "Massaggio decontratturante",
        "Massaggio linfodrenante",
        "Massaggio modellante anticellulite",
        "Gomming gambe"
    ] 
},
{ 
    id: 105, 
    title: "Pacchetto Oro I", 
    description: "10 massaggi da 60 minuti a scelta per un percorso completo di rilassamento e riequilibrio.", 
    duration: "10 x 60 min", 
    price: 200, 
    isPromo: true, 
    category: "promo",
    image: "assets/img/promo/oro-1.jpeg", 
    details: [
        "Massaggi rilassanti",
        "Riflessologia plantare",
        "Trattamento anti-ansia",
        "Trattamento anti-stress"
    ] 
},
{ 
    id: 106, 
    title: "Pacchetto Oro II", 
    description: "10 massaggi da 60 minuti a scelta per un lavoro profondo su muscoli, circolazione e tonicità.", 
    duration: "10 x 60 min", 
    price: 250, 
    isPromo: true, 
    category: "promo",
    image: "assets/img/promo/oro-2.jpeg", 
    details: [
        "Massaggio decontratturante",
        "Massaggio linfodrenante",
        "Massaggio modellante anticellulite",
        "Gomming gambe"
    ] 
},

];

// ==========================================================
// CÓDIGO DEL "SEMILLERO" (No tocar)
// ==========================================================
const serviceSchema = new mongoose.Schema({
  id: { type: Number, unique: true },
  title: String,
  description: String,
  duration: String,
  price: Number,
  isPromo: Boolean,
  isMethod: Boolean,
  domicilio: Boolean,
  category: String,
  image: String,
  details: [String]
});

const Service = mongoose.models.Service || mongoose.model("Service", serviceSchema); // Usamos mongoose.models.Service para evitar redefinir

const seedDB = async () => {
  if (!services || services.length === 0) {
    console.error("❌ El array 'services' está vacío. Pega tus servicios de script.js en seed.js");
    mongoose.connection.close();
    return;
  }

  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Conectado a MongoDB para sembrar...");

    await Service.deleteMany({}); // Borra todos los servicios antiguos
    console.log("Servicios antiguos borrados.");

    await Service.insertMany(services); // Inserta los nuevos servicios
    console.log(`✅ ¡${services.length} nuevos servicios cargados en la base de datos!`);

  } catch (err) {
    console.error("❌ Error al sembrar la base de datos:", err);
  } finally {
    mongoose.connection.close();
    console.log("Conexión cerrada.");
  }
};

seedDB();