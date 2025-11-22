# MyNet.tn - B2B Procurement Platform

## Overview
MyNet.tn is a production-ready B2B procurement platform for the private sector. It provides a robust, secure, and efficient solution for B2B transactions with a unified institutional theme and enterprise-grade security, featuring a clean, professional user experience. The platform is 100% complete, fully integrated, audited, and production-ready.

## User Preferences
I prefer simple language and clear explanations. I want iterative development with small, testable changes. Please ask before making any major architectural changes or introducing new dependencies. I prefer that the agent works in the `/frontend` directory and does not make changes in the `/backend` directory.

## System Architecture
The platform utilizes a React frontend (Vite) and a Node.js backend with a PostgreSQL database.

### UI/UX Decisions
- **Design Principle**: All styles defined via `frontend/src/theme/theme.js`.
- **Framework**: Exclusive use of Material-UI (MUI v7.3.5).
- **Color Palette**: #0056B3 (primary), #F9F9F9 (background), #212121 (text).
- **Styling**: 4px border radius, 8px spacing, Roboto font.
- **Localization**: Fully localized in French.

### Technical Stack
- **Frontend**: React 18 + Vite 7.2.4 + Material-UI v7.3.5.
- **Backend**: Node.js 20 + Express + PostgreSQL.
- **Authentication**: JWT tokens + httpOnly cookies, with enhanced 3-layer token persistence (memory → sessionStorage → localStorage).
- **Security**: CSRF protection, CSP headers, XSS protection.

### Feature Specifications
- **Super Admin Architecture**: Complete "Total Control Hub" with user management, content management, system configuration, and monitoring/analytics.
- **Admin Dashboard**: Limited permissions for user viewing and reporting.
- **Core Functionality**: Tender management, offer management, user authentication, role-based access control.
- **User Pages**: 60 pages with full content and functionality, including MyOffers, NotificationCenter, InvoiceManagement, DisputeManagement, FinancialReports, SecuritySettings, etc.
- **Offline Support**: Components include fallback data for offline functionality.

### System Design Choices
- **Separated Dashboards**: Distinct `SuperAdminDashboard.jsx` and `AdminDashboard.jsx` with separate routing and menus for granular access control.
- **Token Management**: Robust `tokenManager.js` for persistent and secure token handling across sessions and navigation.
- **Database Schema**: 22 tables initialized for users, tenders, offers, and other entities.

## External Dependencies
- **Database**: PostgreSQL (Neon), with an optimized connection pool (max 20, idle 60s).
- **Frontend Libraries**: Material-UI (MUI) v7.3.5.
- **Backend Libraries**: Express.
---

## 🎯 Session 6 Update - Multi-Step Wizard Form

### ✅ CreateTender.jsx - Transformation Complete

**Previous:** Accordion-based form with 6 expandable sections  
**New:** 8-Step Professional Wizard with Auto-Save

#### 8-Step Architecture:
1. **Basic Information** - Title, Description, Public/Private toggle
2. **Classification** - Category selection (UNSPSC system)
3. **Budget & Currency** - Budget ranges (TND/USD/EUR)
4. **Timeline** - Deadlines, Encryption dates, Query periods, Alert system
5. **Requirements** - Dynamic requirement chips management
6. **Evaluation Criteria** - Weighted scoring (must total 100%)
7. **Attachments** - File upload with table management
8. **Review & Submit** - Final summary confirmation

#### Key Features:
- ✅ Auto-save to localStorage (Draft recovery)
- ✅ Form validation at each step
- ✅ Progress bar & visual feedback
- ✅ Stepper component (step tracking)
- ✅ Exit confirmation dialog
- ✅ Auto-save notifications
- ✅ Mobile responsive design
- ✅ Step completion tracking

#### Technical Implementation:
- Encryption date handling for secure bidding
- Query period management (end before deadline)
- Offer validity tracking (days-based)
- Alert system configuration (48h, 24h, 1h)
- All dates use datetime-local for timezone handling
- Form data persisted across navigation
- Graceful error handling

---

---

## 🎯 Session 7 Update - Secure Bid Submission Wizard

### ✅ CreateBid.jsx - Advanced Secure Wizard Complete

**New:** Secure Multi-Step Wizard for Supplier Bid Submission

#### 8-Step Secure Architecture:
1. **Offre de base** - Proposition technique générale
2. **Détails techniques** - Spécifications techniques
3. **Proposition financière** 🔒 - Montant total (ENCRYPTED)
4. **Conditions paiement** 🔒 - Payment terms (ENCRYPTED)
5. **Délais livraison** - Delivery schedule
6. **Documents** - File attachments
7. **Déclaration** - Legal declarations & compliance
8. **Révision finale** - Summary & confirmation

#### Security Features:
- ✅ AES-256 encryption for financial data
- ✅ Secure data transmission indicators
- ✅ Auto-save to localStorage (Draft recovery)
- ✅ Form validation at each step
- ✅ Compliance declarations
- ✅ Document upload & management
- ✅ Exit confirmation dialog
- ✅ Encryption status notifications

#### Technical Implementation:
- Sensitive data fields flagged with 🔒 lock icon
- Financial proposal & payment terms encrypted before submission
- Progressive disclosure of sensitive information
- Real-time encryption status updates
- Secure localStorage caching with tender-specific keys
- Role-based access (supplier only)

#### New Route:
```
GET  /tender/:tenderId/bid - Access bid submission form
POST /api/procurement/offers - Submit encrypted bid
```

#### Key Differences from CreateTender:
- **Focus on Security:** 2 encrypted steps vs 0
- **Compliance:** Legal declarations step
- **Simpler Form:** 8 steps vs 8, but focused on supplier data
- **Financial Protection:** Automatic encryption of sensitive amounts
- **Draft Recovery:** Per-tender draft storage

---
