# 🏗️ Architecture Documentation - MyNet.tn

## Overview

This document describes the architecture and design decisions of the MyNet.tn platform.

---

## 🎯 Architecture Principles

### 1. Separation of Concerns

- **Routes** → Define endpoints only
- **Controllers** → Handle HTTP requests/responses
- **Services** → Business logic
- **Models** → Data access layer

### 2. Scalability

- Stateless API design
- Database connection pooling
- Redis caching
- Horizontal scaling ready

### 3. Security

- Multi-layer security
- Input validation at all layers
- AES-256 encryption for sensitive data
- JWT authentication with refresh tokens

---

## 📐 System Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Frontend (React)                     │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐            │
│  │  Pages   │  │Components│  │ Services │            │
│  └──────────┘  └──────────┘  └──────────┘            │
└──────────────────────┬────────────────────────────────┘
                       │ HTTP/REST API
                       │ WebSocket
┌──────────────────────▼────────────────────────────────┐
│              Backend API (Express.js)                  │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐            │
│  │ Routes   │→ │Controllers│→│ Services │            │
│  └──────────┘  └──────────┘  └──────────┘            │
│       │              │              │                  │
│       └──────────────┴──────────────┘                 │
│                      │                                 │
│              ┌───────▼────────┐                        │
│              │    Models      │                        │
│              └───────┬────────┘                        │
└──────────────────────┼────────────────────────────────┘
                       │
        ┌──────────────┼──────────────┐
        │              │              │
┌───────▼────┐  ┌─────▼─────┐  ┌────▼─────┐
│ PostgreSQL │  │   Redis   │  │  Sentry   │
│  Database  │  │   Cache   │  │ Monitoring│
└────────────┘  └───────────┘  └───────────┘
```

---

## 🗄️ Database Architecture

### Schema Design

- **22 tables** with proper relationships
- **Normalized structure** (3NF)
- **Soft deletes** for data retention
- **Audit logging** for compliance

### Key Tables

1. **users** - User accounts and authentication
2. **tenders** - Procurement tenders
3. **offers** - Supplier offers
4. **purchase_orders** - Purchase orders
5. **invoices** - Invoices
6. **audit_logs** - Audit trail

### Relationships

```
users (1) ──→ (N) tenders (buyer_id)
users (1) ──→ (N) offers (supplier_id)
tenders (1) ──→ (N) offers
offers (1) ──→ (N) purchase_orders
purchase_orders (1) ──→ (N) invoices
```

---

## 🔐 Security Architecture

### Authentication Flow

```
User Login
    ↓
Email/Password Validation
    ↓
JWT Token Generation
    ↓
Token Stored (httpOnly Cookie)
    ↓
Token Validation (Middleware)
    ↓
Request Authorized
```

### Authorization

- **Role-Based Access Control (RBAC)**
- **Permission-based access**
- **Resource ownership checks**

### Encryption

- **AES-256** for sensitive data
- **bcryptjs** for password hashing
- **SSL/TLS** for data in transit

---

## ⚡ Performance Architecture

### Caching Strategy

- **Redis** for API response caching
- **100+ endpoints** cached
- **TTL-based expiration**
- **Cache invalidation** on updates

### Database Optimization

- **Connection pooling** (15 max connections)
- **Query optimization** with indexes
- **Batch operations** where applicable
- **Pagination** on all list endpoints

### Frontend Optimization

- **Code splitting** (lazy loading)
- **Image optimization**
- **Bundle size optimization**
- **Memoization** for components

---

## 🔄 Data Flow

### Tender Creation Flow

```
Buyer creates tender
    ↓
Frontend: CreateTenderWizard.jsx
    ↓
API: POST /api/procurement/tenders
    ↓
Controller: TenderController.create()
    ↓
Service: TenderService.createTender()
    ↓
Model: TenderModel.insert()
    ↓
Database: INSERT INTO tenders
    ↓
Response: Tender created
    ↓
Notification: Suppliers notified
```

---

## 📦 Component Architecture

### Backend Layers

1. **Routes Layer** - Endpoint definitions
2. **Middleware Layer** - Auth, validation, logging
3. **Controller Layer** - Request handling
4. **Service Layer** - Business logic
5. **Model Layer** - Data access

### Frontend Layers

1. **Pages** - Route components
2. **Components** - Reusable UI components
3. **Services** - API clients
4. **Hooks** - Custom React hooks
5. **Utils** - Utility functions

---

## 🚀 Deployment Architecture

### Development

```
Local Machine
├── Frontend (Vite Dev Server)
├── Backend (Node.js)
├── PostgreSQL (Local/Docker)
└── Redis (Local/Docker)
```

### Production

```
Load Balancer
    ↓
┌───────────┬───────────┐
│  Frontend │  Frontend │ (Multiple instances)
└───────────┴───────────┘
    ↓
┌───────────┬───────────┐
│  Backend  │  Backend  │ (Multiple instances)
└───────────┴───────────┘
    ↓
┌───────────┬───────────┐
│ PostgreSQL│  Redis    │
│ (Primary)  │  (Cache)  │
└───────────┴───────────┘
```

---

## 📊 Monitoring & Observability

### Logging

- **Winston** for structured logging
- **Log levels**: error, warn, info, debug
- **File rotation** for log management

### Error Tracking

- **Sentry** integration
- **Error aggregation**
- **Performance monitoring**

### Metrics

- **Request metrics**
- **Database query metrics**
- **Cache hit/miss rates**

---

## 🔄 Workflow Architecture

### Tender Lifecycle

```
draft → published → closed → awarded
```

### Offer Lifecycle

```
submitted → evaluated → accepted/rejected
```

---

## 📚 Additional Resources

- [Project Structure](../../PROJECT_STRUCTURE.md)
- [Security Guide](../SECURITY_INTEGRATION_GUIDE.md)
- [Deployment Guide](../deployment/README.md)

---

**Last Updated**: 2025-12-04

