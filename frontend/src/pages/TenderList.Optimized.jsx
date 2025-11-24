/**
 * 🚀 Optimized TenderList Component
 * Implements pagination, parallel fetching, and caching
 */

import React, { useState, useEffect } from 'react';
import { Box, CircularProgress, Pagination, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { useOptimizedFetch } from '../hooks/useOptimizedFetch';
import { procurementAPI } from '../api';
import TenderCard from '../components/TenderCard';

export default function TenderListOptimized() {
  const [pageSize, setPageSize] = useState(20);
  const {
    data,
    loading,
    error,
    pagination,
    fetchData,
    goToPage
  } = useOptimizedFetch('/api/procurement/tenders');

  useEffect(() => {
    // Fetch with pagination
    fetchData('/api/procurement/tenders', { 
      page: pagination.page, 
      limit: pageSize 
    });
  }, [pagination.page, pageSize]);

  return (
    <Box sx={{ p: 3, direction: 'rtl' }}>
      {/* Page Size Control */}
      <FormControl sx={{ minWidth: 200, mb: 2 }}>
        <InputLabel>عدد العناصر في الصفحة</InputLabel>
        <Select value={pageSize} onChange={e => setPageSize(e.target.value)}>
          <MenuItem value={10}>10</MenuItem>
          <MenuItem value={20}>20</MenuItem>
          <MenuItem value={50}>50</MenuItem>
        </Select>
      </FormControl>

      {/* Tenders Grid */}
      {loading && <CircularProgress />}
      {error && <Box sx={{ color: 'error.main' }}>{error}</Box>}
      
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 2 }}>
        {data?.tenders?.map(tender => (
          <TenderCard key={tender.id} tender={tender} />
        ))}
      </Box>

      {/* Pagination */}
      {pagination.total > pageSize && (
        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
          <Pagination 
            count={Math.ceil(pagination.total / pageSize)}
            page={pagination.page}
            onChange={(e, page) => goToPage(page)}
          />
        </Box>
      )}
    </Box>
  );
}
