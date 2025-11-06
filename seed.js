// backend/seed.js
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config(); // Para que lea tu MONGO_URI del .env


const services = [
    { id: 1,  title: "Massaggio Rilassante Corpo Intero", description: "Massaggio total body per ridurre stress e tensioni. Disponibile in locale o a domicilio.", duration: "60 min", price: 25, isPromo: false, category: "massaggi",
        image: "assets/img/massaggio-rilassante.webp", // <-- CORREGIDO
    details: [
    "Riduzione dello stress e dell'ansia - Il tocco lento e delicato stimola il sistema nervoso parasimpatico, favorendo calma mentale e rilascio di endorfine.",
    "Miglioramento della circolazione sanguigna - I movimenti fluidi aiutano a far fluire meglio il sangue, ossigenando i tessuti e nutrendo le cellule.",
    "Rilassamento muscolare profondo - Scioglie tensioni e rigidità accumulate, migliorando la mobilità e prevenendo dolori.",
    "Benefici per il sonno - Il corpo entra in uno stato di profondo rilassamento, facilitando un riposo più lungo e rigenerante.",
    "Aumento della consapevolezza corporea - Aiuta a riconnettersi con il proprio corpo, percependo meglio sensazioni e bisogni fisici."
    ]
    },
    { id: 2,  title: "Massaggio Decontratturante", description: "Trattamento mirato per sciogliere contratture muscolari. Disponibile in locale o a domicilio.", duration: "45 min", price: 30, isPromo: false, category: "massaggi",
        image: "assets/img/massaggio-descontractturante.webp", // <-- CORREGIDO
        details: [
    "Scioglimento delle contratture muscolari - Agisce in profondità sui punti tesi, liberando le fibre muscolari bloccate.",
    "Riduzione del dolore e delle infiammazioni - Migliora l'afflusso di sangue nella zona interessata, favorendo la guarigione.",
    "Miglioramento della mobilità articolare - Allenta tensioni che limitano i movimenti, restituendo elasticità e libertà.",
    "Prevenzione di nuove contratture - Riequilibra la postura e riduce il rischio di tensioni croniche dovute a stress o sforzi fisici.",
    "Aumento dell'energia e del benessere - Liberando i muscoli, il corpo spende meno energie per compensare il dolore e si sente più leggero e vitale."
    ]
    },
    { id: 3,  title: "Massaggio Linfodrenante", description: "Stimola il sistema linfatico e riduce gonfiori e ritenzione. Disponibile in locale o a domicilio.", duration: "60 min", price: 30, isPromo: false, category: "massaggi",
        image: "assets/img/massaggio-linfodrenante.jpg", // <-- CORREGIDO
        details: [
    "Riduzione di gonfiori e ritenzione idrica - Favorisce il drenaggio dei liquidi in eccesso, specialmente in gambe, caviglie e addome.",
    "Stimolazione del sistema linfatico - Migliora la capacità dell'organismo di eliminare tossine e scorie metaboliche.",
    "Supporto al sistema immunitario - Un flusso linfatico più attivo rafforza le difese naturali del corpo.",
    "Miglioramento della circolazione e della pelle - La pelle appare più tonica, luminosa e compatta grazie all'aumento di ossigenazione.",
    "Effetto rilassante e rigenerante - I movimenti lenti e ritmati inducono calma profonda e benessere generale."
    ]
    },
    { id: 4,  title: "Massaggio Modellante Anticellulite", description: "Trattamento anticellulite con tecniche mirate e drenanti.", duration: "60 min", price: 30, isPromo: false, category: "massaggi",
        image: "assets/img/massaggio-modellante-anticellulite.webp", // <-- CORREGIDO
    details: [
    "Riduzione della cellulite e pelle più liscia - Le tecniche mirate e gli strumenti in legno stimolano la microcircolazione, migliorando l'aspetto della pelle a 'buccia d'arancia'.",
    "Drenaggio dei liquidi in eccesso - Favorisce l'eliminazione di ristagni e gonfiori, specialmente nelle gambe e nelle zone soggette a ritenzione.",
    "Stimolazione del metabolismo locale - L'azione meccanica riattiva il metabolismo dei tessuti, aiutando a bruciare grassi in modo mirato.",
    "Modellamento della silhouette - Tonifica e ridefinisce le forme del corpo, migliorando la compattezza dei tessuti.",
    "Sensazione di leggerezza e vitalità - Dopo la seduta, il corpo appare più sgonfio, dinamico e pieno di energia."
    ]
    },
    { id: 5,  title: "Massaggio Sportivo", description: "Ideale per preparazione e recupero muscolare. Disponibile in locale o a domicilio.", duration: "45 min", price: 30, isPromo: false, category: "massaggi",
        image: "assets/img/massaggio-sportivo.webp", // <-- CORREGIDO
    details: [
    "Preparazione e recupero muscolare ottimali - Migliora l'elasticità e il tono muscolare prima dell'attività e accelera il recupero dopo lo sforzo.",
    "Riduzione di dolori e affaticamento - Aiuta a sciogliere acido lattico e tensioni accumulate, riducendo rigidità e indolenzimento.",
    "Prevenzione degli infortuni - Mantiene i muscoli flessibili e migliora la mobilità articolare, riducendo il rischio di strappi e contratture.",
    "Miglioramento della circolazione e dell'ossigenazione - Favorisce un apporto costante di ossigeno e nutrienti ai tessuti muscolari.",
    "Aumento della performance - Un corpo più libero da tensioni risponde meglio agli allenamenti e alle competizioni."
    ]
    },
    { id: 6,  title: "Massaggio con Pietre Calde", description: "Calore e manualità per rilassamento profondo.", duration: "60 min", price: 25, isPromo: false, category: "massaggi",
        image: "assets/img/massaggio-pietre.webp", // <-- CORREGIDO
    details: [
    "Rilassamento profondo e immediato - Il calore penetra nei muscoli, sciogliendo tensioni più rapidamente rispetto a un massaggio tradizionale.",
    "Stimolazione della circolazione - La temperatura delle pietre favorisce la dilatazione dei vasi sanguigni, migliorando il flusso di sangue e ossigeno.",
    "Alleviamento dei dolori muscolari e articolari - Ideale per chi soffre di rigidità, contratture o dolori cronici legati a posture scorrette o stress.",
    "Effetto detox - Il calore favorisce la sudorazione e il drenaggio delle tossine accumulate nei tessuti.",
    "Benessere mente-corpo - La combinazione di calore e tocco manuale riduce ansia e tensione emotiva, regalando una sensazione di armonia e leggerezza."
    ]
    },
    { id: 7,  title: "Massaggio Anti-Stress", description: "Riflessologia plantare + massaggio testa per rilassare corpo e mente. Disponibile in locale o a domicilio.", duration: "60 min", price: 25, isPromo: false, category: "massaggi",
        image: "assets/img/massaggio-anti-stress.jpg", // <-- CORREGIDO
    details: [
    "Rilassamento globale corpo-mente - La riflessologia agisce in profondità sul corpo attraverso i piedi, mentre il massaggio alla testa scioglie tensioni mentali ed emotive.",
    "Stimolazione energetica completa - Il lavoro sui punti riflessi e sul cranio favorisce un riequilibrio dell'energia vitale in tutto l'organismo.",
    "Miglioramento della circolazione e drenaggio - Favorisce un flusso sanguigno e linfatico più fluido, migliorando ossigenazione e detossinazione.",
    "Riduzione di stress, ansia e mal di testa - L'azione mirata alla testa e ai piedi aiuta a calmare la mente e ad alleviare disturbi legati a tensione nervosa.",
    "Sensazione di leggerezza e chiarezza mentale - Dopo la seduta, il corpo si sente più leggero e la mente più lucida, con un senso di armonia diffusa."
    ]
    },
    { id: 8,  title: "Massaggio Kairós '7 in 1'", description: "Trattamento multisensoriale con aromaterapia, pietre calde e shiatsu.", duration: "90 min", price: 50, isPromo: true, category: "massaggi",
        image: "assets/img/massaggio-kairos.webp", // <-- CORREGIDO
    details: [
    "Immersione sensoriale totale - L'aromaterapia, la musica binaurale e il massaggiatore per occhi creano un'esperienza multisensoriale unica che favorisce rilassamento profondo.",
    "Rilascio di tensioni fisiche e mentali - Le tecniche manuali e con strumenti (gua sha, shiatsu, pietre calde) sciolgono rigidità muscolari e ristagni energetici.",
    "Stimolazione della circolazione e del drenaggio - La gua sha e la riflessologia plantare riattivano il flusso sanguigno e linfatico, migliorando ossigenazione e detossinazione.",
    "Armonizzazione dell'energia vitale - Lo shiatsu e la riflessologia riequilibrano i canali energetici, favorendo benessere globale.",
    "Effetto rigenerante e duraturo - Lascia una sensazione di leggerezza, centratura e rinnovata vitalità che perdura oltre la seduta."
    ]
    },
    { id: 9, title: "Riflessologia Plantare", description: "Tecnica sui punti riflessi dei piedi per riequilibrare corpo e mente. Disponibile in locale o a domicilio.", duration: "60 min", price: 25, isPromo: false, category: "massaggi",
        image: "assets/img/riflessologia-plantare.webp", // <-- CORREGIDO
    details: [
    "Stimolazione della circolazione sanguigna e linfatica - Migliora l'ossigenazione dei tessuti e favorisce l'eliminazione delle tossine.",
    "Riequilibrio degli organi e delle funzioni corporee - Agendo sui punti riflessi dei piedi, sostiene il corretto funzionamento di diversi sistemi del corpo.",
    "Riduzione di stress e tensioni - Favorisce un rilassamento profondo, sciogliendo blocchi sia fisici che emotivi.",
    "Sostegno al sistema immunitario - Stimola la capacità naturale del corpo di difendersi e rigenerarsi.",
    "Alleviamento di disturbi specifici - Può contribuire a migliorare problemi come mal di testa, disturbi digestivi o dolori muscolari attraverso il lavoro mirato sui punti riflessi."
    ]
    },
    { id: 10, title: "Reiki Usui", description: "Tecnica energetica per rilassamento profondo ed equilibrio interiore. Disponibile in locale o a domicilio.", duration: "60 min", price: 25, isPromo: false, category: "massaggi",
        image: "assets/img/reiki-usui.webp", // <-- CORREGIDO
    details: [
    "Profondo rilassamento e riduzione dello stress - L'energia armonizza il sistema nervoso, favorendo calma interiore e serenità.",
    "Riequilibrio energetico - Aiuta a sbloccare e ristabilire il flusso naturale dell'energia vitale (Ki) in tutto il corpo.",
    "Supporto alla guarigione naturale - Stimola la capacità innata dell'organismo di rigenerarsi a livello fisico, emotivo e mentale.",
    "Maggiore chiarezza e centratura mentale - Aiuta a liberare la mente da pensieri confusi o pesanti, migliorando la concentrazione.",
    "Armonia emotiva e spirituale - Favorisce il rilascio di emozioni represse, promuovendo un senso di pace profonda e connessione interiore."
    ]
    },
    { id: 11, title: "Massaggio Anti-Age Viso", description: "Trattamento viso per tonificare e ringiovanire la pelle.", duration: "45 min", price: 20, isPromo: false, category: "massaggi",
        image: "assets/img/massaggio-viso.jpg", // <-- CORREGIDO
    details: [
    "Stimolazione della circolazione sanguigna del viso - Migliora l'apporto di ossigeno e nutrienti alla pelle, rendendola più luminosa.",
    "Tonificazione muscolare - Lavora sui muscoli facciali per mantenere elasticità e prevenire rilassamenti.",
    "Riduzione delle rughe e linee d'espressione - Favorisce la produzione di collagene, attenuando i segni del tempo.",
    "Effetto liftante naturale - Dona un aspetto più compatto e giovane senza ricorrere a trattamenti invasivi.",
    "Rilassamento generale - Un momento di cura che dona benessere non solo alla pelle ma anche alla mente."
    ]
    },
    { id: 12,  title: "Massaggio Gravidanza", description: "Massaggio dolce e sicuro per alleviare tensioni in gravidanza. Disponibile in locale o a domicilio.", duration: "60 min", price: 30, isPromo: false, category: "massaggi",
        image: "assets/img/massaggio-gravidanza.webp", // <-- CORREGIDO
    details: [
    "Alleviamento di dolori e tensioni muscolari - Riduce fastidi comuni come mal di schiena, dolori lombari e rigidità alle spalle.",
    "Riduzione di gonfiori a gambe e piedi - Favorisce la circolazione sanguigna e linfatica, diminuendo la ritenzione idrica.",
    "Miglioramento della postura - Aiuta ad adattarsi ai cambiamenti del corpo durante la gestazione, prevenendo tensioni e squilibri.",
    "Riduzione di stress e ansia - Favorisce un profondo rilassamento, migliorando anche la qualità del sonno.",
    "Connessione mamma-bambino - Il momento di cura e rilassamento favorisce un contatto più consapevole e armonioso con il piccolo."
    ]
    },


    { id: 101, title: "Pacchetto Rinascita (3x90')", description: "3 massaggi da 90' a scelta (4 in 1 o Kairós)", duration: "", price: 100, isPromo: true, category: "promo",
        image: "assets/img/promo/pacchetto-rinascita.jpg", details: [] // <-- CORREGIDO
    },
    { id: 102, title: "Pacchetto Titanio (5x60')", description: "5 massaggi da 60' a scelta", duration: "", price: 110, isPromo: true, category: "promo",
        image: "assets/img/promo/pacchetto-titanio.jpg", details: [] // <-- CORREGIDO
    },
    { id: 103, title: "Pacchetto Argento (3x60')", description: "3 massaggi da 60' a scelta", duration: "", price: 70, isPromo: true, category: "promo",
        image: "assets/img/promo/pacchetto-argento.jpg", details: [] // <-- CORREGIDO
    },
    { id: 104, title: "Pacchetto Oro (10x60')", description: "10 massaggi da 60' a scelta", duration: "", price: 200, isPromo: true, category: "promo",
        image: "assets/img/promo/pacchetto-oro.jpg", details: [] // <-- CORREGIDO
    },
    { id: 105, title: "Promo Natale (2x Viso)", description: "2 massaggi viso + cuoio capelluto", duration: "", price: 30, isPromo: true, category: "promo",
        image: "assets/img/promo/massaggi-viso-cuio.jpg", details: [] // <-- CORREGIDO
    },
    { id: 106, title: "Promo Natale (1x Viso)", description: "1 massaggio viso + cuoio capelluto", duration: "", price: 20, isPromo: true, category: "promo",
        image: "assets/img/promo/massaggio-viso-cuio2.jpg", details: [] // <-- CORREGIDO
    },
    { id: 107, title: "Promo Natale (1x 60')", description: "Un massaggio da 60 minuti a scelta", duration: "", price: 25, isPromo: true, category: "promo",
        image: "assets/img/promo/massaggio-60-minuti.jpg", details: [] // <-- CORREGIDO
    },
    { id: 108, title: "Promo Natale (1x 90')", description: "Un massaggio da 90 minuti a scelta (4 in 1 o Kairos)", duration: "", price: 35, isPromo: true, category: "promo",
        image: "assets/img/promo/massaggio-90-minuti.jpg", details: [] // <-- CORREGIDO
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