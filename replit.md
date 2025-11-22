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
    - **Token Management**: Access tokens in localStorage + memory, httpOnly cookie refresh tokens, automatic token refresh, and XSS protection.
    - **CSRF Protection**: `CSRFProtection.js` utility with token generation, meta tag storage, `X-CSRF-Token` headers, and frontend validation.
    - **Content Security Policy (CSP)**: Comprehensive meta tag directives for various content sources and `upgrade-insecure-requests`.
    - **Additional Security Headers**: Includes `X-Content-Type-Options: nosniff`, `X-Frame-Options: SAMEORIGIN`, and others for robust protection.
    - **Token Expiration**: Request interceptor checks validity, redirects on expiry, and cleans up expired tokens.
- **Error Handling**: `ErrorBoundary.jsx` for React errors, `ErrorFallback.jsx` UI, and `axiosConfig.js` for API error handling (retry, 401/403 redirects). A comprehensive error codes system (`errorCodes.js`) with 30+ French error codes categorized by type (Authentication, Validation, Network, Business Logic, File, System) and mapped to HTTP status codes.
- **Data Validation**: Zod library is used for schema-based validation (e.g., `LoginSchema`, `RegisterSchema`, `TenderSchema`).
- **Request Caching**: `axiosConfig.js` implements a 5-minute cache for GET requests with network error fallback.
- **Admin Interface**: A Super-Admin Interface (`AdminDashboard`) provides comprehensive user & role management, dynamic content editing, system configuration (maintenance mode, email notifications, auto backup, 2FA, cache control, API rate limiting), and real-time analytics. This interface features role-based access control with support for both 'admin' and 'super_admin' roles.

### Super Admin Dashboard - Total Control Hub
Complete admin dashboard with 5 main sections:

**1. AdminDashboard** - Central hub with tabbed interface
- 4 main tabs: Users & Roles, Content Manager, System Configuration, Analytics
- 100% Material-UI design
- Responsive layout

**2. User & Role Management**
- User table with search and pagination
- Direct role editing (Buyer → Supplier → Admin → Super-Admin)
- Block/Unblock user accounts
- Password reset functionality
- Permanent user deletion

**3. Content Manager**
- Edit static pages (About, Terms, Privacy)
- File upload with management
- No deployment needed for changes
- Professional upload interface

**4. System Configuration**
- 6 Toggle Controls:
  - Maintenance Mode
  - Email Notifications
  - Auto Backup
  - Two-Factor Authentication
  - Cache Enabled
- Advanced Options:
  - API Rate Limit configuration
  - Cache cleanup button
  - System restart button
- System Information Display:
  - Version, Health Status, Active Users, Last Backup

**5. Admin Analytics**
- Key Statistics:
  - Active Users
  - Open Tenders
  - Submitted Offers
  - System Errors
- Resource Monitoring:
  - CPU Usage
  - Memory Usage
  - Storage Usage
  - Bandwidth Usage
- Recent Activities Log

### System Design Choices
- **Single Source of Truth**: `theme.js` for styles, `tokenManager.js` for token handling, and `axiosConfig.js` for API interaction.
- **Modular Components**: The frontend consists of 91+ modular JSX components and 90+ lazy-loaded pages.
- **Material-UI & React Router Compatibility**: Grid components are migrated to MUI v2 API, and React Router v7 future flags are configured for compatibility.
- **Role-Based Access Control**: Support for multiple roles with automatic routing:
  - super_admin → /admin dashboard
  - admin → /admin dashboard
  - buyer → /buyer-dashboard
  - supplier → /supplier-search
- **Documentation**: Comprehensive `DOCUMENTATION.md` provides an overview of the error handling system, error codes reference, JSDoc standards, contributing guidelines, and more.

## Recent Changes (Latest Session)

### Fixed Issues
1. **Fixed UpgradeModal crash** - Added missing `currentTier` to `useSubscriptionTier` hook state
2. **Resolved token storage issues** - Implemented localStorage with memory fallback for Replit iframe environment
3. **Enhanced login error logging** - Added detailed response and status information for debugging
4. **Simplified public endpoint detection** - Prevents blocking login/register requests in axios interceptor
5. **Fixed super_admin role recognition** - Updated Sidebar and App.jsx routing to recognize both 'admin' and 'super_admin' roles
6. **Improved login redirect logic** - Super Admin redirects to /admin dashboard after login, not /tenders
7. **Enabled super_admin access to all admin routes** - All admin routes now accept both 'admin' and 'super_admin' roles

### Super Admin Credentials
- Email: **superadmin@mynet.tn**
- Password: **SuperAdmin@123456**
- Role: **super_admin** (stored in database)

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

## Testing Instructions

### Super Admin Dashboard Access
1. Navigate to login page
2. Enter Super Admin credentials:
   - Email: superadmin@mynet.tn
   - Password: SuperAdmin@123456
3. Upon successful login, redirected to /admin dashboard
4. Access 5 main sections via tabs

### Component Status
- ✅ AdminDashboard - Fully implemented with tabbed interface
- ✅ UserRoleManagement - Complete with CRUD operations
- ✅ ContentManager - File upload and page editing
- ✅ SystemConfig - 6 toggle controls + advanced options
- ✅ AdminAnalytics - Stats and resource monitoring

## Deployment Notes
- Frontend runs on port 5000 (allowedHosts enabled)
- Backend runs on port 3000
- All styles controlled through theme.js
- No inline CSS or separate CSS files
- 100% Material-UI components
