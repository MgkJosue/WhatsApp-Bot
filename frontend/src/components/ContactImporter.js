import React, { useState } from 'react';
import { processContactsFile } from '../services/api';

const ContactImporter = ({ onContactsImported }) => {
  const [fileName, setFileName] = useState('');

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      setFileName(file.name);
      
      try {
        const result = await processContactsFile(file);
        onContactsImported(result.contacts);
      } catch (error) {
        console.error('Error al procesar archivo de contactos:', error);
        alert('Error al procesar archivo de contactos: ' + error.message);
      }
    }
  };

  return (
    <div className="contact-importer">
      <h2>Importar Contactos</h2>
      <input 
        type="file" 
        accept=".xlsx, .xls" 
        onChange={handleFileUpload}
        id="contact-file"
        style={{ display: 'none' }}
      />
      <label htmlFor="contact-file" className="file-label">
        {fileName || "Seleccionar archivo Excel"}
      </label>
    </div>
  );
};

export default ContactImporter;