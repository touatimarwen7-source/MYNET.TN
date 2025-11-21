# MyNet.tn - Professional Tendering and Procurement System

## Overview
MyNet.tn is a comprehensive system designed for managing tenders, bids, and government and private procurements specifically for the Tunisian market. The project aims to streamline the procurement process, enhance security, and improve efficiency for both buyers and suppliers. It is currently at an MVP stage, with 75% of the full requirements implemented, focusing on robust security, efficient tender and offer management, and a user-friendly interface. Key capabilities include advanced security features like MFA and IP tracking, smart notification systems, dynamic feature toggling, and server-side PDF generation. The long-term vision is to become the leading platform for professional procurement in Tunisia, offering unparalleled security, transparency, and operational excellence.

## User Preferences
I prefer clear, concise, and structured communication. When suggesting changes or providing explanations, please use simple language and avoid overly technical jargon where possible. I appreciate an iterative development approach, where features are built and reviewed incrementally. Please ask for my approval before making any major architectural changes or implementing new features that significantly deviate from the existing structure. I value detailed explanations for complex technical decisions but also expect you to distill information into actionable summaries. Do not make changes to files outside of the `workspace` directory.

## System Architecture

### UI/UX Decisions
The frontend is built with React 19 and Vite, featuring a full RTL (Right-to-Left) design to cater to the Arabic language market. It includes 9 distinct pages, such as Login, Register, TenderList, TenderDetail, CreateTender, MyOffers, Profile, AuditLog, and PartialAward. The design emphasizes clear navigation, readable error messages, and a permission-based UI that dynamically hides unauthorized buttons, enhancing both security and user experience.

### Technical Implementations
The system follows a microservices-oriented approach with a clear separation between frontend and backend.
- **Backend**: Node.js with Express.js for REST APIs. PostgreSQL (Neon) is used as the database, secured with SSL. Authentication is managed via JWT (1h access, 7d refresh) and Multi-Factor Authentication (MFA) using TOTP. Sensitive data is encrypted with AES-256-GCM, and passwords are hashed using PBKDF2 (1000 iterations). It includes 9 advanced services and 5 organized controllers, exposing 33+ API endpoints. Key security features include IP Address Tracking in audit logs and RBAC with 5 defined roles.
- **Frontend**: React 19 with Vite, using React Router v6 for navigation and Axios for HTTP requests with interceptors. Security measures include XSS Protection, session management, and permission validation. Secure token storage is implemented in memory.

### Feature Specifications
- **Advanced Security**: JWT with refresh mechanism, PBKDF2, AES-256-GCM, TOTP-based MFA, IP Address Tracking, RBAC (5 roles), XSS protection, and secure session management.
- **Tender Management**: CRUD operations for tenders, filtering, secure unique ID generation, publishing/closing, prevention of modification after the first offer, and tender history with soft delete.
- **Offer Management**: CRUD operations for offers, evaluation, winner selection, rejection, server-time check before decryption, and a 1-5 star supplier rating system.
- **Search**: Advanced filtering and pagination for tenders and suppliers.
- **Smart Targeted Notifications**: Notifications filtered by preferred categories, location, budget, and supplier verification status.
- **Feature Flags**: Dynamic toggling of features like ERP Integration, Payment Processing, Audit Logging, and Caching without redeployment.
- **Subscription & Features System**: Manages 9 advanced supplier features, analytics, ERP integration, alerts, and admin controls.
- **PDF Generation**: Server-side generation of tender documents, evaluation reports, award certificates, and transaction reports.

### System Design Choices
The project structure is modular, separating backend, frontend, and documentation. The backend includes dedicated modules for configuration, security (KeyManagementService, AuthorizationGuard, MFAValidator), middleware (errorHandler, ipMiddleware), models, services, controllers, and routes. The frontend is organized into pages, utilities (security, token storage), and core application files.

## External Dependencies
- **Database**: PostgreSQL (specifically Neon for managed PostgreSQL).
- **Backend Framework**: Node.js and Express.js.
- **Frontend Framework**: React 19 and Vite.
- **HTTP Client**: Axios.
- **Authentication**: JSON Web Tokens (JWT) for token management, TOTP for Multi-Factor Authentication.
- **Encryption**: AES-256-GCM.
- **Hashing**: PBKDF2.
- **Monitoring/Logging**: Integrated Audit Logs with IP tracking.