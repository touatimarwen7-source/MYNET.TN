/**
 * 🚀 Optimized Data Fetching Hook
 * Implements parallel fetching, caching, and pagination
 */

import { useState, useEffect, useRef } from 'react';
import axios from 'axios';

export const useOptimizedFetch = (initialUrl, options = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0 });
  
  const cacheRef = useRef(new Map());
  const abortControllerRef = useRef(null);

  const getCacheKey = (url, params) => `${url}:${JSON.stringify(params)}`;

  const fetchData = async (url, params = {}, useCache = true) => {
    const cacheKey = getCacheKey(url, params);

    // Check cache
    if (useCache && cacheRef.current.has(cacheKey)) {
      const cached = cacheRef.current.get(cacheKey);
      if (Date.now() - cached.timestamp < 300000) { // 5 min TTL
        setData(cached.data);
        return cached.data;
      }
    }

    setLoading(true);
    setError(null);

    // Cancel previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();

    try {
      const response = await axios.get(url, {
        params: { ...params, limit: pagination.limit },
        signal: abortControllerRef.current.signal
      });

      const result = response.data;

      // Cache result
      cacheRef.current.set(cacheKey, {
        data: result,
        timestamp: Date.now()
      });

      // Update pagination
      if (result.pagination) {
        setPagination(result.pagination);
      }

      setData(result);
      return result;
    } catch (err) {
      if (err.name !== 'CanceledError') {
        setError(err.response?.data?.error || 'جدث خطأ أثناء تحميل البيانات');
      }
    } finally {
      setLoading(false);
    }
  };

  const clearCache = () => {
    cacheRef.current.clear();
  };

  const goToPage = (page) => {
    setPagination(p => ({ ...p, page }));
  };

  return {
    data,
    loading,
    error,
    pagination,
    fetchData,
    clearCache,
    goToPage
  };
};

/**
 * Parallel Fetch Hook - fetch multiple endpoints in parallel
 */
export const useParallelFetch = (endpoints = []) => {
  const [results, setResults] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (endpoints.length === 0) return;

    setLoading(true);
    setError(null);

    Promise.all(
      endpoints.map(ep => 
        axios.get(ep.url, { params: ep.params }).catch(e => ({ error: e }))
      )
    )
    .then(responses => {
      const data = {};
      endpoints.forEach((ep, idx) => {
        data[ep.key] = responses[idx].data;
      });
      setResults(data);
    })
    .catch(err => setError(err))
    .finally(() => setLoading(false));
  }, [endpoints]);

  return { results, loading, error };
};

export default useOptimizedFetch;
