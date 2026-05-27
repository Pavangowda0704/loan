function DocumentUploadCard({ title, file, onChange }) {
  return (
    <div className="document-card">
      <div>
        <h4>{title}</h4>
        <p>PDF, JPG or PNG</p>
        {file && <span className="uploaded-file">Uploaded: {file.name}</span>}
      </div>

      <label className={file ? "upload-btn uploaded" : "upload-btn"}>
        {file ? "Uploaded" : "Upload"}
        <input
          type="file"
          accept=".pdf,.jpg,.jpeg,.png"
          onChange={(e) => onChange(e.target.files[0])}
          hidden
        />
      </label>
    </div>
  );
}

export default DocumentUploadCard;