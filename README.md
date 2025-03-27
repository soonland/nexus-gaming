# Nexus Gaming

Plateforme de gestion de fiches de jeux vidéo avec critiques et articles.

## Technologies

### Backend
- Fastify
- Prisma (PostgreSQL)
- TypeScript
- JWT Authentication

### Frontend
- Vite
- React
- Chakra UI
- TanStack Query
- TypeScript

## Configuration requise

- Node.js v20+
- PostgreSQL 15+
- Docker (optionnel)

## Installation

1. Cloner le dépôt :
```bash
git clone <repository-url>
cd nexus-gaming
```

2. Installer les dépendances :
```bash
npm install
```

3. Configuration des variables d'environnement :
```bash
# Backend
cd packages/backend
cp .env.example .env
# Modifier les variables selon votre environnement

# Frontend
cd ../frontend
cp .env.example .env
# Modifier les variables selon votre environnement
```

4. Initialiser la base de données :
```bash
cd ../backend
npx prisma migrate dev
```

## Démarrage

### Avec Docker :
```bash
docker-compose up
```

### Sans Docker :

1. Démarrer le backend :
```bash
npm run dev --workspace=@nexus-gaming/backend
```

2. Démarrer le frontend :
```bash
npm run dev --workspace=@nexus-gaming/frontend
```

L'application sera accessible à :
- Frontend : http://localhost:5173
- Backend : http://localhost:3000
- Documentation API : http://localhost:3000/documentation

## Structure du projet

```
nexus-gaming/
├── packages/
│   ├── backend/             # API Fastify
│   │   ├── src/
│   │   │   ├── routes/     # Routes API
│   │   │   ├── plugins/    # Plugins Fastify
│   │   │   └── prisma/     # Configuration Prisma
│   │   └── tests/
│   └── frontend/           # Application React
│       ├── src/
│       │   ├── components/ # Composants React
│       │   ├── pages/      # Pages de l'application
│       │   ├── hooks/      # Hooks personnalisés
│       │   └── services/   # Services (API, etc.)
│       └── public/
```

## Fonctionnalités

- Gestion des jeux vidéo (CRUD)
- Système de critiques avec notes
- Rédaction d'articles
- Association d'articles aux jeux
- Authentification utilisateur
- Gestion des rôles (User/Admin)
- Interface responsive avec thème clair/sombre

## Scripts disponibles

- `npm run dev` : Démarre l'application en mode développement
- `npm run build` : Compile l'application pour la production
- `npm run lint` : Vérifie le code avec ESLint
- `npm run test` : Lance les tests

## Contribution

1. Créer une branche pour votre fonctionnalité
2. Commiter vos changements
3. Pousser la branche
4. Créer une Pull Request

## Licence

MIT
