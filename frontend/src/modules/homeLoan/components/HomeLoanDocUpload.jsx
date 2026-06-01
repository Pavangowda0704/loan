// frontend/src/modules/homeLoan/components/HomeLoanDocUpload.jsx
import { useRef } from 'react';

const HomeLoanDocUpload = ({ doc, file, onFileChange }) => {
  const inputRef = useRef(null);

  const handleClick = () => inputRef.current?.click();

  const handleChange = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (f.size > 5 * 1024 * 1024) {
      alert('File size must be under 5MB');
      return;
    }
    onFileChange(doc.key, f);
  };

  const isUploaded = !!file;

  return (
    <div
      className={`hl-doc-upload-card ${isUploaded ? 'uploaded' : ''}`}
      onClick={handleClick}
    >
      <div className="hl-doc-upload-card__icon">
        {isUploaded ? '✅' : doc.icon || '📄'}
      </div>
      <div className="hl-doc-upload-card__info">
        <div className="hl-doc-upload-card__name">
          {doc.name}
          <span className={`hl-doc-tag hl-doc-tag--${doc.required ? 'required' : 'optional'}`}>
            {doc.required ? 'Required' : 'Optional'}
          </span>
        </div>
        <div className="hl-doc-upload-card__meta">
          {isUploaded ? (
            <span className="hl-file-name">✓ {file.name}</span>
          ) : (
            <span>Accepted: JPG, PNG, PDF · Max 5MB</span>
          )}
        </div>
      </div>
      <div className="hl-doc-upload-card__action">
        <button
          className={`hl-btn hl-btn--sm ${isUploaded ? 'hl-btn--ghost' : 'hl-btn--outline'}`}
          type="button"
          onClick={(e) => { e.stopPropagation(); handleClick(); }}
        >
          {isUploaded ? 'Change' : 'Upload'}
        </button>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept=".jpg,.jpeg,.png,.pdf"
        style={{ display: 'none' }}
        onChange={handleChange}
      />
    </div>
  );
};

export default HomeLoanDocUpload;
