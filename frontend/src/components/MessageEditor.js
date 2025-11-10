import React from 'react';

const MessageEditor = ({ message, onMessageChange }) => {
  return (
    <div className="message-editor">
      <h2>Mensaje</h2>
      <textarea 
        value={message}
        onChange={(e) => onMessageChange(e.target.value)}
        placeholder="Escribe tu mensaje aquí..."
        className="message-textarea"
      />
    </div>
  );
};

export default MessageEditor;