// backend/seed.js
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config(); // Para que lea mongo URI


const services = [

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
    category: "circolazione",
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
    { id: 14,  title: "Massaggio Focalizzato",
        description: "Massaggio express di 30 minuti per rilassare una parte del corpo dove c'è tensione: schiena, spalle e collo, gambe, zona lombare.",
        duration: "30 min",
        price: 15,
        isPromo: false,
        isMethod: false,
        category: "muscolare",
        image: "assets/img/massaggio-focalizzato.webp",
        details: [
            "Azione rapida su dolori specifici.",
            "Ideale per chi ha poco tempo ma necessita di un intervento mirato.",
            "Scioglie tensioni accumulate in aree problematiche come cervicale o zona lombare.",
            "Migliora la mobilità della zona trattata."
        ]
    },
    { id: 13,  title: "Massaggio Gravidanza", 
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
        description: "Tecnica energetica per rilassamento profondo ed equilibrio interiore. Disponibile in locale o a domicilio.", 
        duration: "60 min", 
        price: 25, 
        isPromo: false, 
        isMethod: false,
        category: "energia",
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
        description: "Tecnica sui punti riflessi dei piedi per riequilibrare corpo e mente. Disponibile in locale o a domicilio.", 
        duration: "60 min", 
        price: 25, 
        isPromo: false, 
        isMethod: false,
        category: "energia",
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
        description: "Riflessologia plantare + massaggio testa per rilassare corpo e mente. Disponibile in locale o a domicilio.", 
        duration: "60 min", 
        price: 25, 
        isPromo: false, 
        isMethod: true, 
        category: "energia",
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
        price: 25, 
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
        description: "Stimola il sistema linfatico e riduce gonfiori e ritenzione. Disponibile in locale o a domicilio.", 
        duration: "60 min", 
        price: 30, 
        isPromo: false, 
        isMethod: false,
        category: "circolazione",
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
        description: "Massaggio total body per ridurre stress e tensioni. Disponibile in locale o a domicilio.", 
        duration: "60 min", 
        price: 25, 
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
        category: "circolazione",
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
        category: "energia",
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
    title: "Gomming circolatorio gambe totale (1 Seduta)", 
    description: "Trattamento intensivo per la stimolazione profonda della circolazione e il benessere completo delle gambe.", 
    duration: "60 min", 
    price: 25, 
    isPromo: true, 
    category: "promo",
    image: "assets/img/promo/gomming-circolatorio-1.jpeg", 
    details: [
        "Stimolazione profonda della circolazione sanguigna e linfatica",
        "Rigenerazione dei tessuti e lavoro fasciale mirato",
        "Rilascio delle tensioni muscolari profonde",
        "Sensazione di leggerezza e vitalità",
        "Benessere integrato corpo–mente"
    ] 
    },
    { 
    id: 102, 
    title: "Gomming circolatorio gambe totale (3 Sedute)", 
    description: "Percorso di 3 trattamenti per migliorare stabilmente circolazione, tonicità e leggerezza delle gambe.", 
    duration: "3 x 60 min", 
    price: 75, 
    isPromo: true, 
    category: "promo",
    image: "assets/img/promo/gomming-circolatorio-2.jpeg", 
    details: [
        "Stimolazione profonda della circolazione sanguigna e linfatica",
        "Rigenerazione dei tessuti e lavoro fasciale mirato",
        "Rilascio delle tensioni muscolari profonde",
        "Sensazione di leggerezza e vitalità",
        "Benessere integrato corpo–mente"
    ] 
    },
    { 
    id: 103, 
    title: "Massaggio bioattivo decontratturante + luce rossa (1 Seduta)", 
    description: "Trattamento bioattivo con luce rossa per sciogliere contratture e accelerare il recupero muscolare.", 
    duration: "45 min", 
    price: 30, 
    isPromo: true, 
    category: "promo",
    image: "assets/img/promo/massaggio-bioattivo-1.jpeg", 
    details: [
        "Stimolazione profonda della microcircolazione del viso",
        "Rigenerazione dei tessuti e lavoro fasciale mirato",
        "Rilascio delle tensioni muscolari facciali",
        "Effetto distensivo e luminosità naturale",
        "Benessere integrato viso–mente"
    
    ] 
    },
    { 
    id: 104, 
    title: "Massaggio bioattivo decontratturante + luce rossa (3 Sedute)", 
    description: "rattamento bioattivo con luce rossa per sciogliere contratture e accelerare il recupero muscolare.", 
    duration: "3 x 45 min", 
    price: 85, 
    isPromo: true, 
    category: "promo",
    image: "assets/img/promo/massaggio-bioattivo-2.jpeg", 
    details: [
        "Stimolazione profonda della microcircolazione del viso",
        "Rigenerazione dei tessuti e lavoro fasciale mirato",
        "Rilascio delle tensioni muscolari facciali",
        "Effetto distensivo e luminosità naturale",
        "Benessere integrato viso–mente"
    ] 
    },
    { 
    id: 105, 
    title: "Kairos – 7 tecniche in 1", 
    description: "Esperienza multisensoriale che integra 7 tecniche per un rilassamento profondo e armonizzazione completa.", 
    duration: "90 min", 
    price: 40, 
    isPromo: true, 
    category: "promo",
    image: "assets/img/promo/kairos-7-tecniche-in-1.jpeg", 
    details: [
        "Riflessologia plantare",
        "Massaggio rilassante con pietre calde",
        "Shiatsu",
        "Gua Sha",
        "Aromaterapia",
        "Massaggiatore per occhi",
        "Musica binaurale in cuffia"
    ] 
    },
    { 
    id: 106, 
    title: "Gomming viso rigenerante (1 Seduta)", 
    description: "Trattamento viso rigenerante per stimolare la microcircolazione e donare luminosità naturale.", 
    duration: "60 min", 
    price: 20, 
    isPromo: true, 
    category: "promo",
    image: "assets/img/promo/gomming-viso-1.jpeg", 
    details: [
        "Rilascio profondo delle contratture",
        "Riduzione di dolore e infiammazione",
        "Maggiore elasticità e mobilità",
        "Recupero muscolare accelerato",
        "Benessere e rilassamento profondo"
    ] 
    },
    { 
    id: 107, 
    title: "Gomming viso rigenerante (3 Sedute)", 
    description: "Percorso intensivo di 3 trattamenti per risultati più profondi e duraturi contro tensioni e infiammazioni.", 
    duration: "3 x 60 min", 
    price: 50, 
    isPromo: true, 
    category: "promo",
    image: "assets/img/promo/gomming-viso-2.jpeg", 
    details: [
        "Rilascio profondo delle contratture",
        "Riduzione di dolore e infiammazione",
        "Maggiore elasticità e mobilità",
        "Recupero muscolare accelerato",
        "Benessere e rilassamento profondo"
    ] 
    },
    { 
        id: 108, 
        title: "Pacchetto Anti-Ansia (3 Sedute)", 
        description: "Percorso completo di 3 trattamenti neuro-somatici per ritrovare equilibrio stabile.", 
        duration: "3 x 60 min", 
        price: 65, 
        isPromo: true, 
        category: "promo",
        image: "assets/img/promo/promozioni-anti-ansia.jpeg", 
        details: [
            "Trattamento neuro-somatico mirato",
            "Regolazione del sistema nervoso",
            "Rilascio delle tensioni viscerali ed emotive",
            "Alleggerimento mentale e centratura",
            "Integrazione energetica profonda"
        ] 
    },
    { 
        id: 109, 
        title: "Trattamento Anti-Ansia (Promo)", 
        description: "Seduta singola in promozione per provare il metodo neuro-somatico.", 
        duration: "60 min", 
        price: 25, 
        isPromo: true, 
        category: "promo",
        image: "assets/img/promo/promozioni-anti-ansia1.jpeg", 
        details: [
            "Trattamento neuro-somatico mirato",
            "Regolazione del sistema nervoso",
            "Rilascio delle tensioni viscerali ed emotive",
            "Alleggerimento mentale e centratura",
            "Integrazione energetica profonda"
        ] 
    },
    { id: 110, title: "Pacchetto Argento (3x60')", 
        description: "3 massaggi da 60' a scelta", 
        duration: "", 
        price: 70, 
        isPromo: true, 
        category: "promo",
        image: "assets/img/promo/pacchetto-argento.jpg", details: [] 
    },
    { id: 111, title: "Pacchetto Titanio (5x60')", 
        description: "5 massaggi da 60' a scelta", 
        duration: "", 
        price: 110, 
        isPromo: true, 
        category: "promo",
        image: "assets/img/promo/pacchetto-titanio.jpg", details: [] 
    },
        { id: 112, title: "Pacchetto Rinascita (3x90')", 
        description: "3 massaggi da 90' a scelta (4 in 1 o Kairós)", 
        duration: "", 
        price: 100, 
        isPromo: true, 
        category: "promo",
        image: "assets/img/promo/pacchetto-rinascita.jpg", details: [] 
    },
    
    { id: 113, title: "Pacchetto Oro (10x60')", 
        description: "10 massaggi da 60' a scelta",
        duration: "", 
        price: 200, 
        isPromo: true, 
        category: "promo",
        image: "assets/img/promo/pacchetto-oro.jpg", details: [] 
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