import { useState, useEffect } from 'react';
import { setPageTitle } from '../utils/pageTitle';
import { formatDate } from '../utils/dateFormatter';
import '../styles/corporate-design.css';

export default function DeliveryManagement() {
  const [deliveries, setDeliveries] = useState([
    { id: 1, po_number: 'PO-2025-001', supplier: 'Fournisseur A', items: 100, status: 'pending', expected_date: new Date(Date.now() + 5*24*60*60*1000), received_date: null },
    { id: 2, po_number: 'PO-2025-002', supplier: 'Fournisseur B', items: 50, status: 'delivered', expected_date: new Date(Date.now() - 2*24*60*60*1000), received_date: new Date(Date.now() - 1*24*60*60*1000) },
    { id: 3, po_number: 'PO-2025-003', supplier: 'Fournisseur C', items: 200, status: 'delayed', expected_date: new Date(Date.now() - 5*24*60*60*1000), received_date: null }
  ]);

  useEffect(() => {
    setPageTitle('Suivi des Livraisons');
  }, []);

  const handleReceiveDelivery = (id) => {
    setDeliveries(deliveries.map(d => d.id === id ? {...d, status: 'delivered', received_date: new Date()} : d));
  };

  const getStatusBadge = (status) => {
    const badges = {
      'pending': '⏳ En attente',
      'delivered': '✓ Livrée',
      'delayed': '⚠️ Retardée',
      'cancelled': '✗ Annulée'
    };
    return badges[status] || status;
  };

  return (
    <div className="page delivery-management-page">
      <div className="page-header corporate">
        <h1>📦 Suivi des Livraisons</h1>
        <p className="subtitle">Gestion des réceptions et livraisons</p>
      </div>

      <div className="deliveries-table-section">
        <table className="table-corporate">
          <thead>
            <tr>
              <th>Commande</th>
              <th>Fournisseur</th>
              <th>Articles</th>
              <th>Statut</th>
              <th>Date Attendue</th>
              <th>Date Reçue</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {deliveries.map(delivery => (
              <tr key={delivery.id} className={`status-${delivery.status}`}>
                <td><strong>{delivery.po_number}</strong></td>
                <td>{delivery.supplier}</td>
                <td>{delivery.items}</td>
                <td><span className={`badge-${delivery.status}`}>{getStatusBadge(delivery.status)}</span></td>
                <td>{formatDate(delivery.expected_date)}</td>
                <td>{delivery.received_date ? formatDate(delivery.received_date) : 'N/A'}</td>
                <td>
                  {delivery.status === 'pending' && <button onClick={() => handleReceiveDelivery(delivery.id)} className="btn btn-small btn-primary-corporate">✓ Confirmer</button>}
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
