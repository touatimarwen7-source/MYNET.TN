# MyNet.tn - B2B Procurement Platform

## Overview
MyNet.tn is a production-ready B2B procurement platform for the private sector, designed for scalability and market leadership. It offers a secure and efficient solution for B2B transactions, including tender and offer management, dynamic company profiles, and a complete supply chain process from tender creation to invoice generation. The platform features a unified institutional theme, enterprise-grade security, and a professional user experience.

## User Preferences
I prefer simple language and clear explanations. I want iterative development with small, testable changes. Please ask before making any major architectural changes or introducing new dependencies. I prefer that the agent works in the `/frontend` directory and does not make changes in the `/backend` directory.

## System Architecture
The platform utilizes a React frontend (Vite) and a Node.js backend with a PostgreSQL database.

### UI/UX Decisions
- **Design Principle**: All styles defined via `frontend/src/theme/theme.js` using Material-UI (MUI v7.3.5).
- **Color Palette**: #0056B3 (primary), #F9F9F9 (background), #212121 (text).
- **Styling**: 4px border radius, 8px spacing, Roboto font.
- **Localization**: FRANÇAIS UNIQUEMENT.
- **Responsive Design**: Mobile-first approach with breakpoint guidelines, touch target sizes, responsive typography, and flexible grid layouts.
- **Accessibility**: WCAG 2.1 compliant with ARIA labels, keyboard navigation, semantic HTML, and color contrast compliance.
- **User Experience**: Loading skeletons for improved data loading UX.

### Technical Implementations
- **Frontend**: React 18 + Vite.
- **Backend**: Node.js 20 + Express.
- **Authentication**: JWT tokens + httpOnly cookies, 3-layer token persistence, MFA (SMS & TOTP).
- **Security**: CORS, CSRF, XSS, AES-256 encryption, rate limiting, brute-force protection, input validation, soft deletes, role-based access control.
- **Workflow Management**: Multi-step wizard forms for procurement processes (CreateTender, CreateBid, CreateSupplyRequest, CreateInvoice) with auto-save, draft recovery, validation, and progress tracking.
- **Core Features**: Dynamic company profiles, advanced filtering & search, messaging, reviews & ratings, direct supply requests, analytics dashboards, bid comparison tool.
- **Data Management**: Export features (JSON, CSV), real-time updates via WebSockets, pagination, and bulk operations.
- **Supplier Performance**: Tracking, scoring, ranking, and history.
- **Notifications**: Integrated email notification system with status tracking.
- **Super Admin Features**: Full CRUD for static pages, file management, image gallery, documents with versioning, content backup/restore, analytics, service/subscription plan management, audit logs, purchase orders.
- **Error Handling**: Comprehensive system with custom error classes, global handler, error boundary, and Axios interceptors.
- **Form Validation**: Custom `useFormValidation` hook, pre-built schemas, real-time error display, and backend error integration.
- **Admin Middleware**: Specialized functions for rate limiting, input validation, permission verification, and logging for super admin endpoints.
- **System Utilities**: Logging, analytics, and testing systems with Jest for unit and integration tests.

### System Design Choices
- **Database Connection**: Optimized PostgreSQL connection pool with `SafeClient` wrapper and safe query middleware to prevent memory leaks and improve stability.
- **Security Enhancements**: Implemented CSRF protection, field-level access control, optimistic locking for conflict resolution, and comprehensive rate limiting.
- **Code Quality**: Refactored components (e.g., `SuperAdminCRUD`), eliminated code duplication, and introduced reusable components (AdminDialog, AdminForm, AdminTable, SkeletonLoader).
- **Architectural Patterns**: Use of `withTransaction()` for atomic database operations, `ErrorBoundary` for UI resilience, and `asyncHandler` for robust route error catching.

## External Dependencies
- **Database**: PostgreSQL (Neon).
- **Frontend Libraries**: Material-UI (MUI), React Router DOM, Axios, i18next, socket.io-client.
- **Backend Libraries**: Express, Node.js, cors, express-rate-limit.
- **Email Services**: SendGrid/Resend/Gmail (integrated notification system).