const { Resend } = require('resend');

// --- INICIO DE DEBUGGING ---
console.log("API /api/send-confirmation INVOCADA");
const apiKey = process.env.RESEND_API_KEY;
console.log("API Key cargada:", !!apiKey); // Esto dirá 'true' o 'false'
// --- FIN DE DEBUGGING ---

const resend = new Resend(apiKey);
const TU_EMAIL = "lautarocarignani@gmail.com"; // O tu email de admin
// ... (el resto del código sigue igual)

// Función para permitir CORS (cópiala de tus otros archivos API)
const allowCors = (fn) => async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  return await fn(req, res);
};

// Formatear los servicios para el email
function formatServices(items) {
  let list = '<ul>';
  items.forEach(item => {
    list += `<li>${item.title} (x${item.quantity}) - €${item.price * item.quantity}</li>`;
  });
  list += '</ul>';
  return list;
}

// Formatear los datos del cliente
function formatCustomerData(customer, paymentData) {
  return `
    <p><strong>Nome:</strong> ${customer.name}</p>
    <p><strong>Email:</strong> ${customer.email}</p>
    <p><strong>Telefono:</strong> ${customer.phone}</p>
    <p><strong>Modalità:</strong> ${customer.modality}</p>
    <p><strong>Disponibilità:</strong> ${customer.availability}</p>
    <hr>
    <p><strong>ID Pagamento:</strong> ${paymentData.orderId}</p>
    <p><strong>Metodo:</strong> ${paymentData.paymentMethod}</p>
  `;
}

async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { paymentData, customerDetails } = req.body;

      if (!paymentData || !customerDetails) {
        return res.status(400).json({ error: 'Dati mancanti' });
      }

      const emailCliente = customerDetails.email;
      const nomeCliente = customerDetails.name;
      const totalePagato = paymentData.total;
      
      // 1. Crear el HTML para el correo del cliente
      const emailHtmlCliente = `
        <div>
          <h1>Grazie per il tuo acquisto, ${nomeCliente}!</h1>
          <p>La tua prenotazione è stata confermata con successo.</p>
          <h3>Riepilogo dell'ordine:</h3>
          ${formatServices(paymentData.items)}
          <p><strong>Totale pagato: €${totalePagato}</strong></p>
          <hr>
          <h3>I tuoi dati:</h3>
          ${formatCustomerData(customerDetails, paymentData)}
          <p>Ti contatteremo presto per confermare la data e l'ora della tua prenotazione.</p>
          <p>Grazie,<br>Carites Ravenna</p>
        </div>
      `;
      
      // 2. Crear el HTML para el correo del admin (tú)
      const emailHtmlAdmin = `
        <div>
          <h1>🎉 Nuovo Ordine!</h1>
          <p>Hai ricevuto un nuovo ordine da <strong>${nomeCliente}</strong> (${emailCliente}).</p>
          <h3>Dettagli dell'ordine:</h3>
          ${formatServices(paymentData.items)}
          <p><strong>Totale pagato: €${totalePagato}</strong></p>
          <hr>
          <h3>Dati del cliente:</h3>
          ${formatCustomerData(customerDetails, paymentData)}
        </div>
      `;

      // 3. Enviar correo al CLIENTE
      await resend.emails.send({
        from: 'Carites Ravenna <onboarding@resend.dev>', // Cambia esto si verificaste tu dominio
        to: [emailCliente],
        subject: 'Conferma della tua prenotazione - Carites Ravenna',
        html: emailHtmlCliente,
      });

      // 4. Enviar correo al ADMIN (a ti)
      await resend.emails.send({
        from: 'Notifica Nuovo Ordine <onboarding@resend.dev>', // Cambia esto si verificaste tu dominio
        to: [TU_EMAIL],
        subject: `[Nuovo Ordine] Prenotazione da ${nomeCliente}`,
        html: emailHtmlAdmin,
      });

      res.status(200).json({ message: 'Email inviate con successo' });

    } catch (err) {
      console.error("Errore inviando email:", err);
      res.status(500).json({ error: 'Errore durante l\'invio dell\'email' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

module.exports = allowCors(handler);