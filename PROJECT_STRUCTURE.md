# 🏗️ MyNet.tn - Professional Project Structure

**Version**: 2.0.0  
**Last Updated**: 2025-12-04  
**Status**: ✅ Production Ready

---

## 📁 Project Architecture

```
mynet.tn/
├── 📦 packages/                    # Monorepo packages
│   ├── api/                       # Backend API (Express.js)
│   ├── web/                       # Frontend Web App (React)
│   └── shared/                    # Shared utilities & types
│
├── 🐳 infrastructure/              # Infrastructure & DevOps
│   ├── docker/                    # Docker configurations
│   ├── kubernetes/                 # K8s manifests
│   └── terraform/                 # Infrastructure as Code
│
├── 📚 docs/                       # Documentation
│   ├── api/                       # API documentation
│   ├── architecture/              # Architecture docs
│   ├── deployment/                # Deployment guides
│   └── development/              # Development guides
│
├── 🧪 tests/                      # E2E & Integration tests
│   ├── e2e/                       # End-to-end tests
│   └── integration/               # Integration tests
│
├── 🔧 scripts/                    # Build & utility scripts
│   ├── setup.sh                   # Project setup
│   ├── deploy.sh                  # Deployment script
│   └── migrate.sh                  # Database migration
│
├── 📋 .github/                    # GitHub configurations
│   ├── workflows/                  # CI/CD workflows
│   └── ISSUE_TEMPLATE/            # Issue templates
│
├── ⚙️ config/                     # Global configurations
│   ├── eslint.config.js           # ESLint config
│   ├── prettier.config.js         # Prettier config
│   └── tsconfig.base.json          # TypeScript base config
│
├── 📝 .env.example                 # Environment variables template
├── 🐳 docker-compose.yml           # Docker Compose config
├── 📦 package.json                 # Root package.json (monorepo)
├── 🔒 .gitignore                  # Git ignore rules
├── 📖 README.md                   # Project README
└── 📄 LICENSE                      # License file
```

---

## 📦 Backend Structure (packages/api)

```
packages/api/
├── 📁 src/
│   ├── 🎯 core/                    # Core application logic
│   │   ├── config/                # Configuration files
│   │   ├── database/              # Database setup & migrations
│   │   ├── middleware/            # Express middleware
│   │   └── utils/                 # Utility functions
│   │
│   ├── 🛣️ routes/                  # API routes
│   │   ├── v1/                    # API version 1
│   │   │   ├── auth.routes.js
│   │   │   ├── tenders.routes.js
│   │   │   ├── offers.routes.js
│   │   │   └── ...
│   │   └── index.js               # Route aggregator
│   │
│   ├── 🎮 controllers/             # Route controllers
│   │   ├── auth.controller.js
│   │   ├── tender.controller.js
│   │   └── ...
│   │
│   ├── 💼 services/                # Business logic
│   │   ├── auth.service.js
│   │   ├── tender.service.js
│   │   └── ...
│   │
│   ├── 📊 models/                  # Database models
│   │   ├── User.model.js
│   │   ├── Tender.model.js
│   │   └── ...
│   │
│   ├── 🔐 security/                 # Security modules
│   │   ├── encryption/
│   │   ├── jwt/
│   │   └── mfa/
│   │
│   ├── 📧 jobs/                     # Scheduled jobs
│   │   ├── tender-auto-close.job.js
│   │   └── backup.job.js
│   │
│   └── 🚀 server.js                # Application entry point
│
├── 🧪 tests/                       # Test files
│   ├── unit/
│   ├── integration/
│   └── e2e/
│
├── 📋 package.json                 # Backend dependencies
├── 🐳 Dockerfile                   # Docker image
├── 📝 .env.example                 # Environment template
└── 📖 README.md                    # Backend README
```

---

## 🌐 Frontend Structure (packages/web)

```
packages/web/
├── 📁 src/
│   ├── 🎨 app/                     # Application core
│   │   ├── providers/              # Context providers
│   │   ├── router/                 # Routing configuration
│   │   └── store/                  # State management
│   │
│   ├── 📄 pages/                    # Page components
│   │   ├── auth/                   # Authentication pages
│   │   ├── tenders/                # Tender pages
│   │   ├── offers/                 # Offer pages
│   │   └── admin/                  # Admin pages
│   │
│   ├── 🧩 components/                # Reusable components
│   │   ├── common/                 # Common components
│   │   ├── forms/                  # Form components
│   │   ├── layout/                 # Layout components
│   │   └── features/               # Feature-specific components
│   │
│   ├── 🔌 services/                 # API services
│   │   ├── api/                    # API client
│   │   ├── auth.service.js
│   │   └── tender.service.js
│   │
│   ├── 🎣 hooks/                    # Custom React hooks
│   │   ├── useAuth.js
│   │   ├── useTender.js
│   │   └── ...
│   │
│   ├── 🛠️ utils/                    # Utility functions
│   │   ├── validation/
│   │   ├── formatting/
│   │   └── helpers/
│   │
│   ├── 🎨 theme/                    # Theme configuration
│   │   ├── theme.js
│   │   ├── colors.js
│   │   └── typography.js
│   │
│   ├── 🌍 locales/                  # i18n translations
│   │   └── fr/                     # French translations
│   │
│   ├── 📱 assets/                  # Static assets
│   │   ├── images/
│   │   ├── icons/
│   │   └── fonts/
│   │
│   └── 🚀 main.jsx                 # Application entry point
│
├── 🧪 tests/                       # Test files
│   ├── unit/
│   ├── integration/
│   └── e2e/
│
├── 📋 package.json                 # Frontend dependencies
├── ⚙️ vite.config.js               # Vite configuration
├── 🐳 Dockerfile                   # Docker image
└── 📖 README.md                    # Frontend README
```

