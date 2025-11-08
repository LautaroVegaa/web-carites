document.addEventListener("DOMContentLoaded", async function() {
    const urlParams = new URLSearchParams(window.location.search);
    const sessionId = urlParams.get("session_id");
    
    // 1. Cargar los detalles del cliente PRIMERO.
    const customerDetails = JSON.parse(localStorage.getItem("customerDetails")) || {};

    if (sessionId) {
        // 🔹 Caso Stripe
        try {
            const res = await fetch(`/api/stripe-session?id=${sessionId}`);
            if (!res.ok) throw new Error('Errore nel recupero della sessione Stripe');
            
            const session = await res.json();

            const paymentData = {
                orderId: session.orderId,
                status: session.status || "confermato",
                paymentMethod: session.paymentMethod || "Stripe",
                // Usar email de Stripe, o del formulario, o de último recurso el default
                email: session.email || customerDetails.email || "cliente@email.com", 
                date: session.date || new Date(),
                total: session.total || 0,
                items: JSON.parse(localStorage.getItem("caritesCart")) || []
            };

            localStorage.setItem("paymentData", JSON.stringify(paymentData));
            localStorage.removeItem("caritesCart");

            displayPaymentData(paymentData, customerDetails);
            sendConfirmationEmail(paymentData, customerDetails);

        } catch (err) {
            console.error("❌ Errore Stripe:", err);
            // Fallback: Cargar datos de PayPal/Default, pero pasar los customerDetails
            loadPaymentData(customerDetails); 
        }
    } else {
        // 🔹 Caso PayPal o default (o recarga de página)
        loadPaymentData(customerDetails);
    }

    // Limpieza SÓLO al salir de thank-you.html
    window.addEventListener("beforeunload", cleanupStorage);
});

function loadPaymentData(customerDetails) {
    const paymentDataString = localStorage.getItem("paymentData");
    
    if (paymentDataString) {
        // --- CASO IDEAL (PayPal o Stripe ya procesado) ---
        try {
            const paymentData = JSON.parse(paymentDataString);
            
            // Asegurar que el email del formulario (el más fiable) esté en el resumen
            if (customerDetails.email) {
                paymentData.email = customerDetails.email;
            }
            
            displayPaymentData(paymentData, customerDetails);
            sendConfirmationEmail(paymentData, customerDetails);

        } catch (error) {
            console.error("Errore nel caricamento:", error);
            // Error raro, mostrar datos por defecto PERO con cliente real
            displayDefaultData(customerDetails);
        }
    } else {
        // --- CASO DE RECARGA DE PÁGINA (paymentData fue borrado) ---
        // Mostramos datos por defecto, PERO usamos los customerDetails reales
        displayDefaultData(customerDetails);
    }
}

// ==========================================================
// NUEVA FUNCIÓN PARA ENVIAR EL EMAIL
// ==========================================================
async function sendConfirmationEmail(paymentData, customerDetails) {
    // Evitar enviar email si no hay datos del cliente (ej. página recargada)
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
// ==========================================================

function displayPaymentData(data, customerDetails) {
    displayPaymentSummary(data, customerDetails);
    displayTransactionDetails(data, customerDetails);
    displayServices(data);
}

function displayPaymentSummary(data, customerDetails) {
    const summaryContainer = document.getElementById("payment-summary");
    if (!summaryContainer) return;
    
    // Usar el email del formulario (más fiable) o el del pago
    const displayEmail = customerDetails.email || data.email || "N/A";
    const total = data.total || calculateTotal(data.items || []);

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
            <div class="summary-value">€${parseFloat(total).toFixed(2)}</div>
        </div>
    `;
}

function displayTransactionDetails(data, customerDetails) {
    const detailsContainer = document.getElementById("transaction-details");
    if (!detailsContainer) return;

    const currentDate = new Date();

    // *** ESTA ES LA CORRECCIÓN CLAVE ***
    // Siempre usamos los 'customerDetails' que vienen de localStorage.
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
         // Intentar cargar desde el paymentData guardado si los items no vienen
        const savedData = JSON.parse(localStorage.getItem("paymentData"));
        if (savedData && savedData.items && savedData.items.length > 0) {
            data.items = savedData.items;
            data.total = savedData.total;
        } else {
            return; // No hay items
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

/**
 * MODIFICADO: Esta función ahora acepta 'customerDetails'
 * para no usar "Cliente Esempio" si tenemos los datos reales.
 */
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
    // Usa los customerDetails reales, o un objeto vacío si no existen
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

// ACTUALIZADO para limpiar todo
function cleanupStorage() {
    localStorage.removeItem("paymentData");
    localStorage.removeItem("caritesCart");
    localStorage.removeItem("customerDetails"); // <-- Añadido
    console.log("Storage pulito automaticamente");
}
// NOTA: No hay '}' extra aquí al final.