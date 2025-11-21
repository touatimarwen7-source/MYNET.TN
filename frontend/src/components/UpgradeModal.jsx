import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getNextTierInfo, UPGRADE_VALUES, SERVICE_DESCRIPTIONS } from '../utils/subscriptionTiers';
import '../styles/upgradeModal.css';

export default function UpgradeModal({ isOpen, onClose, currentTier, featureKey }) {
  const navigate = useNavigate();
  const [isAnimating, setIsAnimating] = useState(true);

  if (!isOpen) return null;

  const nextTierInfo = getNextTierInfo(currentTier?.id);
  const featureInfo = SERVICE_DESCRIPTIONS[featureKey] || {};
  const upgradeValue = UPGRADE_VALUES[currentTier?.id] || {};

  const handleClose = () => {
    setIsAnimating(false);
    setTimeout(onClose, 300);
  };

  const handleUpgrade = () => {
    handleClose();
    navigate('/subscription-tiers');
  };

  return (
    <div className={`upgrade-modal-overlay ${isAnimating ? 'show' : ''}`} onClick={handleClose}>
      <div className="upgrade-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="upgrade-modal-header">
          <button className="close-btn" onClick={handleClose}>✕</button>
          <h2>Débloquez cette fonctionnalité</h2>
        </div>

        {/* Body */}
        <div className="upgrade-modal-body">
          {/* Feature Icon and Name */}
          <div className="feature-highlight">
            <div className="feature-icon-large">{featureInfo.icon}</div>
            <h3>{featureInfo.label}</h3>
            <p className="feature-description">{featureInfo.description}</p>
          </div>

          {/* Current Status */}
          <div className="status-section">
            <div className="status-item">
              <span className="status-label">Plan actuel:</span>
              <span className="status-value">{currentTier?.name}</span>
            </div>
            {nextTierInfo && (
              <div className="status-item">
                <span className="status-label">Plan requis:</span>
                <span className="status-value upgrade-badge">{nextTierInfo.name}</span>
              </div>
            )}
          </div>

          {/* Benefits */}
          {nextTierInfo && (
            <div className="benefits-section">
              <h4>Avantages supplémentaires avec {nextTierInfo.name}:</h4>
              <ul className="benefits-list">
                <li>
                  <span className="benefit-icon">✓</span>
                  <span>{upgradeValue.benefit1}</span>
                </li>
                <li>
                  <span className="benefit-icon">✓</span>
                  <span>{upgradeValue.benefit2}</span>
                </li>
                <li>
                  <span className="benefit-icon">✓</span>
                  <span>{upgradeValue.benefit3}</span>
                </li>
              </ul>
            </div>
          )}

          {/* Pricing Info */}
          {nextTierInfo && (
            <div className="pricing-section">
              <div className="price-info">
                <span className="price-label">À partir de</span>
                <span className="price-value">{nextTierInfo.price} TND</span>
                <span className="price-period">/mois</span>
              </div>
            </div>
          )}

          {/* Message if at max tier */}
          {!nextTierInfo && (
            <div className="max-tier-message">
              <p>✓ Vous avez accès à toutes les fonctionnalités</p>
              <p className="subtitle">Merci de votre confiance!</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="upgrade-modal-footer">
          <button className="btn-secondary" onClick={handleClose}>
            Annuler
          </button>
          {nextTierInfo && (
            <button className="btn-primary-upgrade" onClick={handleUpgrade}>
              Voir les Forfaits
            </button>
          )}
        </div>

        {/* Decorative Elements */}
        <div className="modal-decoration"></div>
      </div>
    </div>
  );
}
