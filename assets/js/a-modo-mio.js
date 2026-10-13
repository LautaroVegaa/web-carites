/* ============================================================
   MASSAGGIO A MODO MIO — logica del modulo
   Regole implementate secondo il documento funzionale.
   Tutto lato client. Invio tramite deep link WhatsApp.
   Il dato "fibromialgia" NON viene mai inviato né salvato:
   serve solo a bloccare l'intensità Forte lato client.
   ============================================================ */
(function () {
    "use strict";

    var TOTAL = 90;
    var STEP = 5;
    var WHATSAPP_NUMBER = "393889399627"; // Carites Ravenna

    // Servizio nel catalogo (per l'acquisto dal sito, senza toccare la passerella di pagamento)
    var AMM_SERVICE = { id: 25, title: "Massaggio A Modo Mio", price: 50 };
    // Modalità acquisto: attiva solo quando si arriva dal catalogo con ?buy=1
    var buyMode = false;
    try { buyMode = new URLSearchParams(window.location.search).get("buy") === "1"; } catch (e) {}

    // --- Zone corporee (ordine come nel documento) ---
    var ZONES = [
        { id: "schiena", name: "Schiena e spalle", min: 20, max: 60 },
        { id: "gambe", name: "Gambe (davanti e dietro)", min: 20, max: 60 },
        { id: "braccia", name: "Braccia e mani", min: 10, max: 20 },
        { id: "collo", name: "Collo", min: 5, max: 15 },
        { id: "testa", name: "Testa", min: 5, max: 15 },
        { id: "addome", name: "Addome", min: 5, max: 15 }
    ];

    // --- Piedi: due opzioni mutuamente esclusive ---
    var FEET = {
        idro: { id: "idro", name: "Idrotrattamento + massaggio rilassante", fixed: 30 },
        riflesso: { id: "riflesso", name: "Riflessologia plantare", min: 20, max: 30 }
    };

    // --- Stato ---
    var state = {
        zones: {},          // id -> minuti (0 = non attiva)
        feet: null,         // null | "idro" | "riflesso"
        feetMin: 0,         // minuti assegnati ai piedi
        intensity: null,
        fibromialgia: false,
        aroma: "Lavanda",
        noOil: false,
        music: null,
        eye: null,
        notes: "",
        name: ""
    };
    ZONES.forEach(function (z) { state.zones[z.id] = 0; });

    // --- Riferimenti DOM ---
    var el = {};
    document.addEventListener("DOMContentLoaded", init);

    function init() {
        el.zoneList = document.getElementById("amm-zone-list");
        el.feetGrid = document.getElementById("amm-feet-grid");
        el.assigned = document.getElementById("amm-assigned");
        el.progressBar = document.getElementById("amm-progress-bar");
        el.remaining = document.getElementById("amm-remaining");
        el.complete = document.getElementById("amm-complete");
        el.readjust = document.getElementById("amm-readjust");
        el.sendBtn = document.getElementById("amm-send-btn");
        el.sendHint = document.getElementById("amm-send-hint");
        el.steps = Array.prototype.slice.call(document.querySelectorAll(".amm-step"));

        renderZones();
        renderFeet();
        bindPreferences();
        bindRecap();
        if (buyMode) setupBuyMode();
        update();
    }

    // ===================== MODALITÀ ACQUISTO =====================
    function setupBuyMode() {
        document.getElementById("amm-gift-banner").hidden = false;
        var label = document.getElementById("amm-send-label");
        if (label) label.textContent = "Invia le preferenze e acquista (€50)";
        document.getElementById("amm-gift-check").addEventListener("change", onGiftToggle);
        document.getElementById("amm-gift-buy-btn").addEventListener("click", addToCartAndCheckout);
        var recapSendBtn = document.getElementById("amm-recap-send");
        if (recapSendBtn) recapSendBtn.textContent = "Conferma e vai al pagamento";
    }

    // Opzione regalo: salta la personalizzazione e va direttamente all'acquisto
    function onGiftToggle() {
        var gift = document.getElementById("amm-gift-check").checked;
        document.querySelector(".amm-zones-card").hidden = gift;
        document.getElementById("amm-pref-card").hidden = gift;
        document.getElementById("amm-name-field").hidden = gift;
        document.getElementById("amm-send-btn").hidden = gift;
        document.getElementById("amm-send-hint").hidden = gift;
        document.getElementById("amm-gift-buy-btn").hidden = !gift;
    }

    // Aggiunge A Modo Mio al carrello esistente e porta al checkout normale (nessuna modifica alla passerella)
    function addToCartAndCheckout() {
        var KEY = "caritesCart";
        var cart = [];
        try { cart = JSON.parse(localStorage.getItem(KEY)) || []; } catch (e) { cart = []; }
        if (!Array.isArray(cart)) cart = [];
        var existing = cart.filter(function (i) { return i && i.id === AMM_SERVICE.id; })[0];
        if (existing) existing.quantity = (existing.quantity || 1) + 1;
        else cart.push({ id: AMM_SERVICE.id, title: AMM_SERVICE.title, price: AMM_SERVICE.price, quantity: 1 });
        try { localStorage.setItem(KEY, JSON.stringify(cart)); } catch (e) {}
        window.location.href = "index.html#carrello";
    }

    // ===================== HELPERS =====================
    function assignedTotal() {
        var t = 0;
        ZONES.forEach(function (z) { t += state.zones[z.id]; });
        if (state.feet === "idro") t += FEET.idro.fixed;
        else if (state.feet === "riflesso") t += state.feetMin;
        return t;
    }
    function remaining() { return TOTAL - assignedTotal(); }
    function isActive(z) { return state.zones[z.id] > 0; }

    // ===================== ZONE =====================
    function renderZones() {
        el.zoneList.innerHTML = "";
        ZONES.forEach(function (z) {
            var row = document.createElement("div");
            row.className = "amm-zone";
            row.id = "zone-" + z.id;
            row.innerHTML =
                '<div class="amm-zone-info">' +
                    '<div class="amm-zone-name">' + z.name + '</div>' +
                    '<div class="amm-zone-limits">Min. ' + z.min + ' · Max. ' + z.max + ' minuti</div>' +
                '</div>' +
                '<div class="amm-stepper">' +
                    '<button type="button" class="amm-step-btn" data-act="minus" aria-label="Riduci ' + z.name + '">−</button>' +
                    '<div class="amm-zone-value">0 min</div>' +
                    '<button type="button" class="amm-step-btn" data-act="plus" aria-label="Aumenta ' + z.name + '">+</button>' +
                '</div>';
            row.querySelector('[data-act="minus"]').addEventListener("click", function () { decZone(z); });
            row.querySelector('[data-act="plus"]').addEventListener("click", function () { incZone(z); });
            el.zoneList.appendChild(row);
        });
    }

    function incZone(z) {
        var cur = state.zones[z.id];
        if (cur === 0) {
            // Attivazione: parte dal minimo (regola 2). Solo se il tempo residuo lo consente (regola 8).
            if (remaining() >= z.min) state.zones[z.id] = z.min;
        } else {
            // Incremento di 5, senza superare max né 90 totali (regole 3 e 4).
            if (cur + STEP <= z.max && remaining() >= STEP) state.zones[z.id] = cur + STEP;
        }
        update();
    }
    function decZone(z) {
        var cur = state.zones[z.id];
        if (cur === 0) return;
        if (cur - STEP < z.min) state.zones[z.id] = 0; // sotto il minimo = disattiva
        else state.zones[z.id] = cur - STEP;
        update();
    }

    // ===================== PIEDI =====================
    function renderFeet() {
        el.feetGrid.innerHTML = "";

        // Opzione A — Idrotrattamento (30 fisso)
        var a = document.createElement("div");
        a.className = "amm-foot";
        a.id = "foot-idro";
        a.innerHTML =
            '<div class="amm-foot-radio"></div>' +
            '<div class="amm-foot-body">' +
                '<div class="amm-foot-name">Piedi — ' + FEET.idro.name + '</div>' +
                '<div class="amm-foot-fixed">30 minuti (fisso)</div>' +
            '</div>';
        a.addEventListener("click", function () { selectFeet("idro"); });

        // Opzione B — Riflessologia (20/25/30)
        var b = document.createElement("div");
        b.className = "amm-foot";
        b.id = "foot-riflesso";
        b.innerHTML =
            '<div class="amm-foot-radio"></div>' +
            '<div class="amm-foot-body">' +
                '<div class="amm-foot-name">Piedi — ' + FEET.riflesso.name + '</div>' +
                '<div class="amm-foot-sub">20 · 25 · 30 minuti</div>' +
                '<div class="amm-stepper amm-foot-stepper">' +
                    '<button type="button" class="amm-step-btn" data-act="fminus" aria-label="Riduci riflessologia">−</button>' +
                    '<div class="amm-zone-value" id="foot-riflesso-val">0 min</div>' +
                    '<button type="button" class="amm-step-btn" data-act="fplus" aria-label="Aumenta riflessologia">+</button>' +
                '</div>' +
            '</div>';
        b.addEventListener("click", function () { selectFeet("riflesso"); });
        b.querySelector('[data-act="fminus"]').addEventListener("click", function (e) { e.stopPropagation(); decFeet(); });
        b.querySelector('[data-act="fplus"]').addEventListener("click", function (e) { e.stopPropagation(); incFeetOrSelect(); });

        el.feetGrid.appendChild(a);
        el.feetGrid.appendChild(b);
    }

    function selectFeet(which) {
        if (state.feet === which) {
            // toggle off
            state.feet = null; state.feetMin = 0; update(); return;
        }
        if (which === "idro") {
            // serve spazio per 30 minuti (tenendo conto di quanto occupano già i piedi attuali)
            if (remaining() + currentFeetMinutes() >= FEET.idro.fixed) {
                state.feet = "idro"; state.feetMin = 0;
            }
        } else {
            if (remaining() + currentFeetMinutes() >= FEET.riflesso.min) {
                state.feet = "riflesso"; state.feetMin = FEET.riflesso.min;
            }
        }
        update();
    }
    function currentFeetMinutes() {
        if (state.feet === "idro") return FEET.idro.fixed;
        if (state.feet === "riflesso") return state.feetMin;
        return 0;
    }
    function incFeetOrSelect() {
        if (state.feet !== "riflesso") { selectFeet("riflesso"); return; }
        if (state.feetMin + STEP <= FEET.riflesso.max && remaining() >= STEP) state.feetMin += STEP;
        update();
    }
    function decFeet() {
        if (state.feet !== "riflesso") return;
        if (state.feetMin - STEP < FEET.riflesso.min) { state.feet = null; state.feetMin = 0; }
        else state.feetMin -= STEP;
        update();
    }

    // ===================== REGOLA 9: vicolo cieco =====================
    // Vero se il totale è < 90 ma nessuna mossa (incremento o attivazione) può avvicinarsi a 90.
    function isDeadEnd() {
        var rem = remaining();
        if (rem <= 0) return false;
        // Qualche zona attiva può aumentare?
        var canInc = ZONES.some(function (z) { return state.zones[z.id] > 0 && state.zones[z.id] + STEP <= z.max && rem >= STEP; });
        // Qualche zona inattiva può essere attivata?
        var canActivate = ZONES.some(function (z) { return state.zones[z.id] === 0 && rem >= z.min; });
        // I piedi possono aggiungere tempo?
        var canFeet = false;
        if (state.feet === null) canFeet = (rem >= FEET.riflesso.min) || (rem >= FEET.idro.fixed);
        else if (state.feet === "riflesso") canFeet = (state.feetMin + STEP <= FEET.riflesso.max && rem >= STEP);
        return !(canInc || canActivate || canFeet);
    }

    // ===================== UPDATE UI =====================
    function update() {
        var total = assignedTotal();
        var rem = TOTAL - total;

        // Valori zone + stato bottoni
        ZONES.forEach(function (z) {
            var row = document.getElementById("zone-" + z.id);
            var cur = state.zones[z.id];
            row.classList.toggle("is-active", cur > 0);
            row.querySelector(".amm-zone-value").textContent = cur + " min";
            var minus = row.querySelector('[data-act="minus"]');
            var plus = row.querySelector('[data-act="plus"]');
            minus.disabled = cur === 0;
            if (cur === 0) plus.disabled = rem < z.min;          // regola 8
            else plus.disabled = !(cur + STEP <= z.max && rem >= STEP); // regole 3,4,7
        });

        // Piedi
        var footIdro = document.getElementById("foot-idro");
        var footRif = document.getElementById("foot-riflesso");
        footIdro.classList.toggle("is-selected", state.feet === "idro");
        footRif.classList.toggle("is-selected", state.feet === "riflesso");
        document.getElementById("foot-riflesso-val").textContent = (state.feet === "riflesso" ? state.feetMin : 0) + " min";
        var fminus = footRif.querySelector('[data-act="fminus"]');
        var fplus = footRif.querySelector('[data-act="fplus"]');
        fminus.disabled = state.feet !== "riflesso";
        if (state.feet === "riflesso") fplus.disabled = !(state.feetMin + STEP <= FEET.riflesso.max && rem >= STEP);
        else fplus.disabled = rem < FEET.riflesso.min;

        // Contatore
        el.assigned.textContent = total;
        el.progressBar.style.width = Math.min(100, (total / TOTAL) * 100) + "%";
        if (rem > 0) el.remaining.innerHTML = "Ti mancano <strong>" + rem + " minuti</strong>";
        else el.remaining.innerHTML = "<strong>Tempo completato</strong>";

        var done = total === TOTAL;
        el.complete.hidden = !done;
        el.readjust.hidden = !(total < TOTAL && isDeadEnd());

        updateSendState();
    }

    // ===================== PREFERENZE =====================
    function bindPreferences() {
        // Intensità
        document.querySelectorAll('input[name="intensity"]').forEach(function (r) {
            r.addEventListener("change", function () {
                state.intensity = r.value;
                var fibroWarn = document.getElementById("amm-fibro-warn");
                fibroWarn.hidden = (r.value !== "Forte");
                updateFibroBlock();
                updateSendState();
            });
        });
        // Checkbox fibromialgia (solo client, mai inviato)
        document.getElementById("amm-fibro-check").addEventListener("change", function () {
            state.fibromialgia = this.checked;
            updateFibroBlock();
            updateSendState();
        });

        // Aromaterapia
        document.getElementById("amm-aroma").addEventListener("change", function () { state.aroma = this.value; });
        document.getElementById("amm-nooil").addEventListener("change", function () {
            state.noOil = this.checked;
            document.getElementById("amm-aroma").disabled = this.checked;
        });

        // Musica
        document.querySelectorAll('input[name="music"]').forEach(function (r) {
            r.addEventListener("change", function () { state.music = r.value; updateSendState(); });
        });
        // Occhi
        document.querySelectorAll('input[name="eye"]').forEach(function (r) {
            r.addEventListener("change", function () { state.eye = r.value; updateSendState(); });
        });
        // Note / nome
        document.getElementById("amm-notes").addEventListener("input", function () { state.notes = this.value.trim(); });
        document.getElementById("amm-name").addEventListener("input", function () { state.name = this.value.trim(); updateSendState(); });

        // Invio
        el.sendBtn.addEventListener("click", openRecap);
    }

    // Se fibromialgia + Forte: blocca Forte e suggerisce alternativa
    function updateFibroBlock() {
        var block = document.getElementById("amm-fibro-block");
        var forteOpt = document.getElementById("amm-forte-opt");
        var forteInput = forteOpt.querySelector("input");
        var conflict = state.fibromialgia && state.intensity === "Forte";
        block.hidden = !conflict;
        forteOpt.classList.toggle("is-disabled", state.fibromialgia);
        forteInput.disabled = state.fibromialgia;
        if (conflict) {
            // deseleziona Forte
            forteInput.checked = false;
            state.intensity = null;
        }
    }

    // ===================== VALIDAZIONE + INVIO =====================
    function isComplete() {
        return assignedTotal() === TOTAL
            && !!state.intensity
            && !(state.fibromialgia && state.intensity === "Forte")
            && !!state.music
            && !!state.eye
            && state.name.length > 0;
    }

    function updateSendState() {
        var ok = isComplete();
        el.sendBtn.disabled = !ok;
        if (ok) {
            el.sendHint.textContent = "Tutto pronto! Controlla il riepilogo e invia.";
            el.sendHint.classList.add("is-ready");
        } else {
            el.sendHint.classList.remove("is-ready");
            el.sendHint.textContent = missingMessage();
        }
    }
    function missingMessage() {
        var miss = [];
        if (assignedTotal() !== TOTAL) miss.push("completa i 90 minuti");
        if (!state.intensity) miss.push("scegli l'intensità");
        if (!state.music) miss.push("scegli la musica");
        if (!state.eye) miss.push("indica il massaggiatore per occhi");
        if (!state.name) miss.push("inserisci nome e riferimento");
        if (miss.length === 0) return "Controlla le tue scelte.";
        return "Per inviare: " + miss.join(", ") + ".";
    }

    // ===================== RIEPILOGO =====================
    function buildZoneLines() {
        var lines = [];
        ZONES.forEach(function (z) { if (state.zones[z.id] > 0) lines.push(z.name + ": " + state.zones[z.id] + " min"); });
        if (state.feet === "idro") lines.push("Piedi — " + FEET.idro.name + ": 30 min");
        else if (state.feet === "riflesso") lines.push("Piedi — " + FEET.riflesso.name + ": " + state.feetMin + " min");
        return lines;
    }
    function aromaText() { return state.noOil ? "Senza oli essenziali" : state.aroma; }

    function openRecap() {
        if (!isComplete()) return;
        setStep(3);
        var zoneLines = buildZoneLines();
        var body = document.getElementById("amm-recap-body");
        body.innerHTML =
            '<div class="amm-recap-group-title">Distribuzione dei 90 minuti</div>' +
            '<ul class="amm-recap-list">' + zoneLines.map(function (l) { return "<li>" + l + "</li>"; }).join("") + '</ul>' +
            '<div class="amm-recap-row"><span class="amm-recap-label">Intensità</span><span class="amm-recap-val">' + state.intensity + '</span></div>' +
            '<div class="amm-recap-row"><span class="amm-recap-label">Aroma</span><span class="amm-recap-val">' + aromaText() + '</span></div>' +
            '<div class="amm-recap-row"><span class="amm-recap-label">Musica</span><span class="amm-recap-val">' + state.music + '</span></div>' +
            '<div class="amm-recap-row"><span class="amm-recap-label">Massaggiatore occhi</span><span class="amm-recap-val">' + state.eye + '</span></div>' +
            (state.notes ? '<div class="amm-recap-row"><span class="amm-recap-label">Note</span><span class="amm-recap-val">' + escapeHtml(state.notes) + '</span></div>' : '') +
            '<div class="amm-recap-row"><span class="amm-recap-label">Nome / riferimento</span><span class="amm-recap-val">' + escapeHtml(state.name) + '</span></div>' +
            (buyMode ? '<p class="amm-recap-pay-note">Dopo l\'invio, completa il pagamento di <strong>€50</strong> nel carrello per confermare la prenotazione.</p>' : '');
        document.getElementById("amm-recap").hidden = false;
        document.body.style.overflow = "hidden";
    }

    function closeRecap() {
        document.getElementById("amm-recap").hidden = true;
        document.body.style.overflow = "";
        setStep(2);
    }

    function bindRecap() {
        document.getElementById("amm-recap-close").addEventListener("click", closeRecap);
        document.getElementById("amm-recap-back").addEventListener("click", closeRecap);
        document.getElementById("amm-recap-send").addEventListener("click", function () {
            sendWhatsApp();
            if (buyMode) addToCartAndCheckout();
        });
        document.getElementById("amm-recap").addEventListener("click", function (e) {
            if (e.target === this) closeRecap();
        });
    }

    function sendWhatsApp() {
        var L = [];
        L.push("Ciao Carites! Ho completato le mie preferenze per il *Massaggio A Modo Mio* (90 minuti).");
        L.push("");
        L.push("Nome / riferimento: " + state.name);
        L.push("");
        L.push("Distribuzione 90 minuti:");
        buildZoneLines().forEach(function (l) { L.push("- " + l); });
        L.push("");
        L.push("Intensità: " + state.intensity);
        L.push("Aroma: " + aromaText());
        L.push("Musica: " + state.music);
        L.push("Massaggiatore per occhi: " + state.eye);
        if (state.notes) L.push("Note: " + state.notes);

        var url = "https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encodeURIComponent(L.join("\n"));
        window.open(url, "_blank");
    }

    // ===================== UTIL =====================
    function setStep(n) {
        el.steps.forEach(function (s) { s.classList.toggle("is-active", Number(s.dataset.step) <= n); });
    }
    function escapeHtml(s) {
        return s.replace(/[&<>"']/g, function (c) {
            return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
        });
    }

})();
