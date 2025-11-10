// src/services/api.js
const API_BASE_URL = '/api';

export const sendMessages = async (contacts, message, file) => {
  const formData = new FormData();
  formData.append('contacts', JSON.stringify(contacts));
  formData.append('message', message);
  if (file) {
    formData.append('file', file);
  }

  const response = await fetch(`${API_BASE_URL}/whatsapp/send-messages`, {
    method: 'POST',
    body: formData
  });

  if (!response.ok) {
    throw new Error('Error al enviar mensajes');
  }

  return response.json();
};

export const processContactsFile = async (file) => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${API_BASE_URL}/contacts/process-contacts`, {
    method: 'POST',
    body: formData
  });

  if (!response.ok) {
    throw new Error('Error al procesar archivo de contactos');
  }

  return response.json();
};

export const logoutWhatsApp = async () => {
  const response = await fetch(`${API_BASE_URL}/whatsapp/logout`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Error al cerrar sesión de WhatsApp');
  }

  return response.json();
};