import { useState, useEffect } from 'react';
import { setPageTitle } from '../utils/pageTitle';
import { formatDate } from '../utils/dateFormatter';
import '../styles/corporate-design.css';

export default function MonitoringSubmissions() {
  const [submissions, setSubmissions] = useState([
    { id: 1, tender_id: 'TND-001', supplier: 'Fournisseur A', status: 'submitted', submitted_date: new Date(), price: 40000, delivery: 15 },
    { id: 2, tender_id: 'TND-001', supplier: 'Fournisseur B', status: 'submitted', submitted_date: new Date(Date.now() - 1*24*60*60*1000), price: 45000, delivery: 20 },
    { id: 3, tender_id: 'TND-002', supplier: 'Fournisseur C', status: 'received', submitted_date: new Date(Date.now() - 2*24*60*60*1000), price: 52000, delivery: 10 }
  ]);

  useEffect(() => {
    setPageTitle('Suivi des Soumissions');
  }, []);

  return (
    <div className="page monitoring-submissions-page">
      <div className="page-header corporate">
        <h1>📬 Suivi des Soumissions</h1>
        <p className="subtitle">Suivez les offres reçues en temps réel</p>
      </div>

      <div className="summary-cards">
        <div className="card corporate">
          <label>Total Soumises</label>
          <span className="value">{submissions.length}</span>
        </div>
        <div className="card corporate">
          <label>En Attente</label>
          <span className="value">{submissions.filter(s => s.status === 'submitted').length}</span>
        </div>
        <div className="card corporate">
          <label>Reçues</label>
          <span className="value success">{submissions.filter(s => s.status === 'received').length}</span>
        </div>
      </div>

      <div className="submissions-table-section">
        <table className="table-corporate">
          <thead>
            <tr>
              <th>Appel d'Offres</th>
              <th>Fournisseur</th>
              <th>Statut</th>
              <th>Date Soumission</th>
              <th>Prix Proposé</th>
              <th>Délai (jours)</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {submissions.map(submission => (
              <tr key={submission.id}>
                <td><strong>{submission.tender_id}</strong></td>
                <td>{submission.supplier}</td>
                <td><span className={`badge-${submission.status}`}>{submission.status === 'submitted' ? '⏳ Soumise' : '✓ Reçue'}</span></td>
                <td>{formatDate(submission.submitted_date)}</td>
                <td>{submission.price.toLocaleString()} TND</td>
                <td>{submission.delivery}</td>
                <td>
                  <button className="btn btn-small btn-secondary-corporate">👁️ Détails</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
