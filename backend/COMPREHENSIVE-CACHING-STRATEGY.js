/**
 * 🚀 COMPREHENSIVE CACHING STRATEGY
 * 100% Endpoint Coverage with Optimized TTL
 * 
 * Date: November 23, 2025
 * Status: Production Ready
 */

// CACHE TTL CONFIGURATION BY ENDPOINT TYPE
const CACHE_STRATEGY = {
  // User-Related Endpoints (Fast-changing data)
  USER_AUTH: {
    TTL: 0,           // No cache (sensitive)
    Routes: ['/auth/login', '/auth/register', '/auth/logout']
  },
  
  USER_PROFILE: {
    TTL: 600,         // 10 minutes (user might update profile)
    Routes: ['/api/users/:id', '/api/users/profile']
  },
  
  USER_LIST: {
    TTL: 300,         // 5 minutes (moderate change)
    Routes: ['/api/users', '/api/users/search', '/api/suppliers']
  },

  // Tender-Related Endpoints (Core business)
  TENDER_DETAIL: {
    TTL: 300,         // 5 minutes (can change during bidding)
    Routes: ['/api/tenders/:id', '/api/tenders/:id/details']
  },
  
  TENDER_LIST: {
    TTL: 600,         // 10 minutes (lists change slowly)
    Routes: ['/api/tenders', '/api/tenders/open', '/api/tenders/closed', '/api/tenders/awarded']
  },
  
  TENDER_SEARCH: {
    TTL: 300,         // 5 minutes (search results)
    Routes: ['/api/tenders/search', '/api/search/tenders']
  },

  // Offer-Related Endpoints (Active/changing)
  OFFER_DETAIL: {
    TTL: 120,         // 2 minutes (frequently changes during evaluation)
    Routes: ['/api/offers/:id', '/api/offers/:id/details']
  },
  
  OFFER_LIST: {
    TTL: 300,         // 5 minutes (moderate stability)
    Routes: ['/api/offers', '/api/offers/my-offers', '/api/procurement/offers']
  },
  
  OFFER_EVALUATION: {
    TTL: 120,         // 2 minutes (actively evaluated)
    Routes: ['/api/offers/:id/evaluation', '/api/tenders/:id/offers']
  },

  // Purchase Orders (Stable, infrequently updated)
  PO_DETAIL: {
    TTL: 600,         // 10 minutes (stable)
    Routes: ['/api/purchase-orders/:id', '/api/po/:id']
  },
  
  PO_LIST: {
    TTL: 900,         // 15 minutes (very stable)
    Routes: ['/api/purchase-orders', '/api/purchase-orders/list']
  },

  // Invoices (Stable, critical)
  INVOICE_DETAIL: {
    TTL: 900,         // 15 minutes (very stable)
    Routes: ['/api/invoices/:id', '/api/invoices/:id/details']
  },
  
  INVOICE_LIST: {
    TTL: 900,         // 15 minutes (stable)
    Routes: ['/api/invoices', '/api/invoices/list', '/api/invoices/pending']
  },

  // Reviews & Ratings (Static once created)
  REVIEWS: {
    TTL: 1800,        // 30 minutes (very stable)
    Routes: ['/api/reviews', '/api/reviews/:id', '/api/ratings']
  },

  // Messages (Semi-static, moderate change)
  MESSAGES: {
    TTL: 60,          // 1 minute (frequently checked)
    Routes: ['/api/messages', '/api/messages/inbox', '/api/messages/:id']
  },

  // Notifications (Real-time, minimal caching)
  NOTIFICATIONS: {
    TTL: 30,          // 30 seconds (real-time)
    Routes: ['/api/notifications', '/api/notifications/unread']
  },

  // Analytics (Stable, heavy queries)
  ANALYTICS: {
    TTL: 1800,        // 30 minutes (stable, expensive queries)
    Routes: ['/api/analytics', '/api/analytics/dashboard', '/api/stats']
  },

  // Static Content (Very stable)
  STATIC: {
    TTL: 3600,        // 1 hour (very stable)
    Routes: ['/api/categories', '/api/industries', '/api/regions', '/api/static']
  },

  // Export Operations (One-time, cacheable)
  EXPORTS: {
    TTL: 300,         // 5 minutes (data exports)
    Routes: ['/api/export', '/api/export/csv', '/api/export/json']
  },

  // No Cache (Write operations, real-time data)
  NO_CACHE: {
    TTL: 0,
    Routes: [
      '/api/create', '/api/update', '/api/delete',
      '/api/tenders/create', '/api/offers/submit',
      '/api/invoices/create', '/api/messages/send',
      '/api/auth/mfa', '/api/auth/verify'
    ]
  }
};

// CACHE INVALIDATION RULES
const CACHE_INVALIDATION = {
  // When user is created/updated
  USER_UPDATE: {
    Invalidate: ['users:*', 'user:*'],
    Routes: ['/api/users', 'POST /api/users']
  },

  // When tender is created/updated
  TENDER_UPDATE: {
    Invalidate: ['tenders:*', 'tender:*', 'search:tenders:*'],
    Routes: ['/api/tenders', 'POST /api/tenders']
  },

  // When offer is submitted/evaluated
  OFFER_UPDATE: {
    Invalidate: ['offers:*', 'offer:*', 'tender:*:offers'],
    Routes: ['/api/offers', 'POST /api/offers']
  },

  // When PO is created/updated
  PO_UPDATE: {
    Invalidate: ['purchase-orders:*', 'po:*', 'offers:*:po'],
    Routes: ['/api/purchase-orders', 'POST /api/purchase-orders']
  },

  // When invoice is created/updated
  INVOICE_UPDATE: {
    Invalidate: ['invoices:*', 'invoice:*', 'po:*:invoices'],
    Routes: ['/api/invoices', 'POST /api/invoices']
  }
};

// CACHE KEY PATTERNS
const CACHE_KEYS = {
  USERS: 'users:*',
  TENDERS: 'tenders:*',
  OFFERS: 'offers:*',
  POS: 'purchase-orders:*',
  INVOICES: 'invoices:*',
  MESSAGES: 'messages:*',
  REVIEWS: 'reviews:*',
  ANALYTICS: 'analytics:*',
  SEARCH: 'search:*'
};

// EXPORT FOR USE IN ROUTES
module.exports = {
  CACHE_STRATEGY,
  CACHE_INVALIDATION,
  CACHE_KEYS
};
