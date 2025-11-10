import React from 'react';

const ContactList = ({ contacts }) => {
  return (
    <div className="contact-list">
      <h2>Lista de Contactos ({contacts.length})</h2>
      {contacts.length > 0 ? (
        <div className="contact-table">
          <div className="table-header">
            <div className="table-cell">Número de Teléfono</div>
          </div>
          <div className="table-body">
            {contacts.map((contact, index) => (
              <div className="table-row" key={index}>
                <div className="table-cell">{contact}</div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <p className="no-contacts">No hay contactos importados</p>
      )}
    </div>
  );
};

export default ContactList;