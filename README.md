# Nexus Gaming 🎮

[![Next.js](https://img.shields.io/badge/Next.js-15.0-black?style=flat&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-5.10-2D3748?style=flat&logo=prisma)](https://www.prisma.io/)
[![Chakra UI](https://img.shields.io/badge/Chakra%20UI-2.8-319795?style=flat&logo=chakra-ui)](https://chakra-ui.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

> Modern gaming platform for managing and discovering video games with an
> advanced article and review system.

## ✨ Features

- 🎯 **Complete Game Management** - Detailed game pages, categorization,
  developer/publisher associations
- 📝 **Article System** - Article publishing with approval workflow
- 👥 **User Profiles** - Profile management with gaming social network
  integration
- 🎨 **Modern Interface** - Responsive design with light/dark theme
- 🔐 **Robust Authentication** - Complete system with role management
- 🌐 **RESTful API** - Modern architecture with Next.js API routes
- 🔄 **Content Management** - Complete CRUD system for all content types
- 📊 **Administration** - Comprehensive admin interface

## 🛠️ Technical Stack

- **Framework**: [Next.js 15](https://nextjs.org/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **ORM**: [Prisma](https://www.prisma.io/) with PostgreSQL
- **UI**: [Chakra UI](https://chakra-ui.com/)
- **State**: [TanStack Query](https://tanstack.com/query)
- **Auth**: JWT with bcrypt
- **Validation**: [Zod](https://zod.dev/)
- **Testing**: Jest & React Testing Library
- **Linting**: ESLint & Prettier

## 🚀 Installation

### Prerequisites

- Node.js v20+
- PostgreSQL 15+
- Docker (optional)

### Standard Method

1. **Clone the repository**

```bash
git clone <repository-url>
cd nexus-gaming
```

2. **Install dependencies**

```bash
npm install
```

3. **Configuration**

```bash
cp .env.example .env
```

Configure environment variables in .env:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/nexus-gaming"
JWT_SECRET="your-jwt-secret"
CLOUDINARY_URL="your-cloudinary-url"
```

4. **Initialize database**

```bash
npx prisma migrate dev
npm run db:seed
```

5. **Start the application**

```bash
npm run dev
```

### Docker Method

1. **Build and start containers**

```bash
docker-compose up -d
```

The application will be available at
[http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
nexus-gaming/
├── prisma/                 # Prisma schema and migrations
├── public/                 # Static files
└── src/
    ├── app/               # Next.js routes and pages
    │   ├── admin/        # Admin interface
    │   ├── api/          # API routes
    │   └── [...]/        # Other routes
    ├── components/        # React components
    │   ├── admin/        # Admin components
    │   ├── common/       # Reusable components
    │   └── [...]/        # Other components
    ├── hooks/            # Custom hooks
    ├── lib/              # Utilities and configurations
    ├── providers/        # React providers
    └── types/            # TypeScript types
```

## 📊 Data Models

### Main Entities

- **User**: User management and authentication
- **Game**: Game information
- **Article**: Articles and reviews
- **Company**: Developers and publishers
- **Platform**: Gaming platforms
- **Category**: Content categorization
- **AdminAnnouncement**: System announcements

[View complete Prisma schema](prisma/schema.prisma)

## 📝 Available Scripts

- `npm run dev`: Development mode
- `npm run build`: Production build
- `npm run start`: Start production server
- `npm run lint`: Check code
- `npm run format`: Format code
- `npm run db:clean`: Reset database
- `npm run type-check`: Check types

## 👥 Contributing

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Commit Conventions

We use [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: new feature
fix: bug fix
docs: documentation
style: formatting
refactor: code refactoring
test: adding/updating tests
chore: maintenance
```

## 📜 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file
for details.

## 🤝 Support

For questions or issues:

1. Check the [documentation](docs/)
2. Open an [issue](issues/)
3. Contact the development team

---

Made with ❤️ by the Nexus Gaming Team
