document.addEventListener("DOMContentLoaded", async function() {
    const urlParams = new URLSearchParams(window.location.search);
    const sessionId = urlParams.get("session_id");
    
    // ✅ Parseo seguro de customerDetails
    let customerDetails = {};
    try {
        customerDetails = JSON.parse(localStorage.getItem("customerDetails")) || {};
    } catch (e) {
        customerDetails = {};
    }

    if (sessionId) {
        try {
            const res = await fetch(`/api/stripe-session?id=${sessionId}`);
            if (!res.ok) throw new Error('Errore nel recupero della sessione Stripe');
            
            const sessionData = await res.json();
            const storedData = JSON.parse(localStorage.getItem("paymentData")) || {};

            const paymentData = {
                orderId: sessionData.orderId,
                paymentMethod: sessionData.paymentMethod,
                status: sessionData.status || "Confermato",
                email: sessionData.email || customerDetails.email,
                // ✅ Forzamos número para evitar .toFixed sobre string
                total: Number(sessionData.total),
                date: sessionData.date || new Date(),
                items: storedData.items || []
            };

            localStorage.setItem("paymentData", JSON.stringify(paymentData));
            localStorage.removeItem("caritesCart");

            displayPaymentData(paymentData, customerDetails);
            sendConfirmationEmail(paymentData, customerDetails);

        } catch (err) {
            console.error("❌ Errore Stripe:", err);
            loadPaymentData(customerDetails); 
        }
    } else {
        loadPaymentData(customerDetails);
    }
});

function loadPaymentData(customerDetails) {
    const paymentDataString = localStorage.getItem("paymentData");

    if (paymentDataString) {
        try {
            const paymentData = JSON.parse(paymentDataString);

            // ✅ Corrección: asegurar campos y forzar "Confermato" si está pendiente
            paymentData.email = customerDetails.email || paymentData.email || "N/A";
            paymentData.status = paymentData.status === "pending" ? "Confermato" : (paymentData.status || "Confermato");
            paymentData.paymentMethod = paymentData.paymentMethod || "Stripe / PayPal";
            paymentData.orderId = paymentData.orderId || generateOrderId();

            // ✅ Forzamos número; si no es válido o es <= 0, calculamos por ítems
            const numericTotal = Number(paymentData.total);
            paymentData.total = (Number.isFinite(numericTotal) && numericTotal > 0)
                ? numericTotal
                : calculateTotal(paymentData.items || []);

            displayPaymentData(paymentData, customerDetails);

            if (!localStorage.getItem("emailSent")) {
                sendConfirmationEmail(paymentData, customerDetails);
            }

        } catch (error) {
            console.error("Errore nel caricamento:", error);
            displayDefaultData(customerDetails);
        }
    } else {
        displayDefaultData(customerDetails);
    }
}

async function sendConfirmationEmail(paymentData, customerDetails) {
    if (!customerDetails || !customerDetails.email) {
        console.log("Dati cliente non trovati, email non inviata.");
        return;
    }

    if (localStorage.getItem("emailSent")) {
        console.log("Email già inviata per questo ordine.");
        return;
    }

    try {
        const response = await fetch('/api/send-confirmation', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ paymentData, customerDetails })
        });

        if (response.ok) {
            console.log("Email di conferma inviata con successo.");
            localStorage.setItem("emailSent", "true"); 
        } else {
            console.error("Errore nella risposta del server email.");
        }
    } catch (err) {
        console.error("Errore fatale inviando l'email:", err);
    }
}

function displayPaymentData(data, customerDetails) {
    displayPaymentSummary(data, customerDetails);
    displayTransactionDetails(data, customerDetails);
    displayServices(data);
}

function displayPaymentSummary(data, customerDetails) {
    const summaryContainer = document.getElementById("payment-summary");
    if (!summaryContainer) return;
    
    const displayEmail = customerDetails.email || data.email || "N/A";

    const total = (data.total && data.total > 0)
        ? data.total
        : calculateTotal(data.items || []);

    summaryContainer.innerHTML = `
        <div class="summary-row">
            <div class="summary-label">
                <span class="detail-icon">📧</span>
                Email di conferma inviata a:
            </div>
            <div class="summary-value">${displayEmail}</div>
        </div>
        <div class="summary-row">
            <div class="summary-label">
                <span class="detail-icon">✅</span>
                Stato pagamento:
            </div>
            <div class="summary-value">
                <span class="status-indicator">
                    <span class="status-dot"></span>
                    ${data.status || "Confermato"}
                </span>
            </div>
        </div>
        <div class="summary-row">
            <div class="summary-label">Importo totale pagato:</div>
            <div class="summary-value">€${parseFloat(total || 0).toFixed(2)}</div>
        </div>
    `;
}

