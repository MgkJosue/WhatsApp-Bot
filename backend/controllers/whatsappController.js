// backend/controllers/whatsappController.js
const WhatsAppClient = require('../models/whatsappClient');
const fs = require('fs');
const { MessageMedia } = require('whatsapp-web.js');

// Instancia singleton del cliente
let whatsappClientInstance = null;

// Función para obtener o crear la instancia del cliente
const getClient = () => {
  if (!whatsappClientInstance) {
    console.log('Creando nueva instancia de cliente de WhatsApp');
    whatsappClientInstance = new WhatsAppClient();
  }
  return whatsappClientInstance;
};

// Función para destruir la instancia del cliente
const destroyClient = async () => {
  console.log('Destruyendo instancia actual del cliente');
  if (whatsappClientInstance) {
    try {
      await whatsappClientInstance.destroy();
    } catch (error) {
      console.log('Error al destruir instancia:', error.message);
    }
  }
  whatsappClientInstance = null;
};

const getQRCode = (req, res) => {
  console.log('Solicitud de código QR recibida');
  const client = getClient();
  const qrCode = client.getQRCode();
  if (qrCode) {
    console.log('Código QR generado y enviado');
    res.json({ qrCode });
  } else {
    console.log('Código QR no disponible');
    res.status(404).json({ message: 'QR Code not available' });
  }
};

const getStatus = (req, res) => {
  console.log('Solicitud de estado recibida');
  // If there's no client instance, create one
  if (!whatsappClientInstance) {
    console.log('No hay instancia de cliente, creando una nueva');
    getClient();
  }
  
  const ready = whatsappClientInstance.isReady();
  console.log('Estado del cliente:', ready);
  res.json({ 
    ready: ready,
    message: ready ? 'Client is ready' : 'Client is not ready'
  });
};

const logout = async (req, res) => {
  console.log('Solicitud de cierre de sesión recibida');
  try {
    // Destruir la instancia actual del cliente
    await destroyClient();
    
    // No crear una nueva instancia inmediatamente
    // La nueva instancia se creará cuando se solicite el QR code o se verifique el estado
    
    console.log('Sesión cerrada correctamente');
    res.json({ success: true, message: 'Sesión cerrada correctamente' });
  } catch (error) {
    console.error('Error al cerrar sesión:', error);
    res.status(500).json({ error: 'Error al cerrar sesión' });
  }
};

const sendMessages = async (req, res) => {
  console.log('Solicitud de envío de mensajes recibida');
  const client = getClient();
  
  try {
    // Verificar que el cliente esté listo
    if (!client.isReady()) {
      console.log('Cliente de WhatsApp no está listo');
      return res.status(400).json({ error: 'Cliente de WhatsApp no está listo' });
    }
    
    const { contacts, message } = req.body;
    const file = req.file;
    
    if (!contacts || !message) {
      console.log('Faltan datos requeridos');
      return res.status(400).json({ error: 'Faltan datos requeridos' });
    }
    
    console.log('Procesando lista de contactos');
    const contactList = JSON.parse(contacts);
    
    console.log('Enviando mensajes a', contactList.length, 'contactos');
    for (let num of contactList) {
      try {
        if (file) {
          console.log('Enviando mensaje con archivo a', num);
          await client.sendMessage(num, message, file.path);
        } else {
          console.log('Enviando mensaje de texto a', num);
          await client.sendMessage(num, message);
        }
        console.log(`📩 Enviado a ${num}`);
        await delay(5000); // 5 segs entre mensajes
      } catch (err) {
        console.error(`❌ Error con ${num}:`, err.message);
      }
    }
    
    // Eliminar archivo después de enviar
    if (file) {
      console.log('Eliminando archivo temporal');
      fs.unlinkSync(file.path);
    }
    
    console.log('Mensajes enviados correctamente');
    res.json({ success: true, message: 'Mensajes enviados correctamente' });
  } catch (error) {
    console.error('Error al enviar mensajes:', error);
    res.status(500).json({ error: 'Error al enviar mensajes' });
  }
};

const delay = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

module.exports = {
  getQRCode,
  getStatus,
  logout,
  sendMessages
};