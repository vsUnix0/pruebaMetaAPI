// Importamos el framework Express, que nos permite crear un servidor web de manera sencilla.
import express from 'express';

// Importamos la configuración desde un archivo externo (config/env.js).
// Este archivo probablemente contiene variables de entorno como el puerto del servidor.
import config from './config/env.js';

// Importamos las rutas relacionadas con los webhooks desde otro archivo (routes/webhookRoutes.js).
// Esto ayuda a mantener el código modular y organizado.
import webhookRoutes from './routes/webhookRoutes.js';

// Creamos una instancia de la aplicación Express.
const app = express();

// Middleware: Configuramos Express para que pueda interpretar cuerpos de solicitudes en formato JSON.
// Esto es necesario para manejar solicitudes POST con datos en formato JSON.
app.use(express.json());

// Middleware: Registramos las rutas de los webhooks en la raíz del servidor ('/').
// Esto significa que cualquier solicitud que coincida con las rutas definidas en webhookRoutes será manejada aquí.
app.use('/', webhookRoutes);

// Definimos una ruta GET para la raíz ('/').
// Cuando alguien accede a la raíz del servidor, se envía una respuesta con un mensaje HTML simple.
app.get('/', (req, res) => {
  res.send(`<pre>Nothing to see here.
Checkout README.md to start.</pre>`);
});

// Iniciamos el servidor en el puerto especificado en la configuración (config.PORT).
// Una vez que el servidor está en funcionamiento, imprimimos un mensaje en la consola.
app.listen(config.PORT, () => {
  console.log(`Server is listening on port:  ${config.PORT}`);
});