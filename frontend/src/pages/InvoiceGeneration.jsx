import { useState, useEffect } from 'react';
import { setPageTitle } from '../utils/pageTitle';
import { formatDate } from '../utils/dateFormatter';
import '../styles/corporate-design.css';

export default function InvoiceGeneration() {
  const [invoices, setInvoices] = useState([
    { id: 1, number: 'INV-2025-001', po_number: 'PO-2025-001', supplier: 'Fournisseur A', amount: 40000, items_count: 100, status: 'issued', created_date: new Date(), due_date: new Date(Date.now() + 30*24*60*60*1000) },
    { id: 2, number: 'INV-2025-002', po_number: 'PO-2025-002', supplier: 'Fournisseur B', amount: 52000, items_count: 50, status: 'paid', created_date: new Date(Date.now() - 5*24*60*60*1000), due_date: new Date(Date.now() - 2*24*60*60*1000) }
  ]);

  useEffect(() => {
    setPageTitle('Génération de Factures');
  }, []);

  const handleGenerateInvoice = () => {
    alert('Facture générée et envoyée au fournisseur');
  };

  const handlePayInvoice = (id) => {
    setInvoices(invoices.map(inv => inv.id === id ? {...inv, status: 'paid'} : inv));
  };

  return (
    <div className="page invoice-generation-page">
      <div className="page-header corporate">
        <h1>📄 Génération de Factures</h1>
        <p className="subtitle">Créez et gérez les factures fournisseurs</p>
        <button onClick={handleGenerateInvoice} className="btn btn-primary-corporate">➕ Nouvelle Facture</button>
      </div>

      <div className="invoices-table-section">
        <table className="table-corporate">
          <thead>
            <tr>
              <th>Numéro Facture</th>
              <th>Commande</th>
              <th>Fournisseur</th>
              <th>Montant</th>
              <th>Articles</th>
              <th>Statut</th>
              <th>Date Création</th>
              <th>Date Échéance</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map(invoice => (
              <tr key={invoice.id}>
                <td><strong>{invoice.number}</strong></td>
                <td>{invoice.po_number}</td>
                <td>{invoice.supplier}</td>
                <td>{invoice.amount.toLocaleString()} TND</td>
                <td>{invoice.items_count}</td>
                <td><span className={`badge-${invoice.status}`}>{invoice.status === 'issued' ? '⏳ Émise' : '✓ Payée'}</span></td>
                <td>{formatDate(invoice.created_date)}</td>
                <td>{formatDate(invoice.due_date)}</td>
                <td>
                  {invoice.status === 'issued' && <button onClick={() => handlePayInvoice(invoice.id)} className="btn btn-small btn-primary-corporate">💳 Payer</button>}
                  <button className="btn btn-small btn-secondary-corporate">📥 Télécharger</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
