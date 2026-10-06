import React, { useState } from 'react';
import { UploadCloud, FileText } from 'lucide-react';

export default function FileUpload({ onGenerate, isLoading }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [textInput, setTextInput] = useState('');

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedFile && !textInput.trim()) {
      alert('Kripya PDF file select karein ya notes paste karein.');
      return;
    }
    // Parent component ko data pass kar rahe hain
    onGenerate({ file: selectedFile, text: textInput });
  };

  return (
    <section className="card upload-card">
      <h3>1. Upload Course Notes / Syllabus</h3>
      <p className="subtitle">PDF upload karein ya direct lecture notes paste karein</p>

      <form onSubmit={handleSubmit}>
        <div className="dropzone">
          <input 
            type="file" 
            accept=".pdf,.txt" 
            id="file-input" 
            onChange={handleFileChange}
            style={{ display: 'none' }}
          />
          <label htmlFor="file-input" className="dropzone-label">
            <UploadCloud size={40} color="#3b82f6" />
            <span>{selectedFile ? selectedFile.name : 'Click karke PDF select karein'}</span>
          </label>
        </div>

        <div className="divider"><span>YA NOTES PASTE KAREIN</span></div>

        <textarea
          rows={4}
          placeholder="Yahan text notes paste karein..."
          value={textInput}
          onChange={(e) => setTextInput(e.target.value)}
          className="text-input"
        />

        <button type="submit" className="btn-primary" disabled={isLoading}>
          {isLoading ? 'Processing Material...' : 'Generate Summary & Quiz'}
        </button>
      </form>
    </section>
  );
}