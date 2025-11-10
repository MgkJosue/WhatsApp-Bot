// backend/models/whatsappClient.js
const { Client, MessageMedia } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

class WhatsAppClient {
  constructor() {
    console.log('Creando nueva instancia de cliente de WhatsApp');
    this.client = new Client({
      puppeteer: {
        headless: true,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-accelerated-2d-canvas',
          '--no-first-run',
          '--no-zygote',
          '--single-process',
          '--disable-gpu'
        ]
      }
    });
    this.qrCode = null;
    this.ready = false;
    
    this.client.on('qr', qr => {
      console.log('Código QR recibido');
      this.qrCode = qr;
    });
    
    this.client.on('ready', () => {
      console.log('Cliente de WhatsApp listo');
      this.ready = true;
      this.qrCode = null;
    });
    
    this.client.on('disconnected', (reason) => {
      console.log('Cliente de WhatsApp desconectado:', reason);
      this.ready = false;
      this.qrCode = null;
    });
    
    this.client.initialize();
  }
  
  getQRCode() {
    return this.qrCode;
  }
  
  isReady() {
    return this.ready;
  }
  
  async sendMessage(phone, message, mediaPath = null) {
    if (!this.ready) {
      throw new Error('Client not ready');
    }
    
    try {
      if (mediaPath) {
        console.log('Enviando mensaje con archivo multimedia');
        const media = MessageMedia.fromFilePath(mediaPath);
        await this.client.sendMessage(phone + "@c.us", media, { caption: message });
      } else {
        console.log('Enviando mensaje de texto');
        await this.client.sendMessage(phone + "@c.us", message);
      }
      return { success: true };
    } catch (error) {
      throw new Error('Error sending message: ' + error.message);
    }
  }
  
  async destroy() {
    console.log('Destruyendo cliente de WhatsApp');
    if (this.client) {
      // Eliminar todos los listeners
      console.log('Eliminando listeners');
      this.client.removeAllListeners();
      
      // Forzar la desconexión
      console.log('Forzando desconexión');
      try {
        await this.client.logout();
      } catch (error) {
        console.log('Error al hacer logout:', error.message);
      }
      
      // Destruir el cliente
      console.log('Destruyendo cliente');
      try {
        await this.client.destroy();
      } catch (error) {
        console.log('Error al destruir cliente:', error.message);
      }
      
      // Limpiar las propiedades
      this.client = null;
      this.ready = false;
      this.qrCode = null;
    }
  }
}

module.exports = WhatsAppClient;