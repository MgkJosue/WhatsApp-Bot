const { Client } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const fs = require('fs');

// Leer lista de clientes
const clientes = JSON.parse(fs.readFileSync('./clientes.json', 'utf-8'));

// Leer mensaje
const mensaje = fs.readFileSync('./mensaje.txt', 'utf-8');

// Inicializar cliente
const client = new Client();

client.on('qr', qr => qrcode.generate(qr, { small: true }));
client.on('ready', async () => {
  console.log('✅ Bot conectado! Empezando a enviar mensajes...');

  for (let num of clientes) {
    try {
      await client.sendMessage(num + "@c.us", mensaje);
      console.log(`📩 Enviado a ${num}`);
      await delay(5000); // 5 segs entre mensajes
    } catch (err) {
      console.error(`❌ Error con ${num}:`, err.message);
    }
  }

  console.log("✅ Todos los mensajes fueron enviados.");
  process.exit(); // cerrar app cuando termine
});

client.initialize();

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
