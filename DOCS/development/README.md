# 💻 Development Guide - MyNet.tn

## Getting Started

### Prerequisites

- Node.js 20+
- npm 10+
- PostgreSQL 15+ (or Neon PostgreSQL)
- Redis 7+
- Git

### Initial Setup

```bash
# 1. Clone repository
git clone https://github.com/touatimarwen7-source/MYNET.TN.git
cd MYNET.TN

# 2. Install dependencies
npm run install:all

# 3. Setup environment
cp .env.example .env
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env

# Edit .env files with your configuration

# 4. Start database services (Docker)
docker-compose up -d postgres redis

# 5. Run migrations
cd backend
npm run migrate

# 6. Start development servers
cd ..
npm run dev
```

---

## 🛠️ Development Workflow

### Running Development Servers

```bash
# Both backend and frontend
npm run dev

# Backend only
npm run dev:backend
# or
cd backend && npm run dev

# Frontend only
npm run dev:frontend
# or
cd frontend && npm run dev
```

### Backend Development

```bash
cd backend

# Start with nodemon (auto-reload)
npm run dev:watch

# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Lint code
npm run lint

# Fix linting issues
npm run lint:fix
```

### Frontend Development

```bash
cd frontend

# Start dev server
npm run dev

# Run tests
npm test

# Build for production
npm run build

# Preview production build
npm run preview
```

---

## 📝 Code Standards

### JavaScript/TypeScript

- Use ESLint and Prettier
- Follow existing code style
- Use meaningful variable names
- Add comments for complex logic

### React Components

- Use functional components with hooks
- Follow PascalCase for component names
- Keep components focused and reusable
- Use PropTypes or TypeScript

### Backend

- Follow RESTful API conventions
- Use async/await for async operations
- Handle errors properly
- Validate all inputs

---

## 🧪 Testing

### Backend Tests

```bash
cd backend
npm test
```

Test files location: `backend/tests/`

### Frontend Tests

```bash
cd frontend
npm test
```

Test files location: `frontend/src/__tests__/`

### Writing Tests

- Write tests for new features
- Maintain test coverage > 80%
- Use descriptive test names
- Test edge cases

---

## 🔍 Debugging

### Backend Debugging

```bash
# Enable debug logging
DEBUG=* npm run dev

# Check logs
tail -f backend/logs/app.log
```

### Frontend Debugging

- Use React DevTools
- Check browser console
- Use Vite dev tools
- Check network tab

---

## 📚 Project Structure

### Backend

```
backend/
├── routes/          # API routes
├── controllers/     # Route handlers
├── services/        # Business logic
├── models/          # Database models
├── middleware/      # Express middleware
├── config/          # Configuration
└── utils/           # Utilities
```

### Frontend

```
frontend/src/
├── pages/           # Page components
├── components/      # Reusable components
├── services/        # API services
├── hooks/           # Custom hooks
├── utils/           # Utilities
└── theme/           # Theme configuration
```

---

## 🔄 Git Workflow

### Branch Naming

- `feature/feature-name` - New features
- `fix/bug-description` - Bug fixes
- `docs/documentation-update` - Documentation
- `refactor/refactoring-description` - Refactoring

### Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
feat(auth): add MFA support
fix(api): resolve ID validation issue
docs(readme): update setup instructions
```

---

## 🐛 Common Issues

### Port Already in Use

```bash
# Find process using port
netstat -ano | findstr :3000

# Kill process (Windows)
taskkill /PID <PID> /F
```

### Database Connection Failed

1. Check DATABASE_URL in `.env`
2. Verify database is running
3. Check network connectivity
4. Review database logs

### Module Not Found

```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

---

## 📖 Additional Resources

- [API Documentation](../api/README.md)
- [Architecture Guide](../architecture/README.md)
- [Deployment Guide](../deployment/README.md)
- [Contributing Guide](../../CONTRIBUTING.md)

---

**Last Updated**: 2025-12-04

