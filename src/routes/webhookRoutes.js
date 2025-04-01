import express from 'express'; // Importamos Express
import webhookController from '../controllers/webhookController.js'; // Importamos el controlador del webhook

const router = express.Router(); // Creamos un router de Express para definir rutas

// Ruta para recibir mensajes desde WhatsApp (Meta enviará los eventos aquí)
router.post('/webhook', webhookController.handleIncoming);

// Ruta para la verificación del webhook de Meta (cuando configuramos el webhook en Meta, llamarán a esta ruta con un challenge)
router.get('/webhook', webhookController.verifyWebhook);

export default router; // Exportamos el router para usarlo en app.js