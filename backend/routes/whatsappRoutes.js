// backend/routes/whatsappRoutes.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const fs = require('fs');
const { getQRCode, getStatus, logout, sendMessages } = require('../controllers/whatsappController');

// Configuración de multer para manejar la carga de archivos
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = multer({ storage: storage });

// Crear directorio de uploads si no existe
if (!fs.existsSync('uploads')) {
    fs.mkdirSync('uploads');
}

router.get('/qr', getQRCode);
router.get('/status', getStatus);
router.post('/logout', logout);
router.post('/send-messages', upload.single('file'), sendMessages);

module.exports = router;