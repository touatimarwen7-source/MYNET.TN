/**
 * 🚀 Optimized TenderDetail Component
 * Uses parallel fetching and selective data loading
 */

import React, { useState, useEffect } from 'react';
import { Box, CircularProgress } from '@mui/material';
import { useParallelFetch } from '../hooks/useOptimizedFetch';
import { procurementAPI } from '../api';

export default function TenderDetailOptimized({ tenderId }) {
  const [tender, setTender] = useState(null);
  const [offers, setOffers] = useState([]);

  // ✅ Parallel fetch instead of sequential
  const { results, loading, error } = useParallelFetch([
    {
      key: 'tender',
      url: `/api/procurement/tenders/${tenderId}`,
      params: {}
    },
    {
      key: 'offers',
      url: `/api/procurement/tenders/${tenderId}/offers`,
      params: { limit: 50 }
    }
  ]);

  useEffect(() => {
    if (results.tender) setTender(results.tender.tender);
    if (results.offers) setOffers(results.offers.offers || []);
  }, [results]);

  if (loading) return <CircularProgress />;
  if (error) return <Box sx={{ color: 'error.main' }}>{error}</Box>;

  return (
    <Box sx={{ p: 3, direction: 'rtl' }}>
      {/* Tender details */}
      {tender && (
        <Box>
          <h2>{tender.title}</h2>
          <p>{tender.description}</p>
        </Box>
      )}

      {/* Offers */}
      <Box sx={{ mt: 3 }}>
        <h3>العروض المقدمة ({offers.length})</h3>
        {offers.map(offer => (
          <Box key={offer.id} sx={{ p: 2, border: '1px solid #ddd', mb: 1 }}>
            {offer.offer_number}
          </Box>
        ))}
      </Box>
    </Box>
  );
}
