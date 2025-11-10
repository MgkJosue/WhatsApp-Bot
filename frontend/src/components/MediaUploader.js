import React, { useState } from 'react';

const MediaUploader = ({ onFileSelect }) => {
  const [fileName, setFileName] = useState('');

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFileName(file.name);
      onFileSelect(file);
    }
  };

  return (
    <div className="media-uploader">
      <h2>Archivo Multimedia</h2>
      <input 
        type="file" 
        accept="image/*,video/*" 
        onChange={handleFileChange}
        id="media-file"
        style={{ display: 'none' }}
      />
      <label htmlFor="media-file" className="file-label">
        {fileName || "Seleccionar imagen o video"}
      </label>
    </div>
  );
};

export default MediaUploader;