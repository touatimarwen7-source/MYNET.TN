import { useState, useEffect } from 'react';
import { setPageTitle } from '../utils/pageTitle';
import { formatDate } from '../utils/dateFormatter';
import '../styles/corporate-design.css';

export default function ContractManagement() {
  const [contracts, setContracts] = useState([
    { id: 1, number: 'CTR-2025-001', supplier: 'Fournisseur A', amount: 40000, status: 'signed', start_date: new Date(), end_date: new Date(Date.now() + 90*24*60*60*1000) },
    { id: 2, number: 'CTR-2025-002', supplier: 'Fournisseur B', amount: 52000, status: 'draft', start_date: new Date(), end_date: new Date(Date.now() + 120*24*60*60*1000) }
  ]);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    setPageTitle('Gestion des Contrats');
  }, []);

  const handleGenerateContract = () => {
    alert('Contrat généré et envoyé au fournisseur');
  };

  const handleSignContract = (id) => {
    setContracts(contracts.map(c => c.id === id ? {...c, status: 'signed'} : c));
  };

  return (
    <div className="page contract-management-page">
      <div className="page-header corporate">
        <h1>📜 Gestion des Contrats</h1>
        <p className="subtitle">Suivi des contrats et obligations</p>
      </div>

      <div className="contracts-table-section">
        <table className="table-corporate">
          <thead>
            <tr>
              <th>Numéro de Contrat</th>
              <th>Fournisseur</th>
              <th>Montant</th>
              <th>Statut</th>
              <th>Date Début</th>
              <th>Date Fin</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {contracts.map(contract => (
              <tr key={contract.id}>
                <td><strong>{contract.number}</strong></td>
                <td>{contract.supplier}</td>
                <td>{contract.amount.toLocaleString()} TND</td>
                <td><span className={`badge-${contract.status}`}>{contract.status === 'signed' ? '✓ Signé' : '⏳ Brouillon'}</span></td>
                <td>{formatDate(contract.start_date)}</td>
                <td>{formatDate(contract.end_date)}</td>
                <td>
                  <button onClick={() => handleGenerateContract()} className="btn btn-small btn-secondary-corporate">📄 Voir</button>
                  {contract.status === 'draft' && <button onClick={() => handleSignContract(contract.id)} className="btn btn-small btn-primary-corporate">✓ Signer</button>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
