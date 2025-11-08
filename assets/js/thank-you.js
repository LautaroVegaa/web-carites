document.addEventListener("DOMContentLoaded", async function() {
    const urlParams = new URLSearchParams(window.location.search);
    const sessionId = urlParams.get("session_id");
    
    // 1. Cargar los detalles del cliente PRIMERO.
    const customerDetails = JSON.parse(localStorage.getItem("customerDetails")) || {};

    if (sessionId) {
        // 🔹 Caso Stripe
        try {
            let paymentData = JSON.parse(localStorage.getItem("paymentData")) || {};

            const res = await fetch(`/api/stripe-session?id=${sessionId}`);
            if (!res.ok) throw new Error('Errore nel recupero della sessione Stripe');
            
            const session = await res.json();

            // --- CORRECCIÓN ---
            // Rellenar campos faltantes si Stripe no los devuelve.
            paymentData.orderId = session.orderId || paymentData.orderId || generateOrderId();
            paymentData.status = session.status || paymentData.status || "Confermato";
            paymentData.paymentMethod = session.paymentMethod || paymentData.paymentMethod || "Carta di Credito";
            paymentData.email = session.email || paymentData.email || customerDetails.email;
            paymentData.total = paymentData.total || calculateTotal(paymentData.items || []);
            // --- FIN CORRECCIÓN ---

            localStorage.setItem("paymentData", JSON.stringify(paymentData));
            localStorage.removeItem("caritesCart");

            displayPaymentData(paymentData, customerDetails);
            sendConfirmationEmail(paymentData, customerDetails);

        } catch (err) {
            console.error("❌ Errore Stripe:", err);
            loadPaymentData(customerDetails); 
        }
    } else {
        // 🔹 Caso PayPal o recarga de página
        loadPaymentData(customerDetails);
    }

    window.addEventListener("beforeunload", cleanupStorage);
});

function loadPaymentData(customerDetails) {
    const paymentDataString = localStorage.getItem("paymentData");
    
    if (paymentDataString) {
        try {
            const paymentData = JSON.parse(paymentDataString);

            if (customerDetails.email) {
                paymentData.email = customerDetails.email;
            }

            // --- CORRECCIÓN ---
            // Completar datos si faltan (caso Stripe sin session_id)
            paymentData.total = paymentData.total || calculateTotal(paymentData.items || []);
            paymentData.orderId = paymentData.orderId || generateOrderId();
            paymentData.paymentMethod = paymentData.paymentMethod || "Stripe";
            paymentData.status = paymentData.status || "Confermato";
            // --- FIN CORRECCIÓN ---

            displayPaymentData(paymentData, customerDetails);
            sendConfirmationEmail(paymentData, customerDetails);

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

    try {
        const response = await fetch('/api/send-confirmation', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ paymentData, customerDetails })
        });

        if (response.ok) {
            console.log("Email di conferma inviata con successo.");
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

    // --- CORRECCIÓN ---
    const stored = JSON.parse(localStorage.getItem("paymentData") || "{}");
    const total = (data.total && data.total > 0)
        ? data.total
        : stored.total || calculateTotal(data.items || []);
    const method = data.paymentMethod || stored.paymentMethod || "Stripe";
    // --- FIN CORRECCIÓN ---

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
        <div class="summary-row">
            <div class="summary-label">Metodo di Pagamento:</div>
            <div class="summary-value">${method}</div>
        </div>
    `;
}

function displayTransactionDetails(data, customerDetails) {
    const detailsContainer = document.getElementById("transaction-details");
    if (!detailsContainer) return;

    const currentDate = new Date();

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
            <div class="detail-value">${data.orderId || generateOrderId()}</div>
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
    if (!data.items || data.items.length === 0) {
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
        orderId: generateOrderId(),
        date: new Date(),
        status: "Confermato",
        paymentMethod: "N/A",
        email: customerDetails.email || "N/A",
        total: 0,
        items: []
    };
    displayPaymentData(defaultData, customerDetails || { name: "N/A", email: "N/A", phone: "N/A", modality: "N/A" });
}

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
    return items.reduce((total, item) => {
        return total + ((item.price || 0) * (item.quantity || 1));
    }, 0);
}

function cleanupStorage() {
    localStorage.removeItem("paymentData");
    localStorage.removeItem("caritesCart");
    localStorage.removeItem("customerDetails");
    console.log("Storage pulito automaticamente");
}