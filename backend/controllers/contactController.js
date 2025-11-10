// backend/controllers/contactController.js
const XLSX = require('xlsx');
const fs = require('fs');

class ContactController {
  async processContactsFile(req, res) {
    try {
      const file = req.file;
      
      if (!file) {
        return res.status(400).json({ error: 'No se ha subido ningún archivo' });
      }
      
      const data = fs.readFileSync(file.path);
      const workbook = XLSX.read(data, { type: 'buffer' });
      
      // Asumimos que los contactos están en la primera hoja
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];
      
      // Convertir a JSON
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
      
      // Extraer números de teléfono (asumiendo que están en la primera columna)
      const contacts = jsonData
        .slice(1) // Saltar encabezado
        .map(row => row[0])
        .filter(contact => contact); // Filtrar valores vacíos
      
      // Eliminar archivo después de procesar
      fs.unlinkSync(file.path);
      
      res.json({ contacts });
    } catch (error) {
      console.error('Error al procesar archivo de contactos:', error);
      res.status(500).json({ error: 'Error al procesar archivo de contactos' });
    }
  }
}

module.exports = ContactController;