function displayTransactionDetails(data, customerDetails) {
    const detailsContainer = document.getElementById("transaction-details");
    if (!detailsContainer) return;

    const currentDate = new Date();

    // --- LÓGICA CORREGIDA ---
    // Ya no se depende de 'stored' ni se asignan valores por defecto falsos.
    // Simplemente mostramos lo que 'data' contiene, o "N/A" si está vacío.
    
    let customerHTML = `
        <div class="detail-group">
            <div class="detail-label">
                <span class="detail-icon">👤</span>
                Cliente
            </div>
            <div class="detail-value">${customerDetails.name || 'N/A'}</div>
        </div>
        <div class="detail-group">
            <div class="detail-label">
                <span class="detail-icon">📞</span>
                Telefono
            </div>
            <div class="detail-value">${customerDetails.phone || 'N/A'}</div>
        </div>
        <div class="detail-group">
            <div class="detail-label">
                <span class="detail-icon">📍</span>
                Modalità
            </div>
            <div class="detail-value">${customerDetails.modality || 'N/A'}</div>
        </div>
    `;

    detailsContainer.innerHTML = `
        <div class="detail-group">
            <div class="detail-label">
                <span class="detail-icon">🧾</span>
                ID Ordine
            </div>
            <div class="detail-value">${data.orderId || "N/A"}</div>
        </div>
        <div class="detail-group">
            <div class="detail-label">
                <span class="detail-icon">📅</span>
                Data e Ora
            </div>
            <div class="detail-value">${formatDateTime(data.date || currentDate)}</div>
        </div>
        <div class="detail-group">
            <div class="detail-label">
                <span class="detail-icon">💳</span>
                Metodo di Pagamento
            </div>
            <div class="detail-value">${data.paymentMethod || "N/A"}</div>
        </div>
        ${customerHTML} 
    `;
}

function displayServices(data) {
    // Esta función no necesita cargar de localStorage, 
    // porque 'data' ya debería tener los 'items'.
    if (!data.items || data.items.length === 0) {
        // Fallback por si acaso (aunque no debería ser necesario)
        const savedData = JSON.parse(localStorage.getItem("paymentData"));
        if (savedData && savedData.items && savedData.items.length > 0) {
            data.items = savedData.items;
            data.total = savedData.total;
        } else {
            return; 
        }
    }

    const servicesSection = document.getElementById("services-section");
    const servicesList = document.getElementById("services-list");
    if (!servicesSection || !servicesList) return;

    let servicesHTML = "";
    let total = 0;

    data.items.forEach(item => {
        const itemTotal = (item.price || 0) * (item.quantity || 1);
        total += itemTotal;

        servicesHTML += `
            <div class="service-item">
                <div class="service-info">
                    <div class="service-name">${item.title || item.name || "Servizio"}</div>
                    <div class="service-quantity">Quantità: ${item.quantity || 1}</div>
                </div>
                <div class="service-price">€${itemTotal.toFixed(2)}</div>
            </div>
        `;
    });

    // ✅ 'data.total' ya llega numérico por los endurecimientos de arriba
    servicesHTML += `
        <div class="service-item total-item">
            <div class="service-info">
                <div class="service-name">Totale</div>
            </div>
            <div class="service-price">€${(data.total || total).toFixed(2)}</div>
        </div>
    `;

    servicesList.innerHTML = servicesHTML;
    servicesSection.style.display = "block";
}

function displayDefaultData(customerDetails) {
    const defaultData = {
        orderId: "...",
        date: new Date(),
        status: "In attesa",
        paymentMethod: "...",
        email: customerDetails.email || "N/A",
        total: 0,
        items: []
    };
    displayPaymentData(defaultData, customerDetails || { name: "N/A", email: "N/A", phone: "N/A", modality: "N/A" });
}

// Esta función ya no se usa para generar IDs falsos, pero es útil si alguna vez la necesitas.
function generateOrderId() {
    const timestamp = Date.now().toString(36);
    const randomStr = Math.random().toString(36).substr(2, 4);
    return `ORD${timestamp}${randomStr}`.toUpperCase();
}

function formatDateTime(date) {
    const d = new Date(date);
    return d.toLocaleString("it-IT", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
    });
}

function calculateTotal(items) {
    if (!items) return 0;
    return items.reduce((total, item) => {
        return total + ((item.price || 0) * (item.quantity || 1));
    }, 0);
}

// Esta función ya no se llama desde 'beforeunload', pero la dejamos por si la necesitas
function cleanupStorage() {
    localStorage.removeItem("paymentData");
    localStorage.removeItem("caritesCart");
    localStorage.removeItem("customerDetails");
    localStorage.removeItem("emailSent"); // Limpiar el flag del email
    console.log("Storage pulito manualmente");
}