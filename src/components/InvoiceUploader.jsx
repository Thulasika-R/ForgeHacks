import { useState, useRef, useCallback } from 'react';

const ACCEPTED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

function formatFileSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function getFileExtension(name) {
  return name.split('.').pop().toUpperCase();
}

export default function InvoiceUploader({ onAnalyze, isAnalyzing }) {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const inputRef = useRef(null);

  const validateAndSetFile = useCallback((selectedFile) => {
    setError(null);

    if (!selectedFile) return;

    // Validate type
    if (!ACCEPTED_TYPES.includes(selectedFile.type)) {
      setError(`Invalid file type "${getFileExtension(selectedFile.name)}". Supported formats: JPG, JPEG, PNG, PDF.`);
      return;
    }

    // Validate size
    if (selectedFile.size > MAX_SIZE_BYTES) {
      setError(`File size (${formatFileSize(selectedFile.size)}) exceeds the 5 MB limit.`);
      return;
    }

    setFile(selectedFile);

    // Generate preview for images; skip for PDFs
    if (selectedFile.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => setPreview(e.target.result);
      reader.readAsDataURL(selectedFile);
    } else {
      setPreview(null);
    }
  }, []);

  const handleFileChange = (e) => {
    validateAndSetFile(e.target.files[0]);
    // Reset input so the same file can be re-selected after removal
    e.target.value = '';
  };

  const handleRemove = () => {
    setFile(null);
    setPreview(null);
    setError(null);
  };

  // --- Drag & Drop handlers ---
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const droppedFile = e.dataTransfer.files[0];
    validateAndSetFile(droppedFile);
  };

  const isPdf = file && file.type === 'application/pdf';

  return (
    <div className="upload-card">
      <div className="upload-card-header">
        <h2>Upload GST Invoice</h2>
        <p>Upload an invoice to analyze its transaction risk.</p>
      </div>

      <div className="upload-card-body">
        {/* Error message */}
        {error && (
          <div className="upload-error">
            <span className="upload-error-icon">!</span>
            {error}
          </div>
        )}

        {!file ? (
          /* ---- Drop Zone ---- */
          <div
            className={`upload-dropzone ${isDragOver ? 'drag-over' : ''}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => inputRef.current?.click()}
          >
            <div className="upload-dropzone-icon">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="12" x2="12" y1="18" y2="12" />
                <line x1="9" x2="15" y1="15" y2="15" />
              </svg>
            </div>
            <div className="upload-dropzone-text">
              <span className="upload-dropzone-primary">Drag & Drop Invoice</span>
              <span className="upload-dropzone-or">or</span>
              <span className="upload-dropzone-btn">Choose Invoice</span>
            </div>
            <div className="upload-dropzone-formats">
              Supported formats: JPG, JPEG, PNG, PDF &nbsp;·&nbsp; Max 5 MB
            </div>
            <input
              ref={inputRef}
              type="file"
              accept=".jpg,.jpeg,.png,.pdf"
              onChange={handleFileChange}
              className="upload-hidden-input"
            />
          </div>
        ) : (
          /* ---- Preview ---- */
          <div className="upload-preview">
            <div className="upload-preview-header">
              <h3>Invoice Preview</h3>
            </div>

            <div className="upload-preview-content">
              {isPdf ? (
                /* PDF placeholder card */
                <div className="upload-pdf-placeholder">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" />
                    <polyline points="14 2 14 8 20 8" />
                    <line x1="16" x2="8" y1="13" y2="13" />
                    <line x1="16" x2="8" y1="17" y2="17" />
                  </svg>
                  <span className="upload-pdf-label">PDF Document</span>
                </div>
              ) : (
                /* Image preview */
                <img
                  src={preview}
                  alt="Invoice preview"
                  className="upload-preview-image"
                />
              )}
            </div>

            <div className="upload-preview-meta">
              <div className="upload-file-info">
                <span className="upload-file-name">{file.name}</span>
                <span className="upload-file-details">
                  {getFileExtension(file.name)} &nbsp;·&nbsp; {formatFileSize(file.size)}
                </span>
              </div>
              <button className="btn btn-secondary btn-sm" onClick={handleRemove}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" x2="6" y1="6" y2="18" />
                  <line x1="6" x2="18" y1="6" y2="18" />
                </svg>
                Remove
              </button>
            </div>
          </div>
        )}

        {/* Analyze button */}
        {file && (
          <div className="upload-actions">
            <button
              className="btn btn-primary"
              onClick={() => onAnalyze(file)}
              disabled={isAnalyzing}
            >
              {isAnalyzing ? (
                <>
                  <span className="upload-spinner" />
                  Analyzing...
                </>
              ) : (
                <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8" />
                    <path d="m21 21-4.3-4.3" />
                  </svg>
                  Analyze Invoice
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
