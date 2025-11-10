import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';

const QRCodeDisplay = ({ qrCodeData }) => {
  const [qrCodeImage, setQrCodeImage] = useState('');

  useEffect(() => {
    if (qrCodeData) {
      QRCode.toDataURL(qrCodeData, { width: 200 })
        .then(url => {
          setQrCodeImage(url);
        })
        .catch(err => {
          console.error('Error generating QR code:', err);
        });
    }
  }, [qrCodeData]);

  return (
    <div className="qr-code-display">
      {qrCodeImage ? (
        <img src={qrCodeImage} alt="QR Code" />
      ) : (
        <p>Generando código QR...</p>
      )}
    </div>
  );
};

export default QRCodeDisplay;