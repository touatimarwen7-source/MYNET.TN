import '../styles/importantDocuments.css';

export default function ImportantDocuments({ documents, title = 'Documents Importants' }) {
  if (!documents || documents.length === 0) {
    return (
      <div className="important-documents-section">
        <h3>{title}</h3>
        <div className="empty-state">
          <p>✓ Aucun document en attente</p>
        </div>
      </div>
    );
  }

  return (
    <div className="important-documents-section">
      <h3>{title}</h3>
      <div className="documents-list">
        {documents.map((doc, idx) => (
          <div key={idx} className={`document-item priority-${doc.priority || 'normal'}`}>
            <div className="document-header">
              <div className="document-info">
                <span className="document-icon">{doc.icon}</span>
                <div className="document-title-section">
                  <h4>{doc.title}</h4>
                  <p className="document-meta">{doc.meta}</p>
                </div>
              </div>
              <span className={`document-priority-badge priority-${doc.priority || 'normal'}`}>
                {doc.priority === 'high' ? '🔴 Urgent' :
                 doc.priority === 'medium' ? '🟡 Important' :
                 '🟢 Normal'}
              </span>
            </div>
            
            {doc.details && (
              <p className="document-details">{doc.details}</p>
            )}
            
            {doc.action && (
              <a href={doc.action.path} className="document-action-btn">
                {doc.action.label} →
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
