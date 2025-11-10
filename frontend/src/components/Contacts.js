import React, { useState } from 'react';
import ContactImporter from './ContactImporter';
import ContactList from './ContactList';
import './Contacts.css';

const Contacts = () => {
  const [contacts, setContacts] = useState([]);

  const handleContactsImported = (importedContacts) => {
    setContacts(importedContacts);
  };

  const handleExportTemplate = () => {
    // Crear contenido CSV para la plantilla
    const csvContent = "data:text/csv;charset=utf-8,Número de Teléfono\n593978983373\n593998130537\n593984384471";
    
    // Crear y descargar archivo
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "plantilla_contactos_whatsapp.csv");
    document.body.appendChild(link);
    
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="contacts">
      <h1>Contactos</h1>
      <div className="contacts-content">
        <div className="section">
          <ContactImporter onContactsImported={handleContactsImported} />
        </div>
        
        <div className="section">
          <h2>Lista de Contactos</h2>
          <ContactList contacts={contacts} />
        </div>
        
        <div className="section">
          <h2>Plantilla de Contactos</h2>
          <p>Descarga la plantilla para importar tus contactos:</p>
          <button onClick={handleExportTemplate} className="template-button">
            Descargar Plantilla
          </button>
        </div>
      </div>
    </div>
  );
};

export default Contacts;