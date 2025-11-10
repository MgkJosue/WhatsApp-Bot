import React from 'react';

const ActionButtons = ({ onSend, onExport, sending }) => {
  return (
    <div className="action-buttons">
      <button 
        className="send-button" 
        onClick={onSend}
        disabled={sending}
      >
        {sending ? 'Enviando...' : 'Enviar Mensajes'}
      </button>
      <button className="export-button" onClick={onExport}>
        Exportar Contactos
      </button>
    </div>
  );
};

export default ActionButtons;