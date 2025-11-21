import { useState } from 'react';
import '../styles/leadform.css';

export default function LeadGenerationForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    phone: '',
    formType: 'demo'
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      setSubmitted(true);
      setFormData({ name: '', email: '', company: '', phone: '', formType: 'demo' });
      setTimeout(() => setSubmitted(false), 5000);
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="lead-section">
      <div className="lead-container">
        <div className="lead-content">
          <h2>💌 Restez Connecté avec MyNet.tn</h2>
          <p>Recevez les dernières mises à jour, conseils exclusifs et offres spéciales directement dans votre boîte mail</p>
        </div>

        <form className="lead-form" onSubmit={handleSubmit}>
          {submitted && (
            <div className="success-alert">
              ✓ Merci! Nous vous recontacterons sous 24 heures avec plus d'informations.
            </div>
          )}

          <div className="form-tabs">
            <label className={`tab-label ${formData.formType === 'demo' ? 'active' : ''}`}>
              <input
                type="radio"
                name="formType"
                value="demo"
                checked={formData.formType === 'demo'}
                onChange={handleChange}
              />
              📺 Demander une Démo
            </label>
            <label className={`tab-label ${formData.formType === 'newsletter' ? 'active' : ''}`}>
              <input
                type="radio"
                name="formType"
                value="newsletter"
                checked={formData.formType === 'newsletter'}
                onChange={handleChange}
              />
              📧 S'abonner au Newsletter
            </label>
          </div>

          <div className="form-grid">
            <input
              type="text"
              name="name"
              placeholder="Votre Nom Complet *"
              value={formData.name}
              onChange={handleChange}
              required
              className="form-input"
            />
            <input
              type="email"
              name="email"
              placeholder="Votre Email *"
              value={formData.email}
              onChange={handleChange}
              required
              className="form-input"
            />
            <input
              type="text"
              name="company"
              placeholder="Votre Entreprise *"
              value={formData.company}
              onChange={handleChange}
              required
              className="form-input"
            />
            <input
              type="tel"
              name="phone"
              placeholder="Téléphone (optionnel)"
              value={formData.phone}
              onChange={handleChange}
              className="form-input"
            />
          </div>

          <button
            type="submit"
            className="submit-btn"
            disabled={loading}
          >
            {loading ? '⏳ Envoi en cours...' : '🚀 Envoyer ma Demande'}
          </button>

          <p className="form-disclaimer">
            Nous respectons votre confidentialité. Aucun spam. Vous pouvez vous désabonner à tout moment.
          </p>
        </form>
      </div>
    </div>
  );
}
