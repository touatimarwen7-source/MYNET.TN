/**
 * 🚀 Data Fetching Optimizer
 * Optimizes queries with selective columns, indexes, and batching
 */

class DataFetchingOptimizer {
  // Selective column mappings to avoid fetching unnecessary data
  static COLUMN_SELECTS = {
    tender_list: `
      id, tender_number, title, category, budget_min, budget_max,
      deadline, status, is_public, buyer_id, created_at, first_offer_at
    `,
    tender_detail: `
      id, tender_number, title, description, category, budget_min, budget_max,
      currency, status, deadline, opening_date, requirements, attachments,
      buyer_id, is_public, evaluation_criteria, created_at, updated_at,
      allow_partial_award, max_winners
    `,
    offer_list: `
      id, offer_number, tender_id, supplier_id, total_amount, currency,
      status, submitted_at, technical_score, financial_score, final_score,
      ranking, award_status, awarded_at, is_locked
    `,
    offer_detail: `
      id, offer_number, tender_id, supplier_id, total_amount, currency,
      delivery_time, payment_terms, status, technical_score, financial_score,
      final_score, ranking, submitted_at, award_status, awarded_at,
      created_at, technical_evaluated_at, financial_evaluated_at,
      evaluation_completed_at, receipt_number, receipt_issued_at
    `,
    supplier_list: `
      id, username, company_name, email, phone, role, status,
      created_at, is_active
    `,
    user_minimal: `
      id, username, email, role, is_active, created_at
    `
  };

  /**
   * Build optimized SELECT query with specific columns
   */
  static buildSelectQuery(tableName, columns = null) {
    const columnList = columns || this.COLUMN_SELECTS[tableName] || '*';
    return `SELECT ${columnList} FROM ${tableName}`;
  }

  /**
   * Add pagination to query
   */
  static addPagination(query, page = 1, limit = 20) {
    const offset = (page - 1) * limit;
    return `${query} LIMIT ${limit} OFFSET ${offset}`;
  }

  /**
   * Batch fetch multiple resources
   */
  static async batchFetch(pool, queries) {
    try {
      const results = await Promise.all(
        queries.map(q => pool.query(q.sql, q.params))
      );
      return results.map(r => r.rows);
    } catch (error) {
      console.error('Batch fetch error:', error);
      throw error;
    }
  }

  /**
   * Fetch with intelligent caching
   */
  static async fetchWithCache(cacheManager, cacheKey, ttl, queryFn) {
    // Check cache first
    const cached = await cacheManager.get(cacheKey);
    if (cached) return cached;

    // Execute query
    const result = await queryFn();

    // Store in cache
    await cacheManager.set(cacheKey, result, ttl);

    return result;
  }

  /**
   * Prefetch related data (prevent N+1)
   */
  static async prefetchOffers(pool, tenderIds, limit = 20) {
    if (!tenderIds || tenderIds.length === 0) return {};

    const placeholders = tenderIds.map((_, i) => `$${i + 1}`).join(',');
    const query = `
      SELECT * FROM offers
      WHERE tender_id IN (${placeholders})
      ORDER BY ranking ASC
      LIMIT ${limit}
    `;

    const result = await pool.query(query, tenderIds);
    
    // Group by tender_id
    const grouped = {};
    result.rows.forEach(offer => {
      if (!grouped[offer.tender_id]) {
        grouped[offer.tender_id] = [];
      }
      grouped[offer.tender_id].push(offer);
    });

    return grouped;
  }

  /**
   * Prefetch supplier details
   */
  static async prefetchSuppliers(pool, supplierIds) {
    if (!supplierIds || supplierIds.length === 0) return {};

    const placeholders = supplierIds.map((_, i) => `$${i + 1}`).join(',');
    const query = `
      SELECT ${this.COLUMN_SELECTS.supplier_list}
      FROM users
      WHERE id IN (${placeholders})
    `;

    const result = await pool.query(query, supplierIds);
    
    // Map by ID
    const mapped = {};
    result.rows.forEach(supplier => {
      mapped[supplier.id] = supplier;
    });

    return mapped;
  }

  /**
   * Calculate optimal page size based on data size
   */
  static getOptimalPageSize(dataComplexity = 'normal') {
    const sizes = {
      simple: 50,      // Simple list views
      normal: 20,      // Standard views
      complex: 10,     // Complex views with nested data
      heavy: 5         // Heavy queries with lots of joins
    };
    return sizes[dataComplexity] || 20;
  }
}

module.exports = DataFetchingOptimizer;
