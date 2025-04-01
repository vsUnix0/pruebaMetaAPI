import config from '../config/env.js';
import messageHandler from '../services/messageHandler.js';

class WebhookController {
  async handleIncoming(req, res) {
    // 📌 Meta envía los mensajes dentro de req.body.entry
    // Estructura típica de un mensaje recibido desde WhatsApp:
    // {
    //   "entry": [
    //     {
    //       "changes": [
    //         {
    //           "value": {
    //             "messages": [ { mensaje } ],
    //             "contacts": [ { información del remitente } ]
    //           }
    //         }
    //       ]
    //     }
    //   ]
    // }

    // ✅ Extrae la primera entrada del array "entry" (si existe)
    const entry = req.body.entry?.[0]?.changes?.[0]?.value;

    // ✅ Extrae el mensaje que envió el usuario (si existe)
    const message = entry?.messages?.[0];

    // ✅ Extrae la información del contacto/remitente (si existe)
    const senderInfo = entry?.contacts?.[0];

    // 📌 Si hay un mensaje, lo enviamos a messageHandler para que lo procese
    if (message) {
      await messageHandler.handleIncomingMessage(message, senderInfo);
    }
    console.log("📩 JSON recibido:", JSON.stringify(req.body, null, 2)); // 👈 Aquí verás el JSON en la consola

    // 📌 Meta espera una respuesta 200 para confirmar que el servidor recibió el mensaje correctamente
    res.sendStatus(200);
  }

  verifyWebhook(req, res) {
    // 📌 Meta usa estos parámetros en la URL para verificar el webhook
    // Ejemplo de la solicitud que Meta envía:
    // GET https://mi-servidor.com/webhook?hub.mode=subscribe&hub.verify_token=MI_TOKEN&hub.challenge=123456

    // ✅ Extrae los valores de la consulta en la URL
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    // 📌 Meta envía "subscribe" en hub.mode cuando intenta verificar el webhook
    // 📌 Se compara el token con la variable de entorno WEBHOOK_VERIFY_TOKEN
    if (mode === 'subscribe' && token === config.WEBHOOK_VERIFY_TOKEN) {
      // ✅ Meta espera recibir "challenge" si la verificación es correcta
      res.status(200).send(challenge);
      console.log('✅ Webhook verified successfully!');
    } else {
      // ❌ Si el token es incorrecto, respondemos con 403 (Forbidden)
      res.sendStatus(403);
    }
  }
}

export default new WebhookController();
