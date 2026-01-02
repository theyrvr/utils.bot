# Contributing to Utils.Bot

Thank you for your interest in contributing to Utils.Bot! This guide will help you get started.

## Getting Started

1. **Fork the repository** on GitHub
2. **Clone your fork** locally
3. **Create a branch** for your changes
4. **Make your changes** and commit them
5. **Push to your fork** and submit a pull request

## Development Setup

### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- Discord Bot Token

### Setup Steps

1. Run the setup script:
   ```bash
   ./setup.sh
   ```

2. Or manually:
   ```bash
   # Backend
   cd backend
   npm install
   cp .env.example .env
   # Edit .env with your configuration
   npm run prisma:generate
   npm run prisma:push
   
   # Frontend
   cd ../frontend
   npm install
   cp .env.example .env.local
   # Edit .env.local with your configuration
   ```

3. Start development servers:
   ```bash
   # Terminal 1 - Backend
   cd backend
   npm run dev
   
   # Terminal 2 - Frontend
   cd frontend
   npm run dev
   ```

## Code Style

### TypeScript
- Use TypeScript for all new code
- Follow existing code patterns
- Add types for all functions and variables
- Use meaningful variable names

### Formatting
- Use 2 spaces for indentation
- Use single quotes for strings
- Add semicolons
- Keep lines under 100 characters when possible

### Comments
- Add JSDoc comments for functions
- Explain complex logic
- Keep comments up to date

## Project Structure

### Backend
```
backend/
├── src/
│   ├── api/          # Express API routes
│   ├── bot/          # Discord bot logic
│   │   ├── handlers/ # Interaction handlers
│   │   └── services/ # Business logic
│   └── utils/        # Utilities
├── prisma/           # Database schema
└── tests/            # Tests (if added)
```

### Frontend
```
frontend/
├── src/
│   ├── app/          # Next.js pages
│   ├── components/   # React components
│   ├── lib/          # Utilities
│   ├── types/        # TypeScript types
│   └── styles/       # CSS
```

## Making Changes

### Adding Features

1. **Backend Features:**
   - Update Prisma schema if needed
   - Add/update bot handlers
   - Add/update API routes
   - Update types

2. **Frontend Features:**
   - Create/update components
   - Update API client
   - Update types
   - Add styles

### Bug Fixes

1. Identify the issue
2. Create a test case if possible
3. Fix the bug
4. Test thoroughly
5. Document the fix

### Database Changes

1. Update `backend/prisma/schema.prisma`
2. Run `npm run prisma:generate`
3. Run `npm run prisma:push` or create migration
4. Update affected code
5. Document changes

## Testing

Currently, the project doesn't have automated tests. When adding tests:

1. Use Jest for unit tests
2. Test critical functionality
3. Add integration tests for API
4. Test Discord interactions

## Pull Request Process

1. **Update Documentation**
   - Update README if needed
   - Add comments to complex code
   - Update CHANGELOG (if exists)

2. **Check Your Code**
   - Ensure it builds without errors
   - Test all functionality
   - Check for console errors
   - Verify no sensitive data is committed

3. **Commit Messages**
   - Use clear, descriptive messages
   - Reference issues if applicable
   - Follow conventional commits format:
     - `feat:` New feature
     - `fix:` Bug fix
     - `docs:` Documentation
     - `style:` Formatting
     - `refactor:` Code refactoring
     - `test:` Tests
     - `chore:` Maintenance

4. **Submit PR**
   - Provide clear description
   - List all changes
   - Reference related issues
   - Add screenshots if UI changes

## Code Review

- Be open to feedback
- Respond to comments promptly
- Make requested changes
- Keep discussions professional

## Areas to Contribute

### High Priority
- [ ] Add automated tests
- [ ] Improve error handling
- [ ] Add rate limiting
- [ ] Optimize database queries
- [ ] Add caching

### Features
- [ ] Multi-language support
- [ ] Advanced analytics
- [ ] Ticket templates
- [ ] Auto-responses
- [ ] SLA tracking
- [ ] Custom themes

### Documentation
- [ ] API documentation
- [ ] Video tutorials
- [ ] Deployment guides
- [ ] Troubleshooting guides

## Community

- Be respectful and inclusive
- Help others when possible
- Report issues clearly
- Suggest improvements constructively

## Questions?

- Open an issue for bugs
- Start a discussion for questions
- Check existing issues first

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to Utils.Bot! 🎫
