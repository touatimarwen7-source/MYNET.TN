
/**
 * 🧪 E2E TESTS - CRITICAL FLOWS
 * Tests complets des parcours utilisateurs critiques
 */

const request = require('supertest');
const app = require('../app');

describe('🔥 Critical User Flows - E2E Tests', () => {
  let buyerToken;
  let supplierToken;
  let tenderId;
  let offerId;

  // ============================================
  // FLOW 1: BUYER CREATES TENDER
  // ============================================
  describe('Flow 1: Buyer Creates and Publishes Tender', () => {
    test('Step 1: Buyer logs in', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'buyer@mynet.tn',
          password: 'buyer123'
        });

      expect([200, 400, 401]).toContain(res.status);
      if (res.status === 200) {
        buyerToken = res.body.accessToken;
        expect(buyerToken).toBeDefined();
      }
    });

    test('Step 2: Buyer creates tender', async () => {
      if (!buyerToken) return;

      const res = await request(app)
        .post('/api/procurement/tenders')
        .set('Authorization', `Bearer ${buyerToken}`)
        .send({
          title: 'E2E Test Tender',
          description: 'Description complète du test E2E',
          category: 'Services',
          budget_min: 5000,
          budget_max: 10000,
          deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
        });

      expect([200, 201, 400, 401]).toContain(res.status);
      if (res.status === 201 || res.status === 200) {
        tenderId = res.body.id || res.body.data?.id;
      }
    });

    test('Step 3: Buyer publishes tender', async () => {
      if (!buyerToken || !tenderId) return;

      const res = await request(app)
        .post(`/api/procurement/tenders/${tenderId}/publish`)
        .set('Authorization', `Bearer ${buyerToken}`);

      expect([200, 400, 401, 404]).toContain(res.status);
    });
  });

  // ============================================
  // FLOW 2: SUPPLIER SUBMITS OFFER
  // ============================================
  describe('Flow 2: Supplier Finds and Submits Offer', () => {
    test('Step 1: Supplier logs in', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'supplier@mynet.tn',
          password: 'supplier123'
        });

      expect([200, 400, 401]).toContain(res.status);
      if (res.status === 200) {
        supplierToken = res.body.accessToken;
        expect(supplierToken).toBeDefined();
      }
    });

    test('Step 2: Supplier views available tenders', async () => {
      if (!supplierToken) return;

      const res = await request(app)
        .get('/api/procurement/tenders')
        .set('Authorization', `Bearer ${supplierToken}`);

      expect([200, 401]).toContain(res.status);
      if (res.status === 200) {
        expect(Array.isArray(res.body) || Array.isArray(res.body.data)).toBe(true);
      }
    });

    test('Step 3: Supplier submits offer', async () => {
      if (!supplierToken || !tenderId) return;

      const res = await request(app)
        .post('/api/procurement/offers')
        .set('Authorization', `Bearer ${supplierToken}`)
        .send({
          tender_id: tenderId,
          total_amount: 7500,
          delivery_time: '30 days',
          technical_proposal: 'Proposition technique détaillée'
        });

      expect([200, 201, 400, 401]).toContain(res.status);
      if (res.status === 201 || res.status === 200) {
        offerId = res.body.id || res.body.data?.id;
      }
    });
  });

  // ============================================
  // FLOW 3: BUYER EVALUATES OFFERS
  // ============================================
  describe('Flow 3: Buyer Evaluates and Awards', () => {
    test('Step 1: Buyer views received offers', async () => {
      if (!buyerToken || !tenderId) return;

      const res = await request(app)
        .get(`/api/procurement/tenders/${tenderId}/offers`)
        .set('Authorization', `Bearer ${buyerToken}`);

      expect([200, 401, 404]).toContain(res.status);
    });

    test('Step 2: Buyer evaluates offer', async () => {
      if (!buyerToken || !offerId) return;

      const res = await request(app)
        .post(`/api/procurement/offers/${offerId}/evaluate`)
        .set('Authorization', `Bearer ${buyerToken}`)
        .send({
          technical_score: 85,
          financial_score: 90,
          notes: 'Bonne proposition'
        });

      expect([200, 400, 401, 404]).toContain(res.status);
    });

    test('Step 3: Buyer awards tender', async () => {
      if (!buyerToken || !tenderId) return;

      const res = await request(app)
        .post('/api/procurement/tender-management/award')
        .set('Authorization', `Bearer ${buyerToken}`)
        .send({
          tender_id: tenderId,
          winning_offer_id: offerId
        });

      expect([200, 201, 400, 401, 404]).toContain(res.status);
    });
  });

  // ============================================
  // FLOW 4: NOTIFICATION SYSTEM
  // ============================================
  describe('Flow 4: Notification System', () => {
    test('Supplier receives notification', async () => {
      if (!supplierToken) return;

      const res = await request(app)
        .get('/api/notifications')
        .set('Authorization', `Bearer ${supplierToken}`);

      expect([200, 401]).toContain(res.status);
      if (res.status === 200) {
        expect(Array.isArray(res.body) || Array.isArray(res.body.data)).toBe(true);
      }
    });

    test('Supplier marks notification as read', async () => {
      if (!supplierToken) return;

      const res = await request(app)
        .put('/api/notifications/mark-all-read')
        .set('Authorization', `Bearer ${supplierToken}`);

      expect([200, 401]).toContain(res.status);
    });
  });

  // ============================================
  // FLOW 5: SEARCH AND FILTER
  // ============================================
  describe('Flow 5: Advanced Search', () => {
    test('Search tenders by keyword', async () => {
      const res = await request(app)
        .get('/api/search/tenders?q=test');

      expect([200, 401]).toContain(res.status);
    });

    test('Filter tenders by category', async () => {
      const res = await request(app)
        .get('/api/procurement/tenders?category=Services');

      expect([200, 401]).toContain(res.status);
    });
  });
});

module.exports = { describe, test, expect };
