const express = require('express');
const cors = require('cors');
const whatsappRoutes = require('./routes/whatsappRoutes');
const contactRoutes = require('./routes/contactRoutes');
const path = require('path');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Servir archivos estáticos
app.use('/uploads', express.static('uploads'));

// Rutas
app.use('/api/whatsapp', whatsappRoutes);
app.use('/api/contacts', contactRoutes);

app.get('/', (req, res) => {
    res.json({ message: 'WhatsApp Bot Backend API' });
});

// Iniciar servidor
const server = app.listen(PORT, () => {
    console.log(`Servidor backend corriendo en http://localhost:${PORT}`);
});

// Manejar cierre graceful del servidor
process.on('SIGINT', () => {
    console.log('Apagando servidor...');
    server.close(() => {
        console.log('Servidor apagado');
        process.exit(0);
    });
});