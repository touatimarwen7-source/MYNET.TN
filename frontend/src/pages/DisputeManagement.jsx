import { useState, useEffect } from 'react';
import { setPageTitle } from '../utils/pageTitle';
import { formatDate } from '../utils/dateFormatter';
import '../styles/corporate-design.css';

export default function DisputeManagement() {
  const [disputes, setDisputes] = useState([
    { id: 1, reference: 'DSP-2025-001', subject: 'Qualité non conforme', tender: 'Appel A', party: 'Fournisseur A', status: 'open', created_date: new Date(Date.now() - 5*24*60*60*1000), resolution_date: null },
    { id: 2, reference: 'DSP-2025-002', subject: 'Livraison retardée', tender: 'Appel B', party: 'Fournisseur B', status: 'resolved', created_date: new Date(Date.now() - 10*24*60*60*1000), resolution_date: new Date(Date.now() - 2*24*60*60*1000) }
  ]);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    setPageTitle('Gestion des Litiges');
  }, []);

  const handleResolveDispute = (id) => {
    setDisputes(disputes.map(d => d.id === id ? {...d, status: 'resolved', resolution_date: new Date()} : d));
  };

  return (
    <div className="page dispute-management-page">
      <div className="page-header corporate">
        <h1>⚖️ Gestion des Litiges</h1>
        <p className="subtitle">Résolution des conflits et réclamations</p>
        <button onClick={() => setShowForm(!showForm)} className="btn btn-primary-corporate">➕ Nouveau Litige</button>
      </div>

      {showForm && (
        <div className="form-section corporate">
          <h3>Déclarer un Litige</h3>
          <div className="form-grid">
            <input type="text" placeholder="Sujet du litige" className="input-corporate" />
            <select className="select-corporate">
              <option>Sélectionner une partie</option>
              <option>Fournisseur</option>
              <option>Acheteur</option>
            </select>
            <textarea placeholder="Description du litige..." className="textarea-corporate"></textarea>
          </div>
          <div className="form-actions">
            <button className="btn btn-primary-corporate">Soumettre</button>
            <button onClick={() => setShowForm(false)} className="btn btn-secondary-corporate">Annuler</button>
          </div>
        </div>
      )}

      <div className="disputes-table-section">
        <table className="table-corporate">
          <thead>
            <tr>
              <th>Référence</th>
              <th>Sujet</th>
              <th>Appel d'Offres</th>
              <th>Partie</th>
              <th>Statut</th>
              <th>Date Ouverture</th>
              <th>Date Résolution</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {disputes.map(dispute => (
              <tr key={dispute.id}>
                <td><strong>{dispute.reference}</strong></td>
                <td>{dispute.subject}</td>
                <td>{dispute.tender}</td>
                <td>{dispute.party}</td>
                <td><span className={`badge-${dispute.status}`}>{dispute.status === 'open' ? '⏳ Ouvert' : '✓ Résolu'}</span></td>
                <td>{formatDate(dispute.created_date)}</td>
                <td>{dispute.resolution_date ? formatDate(dispute.resolution_date) : 'N/A'}</td>
                <td>
                  {dispute.status === 'open' && <button onClick={() => handleResolveDispute(dispute.id)} className="btn btn-small btn-primary-corporate">✓ Résoudre</button>}
                  <button className="btn btn-small btn-secondary-corporate">Détails</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
