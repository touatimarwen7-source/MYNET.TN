import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { procurementAPI } from '../api';
import EnhancedTable from '../components/EnhancedTable';

export default function TenderList() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [tenders, setTenders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    fetchTenders();
  }, [i18n.language]);

  const fetchTenders = async () => {
    try {
      setLoading(true);
      const response = await procurementAPI.getTenders();
      setTenders(response.data.tenders || []);
    } catch (err) {
      console.error('Error fetching tenders:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleParticipate = (tenderId) => {
    navigate(`/create-offer/${tenderId}`);
  };

  if (loading) return <div className="loading">{t('messages.loadingTenders')}</div>;

  return (
    <div className="page tender-list-page">
      <h1>{t('tender.list')}</h1>
      
      <div className="filter-section">
        <input
          type="text"
          placeholder={t('tender.title')}
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="input-filter"
        />
      </div>

      {tenders.length === 0 ? (
        <div className="alert alert-info">{t('messages.noTenders')}</div>
      ) : (
        <EnhancedTable
          data={tenders}
          columns={[
            { key: 'title', label: t('tender.title') },
            { key: 'category', label: t('tender.category') },
            { key: 'deadline', label: t('tender.deadline') },
            { key: 'status', label: t('tender.status') },
            { key: 'budget', label: t('tender.budget') }
          ]}
          onRowClick={(tender) => navigate(`/tenders/${tender.id}`)}
          actions={[
            {
              label: t('tender.participate'),
              onClick: (tender) => handleParticipate(tender.id),
              className: 'btn-primary'
            }
          ]}
        />
      )}
    </div>
  );
}
