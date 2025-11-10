import React from 'react';
import './Sidebar.css';

const Sidebar = ({ currentPage, onNavigate, isClientReady, isOpen, onClose }) => {
  return (
    <>
      <div className={`sidebar-overlay ${isOpen ? 'active' : ''}`} onClick={onClose}></div>
      <div className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <h2>WhatsApp Bot</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        <nav className="sidebar-nav">
          <ul>
            <li 
              className={currentPage === 'home' ? 'active' : ''} 
              onClick={() => onNavigate('home')}
            >
              Inicio
            </li>
            <li 
              className={currentPage === 'contacts' ? 'active' : ''} 
              onClick={() => onNavigate('contacts')}
            >
              Contactos
            </li>
            <li 
              className={currentPage === 'session' ? 'active' : ''} 
              onClick={() => onNavigate('session')}
            >
              {isClientReady ? 'Cerrar Sesión' : 'Iniciar Sesión'}
            </li>
          </ul>
        </nav>
      </div>
    </>
  );
};

export default Sidebar;