# Nexus Gaming News

Modern platform for managing and publishing video game content. Complete
administration interface for managing articles, games, and system announcements.

## Project Status

- **Version**: 1.0.0
- **Status**: Active Development
- **Last Update**: April 2025

## Prerequisites

- Node.js (>= 20.0.0)
- PostgreSQL (>= 15.0)
- NPM (>= 10.0.0)

## Quick Start

1. Clone the repository

```bash
git clone git@github.com:your-org/nexus-gaming.git
cd nexus-gaming
```

2. Install dependencies

```bash
npm install
```

3. Configure environment

```bash
cp .env.example .env
# Edit .env with your configurations
```

4. Initialize database

```bash
npx prisma migrate dev
npm run db:seed
```

5. Start development server

```bash
npm run dev
```

## Project Structure

```
src/
├── app/          # Pages and routes (Next.js App Router)
├── components/   # React components
├── hooks/        # Custom hooks
├── lib/          # Utilities and configurations
├── providers/    # React providers
└── types/        # TypeScript types
```

## Architecture

### Frontend

- Next.js 15 with App Router
- Material UI v7
- React Query for state management
- Modular component system

### Backend

- Next.js API Routes
- Prisma ORM
- PostgreSQL
- JWT Authentication

## Database

### Core Models

- Users
- Articles (News and reviews)
- Games
- Categories
- Companies
- Platforms
- Announcements

## Core Commands

### Development

```bash
npm run dev          # Development server
npm run lint         # Code checking
npm run format       # Code formatting
```

### Database

```bash
npm run db:migrate   # Apply migrations
npm run db:seed     # Seed database
npm run db:clean    # Reset database
```

### Production

```bash
npm run build       # Build
npm start          # Production start
```

## Code Standards

- Strict TypeScript
- Custom ESLint config
- Prettier formatting
- Conventional commits

## Testing

```bash
npm run test        # Run tests
npm run test:watch  # Watch mode
npm run test:e2e    # End-to-end tests
```

## Key Considerations

- Required environment variables setup
- Up-to-date database migrations
- Cache and upload folder permissions
- Cloudinary configuration for media

## Resources

- [Technical Documentation](docs/technical.md)
- [Contributing Guide](CONTRIBUTING.md)
- [Changelog](CHANGELOG.md)

## Contact

- **Team**: Nexus Gaming Team
- **Email**: team@nexus-gaming.com

## License

This project is licensed under the MIT License. See [LICENSE](LICENSE) file for
details.
