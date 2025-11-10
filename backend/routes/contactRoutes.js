// backend/routes/contactRoutes.js
const express = require('express');
const router = express.Router();
const ContactController = require('../controllers/contactController');
const multer = require('multer');
const fs = require('fs');

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

const contactController = new ContactController();

router.post('/process-contacts', upload.single('file'), contactController.processContactsFile);

module.exports = router;