---

## 🔧 Configuration Files

### Root Level

- **package.json** - Monorepo workspace configuration
- **docker-compose.yml** - Multi-container Docker setup
- **.env.example** - Environment variables template
- **.gitignore** - Git ignore rules
- **.editorconfig** - Editor configuration
- **.prettierrc** - Prettier configuration
- **.eslintrc.js** - ESLint configuration
- **tsconfig.json** - TypeScript configuration (base)

### Backend (packages/api)

- **.env.example** - Backend environment template
- **Dockerfile** - Backend Docker image
- **.dockerignore** - Docker ignore rules
- **jest.config.js** - Jest test configuration
- **nodemon.json** - Development server config

### Frontend (packages/web)

- **.env.example** - Frontend environment template
- **Dockerfile** - Frontend Docker image
- **vite.config.js** - Vite build configuration
- **vitest.config.js** - Vitest test configuration
- **.eslintrc.js** - ESLint configuration

---

## 🏛️ Architecture Principles

### 1. Separation of Concerns

- **Routes** → Define endpoints only
- **Controllers** → Handle HTTP requests/responses
- **Services** → Business logic
- **Models** → Data access layer

### 2. Scalability

- **Modular structure** → Easy to scale horizontally
- **Microservices-ready** → Can split into services
- **Database sharding** → Ready for large datasets
- **Caching strategy** → Redis for performance

### 3. Maintainability

- **Clear folder structure** → Easy navigation
- **Consistent naming** → Predictable file locations
- **Documentation** → Well-documented code
- **Type safety** → TypeScript support

### 4. Security

- **Layered security** → Multiple security layers
- **Input validation** → All inputs validated
- **Authentication** → JWT + MFA
- **Authorization** → RBAC system

---

## 📊 File Organization Rules

### Naming Conventions

- **Files**: `kebab-case.js` (e.g., `tender-service.js`)
- **Components**: `PascalCase.jsx` (e.g., `TenderCard.jsx`)
- **Constants**: `UPPER_SNAKE_CASE` (e.g., `API_BASE_URL`)
- **Variables**: `camelCase` (e.g., `tenderId`)

### Folder Structure Rules

1. **One feature per folder** → Related files together
2. **Index files** → Export aggregators
3. **Tests co-located** → Tests near source files
4. **Types centralized** → Shared types in `shared/`

---

## 🚀 Deployment Structure

### Production

```
production/
├── api/                            # Backend container
├── web/                            # Frontend container
├── nginx/                          # Reverse proxy
├── postgres/                       # Database container
└── redis/                          # Cache container
```

### Staging

```
staging/
├── api/                            # Backend container
├── web/                            # Frontend container
└── postgres/                       # Database container
```

---

## 📈 Scalability Considerations

### Horizontal Scaling

- **Stateless API** → Can run multiple instances
- **Load balancer** → Distribute traffic
- **Database replication** → Read replicas
- **Cache cluster** → Redis cluster

### Vertical Scaling

- **Resource optimization** → Efficient queries
- **Connection pooling** → Database connections
- **Memory management** → Efficient caching
- **CPU optimization** → Async operations

---

## 🔍 Code Organization Best Practices

### 1. Feature-Based Organization

```
features/
├── tenders/
│   ├── routes/
│   ├── controllers/
│   ├── services/
│   ├── models/
│   └── tests/
└── offers/
    ├── routes/
    ├── controllers/
    ├── services/
    ├── models/
    └── tests/
```

### 2. Layer-Based Organization

```
layers/
├── presentation/                   # Routes & Controllers
├── application/                    # Services & Use Cases
├── domain/                         # Business Logic
└── infrastructure/                 # Database & External APIs
```

---

## ✅ Quality Standards

### Code Quality

- ✅ ESLint configured
- ✅ Prettier configured
- ✅ TypeScript support
- ✅ Test coverage > 80%
- ✅ Code reviews required

### Documentation

- ✅ API documented (Swagger)
- ✅ Code comments
- ✅ README files
- ✅ Architecture docs
- ✅ Deployment guides

---

**Last Updated**: 2025-12-04  
**Maintained By**: MyNet.tn Development Team

