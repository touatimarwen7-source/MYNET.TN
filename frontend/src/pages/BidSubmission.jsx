import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { procurementAPI } from '../api';
import { setPageTitle } from '../utils/pageTitle';
import '../styles/corporate-design.css';

export default function BidSubmission() {
  const { tenderId } = useParams();
  const navigate = useNavigate();
  const [tender, setTender] = useState(null);
  const [bidData, setBidData] = useState({
    price: '', delivery_days: '', quality_score: '', compliance: '', documents: []
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setPageTitle('Soumission d\'Offre');
    fetchTender();
  }, [tenderId]);

  const fetchTender = async () => {
    try {
      const res = await procurementAPI.getTender(tenderId);
      setTender(res.data.tender);
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!bidData.price || !bidData.delivery_days) {
      alert('Veuillez remplir tous les champs obligatoires');
      return;
    }
    setSubmitting(true);
    try {
      await procurementAPI.createOffer({ tender_id: tenderId, ...bidData });
      alert('Offre soumise avec succès!');
      navigate('/my-offers');
    } catch (error) {
      alert('Erreur lors de la soumission: ' + error.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="loading">Chargement de l'appel d'offres...</div>;

  return (
    <div className="page bid-submission-page">
      <div className="page-header corporate">
        <h1>📝 Soumission d'Offre</h1>
        <p className="subtitle">{tender?.title}</p>
      </div>

      <div className="tender-info corporate">
        <div className="info-grid">
          <div className="info-item">
            <label>Budget Estimé</label>
            <span>{tender?.budget_max?.toLocaleString()} TND</span>
          </div>
          <div className="info-item">
            <label>Catégorie</label>
            <span>{tender?.category}</span>
          </div>
          <div className="info-item">
            <label>Date Limite</label>
            <span>{new Date(tender?.deadline).toLocaleDateString('fr-FR')}</span>
          </div>
        </div>
      </div>

      <div className="bid-form corporate">
        <h3>Votre Offre</h3>
        <div className="form-group">
          <label>Prix Proposé (TND) *</label>
          <input type="number" value={bidData.price} onChange={(e) => setBidData({...bidData, price: e.target.value})} className="input-corporate" placeholder="0" />
        </div>

        <div className="form-group">
          <label>Délai de Livraison (jours) *</label>
          <input type="number" value={bidData.delivery_days} onChange={(e) => setBidData({...bidData, delivery_days: e.target.value})} className="input-corporate" placeholder="15" />
        </div>

        <div className="form-group">
          <label>Score de Qualité (%)</label>
          <input type="number" min="0" max="100" value={bidData.quality_score} onChange={(e) => setBidData({...bidData, quality_score: e.target.value})} className="input-corporate" placeholder="90" />
        </div>

        <div className="form-group">
          <label>Conformité</label>
          <textarea value={bidData.compliance} onChange={(e) => setBidData({...bidData, compliance: e.target.value})} className="textarea-corporate" placeholder="Description de la conformité avec les spécifications..."></textarea>
        </div>

        <div className="form-actions">
          <button onClick={handleSubmit} disabled={submitting} className="btn btn-primary-corporate">
            {submitting ? 'Soumission en cours...' : '✓ Soumettre l\'Offre'}
          </button>
          <button onClick={() => navigate('/tenders')} className="btn btn-secondary-corporate">Annuler</button>
        </div>
      </div>
    </div>
  );
}
