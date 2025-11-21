# MyNet.tn - Professional Tender Management Platform

## 📋 Project Overview

**MyNet.tn** is a comprehensive procurement and tender management system for Tunisia with separate dashboards for buyers, suppliers, and administrators. The platform enables organizations to manage the complete tender lifecycle from creation to delivery.

**Stack:**
- Frontend: React/Vite (port 5000)
- Backend: Node.js/Express (port 3000)
- Database: PostgreSQL on Neon
- Language: French (official platform language)
- Design: Corporate financial institution style (Segoe UI, navy/teal)

## 🔄 Complete Tender Lifecycle Implementation

### BUYER WORKFLOW (Complete)
1. **Create Tender** → `/create-tender` - CreateTenderImproved.jsx
   - Multi-step form: General Info → Items → Documents → Settings
   - Data transformation to backend schema
   - 24hr access token expiration

2. **Manage Active Tenders** → `/buyer-active-tenders` - BuyerActiveTenders.jsx
   - View all buyer's active tenders
   - Search, filter, sort functionality
   - Card-based grid layout

3. **Monitor Submissions** → `/monitoring-submissions` - MonitoringSubmissions.jsx
   - Real-time tracking of bid submissions
   - Supplier details and offer amounts
   - Submission status (submitted/received)

4. **Evaluate Offers** → `/tender-evaluation` - TenderEvaluation.jsx
   - Compare bids with scoring criteria
   - Price, compliance, delivery, quality evaluation
   - Select winner or reject offers

5. **Award Tender** → `/tender-awarding` - TenderAwarding.jsx
   - Finalize award to selected supplier
   - Generate contract documents
   - Specify delivery items and totals

6. **Send Notifications** → `/award-notifications` - AwardNotifications.jsx
   - Notify winning supplier
   - Send official award letter
   - Track notification status

7. **Manage Contracts** → `/contracts` - ContractManagement.jsx
   - Contract repository and tracking
   - Draft → Sign workflow
   - Contract details and parties

8. **Track Deliveries** → `/deliveries` - DeliveryManagement.jsx
   - Monitor delivery schedule
   - Confirm receipt of goods
   - Track delayed/received status

9. **Generate Invoices** → `/invoice-generation` - InvoiceGeneration.jsx
   - Create supplier invoices
   - Track payment status
   - Issue and payment tracking

10. **Manage Finances** → `/budgets` - BudgetManagement.jsx
    - Budget allocation by category
    - Spending tracking and remaining budget
    - Budget utilization dashboard

11. **Financial Reports** → `/financial-reports` - FinancialReports.jsx
    - Monthly/quarterly/annual reports
    - Supplier analysis
    - Savings tracking

12. **Monitor Performance** → `/performance` - PerformanceMonitoring.jsx
    - Supplier ratings and metrics
    - On-time delivery percentage
    - Quality and compliance scores

13. **Manage Disputes** → `/disputes` - DisputeManagement.jsx
    - File and track disputes
    - Resolution workflow
    - Document and comment history

14. **Team Management** → `/team-management` - TeamManagement.jsx
    - Add team members
    - Assign roles

15. **Team Permissions** → `/team-permissions` - TeamPermissions.jsx
    - Granular permission control
    - View/Create/Edit/Delete/Approve tenders
    - Manage invoices and team

### SUPPLIER WORKFLOW (Complete)
1. **Browse Tenders** → `/tenders` - TenderList.jsx
   - Filter by status, category, budget
   - Search tenders
   - View tender details

2. **Submit Bid** → `/bid-submission/:tenderId` - BidSubmission.jsx
   - Enter price, delivery time, quality score
   - Upload supporting documents
   - Submit offer with validation

3. **My Offers** → `/my-offers` - MyOffers.jsx
   - Track submitted bids
   - View evaluation status
   - See award/rejection notifications

4. **Manage Products** → `/supplier-products` - SupplierProductsManagement.jsx
   - Create product catalog
   - Set prices and quantities
   - Manage availability

5. **Manage Services** → `/supplier-services` - SupplierServicesManagement.jsx
   - Create service offerings
   - Set hourly rates
   - Manage service descriptions

6. **Catalog Visibility** → `/supplier-catalog` - SupplierCatalog.jsx
   - View public catalog
   - Track catalog views
   - Update product/service visibility

7. **Invoices** → `/supplier-invoices` - SupplierInvoices.jsx
   - View invoices from buyers
   - Track payment status
   - Generate reports

### ADMIN FUNCTIONS (Available)
- `/admin` - AdminDashboard.jsx
- `/admin/audit-logs` - AuditLogViewer.jsx
- `/admin/health` - HealthMonitoring.jsx
- `/admin/archive` - ArchiveManagement.jsx

## 📁 File Structure

