import { useState, useEffect } from 'react';
import { authAPI } from '../api';
import { setPageTitle } from '../utils/pageTitle';
import '../styles/profile-modern.css';

export default function Profile({ user }) {
  useEffect(() => {
    setPageTitle('Mon Profil');
  }, []);

  const [profile, setProfile] = useState(null);
  const [formData, setFormData] = useState({});
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const response = await authAPI.getProfile();
      setProfile(response.data.user);
      setFormData(response.data.user);
    } catch (err) {
      setError(err.response?.data?.error || 'Erreur lors du chargement du profil');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const response = await authAPI.updateProfile(formData);
      setProfile(response.data.user);
      setEditing(false);
      setSuccess('Profil mis à jour avec succès ✓');
    } catch (err) {
      setError(err.response?.data?.error || 'Erreur lors de la mise à jour du profil');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="page-container">
        <div className="loading-skeleton" style={{ height: '400px', borderRadius: '12px' }}></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="page-container">
        <div className="alert alert-danger">Profil non trouvé</div>
      </div>
    );
  }

  return (
    <div className="page-container">
      {/* Page Header */}
      <div className="page-header animate-slide-down">
        <h1 className="page-title">Mon Profil</h1>
        <p className="page-subtitle">Gérez vos informations personnelles et professionnelles</p>
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

      <div className="profile-layout">
        {!editing ? (
          <>
            {/* Profile Card - Main Info */}
            <div className="profile-card animate-scale-in">
              <div className="profile-card-header">
                <div className="profile-avatar">
                  {profile.full_name ? profile.full_name.charAt(0).toUpperCase() : 'U'}
                </div>
                <div className="profile-header-info">
                  <h2 className="profile-name">{profile.full_name || profile.username}</h2>
                  <p className="profile-role">{profile.role === 'buyer' ? '👤 Acheteur' : profile.role === 'supplier' ? '🏢 Fournisseur' : '⚙️ Administrateur'}</p>
                </div>
              </div>

              <div className="profile-info-grid">
                {/* Personal Information */}
                <div className="info-group">
                  <div className="info-item">
                    <label className="info-label">📧 Adresse Email</label>
                    <p className="info-value">{profile.email}</p>
                  </div>
                  <div className="info-item">
                    <label className="info-label">👤 Nom d'utilisateur</label>
                    <p className="info-value">{profile.username}</p>
                  </div>
                  <div className="info-item">
                    <label className="info-label">📱 Téléphone</label>
                    <p className="info-value">{profile.phone || '—'}</p>
                  </div>
                </div>

                {/* Company Information */}
                <div className="info-group">
                  <div className="info-item">
                    <label className="info-label">🏢 Entreprise</label>
                    <p className="info-value">{profile.company_name || '—'}</p>
                  </div>
                  <div className="info-item">
                    <label className="info-label">📜 Enregistrement</label>
                    <p className="info-value">{profile.company_registration || '—'}</p>
                  </div>
                  <div className="info-item">
                    <label className="info-label">✓ Vérification</label>
                    <div className="info-value">
                      {profile.is_verified ? (
                        <span className="badge badge-success">✓ Vérifié</span>
                      ) : (
                        <span className="badge badge-warning">⏳ En attente</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Account Information */}
                <div className="info-group">
                  <div className="info-item">
                    <label className="info-label">📅 Créé le</label>
                    <p className="info-value">{new Date(profile.created_at).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                  </div>
                  <div className="info-item">
                    <label className="info-label">🔄 Mis à jour</label>
                    <p className="info-value">{new Date(profile.updated_at || profile.created_at).toLocaleDateString('fr-FR')}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Edit Button */}
            <div className="profile-actions">
              <button 
                className="btn btn-primary btn-lg hover-lift"
                onClick={() => setEditing(true)}
              >
                ✏️ Modifier le Profil
              </button>
            </div>
          </>
        ) : (
          /* Edit Form */
          <div className="profile-edit-form animate-scale-in">
            <h2 className="form-title">Modifier votre Profil</h2>
            
            <form onSubmit={handleSubmit} className="form-container">
              {/* Personal Information Section */}
              <div className="form-section">
                <h3 className="form-section-title">👤 Informations Personnelles</h3>
                
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Nom Complet</label>
                    <input
                      type="text"
                      name="full_name"
                      value={formData.full_name || ''}
                      onChange={handleChange}
                      className="form-input"
                      placeholder="Votre nom complet"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Téléphone</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone || ''}
                      onChange={handleChange}
                      className="form-input"
                      placeholder="+216 XX XXX XXX"
                    />
                  </div>
                </div>
              </div>

              {/* Company Information Section */}
              <div className="form-section">
                <h3 className="form-section-title">🏢 Informations Professionnelles</h3>
                
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Nom de l'Entreprise</label>
                    <input
                      type="text"
                      name="company_name"
                      value={formData.company_name || ''}
                      onChange={handleChange}
                      className="form-input"
                      placeholder="Votre entreprise"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Numéro d'Enregistrement</label>
                    <input
                      type="text"
                      name="company_registration"
                      value={formData.company_registration || ''}
                      onChange={handleChange}
                      className="form-input"
                      placeholder="Numéro commercial"
                    />
                  </div>
                </div>
              </div>

              {/* Form Actions */}
              <div className="form-actions">
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={() => {
                    setEditing(false);
                    setFormData(profile);
                    setError('');
                  }}
                >
                  ✕ Annuler
                </button>
                <button 
                  type="submit" 
                  className="btn btn-primary"
                  disabled={loading}
                >
                  {loading ? '⏳ Enregistrement...' : '💾 Enregistrer les modifications'}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
