import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import Home from './Home';
import Contacts from './Contacts';
import Session from './Session';
import './Dashboard.css';

const Dashboard = () => {
  const [currentPage, setCurrentPage] = useState('session'); // Empezar en la página de sesión
  const [isClientReady, setIsClientReady] = useState(false);
  const [qrCode, setQrCode] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Verificar el estado del cliente de WhatsApp
  useEffect(() => {
    const checkClientStatus = async () => {
      try {
        const response = await fetch('/api/whatsapp/status');
        if (response.ok) {
          const data = await response.json();
          setIsClientReady(data.ready);
          setLoading(false);
          
          // Si el cliente está listo, ir a la página de inicio
          if (data.ready) {
            setCurrentPage('home');
          } else {
            // Si no está listo, mostrar la página de sesión
            setCurrentPage('session');
          }
        } else {
          setError('No se pudo obtener el estado del cliente. Verifica que el backend esté ejecutándose.');
          setLoading(false);
        }
      } catch (error) {
        console.error('Error checking client status:', error);
        setError('Error de conexión con el backend. Verifica que el servidor esté ejecutándose.');
        setLoading(false);
      }
    };

    // Verificar el estado del cliente cada 5 segundos
    const interval = setInterval(checkClientStatus, 5000);
    checkClientStatus(); // Verificar inmediatamente

    return () => clearInterval(interval);
  }, []);

  const handleNavigation = (page) => {
    setCurrentPage(page);
    setIsSidebarOpen(false); // Cerrar el sidebar al navegar
  };

  const handleSessionChange = (ready) => {
    console.log('Cambio de estado de sesión:', ready);
    setIsClientReady(ready);
    if (ready) {
      setCurrentPage('home');
    } else {
      setCurrentPage('session');
      setQrCode(''); // Limpiar QR code cuando se cierra sesión
    }
  };

  const handleQRCodeUpdate = (qr) => {
    setQrCode(qr);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  if (loading) {
    return (
      <div className="dashboard">
        <div className="loading">Cargando...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard">
        <div className="error">{error}</div>
      </div>
    );
  }

  // No mostrar el botón de menú en la página de sesión
  const hideMenuButton = currentPage === 'session';

  return (
    <div className="dashboard">
      {!hideMenuButton && (
        <button 
          className={`menu-toggle ${isSidebarOpen ? 'hidden' : ''}`} 
          onClick={toggleSidebar}
        >
          ☰
        </button>
      )}
      <Sidebar 
        currentPage={currentPage} 
        onNavigate={handleNavigation} 
        isClientReady={isClientReady}
        isOpen={isSidebarOpen}
        onClose={closeSidebar}
      />
      <div className="dashboard-content">
        {currentPage === 'home' && <Home />}
        {currentPage === 'contacts' && <Contacts />}
        {currentPage === 'session' && (
          <Session 
            onSessionChange={handleSessionChange} 
            onQRCodeUpdate={handleQRCodeUpdate}
            qrCode={qrCode}
            isClientReady={isClientReady}
          />
        )}
      </div>
    </div>
  );
};

export default Dashboard;