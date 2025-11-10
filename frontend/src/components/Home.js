import React, { useState } from 'react';
import MessageEditor from './MessageEditor';
import MediaUploader from './MediaUploader';
import ContactList from './ContactList';
import ActionButtons from './ActionButtons';
import { sendMessages } from '../services/api';
import './Home.css';

const Home = () => {
  const [contacts, setContacts] = useState([]);
  const [message, setMessage] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [sending, setSending] = useState(false);

  // Obtener la lista de contactos cuando se carga el componente
  // useEffect(() => {
  //   // En una implementación real, aquí se obtendría la lista de contactos
  //   // Por ahora, dejamos el estado vacío
  // }, []);

  const handleSendMessages = async () => {
    if (contacts.length === 0) {
      alert('Por favor, importa una lista de contactos primero.');
      return;
    }
    
    if (!message.trim()) {
      alert('Por favor, escribe un mensaje.');
      return;
    }
    
    setSending(true);
    try {
      const result = await sendMessages(contacts, message, selectedFile);
      alert(result.message || 'Mensajes enviados correctamente');
    } catch (error) {
      console.error('Error al enviar mensajes:', error);
      alert('Error al enviar mensajes: ' + error.message);
    } finally {
      setSending(false);
    }
  };

  const handleExportContacts = async () => {
    if (contacts.length === 0) {
      alert('No hay contactos para exportar.');
      return;
    }
    
    try {
      // Crear contenido CSV
      let csvContent = "data:text/csv;charset=utf-8,";
      csvContent += "Número de Teléfono\
";
      contacts.forEach(contact => {
        csvContent += contact + "\
";
      });
      
      // Crear y descargar archivo
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", "contactos_whatsapp.csv");
      document.body.appendChild(link);
      
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error al exportar contactos:', error);
      alert('Error al exportar contactos: ' + error.message);
    }
  };

  return (
    <div className="home">
      <h1>Inicio - Envío de Mensajes</h1>
      <div className="home-content">
        <div className="section">
          <h2>Lista de Contactos</h2>
          <ContactList contacts={contacts} />
          <p className="info-text">
            Para enviar mensajes, primero importa una lista de contactos en la sección "Contactos".
          </p>
        </div>
        
        <div className="section">
          <MessageEditor message={message} onMessageChange={setMessage} />
        </div>
        
        <div className="section">
          <MediaUploader onFileSelect={setSelectedFile} />
        </div>
        
        <div className="section">
          <ActionButtons 
            onSend={handleSendMessages} 
            onExport={handleExportContacts} 
            sending={sending}
          />
        </div>
      </div>
    </div>
  );
};

export default Home;