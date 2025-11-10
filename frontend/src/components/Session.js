import React, { useState, useEffect } from 'react';
import QRCodeDisplay from './QRCodeDisplay';
import { logoutWhatsApp } from '../services/api';
import './Session.css';

const Session = ({ onSessionChange, onQRCodeUpdate, qrCode, isClientReady: externalClientReady }) => {
  const [localQRCode, setLocalQRCode] = useState(qrCode);
  const [loading, setLoading] = useState(false);

  // Obtener el código QR cuando se carga el componente
  useEffect(() => {
    console.log('Componente Session montado');
    const fetchQRCode = async () => {
      console.log('Obteniendo código QR');
      try {
        const response = await fetch('/api/whatsapp/qr');
        if (response.ok) {
          const data = await response.json();
          console.log('Código QR recibido:', data);
          if (data.qrCode) {
            setLocalQRCode(data.qrCode);
            onQRCodeUpdate(data.qrCode);
          }
        } else {
          console.log('Error al obtener código QR, estado:', response.status);
        }
      } catch (error) {
        console.error('Error fetching QR code:', error);
      }
    };

    const checkClientStatus = async () => {
      console.log('Verificando estado del cliente');
      try {
        const response = await fetch('/api/whatsapp/status');
        if (response.ok) {
          const data = await response.json();
          console.log('Estado del cliente:', data);
          // Usar el estado del cliente externo en lugar del estado local
          onSessionChange(data.ready);
          
          // Si el cliente no está listo, seguir obteniendo el código QR
          if (!data.ready) {
            console.log('Cliente no está listo, obteniendo código QR');
            fetchQRCode();
          }
        } else {
          console.log('Error al verificar estado del cliente, estado:', response.status);
        }
      } catch (error) {
        console.error('Error checking client status:', error);
      }
    };

    // Verificar el estado del cliente cada 5 segundos
    console.log('Iniciando verificación periódica del estado del cliente');
    const interval = setInterval(checkClientStatus, 5000);
    checkClientStatus(); // Verificar inmediatamente

    return () => {
      console.log('Componente Session desmontado, limpiando intervalo');
      clearInterval(interval);
    };
  }, [onSessionChange, onQRCodeUpdate]);

  const handleLogout = async () => {
    console.log('Iniciando cierre de sesión');
    setLoading(true);
    try {
      console.log('Enviando solicitud de cierre de sesión al backend');
      const result = await logoutWhatsApp();
      console.log('Sesión cerrada correctamente en el backend:', result);
      // Notificar al padre que la sesión ha cambiado
      onSessionChange(false);
      setLocalQRCode(''); // Limpiar QR code
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    } finally {
      console.log('Finalizando cierre de sesión');
      setLoading(false);
    }
  };

  console.log('Renderizando componente Session, loading:', loading, 'externalClientReady:', externalClientReady);
  return (
    <div className="session">
      <h1>{externalClientReady ? 'Sesión Activa' : 'Iniciar Sesión'}</h1>
      <div className="session-content">
        {loading && (
          <div className="loading-overlay">
            <div className="loading-spinner"></div>
            <p>Cerrando sesión...</p>
          </div>
        )}
        
        {!externalClientReady && localQRCode && (
          <div className="section">
            <h2>Escanea el código QR</h2>
            <QRCodeDisplay qrCodeData={localQRCode} />
            <p>Escanea este código QR con WhatsApp para conectar la aplicación</p>
          </div>
        )}
        
        {externalClientReady && (
          <div className="section">
            <h2>Sesión Activa</h2>
            <p>La sesión de WhatsApp está activa y lista para enviar mensajes.</p>
            <button onClick={handleLogout} className="logout-button" disabled={loading}>
              {loading ? 'Cerrando...' : 'Cerrar Sesión'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Session;