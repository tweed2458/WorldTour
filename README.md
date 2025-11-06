# Guide Universel des Musées et Monuments / Universal Museum and Monuments Guide

Application mobile-first pour découvrir, explorer et interagir avec les musées, monuments et points d'intérêt dans le monde entier.

## 🌟 Fonctionnalités

- **Recherche et géolocalisation** : Trouvez des musées et monuments près de vous
- **Pages détaillées** : Descriptions immersives, photos, guides audio
- **Système de notation** : Notez et commentez vos visites (1-5 étoiles)
- **Badges de visite** : Collectionnez des badges pour chaque lieu visité
- **Parcours personnalisés** : Itinéraires adaptés à vos centres d'intérêt et votre temps
- **Multilingue** : Support de FR, EN, IT, ES, DE, PT

## 🏗️ Architecture

```
world-tour/
├── apps/
│   ├── frontend/    # Nuxt 4 application (Vue 3)
│   └── backend/     # Fastify API + PostgreSQL
```

## 🚀 Démarrage rapide

### Prérequis

- Node.js 18+
- PostgreSQL 14+
- npm ou yarn

### Installation

```bash
# Installer les dépendances
npm install

# Configuration de la base de données
cd apps/backend
cp .env.example .env
# Éditer .env avec vos paramètres PostgreSQL

# Initialiser la base (développement)
npm run db:generate
npm run db:push
npm run db:seed

# Démarrer les applications
cd ../..
npm run dev
```

**⚠️ Problèmes d'installation ?** Consultez le [Guide de Dépannage](TROUBLESHOOTING.md)

L'application sera accessible sur :
- Frontend : http://localhost:3000
- Backend API : http://localhost:3011

## 📱 Technologies

### Frontend
- **Nuxt 4** - Framework Vue.js mobile-first
- **Vue 3** - Framework JavaScript progressif
- **Vue I18n** - Internationalisation
- **Mapbox/Google Maps** - Cartographie interactive
- **Tailwind CSS** - Styling responsive

### Backend
- **Fastify** - Framework web rapide et léger
- **PostgreSQL** - Base de données relationnelle
- **Prisma** - ORM moderne
- **JWT** - Authentification

## 🗺️ MVP Features (Phase 1)

- ✅ Recherche de lieux + géolocalisation
- ✅ Page de détail avec description, photos et audio
- ✅ Système de notation (1 à 5 étoiles)
- ✅ Gestion des badges
- ✅ Parcours simples selon centres d'intérêt
- ✅ Multilingue (FR, EN)

## 📝 Licence

MIT
