# World Tour - Guide d'installation et de développement

## 📋 Prérequis

- Node.js 18 ou supérieur
- PostgreSQL 14 ou supérieur
- npm ou yarn

## 🚀 Installation

### 1. Cloner le projet

```bash
git clone <repository-url>
cd WorldTour
```

### 2. Installer les dépendances

```bash
npm install
```

Cela installera les dépendances pour le monorepo, le frontend et le backend.

### 3. Configurer le Backend

#### a. Créer la base de données PostgreSQL

```bash
# Se connecter à PostgreSQL
psql -U postgres

# Créer la base de données
CREATE DATABASE worldtour;

# Quitter psql
\q
```

#### b. Configurer les variables d'environnement

```bash
cd apps/backend
cp .env.example .env
```

Éditer `.env` avec vos paramètres PostgreSQL :

```env
DATABASE_URL="postgresql://user:password@localhost:5432/worldtour?schema=public"
JWT_SECRET="votre-clé-secrète-très-sécurisée"
PORT=3001
HOST=0.0.0.0
```

#### c. Initialiser la base de données

```bash
# Générer le client Prisma
npm run db:generate

# Exécuter les migrations
npm run db:migrate

# Peupler avec des données d'exemple
npm run db:seed
```

### 4. Configurer le Frontend

```bash
cd ../frontend
cp .env.example .env
```

Le fichier `.env` devrait contenir :

```env
NUXT_PUBLIC_API_BASE=http://localhost:3001/api
```

## 🏃 Lancer l'application

### Option 1 : Lancer tout depuis la racine

```bash
# Depuis la racine du projet
npm run dev
```

Cela lancera le frontend et le backend simultanément.

### Option 2 : Lancer séparément

**Terminal 1 - Backend :**
```bash
cd apps/backend
npm run dev
```

**Terminal 2 - Frontend :**
```bash
cd apps/frontend
npm run dev
```

L'application sera accessible sur :
- **Frontend** : http://localhost:3000
- **Backend API** : http://localhost:3001
- **Health check** : http://localhost:3001/health

## 👤 Compte de test

Un utilisateur de test est créé lors du seed :
- **Email** : test@example.com
- **Mot de passe** : password123

## 📱 Fonctionnalités implémentées

### MVP (Phase 1) ✅

- ✅ Recherche de lieux avec filtres
- ✅ Géolocalisation pour trouver les lieux à proximité
- ✅ Pages détaillées pour chaque lieu (photos, descriptions, audio)
- ✅ Système de notation (1-5 étoiles)
- ✅ Badges de visite
- ✅ Génération de parcours personnalisés
- ✅ Support multilingue (FR, EN, IT, ES, DE, PT)
- ✅ Authentification JWT
- ✅ Profil utilisateur avec historique

### À venir (Phase 2)

- Intégration carte interactive (Mapbox/Google Maps)
- Notifications push
- Partage social
- Recommandations avancées basées sur l'IA
- Mode hors ligne
- Export de parcours en PDF

## 🗂️ Structure du projet

```
WorldTour/
├── apps/
│   ├── frontend/          # Application Nuxt 4
│   │   ├── assets/        # CSS, images
│   │   ├── components/    # Composants Vue réutilisables
│   │   ├── layouts/       # Layouts de l'application
│   │   ├── locales/       # Fichiers de traduction i18n
│   │   ├── pages/         # Pages de l'application
│   │   ├── stores/        # Stores Pinia
│   │   └── types/         # Types TypeScript
│   │
│   └── backend/           # API Fastify
│       ├── prisma/        # Schéma et migrations
│       └── src/
│           ├── routes/    # Routes de l'API
│           ├── utils/     # Utilitaires
│           └── types/     # Types TypeScript
│
├── package.json           # Monorepo package.json
└── README.md
```

## 🛠️ Commandes utiles

### Backend

```bash
cd apps/backend

# Développement
npm run dev

# Générer le client Prisma après modification du schéma
npm run db:generate

# Créer une nouvelle migration
npm run db:migrate

# Re-peupler la base de données
npm run db:seed

# Build pour production
npm run build
npm start
```

### Frontend

```bash
cd apps/frontend

# Développement
npm run dev

# Build pour production
npm run build

# Preview du build
npm run preview
```

## 🐛 Dépannage

### Erreur de connexion à PostgreSQL

Vérifiez que :
1. PostgreSQL est démarré
2. La base de données `worldtour` existe
3. Les credentials dans `.env` sont corrects

### Erreur "Cannot find module"

```bash
# Réinstaller les dépendances
rm -rf node_modules apps/*/node_modules
npm install
```

### Le frontend ne se connecte pas au backend

Vérifiez que :
1. Le backend est démarré sur le port 3001
2. La variable `NUXT_PUBLIC_API_BASE` est correctement définie
3. CORS est activé dans le backend

## 📚 Documentation

- [Nuxt 4 Documentation](https://nuxt.com)
- [Fastify Documentation](https://fastify.dev)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Vue I18n Documentation](https://vue-i18n.intlify.dev)

## 🤝 Contribution

1. Créer une branche pour votre fonctionnalité
2. Faire vos modifications
3. Tester localement
4. Créer une pull request

## 📄 Licence

MIT
