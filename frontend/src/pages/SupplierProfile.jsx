import { useState, useEffect } from 'react';
import axios from 'axios';
import { setPageTitle } from '../utils/pageTitle';
import '../styles/profile-modern.css';

export default function SupplierProfile() {
  const [profile, setProfile] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showPublicProfile, setShowPublicProfile] = useState(false);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editData, setEditData] = useState({});
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    setPageTitle('Profil du Fournisseur');
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/supplier/profile', {
        headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
      });
      setProfile(response.data.profile);
      setEditData(response.data.profile);
      setDocuments(response.data.documents || []);
      setCategories(response.data.categories || []);
    } catch (error) {
      setError('Erreur lors du chargement du profil');
    } finally {
      setLoading(false);
    }
  };

  const handleDocumentUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', 'ISO');

    try {
      await axios.post('http://localhost:3000/api/supplier/documents', formData, {
        headers: { 
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      setSuccess('Document uploadé avec succès ✓');
      setTimeout(() => setSuccess(''), 3000);
      fetchProfile();
    } catch (error) {
      setError('Erreur: ' + error.response?.data?.error);
    }
  };

  const handleDeleteDocument = async (docId) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce document?')) return;
    try {
      await axios.delete(`http://localhost:3000/api/supplier/documents/${docId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
      });
      setSuccess('Document supprimé ✓');
      setTimeout(() => setSuccess(''), 3000);
      fetchProfile();
    } catch (error) {
      setError('Erreur: ' + error.response?.data?.error);
    }
  };

  const handleSaveProfile = async () => {
    try {
      await axios.put('http://localhost:3000/api/supplier/profile', editData, {
        headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
      });
      setProfile(editData);
      setEditing(false);
      setSuccess('Profil mis à jour avec succès ✓');
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      setError('Erreur: ' + error.response?.data?.error);
    }
  };

  if (loading) {
    return (
      <div className="page-container">
        <div className="loading-skeleton" style={{ height: '400px', borderRadius: '12px' }}></div>
      </div>
    );
  }

  return (
    <div className="page-container">
      {/* Page Header */}
      <div className="page-header animate-slide-down">
        <h1 className="page-title">🏢 Profil du Fournisseur</h1>
        <p className="page-subtitle">Gérez votre profil professionnel et vos documents</p>
      </div>

      {/* Alerts */}
      {error && (
        <div className="alert alert-danger animate-slide-up">
          <span>❌</span>
          <div>{error}</div>
        </div>
      )}
      {success && (
        <div className="alert alert-success animate-slide-up">
          <span>✓</span>
          <div>{success}</div>
        </div>
      )}

      {profile && (
        <div className="supplier-profile-layout">
          {/* Company Information Card */}
          <div className="profile-card animate-scale-in">
            <div className="profile-card-header">
              <div className="profile-avatar">🏢</div>
              <div className="profile-header-info">
                <h2 className="profile-name">{profile.company_name}</h2>
                <p className="profile-role">Fournisseur Professionnel</p>
              </div>
              {!editing && (
                <button 
                  className="btn btn-primary hover-lift"
                  onClick={() => setEditing(true)}
                  style={{ marginLeft: 'auto' }}
                >
                  ✏️ Modifier
                </button>
              )}
            </div>

            {editing ? (
              /* Edit Mode */
              <div className="profile-edit-form">
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Nom de l'Entreprise</label>
                    <input 
                      type="text" 
                      value={editData.company_name || ''} 
                      onChange={(e) => setEditData({...editData, company_name: e.target.value})}
                      className="form-input"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Numéro Commercial</label>
                    <input 
                      type="text" 
                      value={editData.commercial_number || ''} 
                      onChange={(e) => setEditData({...editData, commercial_number: e.target.value})}
                      className="form-input"
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Siège Social</label>
                    <input 
                      type="text" 
                      value={editData.location || ''} 
                      onChange={(e) => setEditData({...editData, location: e.target.value})}
                      className="form-input"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Téléphone</label>
                    <input 
                      type="tel" 
                      value={editData.phone || ''} 
                      onChange={(e) => setEditData({...editData, phone: e.target.value})}
                      className="form-input"
                    />
                  </div>
                </div>

                <div className="form-actions">
                  <button className="btn btn-secondary" onClick={() => setEditing(false)}>
                    ✕ Annuler
                  </button>
                  <button className="btn btn-primary" onClick={handleSaveProfile}>
                    💾 Sauvegarder
                  </button>
                </div>
              </div>
            ) : (
              /* View Mode */
              <div className="profile-info-grid">
                <div className="info-group">
                  <div className="info-item">
                    <label className="info-label">📍 Siège Social</label>
                    <p className="info-value">{profile.location || '—'}</p>
                  </div>
                  <div className="info-item">
                    <label className="info-label">📱 Téléphone</label>
                    <p className="info-value">{profile.phone || '—'}</p>
                  </div>
                  <div className="info-item">
                    <label className="info-label">🔢 Numéro Commercial</label>
                    <p className="info-value">{profile.commercial_number || '—'}</p>
                  </div>
                </div>

                <div className="info-group">
                  <div className="info-item">
                    <label className="info-label">⭐ Note Moyenne</label>
                    <p className="info-value">
                      <span className="rating-stars">{'⭐'.repeat(Math.round(profile.average_rating || 0))}</span>
                      {profile.average_rating || 0}/5
                    </p>
                  </div>
                  <div className="info-item">
                    <label className="info-label">📊 Soumissions</label>
                    <p className="info-value">{profile.submission_count || 0}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Expertise Areas */}
          <div className="profile-section animate-slide-up">
            <h3 className="section-title">🎯 Domaines d'Expertise</h3>
            <div className="categories-tags">
              {categories.length === 0 ? (
                <div className="empty-state">
                  <p>Aucun domaine défini</p>
                </div>
              ) : (
                categories.map((cat, idx) => (
                  <span key={idx} className="badge badge-primary">{cat}</span>
                ))
              )}
            </div>
          </div>

          {/* Documents and Certificates */}
          <div className="profile-section animate-slide-up">
            <h3 className="section-title">📄 Documents et Certificats</h3>
            
            <div className="document-upload-area">
              <label className="upload-label">
                <input 
                  type="file" 
                  onChange={handleDocumentUpload}
                  accept=".pdf,.jpg,.jpeg,.png"
                  className="upload-input"
                />
                <span className="upload-button">📤 Télécharger un Document</span>
              </label>
              <p className="upload-help">PDF, JPG ou PNG • Maximum 10 MB</p>
            </div>

            {documents.length === 0 ? (
              <div className="empty-state">
                <p>Aucun document uploadé</p>
              </div>
            ) : (
              <div className="documents-table-wrapper">
                <table className="documents-table">
                  <thead>
                    <tr>
                      <th>Type</th>
                      <th>Date d'Upload</th>
                      <th>Expiration</th>
                      <th>Statut</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {documents.map((doc, idx) => {
                      const daysLeft = doc.days_left || 0;
                      const isExpiringSoon = daysLeft < 30;
                      
                      return (
                        <tr key={idx} className={isExpiringSoon ? 'warning-row' : ''}>
                          <td><strong>{doc.type}</strong></td>
                          <td>{new Date(doc.uploaded_at).toLocaleDateString('fr-FR')}</td>
                          <td>{new Date(doc.expiry_date).toLocaleDateString('fr-FR')}</td>
                          <td>
                            {isExpiringSoon ? (
                              <span className="badge badge-warning">⚠️ {daysLeft} jours</span>
                            ) : (
                              <span className="badge badge-success">✓ Valide</span>
                            )}
                          </td>
                          <td>
                            <button 
                              className="btn btn-sm btn-outline"
                              onClick={() => handleDeleteDocument(doc.id)}
                              title="Supprimer"
                            >
                              🗑️
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Public Profile Preview */}
          <div className="profile-section animate-slide-up">
            <h3 className="section-title">🌐 Profil Public</h3>
            <button 
              className="btn btn-outline"
              onClick={() => setShowPublicProfile(!showPublicProfile)}
            >
              {showPublicProfile ? '🔒 Masquer le Profil' : '👁️ Afficher Profil Public'}
            </button>

            {showPublicProfile && (
              <div className="public-profile-preview">
                <div className="preview-header">
                  <h4>{profile.company_name}</h4>
                  <p className="preview-location">📍 {profile.location}</p>
                </div>
                <div className="preview-content">
                  <p><strong>Domaines:</strong> {categories.join(', ') || '—'}</p>
                  <p><strong>Note:</strong> ⭐ {profile.average_rating || 0}/5</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
