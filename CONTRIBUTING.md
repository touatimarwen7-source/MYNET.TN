# Contributing to MyNet.tn

Thank you for your interest in contributing to MyNet.tn! This document provides guidelines and instructions for contributing.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)
- [Testing](#testing)
- [Documentation](#documentation)

## 📜 Code of Conduct

By participating in this project, you agree to maintain a respectful and inclusive environment for all contributors.

## 🚀 Getting Started

### Prerequisites

- Node.js 20+
- npm 10+
- PostgreSQL 15+
- Redis 7+
- Git

### Setup

1. Fork the repository
2. Clone your fork:
   ```bash
   git clone https://github.com/your-username/MYNET.TN.git
   cd MYNET.TN
   ```
3. Install dependencies:
   ```bash
   npm run install:all
   ```
4. Setup environment variables:
   ```bash
   cp .env.example .env
   cp backend/.env.example backend/.env
   cp frontend/.env.example frontend/.env
   ```
5. Start development servers:
   ```bash
   npm run dev
   ```

## 💻 Development Workflow

### Branch Naming

- `feature/feature-name` - New features
- `fix/bug-description` - Bug fixes
- `docs/documentation-update` - Documentation updates
- `refactor/refactoring-description` - Code refactoring
- `test/test-description` - Test additions/updates

### Workflow Steps

1. Create a branch from `develop`:
   ```bash
   git checkout develop
   git pull origin develop
   git checkout -b feature/your-feature-name
   ```

2. Make your changes

3. Test your changes:
   ```bash
   npm test
   npm run lint
   ```

4. Commit your changes (see [Commit Guidelines](#commit-guidelines))

5. Push to your fork:
   ```bash
   git push origin feature/your-feature-name
   ```

6. Create a Pull Request

## 📝 Coding Standards

### JavaScript/TypeScript

- Use ESLint and Prettier configurations
- Follow existing code style
- Use meaningful variable names
- Add comments for complex logic
- Keep functions small and focused

### React Components

- Use functional components with hooks
- Follow component naming conventions (PascalCase)
- Keep components focused and reusable
- Use PropTypes or TypeScript for type checking

### Backend

- Follow RESTful API conventions
- Use async/await for asynchronous operations
- Handle errors properly
- Validate all inputs
- Add proper error messages

## 📝 Commit Guidelines

We follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting)
- `refactor`: Code refactoring
- `test`: Test additions/changes
- `chore`: Build process or auxiliary tool changes

### Examples

```
feat(auth): add MFA support

Add multi-factor authentication support for enhanced security.
Users can now enable MFA in their account settings.

Closes #123
```

```
fix(api): resolve ID validation issue

Fix undefined ID parameter validation in tender routes.
Added validateIdMiddleware to all routes.

Fixes #456
```

## 🔀 Pull Request Process

### Before Submitting

1. Ensure all tests pass
2. Run linter and fix any issues
3. Update documentation if needed
4. Add tests for new features
5. Ensure code follows style guidelines

### PR Template

- **Description**: Clear description of changes
- **Type**: Feature, Bug Fix, Documentation, etc.
- **Testing**: How to test the changes
- **Screenshots**: If UI changes
- **Related Issues**: Link to related issues

### Review Process

- All PRs require at least one approval
- Address review comments promptly
- Keep PRs focused and small when possible
- Update PR description if needed

## 🧪 Testing

### Backend Tests

```bash
cd backend
npm test
```

### Frontend Tests

```bash
cd frontend
npm test
```

### Writing Tests

- Write tests for new features
- Maintain or improve test coverage
- Use descriptive test names
- Test edge cases and error scenarios

## 📚 Documentation

### Code Documentation

- Add JSDoc comments for functions
- Document complex algorithms
- Explain "why" not just "what"

### API Documentation

- Update Swagger/OpenAPI docs
- Document new endpoints
- Include request/response examples

### README Updates

- Update README if setup changes
- Document new features
- Keep examples up to date

## 🐛 Reporting Bugs

### Bug Report Template

- **Description**: Clear description of the bug
- **Steps to Reproduce**: Detailed steps
- **Expected Behavior**: What should happen
- **Actual Behavior**: What actually happens
- **Environment**: OS, Node version, etc.
- **Screenshots**: If applicable

## 💡 Feature Requests

### Feature Request Template

- **Description**: Clear description of the feature
- **Use Case**: Why is this feature needed?
- **Proposed Solution**: How should it work?
- **Alternatives**: Other solutions considered

## 📞 Questions?

- Open an issue for questions
- Check existing documentation
- Review closed issues/PRs

## 🙏 Thank You!

Your contributions make MyNet.tn better for everyone. Thank you for taking the time to contribute!

