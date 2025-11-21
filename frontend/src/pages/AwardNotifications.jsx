import { useState, useEffect } from 'react';
import { setPageTitle } from '../utils/pageTitle';
import { formatDate } from '../utils/dateFormatter';
import '../styles/corporate-design.css';

export default function AwardNotifications() {
  const [awards, setAwards] = useState([
    { id: 1, tender_title: 'Appel A', supplier: 'Fournisseur A', amount: 40000, status: 'awarded', notified: true, notified_date: new Date() },
    { id: 2, tender_title: 'Appel B', supplier: 'Fournisseur B', amount: 52000, status: 'awarded', notified: true, notified_date: new Date(Date.now() - 2*24*60*60*1000) }
  ]);
  const [showNotifyForm, setShowNotifyForm] = useState(false);

  useEffect(() => {
    setPageTitle('Notifications d\'Attribution');
  }, []);

  const handleSendNotification = (id) => {
    setAwards(awards.map(a => a.id === id ? {...a, notified: true, notified_date: new Date()} : a));
    alert('Notification envoyée au fournisseur');
  };

  return (
    <div className="page award-notifications-page">
      <div className="page-header corporate">
        <h1>🏆 Notifications d'Attribution</h1>
        <p className="subtitle">Informez les fournisseurs des résultats</p>
      </div>

      <div className="awards-table-section">
        <table className="table-corporate">
          <thead>
            <tr>
              <th>Appel d'Offres</th>
              <th>Fournisseur Lauréat</th>
              <th>Montant</th>
              <th>Statut</th>
              <th>Notifié</th>
              <th>Date Notification</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {awards.map(award => (
              <tr key={award.id}>
                <td><strong>{award.tender_title}</strong></td>
                <td>{award.supplier}</td>
                <td>{award.amount.toLocaleString()} TND</td>
                <td><span className="badge-success">✓ Attribué</span></td>
                <td>{award.notified ? <span className="badge-success">✓ Oui</span> : <span className="badge-warning">✗ Non</span>}</td>
                <td>{award.notified_date ? formatDate(award.notified_date) : 'N/A'}</td>
                <td>
                  {!award.notified && <button onClick={() => handleSendNotification(award.id)} className="btn btn-small btn-primary-corporate">📧 Notifier</button>}
                  <button className="btn btn-small btn-secondary-corporate">📄 Lettre</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
