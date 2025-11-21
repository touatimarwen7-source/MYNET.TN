import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../api';
import { setPageTitle } from '../utils/pageTitle';

export default function Register() {
  useEffect(() => {
    setPageTitle('Inscription');
  }, []);

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    full_name: '',
    phone: '',
    role: 'supplier',
    company_name: '',
    company_registration: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await authAPI.register(formData);
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.error || 'Erreur lors de l\'inscription');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page register-page">
      <div className="form-container">
        <h1>Créer un Compte</h1>
        <p className="subtitle">Rejoignez MyNet.tn et commencez à participer aux appels d'offres</p>
        {error && <div className="alert alert-error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Nom d'utilisateur *</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Entrez votre nom d'utilisateur"
              required
            />
          </div>
          <div className="form-group">
            <label>E-mail *</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Entrez votre adresse e-mail"
              required
            />
          </div>
          <div className="form-group">
            <label>Mot de passe *</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Entrez un mot de passe sécurisé"
              required
            />
          </div>
          <div className="form-group">
            <label>Nom complet</label>
            <input
              type="text"
              name="full_name"
              value={formData.full_name}
              onChange={handleChange}
              placeholder="Entrez votre nom complet"
            />
          </div>
          <div className="form-group">
            <label>Numéro de téléphone</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Entrez votre numéro de téléphone"
            />
          </div>
          <div className="form-group">
            <label>Rôle *</label>
            <select name="role" value={formData.role} onChange={handleChange} required>
              <option value="supplier">Fournisseur</option>
              <option value="buyer">Acheteur</option>
            </select>
          </div>
          <div className="form-group">
            <label>Nom de l'entreprise</label>
            <input
              type="text"
              name="company_name"
              value={formData.company_name}
              onChange={handleChange}
              placeholder="Entrez le nom de votre entreprise"
            />
          </div>
          <div className="form-group">
            <label>Numéro d'enregistrement de l'entreprise</label>
            <input
              type="text"
              name="company_registration"
              value={formData.company_registration}
              onChange={handleChange}
              placeholder="Entrez le numéro d'enregistrement"
            />
          </div>
          <button className="btn btn-primary" disabled={loading}>
            {loading ? 'Création en cours...' : 'Créer mon Compte'}
          </button>
        </form>
        <p className="login-link">
          Vous avez déjà un compte? <a href="/login">Se connecter</a>
        </p>
      </div>
    </div>
  );
}
