# 📚 API Documentation - MyNet.tn

## Overview

Complete API reference for MyNet.tn Backend API. All endpoints are RESTful and return JSON responses.

**Base URL**: `http://localhost:3000/api`

**API Version**: v1

---

## 🔐 Authentication

Most endpoints require authentication via JWT tokens.

### Getting a Token

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response**:
```json
{
  "success": true,
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "role": "buyer"
  }
}
```

### Using the Token

Include the token in the Authorization header:

```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## 📖 API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/refresh-token` - Refresh access token
- `POST /api/auth/logout` - Logout user
- `POST /api/auth/password-reset` - Request password reset
- `POST /api/auth/verify-email` - Verify email address

### Procurement

- `GET /api/procurement/tenders` - List tenders
- `POST /api/procurement/tenders` - Create tender
- `GET /api/procurement/tenders/:id` - Get tender details
- `PUT /api/procurement/tenders/:id` - Update tender
- `POST /api/procurement/tenders/:id/publish` - Publish tender
- `POST /api/procurement/tenders/:id/close` - Close tender

- `POST /api/procurement/offers` - Submit offer
- `GET /api/procurement/offers/:id` - Get offer details
- `POST /api/procurement/offers/:id/evaluate` - Evaluate offer

### Admin

- `GET /api/admin/users` - List users
- `GET /api/admin/statistics` - Get statistics
- `PUT /api/admin/users/:id` - Update user
- `DELETE /api/admin/users/:id` - Delete user

### Super Admin

- `GET /api/super-admin/pages` - List static pages
- `POST /api/super-admin/pages` - Create page
- `GET /api/super-admin/backups` - List backups
- `POST /api/super-admin/backups/restore` - Restore backup

---

## 📊 Swagger Documentation

Interactive API documentation is available at:

**Development**: http://localhost:3000/api-docs

The Swagger UI provides:
- Complete endpoint documentation
- Request/response schemas
- Try-it-out functionality
- Authentication testing

---

## 🔍 API Versioning

Currently using version 1 (v1). Future versions will be accessible via:

- `/api/v1/...` - Version 1
- `/api/v2/...` - Version 2 (future)

---

## 📝 Request/Response Format

### Request Format

All requests should include:
- `Content-Type: application/json` header
- JSON body for POST/PUT requests
- Query parameters for GET requests

### Response Format

**Success Response**:
```json
{
  "success": true,
  "data": { ... },
  "message": "Operation successful"
}
```

**Error Response**:
```json
{
  "success": false,
  "error": "Error message",
  "code": "ERROR_CODE"
}
```

---

## 🚦 Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

---

## 📚 Additional Resources

- [Admin API Documentation](../ADMIN_API.md) - Complete admin endpoints
- [Security Guide](../SECURITY_INTEGRATION_GUIDE.md) - Security best practices
- [Testing Guide](../TESTING_GUIDE.md) - API testing guide

---

**Last Updated**: 2025-12-04

