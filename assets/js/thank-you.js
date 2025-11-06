document.addEventListener("DOMContentLoaded", async function() {
    const urlParams = new URLSearchParams(window.location.search);
    const sessionId = urlParams.get("session_id");

    if (sessionId) {
        // 🔹 Caso Stripe
        try {
            // ¡ACTUALIZADO! Apunta a /api/stripe-session usando query param
            const res = await fetch(`/api/stripe-session?id=${sessionId}`);
            if (!res.ok) throw new Error('Errore nel recupero della sessione Stripe');
            
            const session = await res.json();

            const paymentData = {
                orderId: session.orderId,
                status: session.status || "confermato",
                paymentMethod: session.paymentMethod || "Stripe",
                email: session.email || "cliente@email.com",
                date: session.date || new Date(),
                total: session.total || 0,
                items: JSON.parse(localStorage.getItem("caritesCart")) || []
            };

            localStorage.setItem("paymentData", JSON.stringify(paymentData));
            localStorage.removeItem("caritesCart");

            displayPaymentData(paymentData);
        } catch (err) {
            console.error("❌ Errore Stripe:", err);
            loadPaymentData(); // fallback
        }
    } else {
        // 🔹 Caso PayPal o default
        loadPaymentData();
    }

    // Limpieza después de mostrar
    window.addEventListener("beforeunload", cleanupStorage);

});

function loadPaymentData() {
    const paymentDataString = localStorage.getItem("paymentData");
    if (paymentDataString) {
        try {
            const paymentData = JSON.parse(paymentDataString);
            displayPaymentData(paymentData);
        } catch (error) {
            console.error("Errore nel caricamento:", error);
            displayDefaultData();
        }
    } else {
        displayDefaultData();
    }
}

function displayPaymentData(data) {
    displayPaymentSummary(data);
    displayTransactionDetails(data);
    displayServices(data);
}

function displayPaymentSummary(data) {
    const summaryContainer = document.getElementById("payment-summary");
    if (!summaryContainer) return;
    
    const total = data.total || calculateTotal(data.items || []);

    summaryContainer.innerHTML = `
        <div class="summary-row">
            <div class="summary-label">
                <span class="detail-icon">📧</span>
                Email di conferma inviata a:
            </div>
            <div class="summary-value">${data.email || "cliente@email.com"}</div>
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
            <div class="summary-value">€${parseFloat(total).toFixed(2)}</div>
        </div>
    `;
}

function displayTransactionDetails(data) {
    const detailsContainer = document.getElementById("transaction-details");
    if (!detailsContainer) return;

    const currentDate = new Date();

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
            <div class="detail-value">${data.paymentMethod || "Carta di Credito"}</div>
        </div>
    `;
}

function displayServices(data) {
    if (!data.items || data.items.length === 0) return;

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

    // Totale finale
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

function displayDefaultData() {
    const defaultData = {
        orderId: generateOrderId(),
        date: new Date(),
        status: "Confermato",
        paymentMethod: "Carta di Credito",
        email: "cliente@email.com",
        total: 99.99,
        items: [
            { title: "Consulenza Professionale", quantity: 1, price: 99.99 }
        ]
    };
    displayPaymentData(defaultData);
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
    localStorage.removeItem("cartTotal");
    console.log("Storage pulito automaticamente");
}