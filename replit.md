# MyNet.tn - B2B Procurement Platform

## Overview
MyNet.tn is a production-ready B2B procurement platform for the private sector, designed with a unified institutional theme and enterprise-grade security. Its purpose is to provide a robust, secure, and efficient solution for B2B transactions, featuring a clean, professional user experience. Key capabilities include secure user authentication, dynamic content display, optimized performance, and comprehensive security hardening. The platform aims to minimize developer intervention in daily operations through a comprehensive Super-Admin Interface, enhancing operational independence and efficiency.

## User Preferences
I prefer simple language and clear explanations. I want iterative development with small, testable changes. Please ask before making any major architectural changes or introducing new dependencies. I prefer detailed explanations for complex logic. I prefer that the agent works in the `/frontend` directory and does not make changes in the `/backend` directory.

## System Architecture
The platform utilizes a React frontend (Vite) and a Node.js backend.

### UI/UX Decisions
- **Design Principle**: All styles are defined via `frontend/src/theme/theme.js`, with minimal `index.css` for global resets.
- **Framework**: Exclusive use of Material-UI (MUI v7.3.5) for all components, adhering to a flat design with no shadows or gradients.
- **Color Palette**: Fixed institutional colors: `#0056B3` (primary blue), `#F9F9F9` (background), `#212121` (text).
- **Styling**: Uniform 4px border radius, 8px grid-based spacing, and standardized Roboto font.
- **Loading States**: Enhanced with `LoadingSpinner.jsx` and `LoadingSkeletons.jsx` for various component types.
- **Pagination**: Implemented with `Pagination.jsx` for efficient data display.

### Technical Implementations
- **Code-Splitting & Optimization**: Achieved with `React.lazy()` and `Suspense`, utilizing manual chunks for core libraries and APIs.
- **Security Architecture**:
    - **Token Management**: Access tokens in memory (sessionStorage fallback), httpOnly cookie refresh tokens, automatic token refresh, and XSS protection.
    - **CSRF Protection**: `CSRFProtection.js` utility with token generation, meta tag storage, `X-CSRF-Token` headers, and frontend validation.
    - **Content Security Policy (CSP)**: Comprehensive meta tag directives for various content sources and `upgrade-insecure-requests`.
    - **Additional Security Headers**: Includes `X-Content-Type-Options: nosniff`, `X-Frame-Options: SAMEORIGIN`, and others for robust protection.
    - **Token Expiration**: Request interceptor checks validity, redirects on expiry, and cleans up expired tokens.
- **Error Handling**: `ErrorBoundary.jsx` for React errors, `ErrorFallback.jsx` UI, and `axiosConfig.js` for API error handling (retry, 401/403 redirects). A comprehensive error codes system (`errorCodes.js`) with 30+ French error codes categorized by type (Authentication, Validation, Network, Business Logic, File, System) and mapped to HTTP status codes.
- **Data Validation**: Zod library is used for schema-based validation (e.g., `LoginSchema`, `RegisterSchema`, `TenderSchema`).
- **Request Caching**: `axiosConfig.js` implements a 5-minute cache for GET requests with network error fallback.
- **Admin Interface**: A Super-Admin Interface (`AdminDashboard`) provides comprehensive user & role management, dynamic content editing, system configuration (maintenance mode, email notifications, auto backup, 2FA, cache control, API rate limiting), and real-time analytics. This interface features role-based access control.

### System Design Choices
- **Single Source of Truth**: `theme.js` for styles, `tokenManager.js` for token handling, and `axiosConfig.js` for API interaction.
- **Modular Components**: The frontend consists of 91 modular JSX components and 90+ lazy-loaded pages.
- **Material-UI & React Router Compatibility**: Grid components are migrated to MUI v2 API, and React Router v7 future flags are configured for compatibility.
- **Documentation**: Comprehensive `DOCUMENTATION.md` provides an overview of the error handling system, error codes reference, JSDoc standards, contributing guidelines, and more.

## External Dependencies
- **Material-UI (MUI v7.3.5)**: Frontend UI component library.
- **React**: Frontend JavaScript library.
- **Vite 7.2.4**: Frontend build tool.
- **Node.js 20**: Backend runtime environment.
- **Axios**: HTTP client for API requests.
- **Zod**: TypeScript-first schema declaration and validation library.
- **i18n**: Internationalization library.
- **Vitest 1.6.1**: Unit testing framework.
- **ESLint 9+**: Code quality linting.