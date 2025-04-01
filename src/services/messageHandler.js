import whatsappService from './whatsappService.js';
import { saludos } from '../mensajes/saludos.js';
import { response } from 'express';

// Clase que maneja los mensajes entrantes
class MessageHandler {

  async handleIncomingMessage(message, senderInfo) {//se pasan por parametros las rutas de los mensajes entrantes y información de contacto
    if(message.type === 'text'){//recibe una respuesta tipo texto
      const incomingMessage = message.text.body.toLowerCase().trim();//toma los valores en minúscula y sin espacios
      const incomingMedia = ['audio', 'image', 'video', 'document'];

      await whatsappService.markAsRead(message.id);//Marca como leído
      if(this.isGreeting(incomingMessage)){//si el mensaje entrante es saludo
        await this.sendWelcomeMessage(message.from, message.id, senderInfo);//envía el saludo
        await this.sendMenu(message.from);//Envía el menú
      } else if(incomingMedia.includes(incomingMessage)){
        await this.sendMedia(message.from, incomingMessage)
      }else {
        const response = `Echo: ${message.text.body}`;//si no es un saludo responde como echo
        await whatsappService.sendMessage(message.from, response, message.id);//Envía el mensaje
      }
    } else if (message?.type === 'interactive') {//Si es interactivo
      const option = message?.interactive?.button_reply?.id;//busca la opción elegida
      await this.handleMenuOption(message.from, option);//Envía la respuesta a la opción
      await whatsappService.markAsRead(message.id);//marca como leido para evitar errores
    }
  }

  // Verifica si el mensaje es un saludo
  isGreeting(message) {
    return saludos.includes(message);
  }

  // Obtiene el nombre del remitente
  getSenderName(senderInfo) {
    return senderInfo.profile?.name || senderInfo.wa_id || "";
  }

  // Envía un mensaje de bienvenida personalizado
  async sendWelcomeMessage(to, messageId, senderInfo) {
    const name = this.getSenderName(senderInfo);//obtiene el nombre del usuario
    const firstName = name.split(' ')[0];//Toma solo el nombre
    const formatName = firstName.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, '');//formatea ese nombre para que tome tildes
    const welcomeMessage = `Hola ${formatName}, soy tu chat bot de prueba! ¿En qué puedo ayudarte hoy?`;//variable que contiene el saludo con el nombre
    await whatsappService.sendMessage(to, welcomeMessage, messageId);//envía el mensaje pero tiene que procesarse en el main de este archivo
  }

  // Envía un menú de opciones al usuario
  async sendMenu(to) {
    const menuMessage = "Elige una opción";
    const buttons = [
      { type: 'reply', reply: { id: 'option_1', title: 'Agendar' } },
      { type: 'reply', reply: { id: 'option_2', title: 'Consultar' } },
      { type: 'reply', reply: { id: 'option_3', title: 'Ubicación del lugar' } }
    ];
    await whatsappService.sendInteractiveButtons(to, menuMessage, buttons);
  }

  // Maneja la opción seleccionada del menú
  async handleMenuOption(to, option) {
    let response;
    switch (option.normalize("NFD").replace(/[\u0300-\u036f]/g, "")) {
      case 'option_1':
        response = "Agendar cita";
        break;
      case 'option_2':
        response = 'Realiza tu consulta';
        break;
      case 'option_3':
        response = 'Esta es nuestra ubicación';
        break;
      default:
        response = 'Lo siento, no entendí tu selección, por favor elige una de las opciones del menú';
    }
    await whatsappService.sendMessage(to, response);
  }

  
  // Envía un archivo multimedia
  async sendMedia(to, incomingMessage) {
    let mediaUrl = "";
    let caption = "";
    let type = "";
  
    switch (incomingMessage) {
      case "audio":
        mediaUrl = "URL_DEL_AUDIO"; // Reemplaza con la URL real
        caption = "Aquí tienes un audio";
        type = "audio";
        break;
      case "image":
        mediaUrl = "URL_DE_LA_IMAGEN"; // Reemplaza con la URL real
        caption = "Aquí tienes una imagen";
        type = "image";
        break;
      case "video":
        mediaUrl = "URL_DEL_VIDEO"; // Reemplaza con la URL real
        caption = "Aquí tienes un video";
        type = "video";
        break;
      case "document":
        mediaUrl = "https://vsunix0.github.io/PDF/HOTELES.pdf"; // Tu URL de PDF
        caption = "Aquí tienes un documento";
        type = "document";
        break;
      default:
        return await whatsappService.sendMessage(to, "Lo siento, no entiendo lo que acabas de escribir.");
    }
  
    await whatsappService.sendMediaMessage(to, type, mediaUrl, caption);
  }
}

export default new MessageHandler();
