import { useState } from 'react';
import '../styles/advertisement.css';

export default function DynamicAdvertisement() {
  const [advertisements] = useState([
    {
      id: 1,
      type: 'success',
      title: '🎉 Succès Client',
      message: 'Banque Tunisienne adopte MyNet.tn pour gérer 500M TND d\'achats annuels',
      cta: 'En savoir plus →'
    },
    {
      id: 2,
      type: 'webinar',
      title: '📺 Webinaire Gratuit',
      message: 'Masterclass: Optimiser vos appels d\'offres avec l\'IA - Jeudi 20h',
      cta: 'S\'inscrire gratuitement →'
    },
    {
      id: 3,
      type: 'promo',
      title: '🎁 Offre Limitée',
      message: 'Gold Plan à -30% pour les 3 premiers mois - Code: GROWTH30',
      cta: 'Profiter de l\'offre →'
    }
  ]);

  const [currentAd, setCurrentAd] = useState(0);

  const handleNext = () => {
    setCurrentAd((prev) => (prev + 1) % advertisements.length);
  };

  return (
    <div className="dynamic-advertisement">
      <div className={`ad-card ad-${advertisements[currentAd].type}`}>
        <div className="ad-content">
          <h3>{advertisements[currentAd].title}</h3>
          <p>{advertisements[currentAd].message}</p>
          <button className="ad-cta">{advertisements[currentAd].cta}</button>
        </div>
        <div className="ad-controls">
          {advertisements.map((_, idx) => (
            <button
              key={idx}
              className={`dot ${idx === currentAd ? 'active' : ''}`}
              onClick={() => setCurrentAd(idx)}
            ></button>
          ))}
          <button className="next-btn" onClick={handleNext}>→</button>
        </div>
      </div>
    </div>
  );
}
