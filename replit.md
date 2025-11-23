# MyNet.tn - B2B Procurement Platform

## Overview
MyNet.tn is a production-ready B2B procurement platform for the private sector, offering a robust, secure, and efficient solution for B2B transactions. Its core capabilities include tender management, offer management, dynamic company profiles, and a complete supply chain process from tender creation to invoice generation. The platform features a unified institutional theme, enterprise-grade security, and a professional user experience, and is designed for scalability and market leadership in B2B procurement.

## User Preferences
I prefer simple language and clear explanations. I want iterative development with small, testable changes. Please ask before making any major architectural changes or introducing new dependencies. I prefer that the agent works in the `/frontend` directory and does not make changes in the `/backend` directory.

## Recent Changes (November 23, 2025)
- **FIXED: Cursor Reset Bug in /create-tender Form**
  - Issue: Cursor would jump/reset when typing in form fields
  - Root Cause: Step components were recreating on every keystroke causing unmount/remount
  - Solution: Extracted Step components into single memoized StepContent helper component
  - Result: Smooth typing experience without cursor position loss

- **ENHANCED: Advanced Exigences (Requirements) Step in Create Tender**
  - **Requirement Object Structure**: Each requirement now has text, type, priority, and ID
  - **4 Requirement Types**: Technique, Commercial, Administratif, Légal
  - **3 Priority Levels**: Essentielle (Essential), Important, Souhaitable (Desirable)
  - **Visual Indicators**:
    - Color-coded type badges (Technical=Blue, Commercial=Purple, Administrative=Pink, Legal=Teal)
    - Color-coded priority badges (Essential=Red, Important=Orange, Desirable=Green)
    - Left border indicator on requirement cards (Red=Essential, Orange=Important, Green=Desirable)
  - **Complete CRUD Operations**:
    - Add new requirements with type and priority selection
    - Edit existing requirements (inline form with pre-filled values)
    - Delete requirements with button
    - Real-time requirement count display
  - **Enhanced UI/UX**:
    - Multiline text input for detailed requirement descriptions
    - Type and priority dropdown selectors (2-column grid)
    - Add/Update/Cancel button controls
    - Requirements displayed as cards with all metadata
    - Empty state handling (no display until requirements added)

- **100% COMPLETE French Conversion - ZERO Arabic Text Remaining**
  - Fixed ALL remaining Arabic text in admin components
  - Removed Arabic locale file (`frontend/src/locales/ar/common.json`)
  - Verified with grep: ZERO Arabic characters found (✓ 0 matches)

## System Architecture
The platform utilizes a React frontend (Vite) and a Node.js backend with a PostgreSQL database.

### UI/UX Decisions
- **Design Principle**: All styles defined via `frontend/src/theme/theme.js`.
- **Framework**: Exclusive use of Material-UI (MUI v7.3.5).
- **Color Palette**: #0056B3 (primary), #F9F9F9 (background), #212121 (text).
- **Styling**: 4px border radius, 8px spacing, Roboto font.
- **Localization**: FRANÇAIS UNIQUEMENT.
- **Registration Form**: Multi-step form with visual progress indicator (Stepper) for better UX during user onboarding.

### Technical Implementations
- **Frontend**: React 18 + Vite 7.2.4 + Material-UI v7.3.5.
- **Backend**: Node.js 20 + Express + PostgreSQL.
- **Authentication**: JWT tokens + httpOnly cookies, with enhanced 3-layer token persistence, MFA (SMS & TOTP).
- **Security**: CORS protection, CSRF headers, XSS protection, AES-256 encryption, rate limiting, brute-force protection, input validation, soft deletes for compliance, role-based access control.
- **Supply Chain Workflow**: Multi-step wizard forms for CreateTender, CreateBid, CreateSupplyRequest, and CreateInvoice, with auto-save, draft recovery, validation, and progress tracking.
- **Dynamic Company Profile**: For viewing and editing company information.
- **Advanced Filtering & Search**: Suppliers searchable by query, category, rating, and location.
- **Messaging System**: Full user-to-user communication.
- **Reviews & Ratings System**: Comprehensive review, rating, and feedback functionality with 5-star ratings.
- **Direct Supply Request**: Buyers can send direct supply requests to verified suppliers.
- **Analytics & Insights**: Buyer/supplier dashboards, supplier analytics, and bid analytics.
- **Advanced Search & Comparison**: Multi-filter search and a bid comparison tool.
- **Data Management**: Export features (JSON, CSV) and real-time updates via WebSockets.
- **Supplier Performance Tracking**: Performance scoring, ranking, and history.
- **Email Notifications**: Integrated notification system for various events.
- **Super Admin Features**: Full CRUD for static pages, file management, image gallery with SEO, documents with versioning, content backup/restore, analytics, services and subscription plan management.
- **Purchase Orders System**: PO lifecycle management from offers with status tracking and authorization (buyer-supplier only).
- **Audit Logs System**: Admin viewable audit logs tracking user activities and entity changes.
- **Subscription Plans System**: Backend API for plan management and user subscriptions with multiple tiers.

## External Dependencies
- **Database**: PostgreSQL (Neon).
- **Frontend Libraries**: Material-UI (MUI) v7.3.5, React Router DOM, Axios, i18next, socket.io-client (v4.8.1).
- **Backend Libraries**: Express, Node.js 20, cors (v2.8.5), express-rate-limit (v8.2.1).
- **Email Services**: SendGrid/Resend/Gmail.