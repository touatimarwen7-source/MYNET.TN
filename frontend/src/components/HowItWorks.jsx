import '../styles/howitworks.css';

export default function HowItWorks() {
  const buyerSteps = [
    {
      number: 1,
      title: 'Créer un Appel d\'Offres',
      description: 'Définissez vos besoins, fixez les critères et publiez en quelques clics',
      icon: '📝'
    },
    {
      number: 2,
      title: 'Recevoir les Offres',
      description: 'Collectez les propositions de fournisseurs qualifiés en temps réel',
      icon: '📨'
    },
    {
      number: 3,
      title: 'Évaluer et Attribuer',
      description: 'Comparez, analysez avec l\'IA et attribuez les meilleurs fournisseurs',
      icon: '✓'
    }
  ];

  const supplierSteps = [
    {
      number: 1,
      title: 'Parcourir les Opportunités',
      description: 'Découvrez les appels d\'offres correspondant à votre expertise',
      icon: '🔍'
    },
    {
      number: 2,
      title: 'Soumettre une Offre',
      description: 'Répondez avec votre proposition chiffrée sécurisée en quelques minutes',
      icon: '💼'
    },
    {
      number: 3,
      title: 'Remporter le Marché',
      description: 'Recevez le bon de commande et commencez à servir le client',
      icon: '🎯'
    }
  ];

  return (
    <div className="how-it-works">
      <div className="container">
        <h2 className="section-title">Comment Fonctionne MyNet.tn?</h2>
        <p className="section-subtitle">Trois étapes simples pour transformer vos achats</p>

        {/* Buyer Journey */}
        <div className="journey-section">
          <h3 className="journey-title">🏢 Pour les Acheteurs</h3>
          <div className="steps-grid">
            {buyerSteps.map((step, idx) => (
              <div key={idx} className="step-card">
                <div className="step-number">{step.number}</div>
                <div className="step-icon">{step.icon}</div>
                <h4>{step.title}</h4>
                <p>{step.description}</p>
                {idx < buyerSteps.length - 1 && <div className="step-arrow">→</div>}
              </div>
            ))}
          </div>
        </div>

        {/* Supplier Journey */}
        <div className="journey-section">
          <h3 className="journey-title">🏭 Pour les Fournisseurs</h3>
          <div className="steps-grid">
            {supplierSteps.map((step, idx) => (
              <div key={idx} className="step-card">
                <div className="step-number">{step.number}</div>
                <div className="step-icon">{step.icon}</div>
                <h4>{step.title}</h4>
                <p>{step.description}</p>
                {idx < supplierSteps.length - 1 && <div className="step-arrow">→</div>}
              </div>
            ))}
          </div>
        </div>

        {/* Key Benefits */}
        <div className="benefits-section">
          <div className="benefit-item">
            <span className="benefit-icon">⚡</span>
            <h4>Rapide</h4>
            <p>Processus complet en quelques jours au lieu de semaines</p>
          </div>
          <div className="benefit-item">
            <span className="benefit-icon">🔐</span>
            <h4>Sécurisé</h4>
            <p>Chiffrement AES-256 et audit complet de toutes les transactions</p>
          </div>
          <div className="benefit-item">
            <span className="benefit-icon">🤖</span>
            <h4>Intelligent</h4>
            <p>Analyse IA pour sélectionner les meilleures offres automatiquement</p>
          </div>
          <div className="benefit-item">
            <span className="benefit-icon">💰</span>
            <h4>Économique</h4>
            <p>Réduisez les coûts d\'approvisionnement de 15-25%</p>
          </div>
        </div>
      </div>
    </div>
  );
}