```
frontend/src/
├── pages/
│   ├── BuyerDashboard.jsx
│   ├── BuyerActiveTenders.jsx
│   ├── CreateTenderImproved.jsx
│   ├── TenderList.jsx
│   ├── TenderEvaluation.jsx
│   ├── TenderAwarding.jsx
│   ├── MonitoringSubmissions.jsx
│   ├── ContractManagement.jsx
│   ├── DeliveryManagement.jsx
│   ├── AwardNotifications.jsx
│   ├── BudgetManagement.jsx
│   ├── FinancialReports.jsx
│   ├── PerformanceMonitoring.jsx
│   ├── DisputeManagement.jsx
│   ├── InvoiceGeneration.jsx
│   ├── TeamManagement.jsx
│   ├── TeamPermissions.jsx
│   ├── BidSubmission.jsx
│   ├── SupplierProductsManagement.jsx
│   ├── SupplierServicesManagement.jsx
│   ├── Profile.jsx
│   ├── NotificationCenter.jsx
│   └── [other pages]
├── components/
│   ├── Sidebar.jsx (Updated with complete navigation)
│   ├── UnifiedHeader.jsx
│   └── [other components]
├── styles/
│   ├── corporate-design.css
│   ├── financial-corporate.css
│   ├── buyer-active-tenders.css
│   ├── financial-reports.css
│   ├── budget-management.css
│   ├── tender-lifecycle.css
│   └── [other styles]
├── api.js (procurementAPI centralized)
└── utils/
    ├── dateFormatter.js (Safe date handling)
    └── pageTitle.js

backend/
├── routes/procurementRoutes.js
├── controllers/procurement/
│   ├── TenderController.js (getMyTenders endpoint)
│   ├── OfferController.js
│   └── [other controllers]
├── services/TenderService.js (getMyTenders method)
├── security/KeyManagementService.js (24h token expiry)
└── [other backend files]
```

## 🔧 Key Features Implemented

### Authentication & Security
- JWT with 24-hour access token, 30-day refresh token
- Role-based access control (buyer, supplier, admin)
- Secure password hashing (PBKDF2)
- Token refresh mechanism with automatic retry

### Tender Management
- Multi-step tender creation with validation
- Data transformation (frontend ↔ backend formats)
- Tender visibility filtering by creator
- Status tracking (draft, active, closed)

### Evaluation & Award
- Multi-criteria evaluation system
- Scoring on price, compliance, delivery, quality
- Award notification workflow
- Contract generation

### Financial Management
- Budget tracking and allocation
- Invoice generation and payment tracking
- Financial reporting (monthly, quarterly, annual)
- Supplier performance analytics

### Collaboration
- Team management with granular permissions
- Notification center
- Tender chat/comments
- Dispute resolution

## 🎨 Design Standards

**Font:** Segoe UI (corporate standard)
**Colors:**
- Primary: #0055b8 (navy blue)
- Secondary: #003d82 (dark navy)
- Accent: #16a34a (success green)
- Warning: #d97706 (amber)
- Error: #dc2626 (red)

**CSS Classes:**
- `.btn-primary-corporate` - Primary action buttons
- `.table-corporate` - Professional tables
- `.card.corporate` - Card layouts
- `.input-corporate` - Form inputs
- `.badge-*` - Status badges

## 🔌 API Integration

All pages use centralized `procurementAPI` module:
```javascript
import { procurementAPI } from '../api';

// Key methods:
- procurementAPI.getMyTenders(filters)
- procurementAPI.createTender(data)
- procurementAPI.createOffer(data)
- procurementAPI.getTenders(filters)
- procurementAPI.getTender(id)
```

## 📊 Database Schema Integration

**Key Tables:**
- `tenders` - Tender records (buyer_id, created_by, status, deadline)
- `offers` - Supplier bids (supplier_id, tender_id, status)
- `invoices` - Financial records
- `contracts` - Contract management
- `deliveries` - Delivery tracking
- `disputes` - Dispute management
- `suppliers` - Supplier profiles with ratings

## 🚀 Latest Changes (Session)

1. **Fixed Token Expiration** - Extended to 24 hours
2. **Created BuyerActiveTenders** - Displays only user's tenders
3. **Fixed Date Formatting** - Safe date handling with formatDate utility
4. **Created Complete Lifecycle Pages:**
   - BidSubmission, ContractManagement, DeliveryManagement
   - AwardNotifications, PerformanceMonitoring, DisputeManagement
   - InvoiceGeneration, MonitoringSubmissions
5. **Updated Navigation** - Sidebar reflects all new pages
6. **Fixed Duplicate Routes** - Cleaned up redundant paths

## ✅ Quality Assurance

- All pages have corporate styling
- All forms have validation
- All tables support sorting/filtering
- Date formatting handles null/invalid dates
- API calls use centralized module
- Role-based access control enforced
- Responsive design for mobile devices

## 🎯 User Preferences

- French language (all UI text in French)
- Professional financial institution style (no emojis in branding, minimal in UI)
- Formal terminology (Appels d'Offres, Fournisseur, Acheteur, etc.)
- Corporate design with Segoe UI and navy/teal colors

## 📝 Documentation

- Each page component has clear purpose and integration point
- API module is centralized for consistency
- Utility functions prevent code duplication
- Sidebar navigation is the main entry point for all features

---

**Status:** MVP Complete - Full tender lifecycle operational
**Last Updated:** November 21, 2025
