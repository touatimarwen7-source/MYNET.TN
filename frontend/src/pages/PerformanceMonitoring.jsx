import { useState, useEffect } from 'react';
import { setPageTitle } from '../utils/pageTitle';
import '../styles/corporate-design.css';

export default function PerformanceMonitoring() {
  const [suppliers, setSuppliers] = useState([
    { id: 1, name: 'Fournisseur A', rating: 4.8, tenders_count: 15, on_time: 95, quality: 98, compliance: 100 },
    { id: 2, name: 'Fournisseur B', rating: 4.2, tenders_count: 8, on_time: 85, quality: 92, compliance: 95 },
    { id: 3, name: 'Fournisseur C', rating: 3.9, tenders_count: 5, on_time: 75, quality: 85, compliance: 88 }
  ]);

  useEffect(() => {
    setPageTitle('Suivi de Performance');
  }, []);

  const getRatingColor = (rating) => {
    if (rating >= 4.5) return '#16a34a';
    if (rating >= 3.5) return '#f59e0b';
    return '#ef4444';
  };

  return (
    <div className="page performance-monitoring-page">
      <div className="page-header corporate">
        <h1>⭐ Suivi de Performance</h1>
        <p className="subtitle">Évaluez la performance des fournisseurs</p>
      </div>

      <div className="performance-table-section">
        <table className="table-corporate">
          <thead>
            <tr>
              <th>Fournisseur</th>
              <th>Rating Global</th>
              <th>Marchés Gagnés</th>
              <th>% Ponctualité</th>
              <th>Qualité %</th>
              <th>Conformité %</th>
              <th>Statut</th>
            </tr>
          </thead>
          <tbody>
            {suppliers.map(supplier => (
              <tr key={supplier.id}>
                <td><strong>{supplier.name}</strong></td>
                <td>
                  <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
                    <span style={{fontSize: '1.2rem', color: getRatingColor(supplier.rating)}}>★★★★★</span>
                    <strong>{supplier.rating.toFixed(1)}/5</strong>
                  </div>
                </td>
                <td>{supplier.tenders_count}</td>
                <td>
                  <div className="progress-bar" style={{width: '100px'}}>
                    <div className="progress" style={{width: `${supplier.on_time}%`, background: getRatingColor(supplier.on_time / 100 * 5)}}></div>
                    <span>{supplier.on_time}%</span>
                  </div>
                </td>
                <td>
                  <div className="progress-bar" style={{width: '100px'}}>
                    <div className="progress" style={{width: `${supplier.quality}%`, background: getRatingColor(supplier.quality / 100 * 5)}}></div>
                    <span>{supplier.quality}%</span>
                  </div>
                </td>
                <td>
                  <div className="progress-bar" style={{width: '100px'}}>
                    <div className="progress" style={{width: `${supplier.compliance}%`, background: getRatingColor(supplier.compliance / 100 * 5)}}></div>
                    <span>{supplier.compliance}%</span>
                  </div>
                </td>
                <td><span className="badge-success">✓ Actif</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
